# RetailHub End-to-End Test Script

$GatewayUrl = "http://localhost:8080"
$AdminUser = "admin"
$AdminPass = "admin123"

Write-Host "--- 1. Testing Login (Gateway -> CRM) ---"
$LoginBody = @{
    username = $AdminUser
    password = $AdminPass
} | ConvertTo-Json

try {
    $LoginResponse = Invoke-RestMethod -Uri "$GatewayUrl/api/auth/login" -Method Post -Body $LoginBody -ContentType "application/json" -SessionVariable Session
    $Token = $LoginResponse.token
    Write-Host "Success! Token Received: $($Token.Substring(0, 10))..." -ForegroundColor Green
} catch {
    Write-Host "Login Failed: $_" -ForegroundColor Red
    exit
}

Write-Host "`n--- 2. Testing Inventory Access (Gateway -> Inventory) ---"
$Headers = @{
    Authorization = "Bearer $Token"
}

try {
    $Products = Invoke-RestMethod -Uri "$GatewayUrl/api/inventory/products" -Method Get -Headers $Headers
    Write-Host "Success! Found $($Products.Count) products." -ForegroundColor Green
    if ($Products.Count -gt 0) {
        $Sku = $Products[0].sku
        Write-Host "Picked Product SKU: $Sku"
    } else {
        Write-Host "No products found. Cannot proceed with Order test." -ForegroundColor Yellow
        exit
    }
} catch {
    Write-Host "Inventory Access Failed: $_" -ForegroundColor Red
    exit
}

Write-Host "`n--- 3. Testing Order Creation (Gateway -> OMS -> Kafka) ---"
try {
    $OrderUrl = "$GatewayUrl/api/oms/create?sku=$Sku&qty=1&customer=$AdminUser"
    $Order = Invoke-RestMethod -Uri $OrderUrl -Method Post -Headers $Headers
    $OrderId = $Order.id
    Write-Host "Order Placed! ID: $OrderId, Status: $($Order.status)" -ForegroundColor Cyan
} catch {
    Write-Host "Order Creation Failed: $_" -ForegroundColor Red
    exit
}

Write-Host "`n--- 4. Waiting for Event Processing (5 seconds) ---"
Start-Sleep -Seconds 5

Write-Host "`n--- 5. Verifying Order Status (Gateway -> OMS via DB) ---"
try {
    $MyOrders = Invoke-RestMethod -Uri "$GatewayUrl/api/oms/my-orders?customer=$AdminUser" -Method Get -Headers $Headers
    $TargetOrder = $MyOrders | Where-Object { $_.id -eq $OrderId }
    
    if ($TargetOrder) {
        Write-Host "Order Found. Current Status: $($TargetOrder.status)"
        if ($TargetOrder.status -eq "APPROVED") {
            Write-Host "TEST PASSED: Order was APPROVED asynchronously!" -ForegroundColor Green
        } elseif ($TargetOrder.status -eq "CANCELLED") {
             Write-Host "TEST PASSED (Technically): Order processed but CANCELLED (Stock check failed?)." -ForegroundColor Yellow
        } else {
             Write-Host "TEST FAILED: Order status is still $($TargetOrder.status) (Expected APPROVED/CANCELLED)" -ForegroundColor Red
        }
    } else {
        Write-Host "Order Not Found!" -ForegroundColor Red
    }
} catch {
    Write-Host "Check Status Failed: $_" -ForegroundColor Red
}
