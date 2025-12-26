package com.retailhub.crm.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@DiscriminatorValue("REGULAR")
@NoArgsConstructor
public class RegularCustomer extends Customer {

    public RegularCustomer(String name, String email) {
        super(name, email);
    }

    @Override
    public BigDecimal calculateLoyaltyPoints(BigDecimal orderValue) {
        // Regular customers get 1 point per $10 spent
        return orderValue.divide(BigDecimal.valueOf(10));
    }
}
