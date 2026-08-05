package com.tradenest.orderservice.serviceImpl;

import java.time.temporal.ChronoUnit;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.tradenest.orderservice.dto.request.RentalRequest;
import com.tradenest.orderservice.dto.request.UpdateRentalStatusRequest;
import com.tradenest.orderservice.dto.response.ApiResponse;
import com.tradenest.orderservice.dto.response.ProductDto;
import com.tradenest.orderservice.dto.response.RentalResponse;
import com.tradenest.orderservice.entities.RentalTransaction;
import com.tradenest.orderservice.enums.RentalStatus;
import com.tradenest.orderservice.repository.RentalTransactionRepository;
import com.tradenest.orderservice.service.RentalService;

@Service
public class RentalServiceImpl implements RentalService {

    private final RentalTransactionRepository rentalRepository;
    private final RestTemplate restTemplate;

    public RentalServiceImpl(RentalTransactionRepository rentalRepository, RestTemplate restTemplate) {
        this.rentalRepository = rentalRepository;
        this.restTemplate = restTemplate;
    }

    @Override
    public RentalResponse createRental(RentalRequest request) {

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
        if (product.getUid().equals(request.getRenterId())) {
            throw new RuntimeException("You cannot rent your own product");
        }

        if (product.getRentDetails() == null) {
            throw new RuntimeException("Product is not available for rent");
        }

        long days = ChronoUnit.DAYS.between(request.getStartDate(), request.getEndDate());
        if (days <= 0) {
            throw new RuntimeException("End date must be after start date");
        }
        
        BigDecimal expectedAmount = product.getRentDetails().getChargePerDay().multiply(BigDecimal.valueOf(days))
                .add(product.getRentDetails().getSecurityDeposit());

        RentalTransaction rental = RentalTransaction.builder()
                .pid(request.getPid())
                .ownerId(product.getUid())
                .renterId(request.getRenterId())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .totalAmount(expectedAmount)
                .status(RentalStatus.REQUESTED)
                .build();

        RentalTransaction saved = rentalRepository.save(rental);

        return mapToResponse(saved);
    }

    @Override
    public RentalResponse getRentalById(Integer rentalId) {

        RentalTransaction rental = rentalRepository.findById(rentalId)
                .orElseThrow(() -> new RuntimeException("Rental not found"));

        return mapToResponse(rental);
    }

    @Override
    public List<RentalResponse> getAllRentals() {

        return rentalRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<RentalResponse> getRentalsByRenter(Integer renterId) {

        return rentalRepository.findByRenterId(renterId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<RentalResponse> getRentalsByOwner(Integer ownerId) {

        return rentalRepository.findByOwnerId(ownerId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public RentalResponse updateRentalStatus(UpdateRentalStatusRequest request) {

        RentalTransaction rental = rentalRepository.findById(request.getRentalId())
                .orElseThrow(() -> new RuntimeException("Rental not found"));

        rental.setStatus(request.getStatus());

        RentalTransaction updated = rentalRepository.save(rental);

        return mapToResponse(updated);
    }

    @Override
    public ApiResponse cancelRental(Integer rentalId) {

        RentalTransaction rental = rentalRepository.findById(rentalId)
                .orElseThrow(() -> new RuntimeException("Rental not found"));

        rental.setStatus(RentalStatus.CANCELLED);

        rentalRepository.save(rental);

        return ApiResponse.builder()
                .success(true)
                .message("Rental cancelled successfully")
                .build();
    }

    private RentalResponse mapToResponse(RentalTransaction rental) {

        return RentalResponse.builder()
                .rentalId(rental.getRentalId())
                .pid(rental.getPid())
                .ownerId(rental.getOwnerId())
                .renterId(rental.getRenterId())
                .startDate(rental.getStartDate())
                .endDate(rental.getEndDate())
                .totalAmount(rental.getTotalAmount())
                .status(rental.getStatus())
                .build();
    }
}