package com.retailhub.payment.repository;

import com.retailhub.payment.model.PaymentRecord;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<PaymentRecord, Long> {
}
