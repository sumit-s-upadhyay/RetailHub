package com.retailhub.payment.controller;

import com.retailhub.payment.adapter.PaymentProcessor;
import com.retailhub.payment.adapter.PayPalAdapter;
import com.retailhub.payment.adapter.StripeAdapter;
import com.retailhub.payment.model.PaymentRecord;
import com.retailhub.payment.model.Wallet;
import com.retailhub.payment.repository.PaymentRepository;
import com.retailhub.payment.repository.WalletRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "*")
public class PaymentController {

    private final Map<String, PaymentProcessor> strategies = new HashMap<>();
    private final PaymentRepository repository;
    private final WalletRepository walletRepository;

    @Autowired
    public PaymentController(List<PaymentProcessor> processors, PaymentRepository repository,
            WalletRepository walletRepository) {
        this.repository = repository;
        this.walletRepository = walletRepository;
        for (PaymentProcessor processor : processors) {
            if (processor instanceof StripeAdapter) {
                strategies.put("stripe", processor);
            } else if (processor instanceof PayPalAdapter) {
                strategies.put("paypal", processor);
            }
        }
    }

    // --- WALLET ENDPOINTS ---

    @PostMapping("/wallet/create")
    public Wallet createWallet(@RequestParam String username, @RequestParam double initialAmount) {
        return walletRepository.save(new Wallet(username, initialAmount));
    }

    @GetMapping("/wallet/balance")
    public double getBalance(@RequestParam String username) {
        return walletRepository.findByCustomerUsername(username)
                .map(Wallet::getBalance)
                .orElse(0.0);
    }

    @PostMapping("/wallet/add")
    public Wallet addFunds(@RequestParam String username, @RequestParam double amount) {
        Wallet wallet = walletRepository.findByCustomerUsername(username)
                .orElseGet(() -> new Wallet(username, 0.0)); // Create if missing
        wallet.setBalance(wallet.getBalance() + amount);
        return walletRepository.save(wallet);
    }

    // --- PAYMENT PROCESSING ---

    @PostMapping("/pay") // Keep this mapping so OMS can call it
    public boolean pay(@RequestParam String type, @RequestParam String accountId, @RequestParam double amount) {
        boolean success = false;
        String finalAccount = accountId;

        // If 'wallet', we bypass the adapter pattern and hit the DB directly
        if ("wallet".equalsIgnoreCase(type)) {
            // accountId here is expected to be the username (e.g. "USER-1" or "alice")
            // In our OMS, we are passing "USER-{ID}". We might need to map ID to Username?
            // For now, let's assume accountId IS the username key.
            Wallet wallet = walletRepository.findByCustomerUsername(accountId).orElse(null);
            if (wallet != null) {
                if (wallet.getBalance() >= amount) {
                    wallet.setBalance(wallet.getBalance() - amount);
                    walletRepository.save(wallet);
                    success = true;
                    finalAccount = "Wallet-" + accountId;
                } else {
                    System.err.println("Insufficient Wallet Balance for " + accountId);
                }
            } else {
                System.err.println("Wallet not found for " + accountId);
            }
        } else {
            // Standard External Gateways
            PaymentProcessor processor = strategies.get(type.toLowerCase());
            if (processor != null) {
                success = processor.processPayment(accountId, amount);
            }
        }

        // LOG TRANSACTION
        PaymentRecord record = new PaymentRecord(type, finalAccount, amount, success);
        repository.save(record);

        return success;
    }

    @GetMapping("/history")
    public List<PaymentRecord> getHistory() {
        return repository.findAll(Sort.by(Sort.Direction.DESC, "timestamp"));
    }
}
