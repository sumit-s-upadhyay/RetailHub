package com.retailhub.payment.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "wallets")
@Data
@NoArgsConstructor
public class Wallet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String customerUsername;

    private double balance;

    public Wallet(String customerUsername, double balance) {
        this.customerUsername = customerUsername;
        this.balance = balance;
    }
}
