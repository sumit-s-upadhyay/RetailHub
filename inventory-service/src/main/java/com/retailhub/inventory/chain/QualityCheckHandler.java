package com.retailhub.inventory.chain;

import org.springframework.stereotype.Component;

@Component
public class QualityCheckHandler extends InventoryHandler {

    @Override
    public boolean check(String sku, int qty) {
        System.out.println("[Chain 2] Verifying Product Quality Status...");
        // Logic: specific items might be "Quarantined" or "Damaged"
        boolean isDamaged = false;

        if (isDamaged) {
            System.err.println("❌ Quality Check Failed: Item marked as damaged.");
            return false;
        }

        System.out.println("   ✅ Quality Check OK.");
        return checkNext(sku, qty);
    }
}
