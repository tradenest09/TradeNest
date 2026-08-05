package com.tradenest.productservice.serviceImpl;

import com.tradenest.productservice.dto.request.AddReviewRequest;
import com.tradenest.productservice.dto.response.ApiResponse;
import com.tradenest.productservice.dto.response.ReviewResponse;
import com.tradenest.productservice.entities.Product;
import com.tradenest.productservice.entities.Review;
import com.tradenest.productservice.repositories.ProductRepository;
import com.tradenest.productservice.repositories.ReviewRepository;
import com.tradenest.productservice.services.ReviewService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;

    public ReviewServiceImpl(ReviewRepository reviewRepository, ProductRepository productRepository) {
        this.reviewRepository = reviewRepository;
        this.productRepository = productRepository;
    }

    @Override
    public ReviewResponse addReview(AddReviewRequest request) {
        Product product = productRepository.findById(request.getPid())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Review review = Review.builder()
                .product(product)
                .uid(request.getUid())
                .rating(request.getRating())
                .reviewText(request.getReviewText())
                .build();

        Review saved = reviewRepository.save(review);
        return mapToResponse(saved);
    }

    @Override
    public List<ReviewResponse> getReviewsByProduct(Integer pid) {
        return reviewRepository.findByProductPid(pid).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ReviewResponse> getReviewsByUser(Integer uid) {
        return reviewRepository.findByUid(uid).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ApiResponse deleteReview(Integer reviewId) {
        reviewRepository.deleteById(reviewId);
        return ApiResponse.builder().success(true).message("Review deleted successfully").build();
    }

    private ReviewResponse mapToResponse(Review review) {
        return ReviewResponse.builder()
                .reviewId(review.getReviewId())
                .pid(review.getProduct().getPid())
                .uid(review.getUid())
                .rating(review.getRating())
                .reviewText(review.getReviewText())
                .reviewDate(review.getReviewDate())
                .build();
    }
}
