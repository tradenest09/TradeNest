package com.tradenest.orderservice.dto.response;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class ProductRentDto {
    private Integer prid;
    private Integer pid;
    private Integer noOfDays;
    private BigDecimal chargePerDay;
    private BigDecimal securityDeposit;
}
