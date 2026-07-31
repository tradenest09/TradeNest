package com.tradenest.productservice.dto.request;

import java.math.BigDecimal;

import com.tradenest.productservice.enums.ProductStatus;
import com.tradenest.productservice.enums.ProductType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateProductRequest {

    private Integer cid;      

    private String pname;

    private String pdesc;

    private BigDecimal price;

    private ProductStatus status;

    private ProductType type;
}