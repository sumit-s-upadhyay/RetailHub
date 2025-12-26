package com.retailhub.crm.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * CUSTOMER (Base Class)
 * OOD Concept: Inheritance
 * We use Single Table inheritance for simplicity, or we could use Joined.
 * Here, 'discriminator' helps DB know if it's Regular or Premium.
 */
@Entity
@Data
@NoArgsConstructor
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "customer_type", discriminatorType = DiscriminatorType.STRING)
public abstract class Customer {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;

    public Customer(String name, String email) {
        this.name = name;
        this.email = email;
    }

    /**
     * OOD Concept: Polymorphism
     * Each customer type might calculate loyalty points differently.
     */
    public abstract BigDecimal calculateLoyaltyPoints(BigDecimal orderValue);
}
