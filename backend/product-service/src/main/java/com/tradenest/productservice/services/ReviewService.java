package com.tradenest.productservice.services;

import com.tradenest.productservice.dto.request.AddReviewRequest;
import com.tradenest.productservice.dto.response.ApiResponse;
import com.tradenest.productservice.dto.response.ReviewResponse;

import java.util.List;

public interface ReviewService {
    ReviewResponse addReview(AddReviewRequest request);
    List<ReviewResponse> getReviewsByProduct(Integer pid);
    List<ReviewResponse> getReviewsByUser(Integer uid);
    ApiResponse deleteReview(Integer reviewId);
}
