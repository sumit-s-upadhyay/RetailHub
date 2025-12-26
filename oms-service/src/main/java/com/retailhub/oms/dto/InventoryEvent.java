package com.retailhub.oms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

public class InventoryEvent {
    private String type;
    private Long orderId;
    private String sku;
    private int quantity;

    public InventoryEvent() {
    }

    public InventoryEvent(String type, Long orderId, String sku, int quantity) {
        this.type = type;
        this.orderId = orderId;
        this.sku = sku;
        this.quantity = quantity;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

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
}
