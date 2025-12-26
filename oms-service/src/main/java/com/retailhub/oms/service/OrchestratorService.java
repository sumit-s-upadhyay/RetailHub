package com.retailhub.oms.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class OrchestratorService {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${service.inventory.url}")
    private String inventoryUrl;

    @Value("${service.payment.url}")
    private String paymentUrl;

    @io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker(name = "inventory", fallbackMethod = "reserveFallback")
    public boolean reserveStock(String sku, int qty) {
        String url = inventoryUrl + "/check?sku=" + sku + "&qty=" + qty;
        System.out.println("   [Network] GET " + url);
        Boolean result = restTemplate.getForObject(url, Boolean.class);
        return result != null && result;
    }

    public boolean reserveFallback(String sku, int qty, Throwable t) {
        System.err.println("   [CircuitBreaker] Inventory Service Unavailable (" + t.getMessage() + ")");
        return false; // Safely fail
    }

    @io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker(name = "payment", fallbackMethod = "paymentFallback")
    public boolean processPayment(String type, String user, double amount) {
        String url = paymentUrl + "/pay?type=" + type + "&accountId=" + user + "&amount=" + amount;
        System.out.println("   [Network] POST " + url);
        Boolean result = restTemplate.postForObject(url, null, Boolean.class);
        return result != null && result;
    }

    public boolean paymentFallback(String type, String user, double amount, Throwable t) {
        System.err.println("   [CircuitBreaker] Payment Service Unavailable (" + t.getMessage() + ")");
        return false; // Safely fail
    }
}
