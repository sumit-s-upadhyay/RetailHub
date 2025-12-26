package com.retailhub.oms.controller;

import com.retailhub.oms.model.Order;
import com.retailhub.oms.repository.OrderRepository;
import com.retailhub.oms.service.OrchestratorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/oms")
public class OmsController {

    @Autowired
    private OrderRepository repository;

    @Autowired
    private org.springframework.kafka.core.KafkaTemplate<String, Object> kafkaTemplate;

    @Autowired
    private OrchestratorService orchestrator;

    // Place Order -> STATUS: CREATED
    @PostMapping("/create")
    public Order createOrder(@RequestParam String sku, @RequestParam int qty, @RequestParam String customer) {
        Order order = new Order(customer, sku, qty, 999.00 * qty); // Mock Price
        order.setStatus("CREATED"); // Initial State
        Order saved = repository.save(order);

        // Async Validation via Kafka
        com.retailhub.oms.dto.OrderEvent event = new com.retailhub.oms.dto.OrderEvent(
                "ORDER_CREATED", saved.getId(), sku, qty, customer);

        kafkaTemplate.send("orders", event);
        System.out.println("Published Order Event: " + event);

        return saved;
    }

    // Customer sees their orders
    @GetMapping("/my-orders")
    public List<Order> getMyOrders(@RequestParam String customer) {
        return repository.findByCustomerId(customer);
    }

    // Customer Pays -> STATUS: PAID (Only if APPROVED)
    @PostMapping("/{id}/pay")
    public Order payOrder(@PathVariable Long id) {
        Order order = repository.findById(id).orElseThrow();
        if ("APPROVED".equals(order.getStatus())) {
            // Call Payment Service
            boolean paid = orchestrator.processPayment("wallet", order.getCustomerId(), order.getAmount());
            if (paid) {
                order.setStatus("PAID");
            } else {
                throw new RuntimeException("Payment Failed");
            }
        }
        return repository.save(order);
    }

    // Customer Cancels -> STATUS: CANCELLED (Only if CREATED)
    @PostMapping("/{id}/cancel")
    public Order cancelOrder(@PathVariable Long id) {
        Order order = repository.findById(id).orElseThrow();
        if ("CREATED".equals(order.getStatus())) {
            order.setStatus("CANCELLED");
        } else {
            throw new RuntimeException("Cannot cancel order in state: " + order.getStatus());
        }
        return repository.save(order);
    }

    // --- 2. CSR Actions ---

    // CSR sees pending orders
    @GetMapping("/pending")
    public List<Order> getPendingOrders() {
        return repository.findByStatus("CREATED");
    }

    // CSR Approves -> STATUS: APPROVED (Only if Stock Available)
    @PostMapping("/{id}/approve")
    public Order approveOrder(@PathVariable Long id) {
        Order order = repository.findById(id).orElseThrow();
        if ("CREATED".equals(order.getStatus())) {
            // Check Inventory
            boolean stockOk = orchestrator.reserveStock(order.getSku(), order.getQuantity());
            if (stockOk) {
                order.setStatus("APPROVED");
            } else {
                order.setStatus("CANCELLED"); // Out of Stock
            }
        }
        return repository.save(order);
    }

    // --- 3. Shipping Actions ---

    // Logistics sees paid orders ready for shipping
    @GetMapping("/paid")
    public List<Order> getPaidOrders() {
        return repository.findByStatus("PAID");
    }

    // Logistics Ships -> STATUS: SHIPPED
    @PostMapping("/{id}/ship")
    public Order shipOrder(@PathVariable Long id) {
        Order order = repository.findById(id).orElseThrow();
        if ("PAID".equals(order.getStatus())) {
            order.setStatus("SHIPPED");
        }
        return repository.save(order);
    }
}
