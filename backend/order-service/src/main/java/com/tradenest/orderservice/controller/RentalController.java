package com.tradenest.orderservice.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.tradenest.orderservice.dto.request.RentalRequest;
import com.tradenest.orderservice.dto.request.UpdateRentalStatusRequest;
import com.tradenest.orderservice.dto.response.ApiResponse;
import com.tradenest.orderservice.dto.response.RentalResponse;
import com.tradenest.orderservice.service.RentalService;

@RestController
@RequestMapping("/api/rentals")

public class RentalController {

    private final RentalService rentalService;

    public RentalController(RentalService rentalService) {
        this.rentalService = rentalService;
    }

    // Create Rental
    @PostMapping
    public ResponseEntity<RentalResponse> createRental(
            @RequestBody RentalRequest request) {

        return new ResponseEntity<>(
                rentalService.createRental(request),
                HttpStatus.CREATED);
    }

    // Get Rental by ID
    @GetMapping("/{rentalId}")
    public ResponseEntity<RentalResponse> getRentalById(
            @PathVariable Integer rentalId) {

        return ResponseEntity.ok(
                rentalService.getRentalById(rentalId));
    }

    // Get All Rentals
    @GetMapping
    public ResponseEntity<List<RentalResponse>> getAllRentals() {

        return ResponseEntity.ok(
                rentalService.getAllRentals());
    }

    // Get Rentals by Owner
    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<List<RentalResponse>> getRentalsByOwner(
            @PathVariable Integer ownerId) {

        return ResponseEntity.ok(
                rentalService.getRentalsByOwner(ownerId));
    }

    // Get Rentals by Renter
    @GetMapping("/renter/{renterId}")
    public ResponseEntity<List<RentalResponse>> getRentalsByRenter(
            @PathVariable Integer renterId) {

        return ResponseEntity.ok(
                rentalService.getRentalsByRenter(renterId));
    }

    // Update Rental Status
    @PutMapping("/status")
    public ResponseEntity<RentalResponse> updateRentalStatus(
            @RequestBody UpdateRentalStatusRequest request) {

        return ResponseEntity.ok(
                rentalService.updateRentalStatus(request));
    }

    // Cancel Rental
    @DeleteMapping("/{rentalId}")
    public ResponseEntity<ApiResponse> cancelRental(
            @PathVariable Integer rentalId) {

        return ResponseEntity.ok(
                rentalService.cancelRental(rentalId));
    }
}
