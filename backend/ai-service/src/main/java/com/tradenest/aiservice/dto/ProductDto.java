package com.tradenest.aiservice.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductDto {
    private Integer pid;
    private Integer uid;
    private Integer cid;
    private String categoryName;
    private String pname;
    private String pdesc;
    private BigDecimal price;
    private String status;
    private String type;
    private LocalDateTime createdAt;
    private List<ImageDto> images;
}
