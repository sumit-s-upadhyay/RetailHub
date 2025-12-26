package com.retailhub.oms.listener;

import com.retailhub.oms.dto.InventoryEvent;
import com.retailhub.oms.model.Order;
import com.retailhub.oms.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class OmsEventListener {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private org.springframework.kafka.core.KafkaTemplate<String, Object> kafkaTemplate;

    @KafkaListener(topics = "inventory-events", groupId = "oms-group")
    public void handleInventoryEvent(InventoryEvent event) {
        System.out.println("Received Inventory Event: " + event);

        orderRepository.findById(event.getOrderId()).ifPresent(order -> {
            if ("STOCK_RESERVED".equals(event.getType())) {
                order.setStatus("APPROVED");
                kafkaTemplate.send("notification-topic",
                        "Order #" + order.getId() + " confirmed for " + order.getCustomerId());
            } else if ("OUT_OF_STOCK".equals(event.getType())) {
                order.setStatus("CANCELLED"); // or OUT_OF_STOCK
                kafkaTemplate.send("notification-topic", "Order #" + order.getId() + " cancelled (Out of Stock)");
            }
            orderRepository.save(order);
            System.out.println("Updated Order " + order.getId() + " to " + order.getStatus());
        });
    }
}
