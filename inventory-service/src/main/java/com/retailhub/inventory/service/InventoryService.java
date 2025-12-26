package com.retailhub.inventory.service;

import com.retailhub.inventory.model.Product;
import com.retailhub.inventory.model.Review;
import com.retailhub.inventory.repository.ProductRepository;
import com.retailhub.inventory.repository.ReviewRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InventoryService {

    private final ProductRepository productRepository;
    private final ReviewRepository reviewRepository;
    private final InventoryValidator validator;

    public InventoryService(ProductRepository productRepository, ReviewRepository reviewRepository,
            InventoryValidator validator) {
        this.productRepository = productRepository;
        this.reviewRepository = reviewRepository;
        this.validator = validator;
    }

    public Review addReview(Review review) {
        return reviewRepository.save(review);
    }

    public List<Review> getReviews(String sku) {
        return reviewRepository.findBySku(sku);
    }

    public boolean checkStock(String sku, int qty) {
        return validator.validateRequest(sku, qty);
    }

    @Cacheable(value = "products")
    public List<Product> getAllProducts() {
        System.out.println("Fetching products from Database...");
        return productRepository.findAll();
    }

    @CacheEvict(value = "products", allEntries = true)
    public Product addProduct(Product product) {
        return productRepository.save(product);
    }

    @CacheEvict(value = "products", allEntries = true)
    public Product updateProduct(String sku, Product updates) {
        Product existing = productRepository.findById(sku).orElseThrow(() -> new RuntimeException("Product not found"));
        existing.setName(updates.getName());
        existing.setQuantity(updates.getQuantity());
        // Price isn't in model currently, assuming it might be added later or mocked
        return productRepository.save(existing);
    }

    @org.springframework.transaction.annotation.Transactional
    @CacheEvict(value = "products", allEntries = true)
    public boolean reserveStock(String sku, int qty) {
        Product product = productRepository.findById(sku).orElse(null);
        if (product != null && product.getQuantity() >= qty) {
            product.setQuantity(product.getQuantity() - qty);
            productRepository.save(product);
            return true;
        }
        return false;
    }
}
