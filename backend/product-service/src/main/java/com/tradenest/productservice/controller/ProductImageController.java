package com.tradenest.productservice.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.tradenest.productservice.dto.request.AddImageRequest;
import com.tradenest.productservice.dto.response.ApiResponse;
import com.tradenest.productservice.dto.response.ImageResponse;
import com.tradenest.productservice.services.ProductImageService;

@RestController
@RequestMapping("/api/images")
public class ProductImageController {

    private final ProductImageService productImageService;

    public ProductImageController(ProductImageService productImageService) {
        this.productImageService = productImageService;
    }

    @PostMapping
    public ImageResponse addImage(@RequestBody AddImageRequest request) {
        return productImageService.addImage(request);
    }

    @GetMapping("/product/{pid}")
    public List<ImageResponse> getImagesByProduct(@PathVariable Integer pid) {
        return productImageService.getImagesByProduct(pid);
    }

    @DeleteMapping("/{imageId}")
    public ApiResponse deleteImage(@PathVariable Integer imageId) {
        return productImageService.deleteImage(imageId);
    }

}