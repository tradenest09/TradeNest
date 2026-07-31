package com.tradenest.productservice.dto.request;

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
public class AddRentRequest {

    private Integer pid;

    private Integer noOfDays;

    private BigDecimal chargePerDay;

    private BigDecimal securityDeposit;

}