package com.tradenest.productservice.dto.request;

import lombok.Data;

@Data
public class AddReviewRequest {
    private Integer pid;
    private Integer uid;
    private Integer rating;
    private String reviewText;
}
