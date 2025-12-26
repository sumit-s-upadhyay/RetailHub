package com.retailhub.oms.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class OrchestratorService {

    private final RestTemplate restTemplate = new RestTemplate();

    // URLs (In Docker/K8s these would be service names, locally they are localhost
    // ports)
    private static final String INVENTORY_URL = "http://localhost:8085/api/inventory/check";
    private static final String PAYMENT_URL = "http://localhost:8084/api/payment";

    public boolean reserveStock(String sku, int qty) {
        String url = INVENTORY_URL + "?sku=" + sku + "&qty=" + qty;
        try {
            System.out.println("   [Network] GET " + url);
            Boolean result = restTemplate.getForObject(url, Boolean.class);
            return result != null && result;
        } catch (Exception e) {
            System.err.println("   [Network] Inventory Call Failed: " + e.getMessage());
            return false;
        }
    }

    public boolean processPayment(String type, String user, double amount) {
        String url = PAYMENT_URL + "/pay?type=" + type + "&accountId=" + user + "&amount=" + amount;
        try {
            System.out.println("   [Network] POST " + url);
            Boolean result = restTemplate.postForObject(url, null, Boolean.class);
            return result != null && result;
        } catch (Exception e) {
            System.err.println("   [Network] Payment Call Failed: " + e.getMessage());
            return false;
        }
    }
}
