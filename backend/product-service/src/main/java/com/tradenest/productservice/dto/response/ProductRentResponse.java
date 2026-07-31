package com.tradenest.productservice.dto.response;

import java.math.BigDecimal;

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
public class ProductRentResponse {

    private Integer prid;

    private Integer pid;

    private Integer noOfDays;

    private BigDecimal chargePerDay;

    private BigDecimal securityDeposit;

}