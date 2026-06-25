package com.noodle.repository;

import com.noodle.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserIdOrderByCreatedAtDesc(String userId);
    List<Order> findByStatusOrderByCreatedAtDesc(String status);
}