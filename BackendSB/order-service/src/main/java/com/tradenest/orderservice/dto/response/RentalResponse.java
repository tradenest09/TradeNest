package com.tradenest.orderservice.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.tradenest.orderservice.enums.RentalStatus;

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
public class RentalResponse {

    private Integer rentalId;

    private Integer pid;

    private Integer ownerId;

    private Integer renterId;

    private LocalDate startDate;

    private LocalDate endDate;

    private BigDecimal totalAmount;

    private RentalStatus status;

}