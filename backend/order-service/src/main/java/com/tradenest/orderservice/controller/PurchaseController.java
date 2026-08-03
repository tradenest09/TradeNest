package com.tradenest.orderservice.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.tradenest.orderservice.dto.request.PurchaseRequest;
import com.tradenest.orderservice.dto.response.ApiResponse;
import com.tradenest.orderservice.dto.response.PurchaseResponse;
import com.tradenest.orderservice.service.PurchaseService;

@RestController
@RequestMapping("/api/purchases")
@CrossOrigin(origins = "*")
public class PurchaseController
{

    private final PurchaseService purchaseService;

    public PurchaseController(PurchaseService purchaseService)
    {
        this.purchaseService = purchaseService;
    }

    // Create Purchase
    @PostMapping
    public ResponseEntity<PurchaseResponse> createPurchase(
            @RequestBody PurchaseRequest request) 
    {
        return new ResponseEntity<>(
                purchaseService.createPurchase(request),
                HttpStatus.CREATED);
    }

    // Get Purchase by ID
    @GetMapping("/{purchaseId}")
    public ResponseEntity<PurchaseResponse> getPurchaseById(
            @PathVariable Integer purchaseId)
    {
        return ResponseEntity.ok(
                purchaseService.getPurchaseById(purchaseId));
    }

    // Get All Purchases
    @GetMapping
    public ResponseEntity<List<PurchaseResponse>> getAllPurchases()
    {
        return ResponseEntity.ok(
                purchaseService.getAllPurchases());
    }

    // Get Purchases by Buyer
    @GetMapping("/buyer/{buyerId}")
    public ResponseEntity<List<PurchaseResponse>> getPurchasesByBuyer(
            @PathVariable Integer buyerId) {

        return ResponseEntity.ok(
                purchaseService.getPurchasesByBuyer(buyerId));
    }

    // Get Purchases by Seller
    @GetMapping("/seller/{sellerId}")
    public ResponseEntity<List<PurchaseResponse>> getPurchasesBySeller(
            @PathVariable Integer sellerId)
    {
        return ResponseEntity.ok(
                purchaseService.getPurchasesBySeller(sellerId));
    }

    // Cancel Purchase
    @DeleteMapping("/{purchaseId}")
    public ResponseEntity<ApiResponse> cancelPurchase(
            @PathVariable Integer purchaseId)
    {
        return ResponseEntity.ok(
                purchaseService.cancelPurchase(purchaseId));
    }
    
    @GetMapping("/count")
    public ResponseEntity<Long> getTotalOrders() {

        return ResponseEntity.ok(purchaseService.getTotalOrders());

    }
}