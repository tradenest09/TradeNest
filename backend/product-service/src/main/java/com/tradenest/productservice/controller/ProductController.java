package com.tradenest.productservice.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.tradenest.productservice.dto.request.AddProductRequest;
import com.tradenest.productservice.dto.request.UpdateProductRequest;
import com.tradenest.productservice.dto.response.ApiResponse;
import com.tradenest.productservice.dto.response.ProductResponse;
import com.tradenest.productservice.enums.ProductType;
import com.tradenest.productservice.services.ProductService;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    // Add Product
    @PostMapping
    public ProductResponse addProduct(@RequestBody AddProductRequest request) {
        return productService.addProduct(request);
    }

    // Get Product By Id
    @GetMapping("/{pid}")
    public ProductResponse getProductById(@PathVariable Integer pid) {
        return productService.getProductById(pid);
    }

    // Get All Products
    @GetMapping
    public List<ProductResponse> getAllProducts() {
        return productService.getAllProducts();
    }

    // Get Products By Category
    @GetMapping("/category/{cid}")
    public List<ProductResponse> getProductsByCategory(@PathVariable Integer cid) {
        return productService.getProductsByCategory(cid);
    }

    // Get Products By Seller
    @GetMapping("/seller/{uid}")
    public List<ProductResponse> getProductsBySeller(@PathVariable Integer uid) {
        return productService.getProductsBySeller(uid);
    }

    // Get Products By Type
    @GetMapping("/type/{type}")
    public List<ProductResponse> getProductsByType(@PathVariable ProductType type) {
        return productService.getProductsByType(type);
    }

    // Search Product
    @GetMapping("/search")
    public List<ProductResponse> searchProducts(@RequestParam String keyword) {
        return productService.searchProducts(keyword);
    }

    // Update Product
    @PutMapping("/{pid}")
    public ProductResponse updateProduct(@PathVariable Integer pid,
            @RequestBody UpdateProductRequest request) {

        return productService.updateProduct(pid, request);
    }

    // Delete Product
    @DeleteMapping("/{pid}")
    public ApiResponse deleteProduct(@PathVariable Integer pid) {
        return productService.deleteProduct(pid);
    }
    
    @GetMapping("/count")
    public ResponseEntity<Long> getTotalProducts() {

        return ResponseEntity.ok(productService.getTotalProducts());

    }
}