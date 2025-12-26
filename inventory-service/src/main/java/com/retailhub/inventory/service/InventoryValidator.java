package com.retailhub.inventory.service;

import com.retailhub.inventory.chain.StockAvailabilityHandler;
import com.retailhub.inventory.chain.QualityCheckHandler;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;

@Service
public class InventoryValidator {

    private final StockAvailabilityHandler stockHandler;
    private final QualityCheckHandler qualityHandler;

    public InventoryValidator(StockAvailabilityHandler stockHandler, QualityCheckHandler qualityHandler) {
        this.stockHandler = stockHandler;
        this.qualityHandler = qualityHandler;
    }

    // configure the chain
    @PostConstruct
    public void init() {
        stockHandler.setNext(qualityHandler);
    }

    public boolean validateRequest(String sku, int qty) {
        return stockHandler.check(sku, qty);
    }
}
