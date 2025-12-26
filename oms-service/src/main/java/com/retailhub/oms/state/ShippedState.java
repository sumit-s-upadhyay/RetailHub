package com.retailhub.oms.state;

public class ShippedState implements OrderState {

    @Override
    public void next(OrderContext context) {
        System.out.println("Order Delivered.");
        // Could transition to DeliveredState
    }

    @Override
    public void prev(OrderContext context) {
        context.setState(new PaidState());
    }

    @Override
    public void printStatus() {
        System.out.println("Order Shipped. Customer cannot cancel now.");
    }
}
