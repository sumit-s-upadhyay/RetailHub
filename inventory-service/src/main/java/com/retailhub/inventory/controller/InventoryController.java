package com.retailhub.inventory.controller;

import com.retailhub.inventory.service.InventoryValidator;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/inventory")
@org.springframework.web.bind.annotation.CrossOrigin(origins = "*")
public class InventoryController {

    private final InventoryValidator validator;
    private final com.retailhub.inventory.repository.ProductRepository productRepository;

    public InventoryController(InventoryValidator validator,
            com.retailhub.inventory.repository.ProductRepository productRepository) {
        this.validator = validator;
        this.productRepository = productRepository;
    }

    @GetMapping("/check")
    public boolean checkStock(@RequestParam String sku, @RequestParam int qty) {
        return validator.validateRequest(sku, qty);
    }

    @GetMapping("/products")
    public java.util.List<com.retailhub.inventory.model.Product> getAllProducts() {
        return productRepository.findAll();
    }
}
