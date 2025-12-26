package com.retailhub.oms.repository;

import com.retailhub.oms.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByStatus(String status);

    List<Order> findByCustomerId(String customerId);
}
