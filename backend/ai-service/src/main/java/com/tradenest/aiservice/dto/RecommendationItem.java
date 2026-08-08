package com.tradenest.aiservice.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RecommendationItem {
    private Integer productId;
    private Integer score;
    private String reason;
    private ProductDto productDetails; // Will be populated by AI service after Gemini returns
}
