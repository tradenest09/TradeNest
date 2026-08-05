package com.tradenest.productservice.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ReviewResponse {
    private Integer reviewId;
    private Integer pid;
    private Integer uid;
    private Integer rating;
    private String reviewText;
    private LocalDateTime reviewDate;
}
