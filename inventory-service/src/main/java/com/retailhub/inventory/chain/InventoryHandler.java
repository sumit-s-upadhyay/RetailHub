package com.retailhub.inventory.chain;

import org.springframework.stereotype.Component;

/**
 * HANDLER INTERFACE
 * OOD Pattern: Chain of Responsibility
 * Defines a step in the inventory validation process.
 */
public abstract class InventoryHandler {

    protected InventoryHandler next;

    public void setNext(InventoryHandler next) {
        this.next = next;
    }

    public abstract boolean check(String sku, int qty);

    protected boolean checkNext(String sku, int qty) {
        if (next == null) {
            return true; // End of chain, all checks passed
        }
        return next.check(sku, qty);
    }
}
