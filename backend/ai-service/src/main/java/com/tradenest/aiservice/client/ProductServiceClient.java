package com.tradenest.aiservice.client;

import com.tradenest.aiservice.dto.ProductDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class ProductServiceClient {

    private final RestTemplate restTemplate;
    private static final String PRODUCT_SERVICE_URL = "http://PRODUCT-SERVICE/api/products";

    @Autowired
    public ProductServiceClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public List<ProductDto> getAllProducts() {
        try {
            ResponseEntity<List<ProductDto>> response = restTemplate.exchange(
                    PRODUCT_SERVICE_URL,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<List<ProductDto>>() {}
            );
            
            if (response.getBody() != null) {
                // Filter out SOLD products
                return response.getBody().stream()
                        .filter(p -> !"SOLD".equalsIgnoreCase(p.getStatus()))
                        .collect(Collectors.toList());
            }
            return Collections.emptyList();
        } catch (Exception e) {
            System.err.println("Failed to fetch products: " + e.getMessage());
            return Collections.emptyList();
        }
    }
}
