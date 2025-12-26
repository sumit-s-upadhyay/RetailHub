package com.retailhub.crm.strategy;

import java.math.BigDecimal;

public class FlatDiscountStrategy implements DiscountStrategy {
    
    private final BigDecimal discountAmount;

    public FlatDiscountStrategy(BigDecimal discountAmount) {
        this.discountAmount = discountAmount;
    }

    @Override
    public BigDecimal applyDiscount(BigDecimal totalAmount) {
        // Prevent negative total
        if (totalAmount.compareTo(discountAmount) < 0) {
            return BigDecimal.ZERO;
        }
        return totalAmount.subtract(discountAmount);
    }
}
