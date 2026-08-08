package com.tradenest.orderservice.serviceImpl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.tradenest.orderservice.exception.ProductUnavailableException;
import com.tradenest.orderservice.dto.request.PurchaseRequest;
import com.tradenest.orderservice.dto.response.ApiResponse;
import com.tradenest.orderservice.dto.response.ProductDto;
import com.tradenest.orderservice.dto.response.PurchaseResponse;
import com.tradenest.orderservice.entities.Purchase;
import com.tradenest.orderservice.enums.PurchaseStatus;
import com.tradenest.orderservice.repository.PurchaseRepository;
import com.tradenest.orderservice.service.PurchaseService;

@Service
public class PurchaseServiceImpl implements PurchaseService {

    private final PurchaseRepository purchaseRepository;
    private final RestTemplate restTemplate;

    public PurchaseServiceImpl(PurchaseRepository purchaseRepository, RestTemplate restTemplate) {
        this.purchaseRepository = purchaseRepository;
        this.restTemplate = restTemplate;
    }

    @Override
    public PurchaseResponse createPurchase(PurchaseRequest request) {

        // Fetch product from product-service to validate price and seller
        String productUrl = "http://localhost:8082/api/products/" + request.getPid();
        ProductDto product;
        try {
            product = restTemplate.getForObject(productUrl, ProductDto.class);
        } catch (Exception e) {
            throw new RuntimeException("Error fetching product details or product not found: " + e.getMessage());
        }

        if (product == null) {
            throw new RuntimeException("Product not found");
        }

        if (product.getUid().equals(request.getBuyerId())) {
            throw new RuntimeException("You cannot buy your own product");
        }

        if ("SOLD".equalsIgnoreCase(product.getStatus())) {
            throw new ProductUnavailableException("This product has already been sold.");
        }
        
        if ("INACTIVE".equalsIgnoreCase(product.getStatus())) {
            throw new ProductUnavailableException("This product is unavailable.");
        }

        Purchase purchase = Purchase.builder()
                .pid(request.getPid())
                .buyerId(request.getBuyerId())
                .sellerId(product.getUid())
                .amount(product.getPrice())
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