package com.tradenest.productservice.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.tradenest.productservice.dto.request.AddCategoryRequest;
import com.tradenest.productservice.dto.request.UpdateCategoryRequest;
import com.tradenest.productservice.dto.response.ApiResponse;
import com.tradenest.productservice.dto.response.CategoryResponse;
import com.tradenest.productservice.services.CategoryService;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "*")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    // Add Category
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CategoryResponse addCategory(@RequestBody AddCategoryRequest request) {
        return categoryService.addCategory(request);
    }

    
    @GetMapping
    public List<CategoryResponse> getAllCategories() {
        return categoryService.getAllCategories();
    }

    @GetMapping("/{cid}")
    public CategoryResponse getCategoryById(@PathVariable Integer cid) {
        return categoryService.getCategoryById(cid);
    }


    @PutMapping("/{cid}")
    public CategoryResponse updateCategory(@PathVariable Integer cid,
                                           @RequestBody UpdateCategoryRequest request) {
        return categoryService.updateCategory(cid, request);
    }

    
    @DeleteMapping("/{cid}")
    public ApiResponse deleteCategory(@PathVariable Integer cid) {
        return categoryService.deleteCategory(cid);
    }

}