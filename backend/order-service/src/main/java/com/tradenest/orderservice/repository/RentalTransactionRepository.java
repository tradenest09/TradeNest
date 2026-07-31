package com.tradenest.orderservice.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tradenest.orderservice.entities.RentalTransaction;
import com.tradenest.orderservice.enums.RentalStatus;

@Repository
public interface RentalTransactionRepository extends JpaRepository<RentalTransaction, Integer> {

    // Rentals by renter
    List<RentalTransaction> findByRenterId(Integer renterId);

    // Rentals by owner
    List<RentalTransaction> findByOwnerId(Integer ownerId);

    // Rentals of a product
    List<RentalTransaction> findByPid(Integer pid);

    // Rentals by status
    List<RentalTransaction> findByStatus(RentalStatus status);

    // Owner + Status
    List<RentalTransaction> findByOwnerIdAndStatus(Integer ownerId, RentalStatus status);

    // Renter + Status
    List<RentalTransaction> findByRenterIdAndStatus(Integer renterId, RentalStatus status);
}