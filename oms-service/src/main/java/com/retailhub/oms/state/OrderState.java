package com.retailhub.oms.state;

/**
 * STATE INTERFACE
 * OOD Concept: State Pattern
 * Defines the contract for all possible states an Order can be in.
 */
public interface OrderState {
    void next(OrderContext context);
    void prev(OrderContext context);
    void printStatus();
}
