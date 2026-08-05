package com.tradenest.productservice.controller;

import org.springframework.web.bind.annotation.*;

import com.tradenest.productservice.dto.request.AddRentRequest;
import com.tradenest.productservice.dto.response.ApiResponse;
import com.tradenest.productservice.dto.response.ProductRentResponse;
import com.tradenest.productservice.services.ProductRentService;

@RestController
@RequestMapping("/api/rent")

public class ProductRentController {

    private final ProductRentService productRentService;

    public ProductRentController(ProductRentService productRentService) {
        this.productRentService = productRentService;
    }

    @PostMapping
    public ProductRentResponse addRent(@RequestBody AddRentRequest request) {
        return productRentService.addRent(request);
    }

    @GetMapping("/product/{pid}")
    public ProductRentResponse getRentByProduct(@PathVariable Integer pid) {
        return productRentService.getRentByProduct(pid);
    }

    @DeleteMapping("/{prid}")
    public ApiResponse deleteRent(@PathVariable Integer prid) {
        return productRentService.deleteRent(prid);
    }

}
