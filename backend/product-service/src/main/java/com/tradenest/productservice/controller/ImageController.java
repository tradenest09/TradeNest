package com.tradenest.productservice.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.MediaType;

import com.tradenest.productservice.dto.response.ImageResponse;
import com.tradenest.productservice.services.ProductImageService;

@RestController
@RequestMapping("/api/products")
public class ImageController {

    private final ProductImageService productImageService;

    public ImageController(ProductImageService productImageService) {
        this.productImageService = productImageService;
    }

    @PostMapping(value = "/{productId}/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ImageResponse> uploadImage(
            @PathVariable Integer productId, 
            @RequestParam("file") MultipartFile file) {
        ImageResponse response = productImageService.uploadImage(productId, file);
        return ResponseEntity.ok(response);
    }
}
