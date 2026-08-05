package com.tradenest.productservice.serviceImpl;

import java.util.List;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.stereotype.Service;

import com.tradenest.productservice.dto.request.AddProductRequest;
import com.tradenest.productservice.dto.request.UpdateProductRequest;
import com.tradenest.productservice.dto.response.ApiResponse;
import com.tradenest.productservice.dto.response.ProductResponse;
import com.tradenest.productservice.entities.Category;
import com.tradenest.productservice.entities.Product;
import com.tradenest.productservice.enums.ProductStatus;
import com.tradenest.productservice.enums.ProductType;
import com.tradenest.productservice.repositories.CategoryRepository;
import com.tradenest.productservice.repositories.ProductRepository;
import com.tradenest.productservice.repositories.ProductImageRepository;
import com.tradenest.productservice.entities.ProductImage;
import com.tradenest.productservice.dto.response.ImageResponse;
import com.tradenest.productservice.services.ProductService;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductImageRepository productImageRepository;

    public ProductServiceImpl(ProductRepository productRepository,
                              CategoryRepository categoryRepository,
                              ProductImageRepository productImageRepository) {

        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.productImageRepository = productImageRepository;
    }
    @Override
    public ProductResponse addProduct(AddProductRequest request) {

        Category category = categoryRepository.findById(request.getCid())
                .orElseThrow(() ->
                        new RuntimeException("Category not found"));

        Product product = Product.builder()
                .uid(request.getUid())
                .category(category)
                .pname(request.getPname())
                .pdesc(request.getPdesc())
                .price(request.getPrice())
                .status(ProductStatus.AVAILABLE)
                .type(request.getType())
                .build();

        Product saved = productRepository.save(product);

        return convertToResponse(saved);
    }

    @Override
    public ProductResponse getProductById(Integer pid) {

        Product product = productRepository.findById(pid)
                .orElseThrow(() ->
                        new RuntimeException("Product not found"));

        return convertToResponse(product);
    }
    
    private ProductResponse convertToResponse(Product product) {
        
        List<ProductImage> productImages = productImageRepository.findByProductPid(product.getPid());
        List<ImageResponse> imageResponses = productImages.stream().map(img -> 
            ImageResponse.builder()
                .imageId(img.getImageId())
                .pid(img.getProduct().getPid())
                .imageUrl(img.getImageUrl())
                .isPrimary(img.getIsPrimary())
                .build()
        ).toList();

        return ProductResponse.builder()
                .pid(product.getPid())
                .uid(product.getUid())
                .cid(product.getCategory().getCid())
                .categoryName(product.getCategory().getCname())
                .pname(product.getPname())
                .pdesc(product.getPdesc())
                .price(product.getPrice())
                .status(product.getStatus())
                .type(product.getType())
                .createdAt(product.getCreatedAt())
                .images(imageResponses)
                .build();
    }

    @Override
    public List<ProductResponse> getAllProducts() {

        return productRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    @Override
    public List<ProductResponse> getProductsByCategory(Integer cid) {

    	return productRepository.findByCategoryCid(cid)
    	        .stream()
    	        .map(this::convertToResponse)
    	        .toList();
    }

    @Override
    public List<ProductResponse> getProductsBySeller(Integer uid) {

        return productRepository.findByUid(uid)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    @Override
    public List<ProductResponse> getProductsByType(ProductType type) {

        return productRepository.findByType(type)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    @Override
    public List<ProductResponse> searchProducts(String keyword) {

        return productRepository
                .findByPnameContainingIgnoreCase(keyword)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    @Override
    public ProductResponse updateProduct(Integer pid, UpdateProductRequest request) {

        Product product = productRepository.findById(pid)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        product.setPname(request.getPname());
        product.setPdesc(request.getPdesc());
        product.setPrice(request.getPrice());
        product.setStatus(request.getStatus());
        product.setType(request.getType());

        Category category = categoryRepository.findById(request.getCid())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        product.setCategory(category);

        Product updated = productRepository.save(product);

        return convertToResponse(updated);
    }

    @Override
    public ApiResponse deleteProduct(Integer pid) {

        Product product = productRepository.findById(pid)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Delete associated physical images and DB records
        List<ProductImage> images = productImageRepository.findByProductPid(pid);
        for (ProductImage img : images) {
            try {
                Path filePath = Paths.get("uploads/products/", img.getImageUrl());
                Files.deleteIfExists(filePath);
            } catch (Exception e) {
                System.err.println("Failed to delete physical image file: " + e.getMessage());
            }
        }
        productImageRepository.deleteAll(images);

        productRepository.delete(product);

        return ApiResponse.builder()
                .success(true)
                .message("Product deleted successfully")
                .build();
    }
    
    @Override
    public long getTotalProducts() {

        return productRepository.count();

    }
}