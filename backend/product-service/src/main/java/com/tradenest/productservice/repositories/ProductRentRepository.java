package com.tradenest.productservice.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tradenest.productservice.entities.ProductRent;

@Repository
public interface ProductRentRepository extends JpaRepository<ProductRent, Integer> {

    Optional<ProductRent> findByProductPid(Integer pid);

}