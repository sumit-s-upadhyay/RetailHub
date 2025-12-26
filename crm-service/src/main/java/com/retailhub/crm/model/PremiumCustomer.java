package com.retailhub.crm.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@DiscriminatorValue("PREMIUM")
@NoArgsConstructor
public class PremiumCustomer extends Customer {

    public PremiumCustomer(String name, String email) {
        super(name, email);
    }

    @Override
    public BigDecimal calculateLoyaltyPoints(BigDecimal orderValue) {
        // Premium customers get 2 points per $10 spent
        return orderValue.divide(BigDecimal.valueOf(5));
    }
}
