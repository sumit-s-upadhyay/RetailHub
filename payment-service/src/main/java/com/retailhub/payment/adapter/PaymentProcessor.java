package com.retailhub.payment.adapter;

/**
 * TARGET INTERFACE
 * OOD Pattern: Adapter
 * The application only talks to this interface. It doesn't know about 'Stripe'
 * or 'PayPal' direct SDKs.
 */
public interface PaymentProcessor {
    boolean processPayment(String accountId, double amount);
}
