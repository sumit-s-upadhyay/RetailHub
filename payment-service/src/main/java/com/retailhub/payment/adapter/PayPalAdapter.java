package com.retailhub.payment.adapter;

import org.springframework.stereotype.Component;

/**
 * ADAPTER 1: PayPal
 * Adapts the (simulated) PayPal API to our PaymentProcessor interface.
 */
@Component("paypal")
public class PayPalAdapter implements PaymentProcessor {

    @Override
    public boolean processPayment(String accountId, double amount) {
        System.out.println("Processing via PayPal API for User: " + accountId);
        // Simulate complex PayPal handshake
        System.out.println("   [PayPal] verifying token...");
        System.out.println("   [PayPal] payment approved: $" + amount);
        return true;
    }
}
