package com.tradenest.productservice.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.tradenest.productservice.enums.ProductStatus;
import com.tradenest.productservice.enums.ProductType;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductResponse {

    private Integer pid;

    private Integer uid;

    private Integer cid;

    private String categoryName;

    private String pname;

    private String pdesc;

    private BigDecimal price;

    private ProductStatus status;

    private ProductType type;

    private LocalDateTime createdAt;

    private List<ImageResponse> images = null;

    private ProductRentResponse rentDetails = null;

}