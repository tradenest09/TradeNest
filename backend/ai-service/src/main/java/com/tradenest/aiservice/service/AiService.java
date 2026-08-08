package com.tradenest.aiservice.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tradenest.aiservice.client.ProductServiceClient;
import com.tradenest.aiservice.dto.ProductDto;
import com.tradenest.aiservice.dto.RecommendationItem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class AiService {

    private final ProductServiceClient productServiceClient;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    @Value("${gemini.api.url}")
    private String geminiApiUrl;

    @Autowired
    public AiService(ProductServiceClient productServiceClient, ObjectMapper objectMapper) {
        this.productServiceClient = productServiceClient;
        this.restTemplate = new RestTemplate();
        this.objectMapper = objectMapper;
    }

    public List<RecommendationItem> getRecommendations(String query) {
        try {
            // 1. Fetch available products
            List<ProductDto> allProducts = productServiceClient.getAllProducts();
            
            if (allProducts.isEmpty()) {
                return Collections.emptyList();
            }

            // 2. Basic Pre-filtering (Budget & Category)
            List<ProductDto> filteredProducts = preFilterProducts(query, allProducts);
            
            if (filteredProducts.isEmpty()) {
                // If pre-filtering was too strict, fallback to all products
                filteredProducts = allProducts;
            }

            // 3. Construct Gemini Prompt
            String prompt = buildPrompt(query, filteredProducts);

            // 4. Call Gemini API
            String jsonResponse = callGeminiApi(prompt);

            // 5. Parse Response and Map DTOs
            return parseGeminiResponse(jsonResponse, filteredProducts);

        } catch (Exception e) {
            System.err.println("AI Service Error: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to get AI recommendations: " + e.getMessage());
        }
    }

    private List<ProductDto> preFilterProducts(String query, List<ProductDto> products) {
        String lowerQuery = query.toLowerCase();
        
        // Extract budget (e.g., "under 60000", "under 5000", "< 60000")
        BigDecimal maxBudget = null;
        Pattern pattern = Pattern.compile("(?:under|below|<|max)\\s*(?:rs\\.?|₹)?\\s*(\\d+(?:,\\d+)*)");
        Matcher matcher = pattern.matcher(lowerQuery);
        if (matcher.find()) {
            try {
                String amountStr = matcher.group(1).replace(",", "");
                maxBudget = new BigDecimal(amountStr);
            } catch (Exception ignored) {}
        }

        final BigDecimal finalBudget = maxBudget;
        
        return products.stream()
                .filter(p -> {
                    // Status filter
                    if (!"AVAILABLE".equalsIgnoreCase(p.getStatus())) {
                        return false;
                    }

                    // Budget filter
                    if (finalBudget != null && p.getPrice() != null && p.getPrice().compareTo(finalBudget) > 0) {
                        return false;
                    }
                    
                    // Simple category keyword matching (very basic)
                    boolean categoryMatch = true;
                    if (lowerQuery.contains("laptop") || lowerQuery.contains("computer")) {
                        categoryMatch = "Electronics".equalsIgnoreCase(p.getCategoryName());
                    } else if (lowerQuery.contains("phone") || lowerQuery.contains("mobile")) {
                        categoryMatch = "Mobile Phones".equalsIgnoreCase(p.getCategoryName()) || "Electronics".equalsIgnoreCase(p.getCategoryName());
                    } else if (lowerQuery.contains("bike") || lowerQuery.contains("scooter") || lowerQuery.contains("car")) {
                        categoryMatch = "Vehicles".equalsIgnoreCase(p.getCategoryName()) || "Bikes".equalsIgnoreCase(p.getCategoryName());
                    } else if (lowerQuery.contains("furniture") || lowerQuery.contains("table") || lowerQuery.contains("chair") || lowerQuery.contains("bed")) {
                        categoryMatch = "Furniture".equalsIgnoreCase(p.getCategoryName());
                    }
                    
                    return categoryMatch;
                })
                .collect(Collectors.toList());
    }

    private String buildPrompt(String query, List<ProductDto> products) {
        StringBuilder sb = new StringBuilder();
        sb.append("You are an AI Shopping Assistant for TradeNest. Based on the user's query, recommend the best products from the provided catalog.\n\n");
        sb.append("Rules:\n");
        sb.append("1. ONLY recommend products that exist in the provided JSON catalog.\n");
        sb.append("2. DO NOT invent or hallucinate products, prices, or details.\n");
        sb.append("3. Output STRICTLY valid JSON. Do not include markdown code blocks like ```json or any conversational text.\n");
        sb.append("4. Calculate a match 'score' (0-100) based on how well the product fits the user query.\n");
        sb.append("5. Provide a short 'reason' for why this product is recommended.\n");
        sb.append("6. Return up to 6 best matching products.\n");
        sb.append("7. The output MUST match this exact schema: { \"recommendations\": [ { \"productId\": 1, \"score\": 95, \"reason\": \"Matches your budget\" } ] }\n\n");
        
        sb.append("User Query: \"").append(query).append("\"\n\n");
        sb.append("Product Catalog:\n[\n");
        
        for (int i = 0; i < products.size(); i++) {
            ProductDto p = products.get(i);
            sb.append("  {")
              .append("\"id\":").append(p.getPid()).append(",")
              .append("\"name\":\"").append(escapeJson(p.getPname())).append("\",")
              .append("\"category\":\"").append(escapeJson(p.getCategoryName())).append("\",")
              .append("\"price\":").append(p.getPrice()).append(",")
              .append("\"desc\":\"").append(escapeJson(p.getPdesc())).append("\"}");
            if (i < products.size() - 1) {
                sb.append(",");
            }
            sb.append("\n");
        }
        sb.append("]\n");
        
        return sb.toString();
    }
    
    private String escapeJson(String str) {
        if (str == null) return "";
        return str.replace("\"", "\\\"").replace("\n", " ");
    }

    private String callGeminiApi(String prompt) throws Exception {
        String url = geminiApiUrl + geminiApiKey;
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        Map<String, Object> requestBody = new HashMap<>();
        
        Map<String, Object> part = new HashMap<>();
        part.put("text", prompt);
        
        Map<String, Object> content = new HashMap<>();
        content.put("parts", Collections.singletonList(part));
        
        requestBody.put("contents", Collections.singletonList(content));
        
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
        
        ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);
        return response.getBody();
    }

    private List<RecommendationItem> parseGeminiResponse(String responseBody, List<ProductDto> products) throws Exception {
        JsonNode rootNode = objectMapper.readTree(responseBody);
        
        // Gemini API wraps response in candidates[0].content.parts[0].text
        JsonNode candidates = rootNode.path("candidates");
        if (candidates.isMissingNode() || !candidates.isArray() || candidates.size() == 0) {
            throw new RuntimeException("Invalid response from Gemini API");
        }
        
        String jsonText = candidates.get(0).path("content").path("parts").get(0).path("text").asText();
        
        // Clean up potential markdown formatting that Gemini might mistakenly include despite instructions
        jsonText = jsonText.trim();
        if (jsonText.startsWith("```json")) {
            jsonText = jsonText.substring(7);
        }
        if (jsonText.startsWith("```")) {
            jsonText = jsonText.substring(3);
        }
        if (jsonText.endsWith("```")) {
            jsonText = jsonText.substring(0, jsonText.length() - 3);
        }
        jsonText = jsonText.trim();
        
        JsonNode recommendationsNode = objectMapper.readTree(jsonText).path("recommendations");
        if (!recommendationsNode.isArray()) {
            throw new RuntimeException("Invalid recommendations format from Gemini");
        }
        
        List<RecommendationItem> results = new ArrayList<>();
        Map<Integer, ProductDto> productMap = products.stream()
                .collect(Collectors.toMap(ProductDto::getPid, p -> p, (p1, p2) -> p1));
                
        for (JsonNode node : recommendationsNode) {
            int productId = node.path("productId").asInt();
            int score = node.path("score").asInt();
            String reason = node.path("reason").asText();
            
            if (productMap.containsKey(productId)) {
                RecommendationItem item = new RecommendationItem(productId, score, reason, productMap.get(productId));
                results.add(item);
            }
        }
        
        // Sort by score descending
        results.sort((a, b) -> Integer.compare(b.getScore(), a.getScore()));
        
        return results;
    }
}
