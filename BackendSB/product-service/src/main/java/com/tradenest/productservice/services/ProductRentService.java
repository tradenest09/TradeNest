package com.tradenest.productservice.services;

import com.tradenest.productservice.dto.request.AddRentRequest;
import com.tradenest.productservice.dto.response.ApiResponse;
import com.tradenest.productservice.dto.response.ProductRentResponse;

public interface ProductRentService {

    ProductRentResponse addRent(AddRentRequest request);

    ProductRentResponse getRentByProduct(Integer pid);

    ApiResponse deleteRent(Integer prid);

}