package com.retailhub.payment.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
public class PaymentRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type; // PayPal, Stripe
    private String accountId;
    private double amount;
    private boolean success;
    private LocalDateTime timestamp;

    public PaymentRecord(String type, String accountId, double amount, boolean success) {
        this.type = type;
        this.accountId = accountId;
        this.amount = amount;
        this.success = success;
        this.timestamp = LocalDateTime.now();
    }
}
