package com.tradenest.orderservice.repository;



import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tradenest.orderservice.entities.Purchase;
import com.tradenest.orderservice.enums.PurchaseStatus;

@Repository
public interface PurchaseRepository extends JpaRepository<Purchase, Integer> {

    // All purchases by buyer
    List<Purchase> findByBuyerId(Integer buyerId);

    // All sales by seller
    List<Purchase> findBySellerId(Integer sellerId);

    // Purchase of a product
    List<Purchase> findByPid(Integer pid);

    // Purchases by status
    List<Purchase> findByStatus(PurchaseStatus status);

    // Buyer + Status
    List<Purchase> findByBuyerIdAndStatus(Integer buyerId, PurchaseStatus status);

    // Seller + Status
    List<Purchase> findBySellerIdAndStatus(Integer sellerId, PurchaseStatus status);
}