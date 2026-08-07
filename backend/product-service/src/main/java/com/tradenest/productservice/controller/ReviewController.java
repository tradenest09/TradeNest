package com.tradenest.productservice.controller;

import com.tradenest.productservice.dto.request.AddReviewRequest;
import com.tradenest.productservice.dto.response.ApiResponse;
import com.tradenest.productservice.dto.response.ReviewResponse;
import com.tradenest.productservice.services.ReviewService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")

public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping
    public ResponseEntity<ReviewResponse> addReview(@RequestBody AddReviewRequest request) {
        return new ResponseEntity<>(reviewService.addReview(request), HttpStatus.CREATED);
    }

    @GetMapping("/product/{pid}")
    public ResponseEntity<List<ReviewResponse>> getReviewsByProduct(@PathVariable Integer pid) {
        return ResponseEntity.ok(reviewService.getReviewsByProduct(pid));
    }

    @GetMapping("/user/{uid}")
    public ResponseEntity<List<ReviewResponse>> getReviewsByUser(@PathVariable Integer uid) {
        return ResponseEntity.ok(reviewService.getReviewsByUser(uid));
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<ApiResponse> deleteReview(@PathVariable Integer reviewId) {
        return ResponseEntity.ok(reviewService.deleteReview(reviewId));
    }
}

