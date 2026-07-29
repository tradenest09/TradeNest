package com.tradenest.orderservice.service;

import java.util.List;

import com.tradenest.orderservice.dto.request.RentalRequest;
import com.tradenest.orderservice.dto.request.UpdateRentalStatusRequest;
import com.tradenest.orderservice.dto.response.ApiResponse;
import com.tradenest.orderservice.dto.response.RentalResponse;

public interface RentalService {

    // Create Rental Request
    RentalResponse createRental(RentalRequest request);

    // Get Rental by ID
    RentalResponse getRentalById(Integer rentalId);

    // Get All Rentals
    List<RentalResponse> getAllRentals();

    // Get Rentals by Renter
    List<RentalResponse> getRentalsByRenter(Integer renterId);

    // Get Rentals by Owner
    List<RentalResponse> getRentalsByOwner(Integer ownerId);

    // Update Rental Status
    RentalResponse updateRentalStatus(UpdateRentalStatusRequest request);

    // Cancel Rental
    ApiResponse cancelRental(Integer rentalId);

}