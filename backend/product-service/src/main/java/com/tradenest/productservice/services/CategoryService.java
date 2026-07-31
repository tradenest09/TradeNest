package com.tradenest.productservice.services;

import java.util.List;

import com.tradenest.productservice.dto.request.AddCategoryRequest;
import com.tradenest.productservice.dto.request.UpdateCategoryRequest;
import com.tradenest.productservice.dto.response.ApiResponse;
import com.tradenest.productservice.dto.response.CategoryResponse;

public interface CategoryService {

    CategoryResponse addCategory(AddCategoryRequest request);

    List<CategoryResponse> getAllCategories();

    CategoryResponse getCategoryById(Integer cid);

    CategoryResponse updateCategory(Integer cid, UpdateCategoryRequest request);

    ApiResponse deleteCategory(Integer cid);

}