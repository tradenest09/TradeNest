package com.tradenest.productservice.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tradenest.productservice.entities.Product;
import com.tradenest.productservice.enums.ProductStatus;
import com.tradenest.productservice.enums.ProductType;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {

    List<Product> findByUid(Integer uid);

    List<Product> findByCategoryCid(Integer cid);

    List<Product> findByStatus(ProductStatus status);

    List<Product> findByType(ProductType type);

    List<Product> findByPnameContainingIgnoreCase(String pname);

}