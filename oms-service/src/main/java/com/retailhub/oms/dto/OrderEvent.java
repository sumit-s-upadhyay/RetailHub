package com.retailhub.oms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

public class OrderEvent {
    private String type; // "ORDER_CREATED"
    private Long orderId;
    private String sku;
    private int quantity;
    private String customer;

    public OrderEvent() {
    }

    public OrderEvent(String type, Long orderId, String sku, int quantity, String customer) {
        this.type = type;
        this.orderId = orderId;
        this.sku = sku;
        this.quantity = quantity;
        this.customer = customer;
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

    public String getCustomer() {
        return customer;
    }

    public void setCustomer(String customer) {
        this.customer = customer;
    }
}
