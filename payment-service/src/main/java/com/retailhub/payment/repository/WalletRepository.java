package com.retailhub.payment.repository;

import com.retailhub.payment.model.Wallet;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface WalletRepository extends JpaRepository<Wallet, Long> {
    Optional<Wallet> findByCustomerUsername(String customerUsername);
}
