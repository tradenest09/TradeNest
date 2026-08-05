package com.tradenest.orderservice.controller;

import com.tradenest.orderservice.dto.request.AddPaymentRequest;
import com.tradenest.orderservice.dto.response.PaymentResponse;
import com.tradenest.orderservice.enums.PaymentStatus;
import com.tradenest.orderservice.service.PaymentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping
    public ResponseEntity<PaymentResponse> addPayment(@RequestBody AddPaymentRequest request) {
        return new ResponseEntity<>(paymentService.addPayment(request), HttpStatus.CREATED);
    }

    @GetMapping("/payer/{payerId}")
    public ResponseEntity<List<PaymentResponse>> getPaymentsByPayer(@PathVariable Integer payerId) {
        return ResponseEntity.ok(paymentService.getPaymentsByPayer(payerId));
    }

    @PutMapping("/{paymentId}/status")
    public ResponseEntity<PaymentResponse> updatePaymentStatus(
            @PathVariable Integer paymentId,
            @RequestBody Map<String, String> request) {
        PaymentStatus status = PaymentStatus.valueOf(request.get("status").toUpperCase());
        return ResponseEntity.ok(paymentService.updatePaymentStatus(paymentId, status));
    }
}
