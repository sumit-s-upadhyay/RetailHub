package com.retailhub.crm.strategy;

import java.math.BigDecimal;

public class PercentageDiscountStrategy implements DiscountStrategy {
    
    private final BigDecimal percentage; // e.g., 0.10 for 10%

    public PercentageDiscountStrategy(BigDecimal percentage) {
        this.percentage = percentage;
    }

    @Override
    public BigDecimal applyDiscount(BigDecimal totalAmount) {
        BigDecimal discount = totalAmount.multiply(percentage);
        return totalAmount.subtract(discount);
    }
}
