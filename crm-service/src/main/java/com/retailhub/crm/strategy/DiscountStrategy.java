package com.retailhub.crm.strategy;

import java.math.BigDecimal;

/**
 * DISCOUNT STRATEGY (Interface)
 * OOD Concept: Strategy Pattern
 * Defines a family of algorithms (discounts), encapsulates each one, and makes them interchangeable.
 */
public interface DiscountStrategy {
    BigDecimal applyDiscount(BigDecimal totalAmount);
}
