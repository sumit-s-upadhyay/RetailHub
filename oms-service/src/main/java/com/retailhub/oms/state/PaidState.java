package com.retailhub.oms.state;

public class PaidState implements OrderState {

    @Override
    public void next(OrderContext context) {
        System.out.println("Shipping order...");
        context.setState(new ShippedState());
    }

    @Override
    public void prev(OrderContext context) {
        context.setState(new CreatedState());
    }

    @Override
    public void printStatus() {
        System.out.println("Order Paid. Ready to ship.");
    }
}
