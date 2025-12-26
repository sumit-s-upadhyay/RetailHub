package com.retailhub.inventory.listener;

import com.retailhub.inventory.dto.InventoryEvent;
import com.retailhub.inventory.dto.OrderEvent;
import com.retailhub.inventory.service.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
public class InventoryEventListener {

    @Autowired
    private InventoryService inventoryService;

    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;

    @KafkaListener(topics = "orders", groupId = "inventory-group")
    public void handleOrderEvent(OrderEvent event) {
        System.out.println("Received Order Event: " + event);

        if ("ORDER_CREATED".equals(event.getType())) {
            // Attempt to reserve stock directly (Check + Decrement)
            boolean reserved = inventoryService.reserveStock(event.getSku(), event.getQuantity());

            InventoryEvent response = new InventoryEvent();
            response.setOrderId(event.getOrderId());
            response.setSku(event.getSku());
            response.setQuantity(event.getQuantity());

            if (reserved) {
                response.setType("STOCK_RESERVED");
                System.out.println("Stock Reserved. Sending STOCK_RESERVED");
            } else {
                response.setType("OUT_OF_STOCK");
                System.out.println("Out of Stock. Sending OUT_OF_STOCK");
            }

            kafkaTemplate.send("inventory-events", response);
        }
    }
}
