package com.tradenest.orderservice.dto.request;

import java.math.BigDecimal;
import java.time.LocalDate;

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
public class RentalRequest {

    private Integer pid;

    private Integer ownerId;

    private Integer renterId;

    private LocalDate startDate;

    private LocalDate endDate;

    private BigDecimal totalAmount;

}