package com.tradenest.productservice.serviceImpl;

import org.springframework.stereotype.Service;

import com.tradenest.productservice.dto.request.AddRentRequest;
import com.tradenest.productservice.dto.response.ApiResponse;
import com.tradenest.productservice.dto.response.ProductRentResponse;
import com.tradenest.productservice.entities.Product;
import com.tradenest.productservice.entities.ProductRent;
import com.tradenest.productservice.repositories.ProductRentRepository;
import com.tradenest.productservice.repositories.ProductRepository;
import com.tradenest.productservice.services.ProductRentService;

@Service
public class ProductRentServiceImpl implements ProductRentService {

    private final ProductRentRepository productRentRepository;
    private final ProductRepository productRepository;

    public ProductRentServiceImpl(ProductRentRepository productRentRepository,
                                  ProductRepository productRepository) {

        this.productRentRepository = productRentRepository;
        this.productRepository = productRepository;
    }

    @Override
    public ProductRentResponse addRent(AddRentRequest request) {

        Product product = productRepository.findById(request.getPid())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        ProductRent rent = ProductRent.builder()
                .product(product)
                .noOfDays(request.getNoOfDays())
                .chargePerDay(request.getChargePerDay())
                .securityDeposit(request.getSecurityDeposit())
                .build();

        ProductRent saved = productRentRepository.save(rent);

        return convertToResponse(saved);
    }

    @Override
    public ProductRentResponse getRentByProduct(Integer pid) {

        ProductRent rent = productRentRepository.findByProductPid(pid)
                .orElseThrow(() -> new RuntimeException("Rent details not found"));

        return convertToResponse(rent);
    }

    @Override
    public ApiResponse deleteRent(Integer prid) {

        ProductRent rent = productRentRepository.findById(prid)
                .orElseThrow(() -> new RuntimeException("Rent details not found"));

        productRentRepository.delete(rent);

        return ApiResponse.builder()
                .success(true)
                .message("Rent details deleted successfully")
                .build();
    }

    private ProductRentResponse convertToResponse(ProductRent rent) {

        return ProductRentResponse.builder()
                .prid(rent.getPrid())
                .pid(rent.getProduct().getPid())
                .noOfDays(rent.getNoOfDays())
                .chargePerDay(rent.getChargePerDay())
                .securityDeposit(rent.getSecurityDeposit())
                .build();
    }

}