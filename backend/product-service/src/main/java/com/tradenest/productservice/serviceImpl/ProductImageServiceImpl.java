package com.tradenest.productservice.serviceImpl;

import java.util.List;
import java.util.UUID;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.io.IOException;

import org.springframework.web.multipart.MultipartFile;

import org.springframework.stereotype.Service;

import com.tradenest.productservice.dto.request.AddImageRequest;
import com.tradenest.productservice.dto.response.ApiResponse;
import com.tradenest.productservice.dto.response.ImageResponse;
import com.tradenest.productservice.entities.Product;
import com.tradenest.productservice.entities.ProductImage;
import com.tradenest.productservice.repositories.ProductImageRepository;
import com.tradenest.productservice.repositories.ProductRepository;
import com.tradenest.productservice.services.ProductImageService;

@Service
public class ProductImageServiceImpl implements ProductImageService {

    private final ProductImageRepository productImageRepository;
    private final ProductRepository productRepository;

    public ProductImageServiceImpl(ProductImageRepository productImageRepository,
                                   ProductRepository productRepository) {

        this.productImageRepository = productImageRepository;
        this.productRepository = productRepository;
    }

    @Override
    public ImageResponse addImage(AddImageRequest request) {

        Product product = productRepository.findById(request.getPid())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        ProductImage image = ProductImage.builder()
                .product(product)
                .imageUrl(request.getImageUrl())
                .isPrimary(request.getIsPrimary())
                .build();

        ProductImage saved = productImageRepository.save(image);

        return convertToResponse(saved);
    }

    @Override
    public List<ImageResponse> getImagesByProduct(Integer pid) {

        return productImageRepository.findByProductPid(pid)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    @Override
    public ApiResponse deleteImage(Integer piid) {

        ProductImage image = productImageRepository.findById(piid)
                .orElseThrow(() -> new RuntimeException("Image not found"));

        try {
            Path filePath = Paths.get("uploads/products/", image.getImageUrl());
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            System.err.println("Failed to delete physical image file: " + e.getMessage());
        }

        productImageRepository.delete(image);

        return ApiResponse.builder()
                .success(true)
                .message("Image deleted successfully")
                .build();
    }

    private ImageResponse convertToResponse(ProductImage image) {

        return ImageResponse.builder()
                .imageId(image.getImageId())
                .pid(image.getProduct().getPid())
                .imageUrl(image.getImageUrl())
                .isPrimary(image.getIsPrimary())
                .build();
    }

    @Override
    public ImageResponse uploadImage(Integer productId, MultipartFile file) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (file.isEmpty()) {
            throw new RuntimeException("Failed to store empty file");
        }

        try {
            // Create uploads/products/ if it doesn't exist
            String uploadDir = "uploads/products/";
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Generate UUID filename preserving extension
            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String newFilename = UUID.randomUUID().toString() + extension;

            // Save file
            Path filePath = uploadPath.resolve(newFilename);
            Files.copy(file.getInputStream(), filePath);

            // Is this the first image? Make it primary
            boolean isFirstImage = productImageRepository.findByProductPid(productId).isEmpty();

            // Save into Image table
            ProductImage image = ProductImage.builder()
                    .product(product)
                    .imageUrl(newFilename)
                    .isPrimary(isFirstImage)
                    .build();

            ProductImage saved = productImageRepository.save(image);
            return convertToResponse(saved);
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file: " + e.getMessage(), e);
        }
    }

}