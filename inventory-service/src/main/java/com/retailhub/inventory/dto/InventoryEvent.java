package com.retailhub.inventory.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class InventoryEvent {
    private String type; // "STOCK_RESERVED", "OUT_OF_STOCK"
    private Long orderId;
    private String sku;
    private int quantity;
}
