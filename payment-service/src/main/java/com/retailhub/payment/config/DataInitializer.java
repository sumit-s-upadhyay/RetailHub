package com.retailhub.payment.config;

import com.retailhub.payment.model.Wallet;
import com.retailhub.payment.repository.WalletRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private WalletRepository walletRepository;

    @Override
    public void run(String... args) throws Exception {
        // Wallet for john_doe
        if (walletRepository.findByCustomerUsername("john_doe").isEmpty()) {
            walletRepository.save(new Wallet("john_doe", 1000.00));
        }
    }
}
