package com.tradenest.orderservice.serviceImpl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.tradenest.orderservice.dto.request.PurchaseRequest;
import com.tradenest.orderservice.dto.response.ApiResponse;
import com.tradenest.orderservice.dto.response.PurchaseResponse;
import com.tradenest.orderservice.entities.Purchase;
import com.tradenest.orderservice.enums.PurchaseStatus;
import com.tradenest.orderservice.repository.PurchaseRepository;
import com.tradenest.orderservice.service.PurchaseService;

@Service
public class PurchaseServiceImpl implements PurchaseService {

    private final PurchaseRepository purchaseRepository;

    public PurchaseServiceImpl(PurchaseRepository purchaseRepository) {
        this.purchaseRepository = purchaseRepository;
    }

    @Override
    public PurchaseResponse createPurchase(PurchaseRequest request) {

        Purchase purchase = Purchase.builder()
                .pid(request.getPid())
                .buyerId(request.getBuyerId())
                .sellerId(request.getSellerId())
                .amount(request.getAmount())
                .purchaseDate(LocalDateTime.now())
                .status(PurchaseStatus.PENDING)
                .build();

        Purchase saved = purchaseRepository.save(purchase);

        return mapToResponse(saved);
    }

    @Override
    public PurchaseResponse getPurchaseById(Integer purchaseId) {

        Purchase purchase = purchaseRepository.findById(purchaseId)
                .orElseThrow(() -> new RuntimeException("Purchase not found"));

        return mapToResponse(purchase);
    }

    @Override
    public List<PurchaseResponse> getAllPurchases() {

        return purchaseRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<PurchaseResponse> getPurchasesByBuyer(Integer buyerId) {

        return purchaseRepository.findByBuyerId(buyerId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<PurchaseResponse> getPurchasesBySeller(Integer sellerId) {

        return purchaseRepository.findBySellerId(sellerId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ApiResponse cancelPurchase(Integer purchaseId) {

        Purchase purchase = purchaseRepository.findById(purchaseId)
                .orElseThrow(() -> new RuntimeException("Purchase not found"));

        purchase.setStatus(PurchaseStatus.CANCELLED);

        purchaseRepository.save(purchase);

        return ApiResponse.builder()
                .success(true)
                .message("Purchase cancelled successfully")
                .build();
    }

    private PurchaseResponse mapToResponse(Purchase purchase) {

        return PurchaseResponse.builder()
                .purchaseId(purchase.getPurchaseId())
                .pid(purchase.getPid())
                .buyerId(purchase.getBuyerId())
                .sellerId(purchase.getSellerId())
                .purchaseDate(purchase.getPurchaseDate())
                .amount(purchase.getAmount())
                .status(purchase.getStatus())
                .build();
    }
    
    @Override
    public long getTotalOrders() {

        return purchaseRepository.count();

    }
}