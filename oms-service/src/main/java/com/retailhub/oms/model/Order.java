package com.retailhub.oms.model;

import jakarta.persistence.*;

@Entity
@Table(name = "feature_orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String customerId;
    private String sku;
    private int quantity;
    private double amount;

    private String status; // CREATED, APPROVED, PAID, SHIPPED, CANCELLED

    public Order() {
    }

    public Order(String customerId, String sku, int quantity, double amount) {
        this.customerId = customerId;
        this.sku = sku;
        this.quantity = quantity;
        this.amount = amount;
        this.status = "CREATED";
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCustomerId() {
        return customerId;
    }

    public void setCustomerId(String customerId) {
        this.customerId = customerId;
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

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
