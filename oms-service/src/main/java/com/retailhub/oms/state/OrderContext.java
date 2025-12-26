package com.retailhub.oms.state;

import com.retailhub.oms.service.OrchestratorService;

public class OrderContext {

    private OrderState state;
    private OrchestratorService orchestrator;

    // Order Details
    private String sku = "IPHONE15";
    private int quantity = 1;
    private String customerId = "Guest";

    public OrderContext(OrchestratorService orchestrator) {
        this.orchestrator = orchestrator;
        this.state = new CreatedState();
    }

    public void nextState() {
        if (state != null) {
            state.next(this);
        }
    }

    // Manual Getters and Setters
    public OrderState getState() {
        return state;
    }

    public void setState(OrderState state) {
        this.state = state;
    }

    public OrchestratorService getOrchestrator() {
        return orchestrator;
    }
    // No setter for orchestrator needed usually, but can add if required

    public String getSku() {
        return sku;
    }

    public void setSku(String sku) {
        this.sku = sku;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public String getCustomerId() {
        return customerId;
    }

    public void setCustomerId(String customerId) {
        this.customerId = customerId;
    }
}
