package com.tradenest.orderservice.dto.request;

import com.tradenest.orderservice.enums.PaymentMethod;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class AddPaymentRequest {
    private Integer purchaseId;
    private Integer rentalId;
    private Integer payerId;
    private BigDecimal amount;
    private PaymentMethod paymentMethod;
    private String transactionRef;
}
