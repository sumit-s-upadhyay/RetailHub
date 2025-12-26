package com.retailhub.inventory.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderEvent {
    private String type; // "ORDER_CREATED"
    private Long orderId;
    private String sku;
    private int quantity;
    private String customer; // For analytics logging?
}
