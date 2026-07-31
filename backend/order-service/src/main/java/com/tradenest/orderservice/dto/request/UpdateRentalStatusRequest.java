package com.tradenest.orderservice.dto.request;

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
public class UpdateRentalStatusRequest {

    private Integer rentalId;

    private RentalStatus status;

}