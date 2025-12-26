package com.retailhub.oms.state;

import com.retailhub.oms.service.OrchestratorService;

public class CreatedState implements OrderState {

    @Override
    public void next(OrderContext context) {
        System.out.println("Processing order...");
        OrchestratorService orch = context.getOrchestrator();

        // 1. REAL INVENTORY CHECK
        // Get dynamic order details from Context
        String sku = context.getSku();
        int qty = context.getQuantity();

        System.out.println("   -> [OMS] Calling Inventory Service for " + sku + "...");
        boolean stockOk = orch.reserveStock(sku, qty);

        if (!stockOk) {
            System.err.println("   ❌ Stock Check Failed! Order cannot proceed.");
            return; // Stay in Created State, or move to Cancelled
        }
        System.out.println("   <- [Inventory] Stock Available.");

        // 2. REAL PAYMENT CALL
        String paymentType = "paypal";
        double amount = 999.00;

        System.out.println("   -> [OMS] Calling Payment Service (" + paymentType + ")...");
        boolean paid = orch.processPayment(paymentType, "user@example.com", amount);

        if (!paid) {
            System.err.println("   ❌ Payment Failed!");
            return;
        }
        System.out.println("   <- [Payment] Approved.");

        context.setState(new PaidState());
    }

    @Override
    public void prev(OrderContext context) {
        System.out.println("The order is in its root state.");
    }

    @Override
    public void printStatus() {
        System.out.println("Order Created. Waiting for processing.");
    }
}
