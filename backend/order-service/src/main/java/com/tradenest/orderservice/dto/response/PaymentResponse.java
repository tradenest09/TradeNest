package com.tradenest.orderservice.dto.response;

import com.tradenest.orderservice.enums.PaymentMethod;
import com.tradenest.orderservice.enums.PaymentStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class PaymentResponse {
    private Integer paymentId;
    private Integer purchaseId;
    private Integer rentalId;
    private Integer payerId;
    private BigDecimal amount;
    private PaymentMethod paymentMethod;
    private PaymentStatus paymentStatus;
    private String transactionRef;
    private LocalDateTime paymentDate;
}
