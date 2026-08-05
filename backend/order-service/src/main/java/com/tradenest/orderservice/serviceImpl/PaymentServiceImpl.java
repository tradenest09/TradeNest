package com.tradenest.orderservice.serviceImpl;

import com.tradenest.orderservice.dto.request.AddPaymentRequest;
import com.tradenest.orderservice.dto.response.PaymentResponse;
import com.tradenest.orderservice.entities.Payment;
import com.tradenest.orderservice.entities.Purchase;
import com.tradenest.orderservice.entities.RentalTransaction;
import com.tradenest.orderservice.enums.PaymentStatus;
import com.tradenest.orderservice.enums.PurchaseStatus;
import com.tradenest.orderservice.enums.RentalStatus;
import com.tradenest.orderservice.repository.PaymentRepository;
import com.tradenest.orderservice.repository.PurchaseRepository;
import com.tradenest.orderservice.repository.RentalTransactionRepository;
import com.tradenest.orderservice.service.PaymentService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final PurchaseRepository purchaseRepository;
    private final RentalTransactionRepository rentalRepository;

    public PaymentServiceImpl(PaymentRepository paymentRepository, 
                              PurchaseRepository purchaseRepository, 
                              RentalTransactionRepository rentalRepository) {
        this.paymentRepository = paymentRepository;
        this.purchaseRepository = purchaseRepository;
        this.rentalRepository = rentalRepository;
    }

    @Override
    public PaymentResponse addPayment(AddPaymentRequest request) {
        Purchase purchase = null;
        if (request.getPurchaseId() != null) {
            purchase = purchaseRepository.findById(request.getPurchaseId())
                    .orElseThrow(() -> new RuntimeException("Purchase not found"));
        }

        RentalTransaction rental = null;
        if (request.getRentalId() != null) {
            rental = rentalRepository.findById(request.getRentalId())
                    .orElseThrow(() -> new RuntimeException("Rental not found"));
        }

        Payment payment = Payment.builder()
                .purchase(purchase)
                .rentalTransaction(rental)
                .payerId(request.getPayerId())
                .amount(request.getAmount())
                .paymentMethod(request.getPaymentMethod())
                .transactionRef(request.getTransactionRef())
                .paymentStatus(PaymentStatus.PENDING)
                .build();

        Payment saved = paymentRepository.save(payment);
        return mapToResponse(saved);
    }

    @Override
    public List<PaymentResponse> getPaymentsByPayer(Integer payerId) {
        return paymentRepository.findByPayerId(payerId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public PaymentResponse updatePaymentStatus(Integer paymentId, PaymentStatus status) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        payment.setPaymentStatus(status);
        Payment updated = paymentRepository.save(payment);

        // Auto update purchase / rental status based on payment success
        if (status == PaymentStatus.SUCCESS) {
            if (payment.getPurchase() != null) {
                Purchase purchase = payment.getPurchase();
                purchase.setStatus(PurchaseStatus.COMPLETED);
                purchaseRepository.save(purchase);
            }
            if (payment.getRentalTransaction() != null) {
                RentalTransaction rental = payment.getRentalTransaction();
                rental.setStatus(RentalStatus.ACTIVE);
                rentalRepository.save(rental);
            }
        }

        return mapToResponse(updated);
    }

    private PaymentResponse mapToResponse(Payment payment) {
        return PaymentResponse.builder()
                .paymentId(payment.getPaymentId())
                .purchaseId(payment.getPurchase() != null ? payment.getPurchase().getPurchaseId() : null)
                .rentalId(payment.getRentalTransaction() != null ? payment.getRentalTransaction().getRentalId() : null)
                .payerId(payment.getPayerId())
                .amount(payment.getAmount())
                .paymentMethod(payment.getPaymentMethod())
                .paymentStatus(payment.getPaymentStatus())
                .transactionRef(payment.getTransactionRef())
                .paymentDate(payment.getPaymentDate())
                .build();
    }
}
