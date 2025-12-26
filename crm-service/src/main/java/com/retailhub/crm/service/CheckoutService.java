package com.retailhub.crm.service;

import com.retailhub.crm.strategy.DiscountStrategy;
import com.retailhub.crm.strategy.FlatDiscountStrategy;
import com.retailhub.crm.strategy.PercentageDiscountStrategy;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

/**
 * CONTEXT CLASS for Strategy Pattern
 * This service decides WHICH strategy to use at runtime.
 */
@Service
public class CheckoutService {

    public BigDecimal calculateFinalPrice(BigDecimal orderTotal, String discountType) {
        DiscountStrategy strategy;

        // In a real app, this logic might come from a DB configuration or Rules Engine
        switch (discountType) {
            case "SUMMER_SALE":
                strategy = new PercentageDiscountStrategy(new BigDecimal("0.20")); // 20% off
                break;
            case "WELCOME_OFFER":
                strategy = new FlatDiscountStrategy(new BigDecimal("10.00")); // $10 off
                break;
            default:
                strategy = (amount) -> amount; // Lambda: No discount
                break;
        }

        return strategy.applyDiscount(orderTotal);
    }
}
