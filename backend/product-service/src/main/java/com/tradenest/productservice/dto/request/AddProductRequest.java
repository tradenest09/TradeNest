package com.tradenest.productservice.dto.request;

import java.math.BigDecimal;

import com.tradenest.productservice.enums.ProductStatus;
import com.tradenest.productservice.enums.ProductType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddProductRequest {

    @NotNull
    private Integer uid;

    @NotNull
    private Integer cid;

    @NotBlank
    private String pname;

    private String pdesc;

    @NotNull
    private BigDecimal price;

    @NotNull
    private ProductStatus status;

    @NotNull
    private ProductType type;

}