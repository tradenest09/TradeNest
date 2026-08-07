package com.tradenest.productservice.services;

import java.util.List;

import com.tradenest.productservice.dto.request.AddProductRequest;
import com.tradenest.productservice.dto.request.UpdateProductRequest;
import com.tradenest.productservice.dto.response.ApiResponse;
import com.tradenest.productservice.dto.response.ProductResponse;
import com.tradenest.productservice.enums.ProductType;

public interface ProductService {

    ProductResponse addProduct(AddProductRequest request);

    ProductResponse getProductById(Integer pid);

    List<ProductResponse> getAllProducts();

    List<ProductResponse> getProductsByCategory(Integer cid);

    List<ProductResponse> getProductsBySeller(Integer uid);

    List<ProductResponse> getProductsByType(ProductType type);

    List<ProductResponse> searchProducts(String keyword);

    ProductResponse updateProduct(Integer pid, UpdateProductRequest request);
    
    ProductResponse updateProductStatus(Integer pid, com.tradenest.productservice.enums.ProductStatus status);

    ApiResponse deleteProduct(Integer pid);
    
    long getTotalProducts();

}