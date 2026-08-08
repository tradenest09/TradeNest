package com.tradenest.aiservice.controller;

import com.tradenest.aiservice.dto.AiRecommendationRequest;
import com.tradenest.aiservice.dto.AiRecommendationResponse;
import com.tradenest.aiservice.dto.RecommendationItem;
import com.tradenest.aiservice.service.AiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    private final AiService aiService;

    @Autowired
    public AiController(AiService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/recommend")
    public ResponseEntity<?> getRecommendations(@RequestBody AiRecommendationRequest request) {
        if (request == null || request.getQuery() == null || request.getQuery().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", "Query cannot be empty"));
        }

        try {
            List<RecommendationItem> items = aiService.getRecommendations(request.getQuery());
            return ResponseEntity.ok(new AiRecommendationResponse(items));
        } catch (Exception e) {
            // Return 500 but in a JSON format so the frontend can handle it gracefully
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", "AI Service Error: " + e.getMessage()));
        }
    }
}
