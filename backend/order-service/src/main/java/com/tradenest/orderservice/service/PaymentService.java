package com.tradenest.orderservice.service;

import com.tradenest.orderservice.dto.request.AddPaymentRequest;
import com.tradenest.orderservice.dto.response.ApiResponse;
import com.tradenest.orderservice.dto.response.PaymentResponse;
import com.tradenest.orderservice.enums.PaymentStatus;

import java.util.List;

public interface PaymentService {
    PaymentResponse addPayment(AddPaymentRequest request);
    List<PaymentResponse> getPaymentsByPayer(Integer payerId);
    PaymentResponse updatePaymentStatus(Integer paymentId, PaymentStatus status);
}
