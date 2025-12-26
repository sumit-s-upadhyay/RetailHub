package com.retailhub.payment.adapter;

import org.springframework.stereotype.Component;

/**
 * ADAPTER 2: Stripe
 * Adapts the (simulated) Stripe API to our PaymentProcessor interface.
 */
@Component("stripe")
public class StripeAdapter implements PaymentProcessor {

    @Override
    public boolean processPayment(String accountId, double amount) {
        System.out.println("Processing via Stripe API for Card: " + accountId);
        // Simulate Stripe charge
        System.out.println("   [Stripe] charging credit card...");
        System.out.println("   [Stripe] captured: $" + amount);
        return true;
    }
}
