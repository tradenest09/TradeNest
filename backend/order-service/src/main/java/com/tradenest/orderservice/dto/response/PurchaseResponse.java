package com.tradenest.orderservice.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.tradenest.orderservice.enums.PurchaseStatus;

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
public class PurchaseResponse {

    private Integer purchaseId;

    private Integer pid;

    private Integer buyerId;

    private Integer sellerId;

    private LocalDateTime purchaseDate;

    private BigDecimal amount;

    private PurchaseStatus status;

}