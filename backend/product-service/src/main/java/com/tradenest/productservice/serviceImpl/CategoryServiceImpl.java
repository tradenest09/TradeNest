package com.tradenest.productservice.serviceImpl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.tradenest.productservice.dto.request.AddCategoryRequest;
import com.tradenest.productservice.dto.request.UpdateCategoryRequest;
import com.tradenest.productservice.dto.response.ApiResponse;
import com.tradenest.productservice.dto.response.CategoryResponse;
import com.tradenest.productservice.entities.Category;
import com.tradenest.productservice.repositories.CategoryRepository;
import com.tradenest.productservice.services.CategoryService;

@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryServiceImpl(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    // Convert Entity -> DTO
    private CategoryResponse convertToResponse(Category category) {

        return CategoryResponse.builder()
                .cid(category.getCid())
                .cname(category.getCname())
                .description(category.getDescription())
                .build();
    }

    @Override
    public CategoryResponse addCategory(AddCategoryRequest request) {

        if (categoryRepository.existsByCname(request.getCname())) {
            throw new RuntimeException("Category already exists");
        }

        Category category = Category.builder()
                .cname(request.getCname())
                .description(request.getDescription())
                .build();

        Category saved = categoryRepository.save(category);

        return convertToResponse(saved);
    }

    @Override
    public List<CategoryResponse> getAllCategories() {

        return categoryRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    @Override
    public CategoryResponse getCategoryById(Integer cid) {

        Category category = categoryRepository.findById(cid)
                .orElseThrow(() ->
                        new RuntimeException("Category not found"));

        return convertToResponse(category);
    }

    @Override
    public CategoryResponse updateCategory(Integer cid, UpdateCategoryRequest request) {

        Category category = categoryRepository.findById(cid)
                .orElseThrow(() ->
                        new RuntimeException("Category not found"));

        category.setCname(request.getCname());
        category.setDescription(request.getDescription());

        Category updated = categoryRepository.save(category);

        return convertToResponse(updated);
    }

    @Override
    public ApiResponse deleteCategory(Integer cid) {

        Category category = categoryRepository.findById(cid)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        if (category.getProducts() != null && !category.getProducts().isEmpty()) {
            return ApiResponse.builder()
                    .success(false)
                    .message("Category cannot be deleted because products exist.")
                    .build();
        }

        categoryRepository.delete(category);

        return ApiResponse.builder()
                .success(true)
                .message("Category deleted successfully.")
                .build();
    }

}