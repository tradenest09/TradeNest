package com.tradenest.orderservice.serviceImpl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.tradenest.orderservice.dto.request.RentalRequest;
import com.tradenest.orderservice.dto.request.UpdateRentalStatusRequest;
import com.tradenest.orderservice.dto.response.ApiResponse;
import com.tradenest.orderservice.dto.response.RentalResponse;
import com.tradenest.orderservice.entities.RentalTransaction;
import com.tradenest.orderservice.enums.RentalStatus;
import com.tradenest.orderservice.repository.RentalTransactionRepository;
import com.tradenest.orderservice.service.RentalService;

@Service
public class RentalServiceImpl implements RentalService {

    private final RentalTransactionRepository rentalRepository;

    public RentalServiceImpl(RentalTransactionRepository rentalRepository) {
        this.rentalRepository = rentalRepository;
    }

    @Override
    public RentalResponse createRental(RentalRequest request) {

        RentalTransaction rental = RentalTransaction.builder()
                .pid(request.getPid())
                .ownerId(request.getOwnerId())
                .renterId(request.getRenterId())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .totalAmount(request.getTotalAmount())
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