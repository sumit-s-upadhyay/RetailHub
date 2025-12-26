package com.retailhub.inventory.controller;

import com.retailhub.inventory.model.Product;
import com.retailhub.inventory.model.Review;
import com.retailhub.inventory.service.InventoryService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @PostMapping("/reviews")
    public Review addReview(@RequestBody Review review) {
        return inventoryService.addReview(review);
    }

    @GetMapping("/reviews")
    public List<Review> getReviews(@RequestParam String sku) {
        return inventoryService.getReviews(sku);
    }

    @GetMapping("/check")
    public boolean checkStock(@RequestParam String sku, @RequestParam int qty) {
        return inventoryService.checkStock(sku, qty);
    }

    @GetMapping("/products")
    public List<Product> getAllProducts() {
        return inventoryService.getAllProducts();
    }

    // --- CSR / Admin Product Management ---

    @PostMapping("/products")
    public Product addProduct(@RequestBody Product product) {
        return inventoryService.addProduct(product);
    }

    @PutMapping("/products/{sku}")
    public Product updateProduct(@PathVariable String sku, @RequestBody Product updates) {
        return inventoryService.updateProduct(sku, updates);
    }
}
