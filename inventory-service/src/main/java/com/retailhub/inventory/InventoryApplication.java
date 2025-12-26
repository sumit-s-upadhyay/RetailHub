package com.retailhub.inventory;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class InventoryApplication {
    public static void main(String[] args) {
        SpringApplication.run(InventoryApplication.class, args);
    }

    @org.springframework.context.annotation.Bean
    public org.springframework.boot.CommandLineRunner demoData(
            com.retailhub.inventory.repository.ProductRepository repo) {
        return args -> {
            if (repo.count() == 0) {
                repo.save(new com.retailhub.inventory.model.Product("IPHONE15", "iPhone 15 Pro", 50));
                repo.save(new com.retailhub.inventory.model.Product("MACBOOK", "MacBook Pro M3", 10));
                repo.save(new com.retailhub.inventory.model.Product("TSHIRT", "RetailHub T-Shirt", 1000));
                System.out.println("✅ Inventory Data Seeded via CommandLineRunner");
            }
        };
    }
}
