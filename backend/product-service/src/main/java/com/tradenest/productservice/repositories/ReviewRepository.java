package com.tradenest.productservice.repositories;

import com.tradenest.productservice.entities.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Integer> {
    List<Review> findByProductPid(Integer pid);
    List<Review> findByUid(Integer uid);
}
