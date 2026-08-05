package com.tradenest.orderservice.dto.response;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class ProductDto {
    private Integer pid;
    private Integer uid;
    private BigDecimal price;
    private String status;
    private String type;
    private ProductRentDto rentDetails;
}
