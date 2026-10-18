using System;
using TradeNest.OrderService.Entities;

namespace TradeNest.OrderService.DTOs
{
    public class PurchaseRequest
    {
        public int Pid { get; set; }
        public int BuyerId { get; set; }
        public int SellerId { get; set; }
        public decimal Amount { get; set; }
    }

    public class PurchaseResponse
    {
        public int PurchaseId { get; set; }
        public int Pid { get; set; }
        public int BuyerId { get; set; }
        public int SellerId { get; set; }
        public DateTime PurchaseDate { get; set; }
        public decimal Amount { get; set; }
        public string Status { get; set; }
    }

    public class AddPaymentRequest
    {
        public int? PurchaseId { get; set; }
        public int? RentalId { get; set; }
        public int PayerId { get; set; }
        public decimal Amount { get; set; }
        public string PaymentMethod { get; set; }
        public string TransactionRef { get; set; }
    }

    public class PaymentResponse
    {
        public int PaymentId { get; set; }
        public int? PurchaseId { get; set; }
        public int? RentalId { get; set; }
        public int PayerId { get; set; }
        public decimal Amount { get; set; }
        public string PaymentMethod { get; set; }
        public string PaymentStatus { get; set; }
        public string TransactionRef { get; set; }
        public DateTime PaymentDate { get; set; }
    }

    public class RentalRequest
    {
        public int Pid { get; set; }
        public int OwnerId { get; set; }
        public int RenterId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public decimal TotalAmount { get; set; }
    }

    public class RentalResponse
    {
        public int RentalId { get; set; }
        public int Pid { get; set; }
        public int OwnerId { get; set; }
        public int RenterId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public decimal TotalAmount { get; set; }
        public string Status { get; set; }
    }

    public class UpdateRentalStatusRequest
    {
        public int RentalId { get; set; }
        public string Status { get; set; }
    }

    public class UpdatePaymentStatusRequest
    {
        public string Status { get; set; }
    }

    public class ApiResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; } = null!;
    }
}

    public class ProductDto
    {
        public int Pid { get; set; }
        public int Uid { get; set; }
        public string Status { get; set; } = null!;
        public decimal Price { get; set; }
        public ProductRentDto? RentDetails { get; set; }
    }

    public class ProductRentDto
    {
        public decimal ChargePerDay { get; set; }
        public decimal SecurityDeposit { get; set; }
    }
