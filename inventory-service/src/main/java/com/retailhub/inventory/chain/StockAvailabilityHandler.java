package com.retailhub.inventory.chain;

import com.retailhub.inventory.model.Product;
import com.retailhub.inventory.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import java.util.Optional;

@Component
public class StockAvailabilityHandler extends InventoryHandler {

    @Autowired
    private ProductRepository productRepository;

    @Override
    public boolean check(String sku, int qty) {
        System.out.println("[Chain 1] Checking Real Database Stock for " + sku);

        Optional<Product> productOpt = productRepository.findById(sku);

        if (productOpt.isEmpty()) {
            System.err.println("❌ Validation Failed: Product not found.");
            return false;
        }

        Product product = productOpt.get();
        if (product.getQuantity() < qty) {
            System.err.println("❌ Stock Check Failed: Required " + qty + ", Found " + product.getQuantity());
            return false;
        }

        // DECREMENT STOCK (Simulating Reservation)
        product.setQuantity(product.getQuantity() - qty);
        productRepository.save(product);

        System.out.println("   ✅ Local Stock Reserved. New Qty: " + product.getQuantity());
        return checkNext(sku, qty);
    }
}
