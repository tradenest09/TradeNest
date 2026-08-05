package com.tradenest.orderservice.repository;

import com.tradenest.orderservice.entities.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Integer> {
    List<Payment> findByPayerId(Integer payerId);
    Optional<Payment> findByTransactionRef(String transactionRef);
}
