package com.tradenest.orderservice.service;

import java.util.List;

import com.tradenest.orderservice.dto.request.PurchaseRequest;
import com.tradenest.orderservice.dto.response.ApiResponse;
import com.tradenest.orderservice.dto.response.PurchaseResponse;

public interface PurchaseService {

    // Create Purchase
    PurchaseResponse createPurchase(PurchaseRequest request);

    // Get Purchase by ID
    PurchaseResponse getPurchaseById(Integer purchaseId);

    // Get All Purchases
    List<PurchaseResponse> getAllPurchases();

    // Get Purchases by Buyer
    List<PurchaseResponse> getPurchasesByBuyer(Integer buyerId);

    // Get Purchases by Seller
    List<PurchaseResponse> getPurchasesBySeller(Integer sellerId);

    // Cancel Purchase
    ApiResponse cancelPurchase(Integer purchaseId);
    
    long getTotalOrders();

}