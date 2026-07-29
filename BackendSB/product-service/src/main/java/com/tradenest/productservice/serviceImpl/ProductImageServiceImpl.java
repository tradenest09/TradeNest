package com.tradenest.productservice.serviceImpl;

import java.util.List;

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

}