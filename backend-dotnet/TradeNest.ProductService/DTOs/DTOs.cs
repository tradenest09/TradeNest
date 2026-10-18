using System;
using TradeNest.ProductService.Enums;

namespace TradeNest.ProductService.DTOs
{
    public class ProductResponse {
        public int Pid { get; set; }
        public int Uid { get; set; }
        public int Cid { get; set; }
        public string? CategoryName { get; set; }
        public string Pname { get; set; }
        public string Pdesc { get; set; }
        public decimal Price { get; set; }
        public ProductStatus Status { get; set; }
        public ProductType Type { get; set; }
        public DateTime? CreatedAt { get; set; }
        public List<ImageResponse>? Images { get; set; }
        public ProductRentResponse? RentDetails { get; set; }
    }
    public class CategoryResponse {
        public int Cid { get; set; }
        public string Cname { get; set; }
        public string? Description { get; set; }
    }
    public class ImageResponse {
        public int ImageId { get; set; }
        public int Pid { get; set; }
        public string ImageUrl { get; set; }
        public bool? IsPrimary { get; set; }
    }
    public class ProductRentResponse {
        public int Prid { get; set; }
        public int Pid { get; set; }
        public int? NoOfDays { get; set; }
        public decimal ChargePerDay { get; set; }
        public decimal SecurityDeposit { get; set; }
    }
    public class ReportResponse {
        public int ReportId { get; set; }
        public int Pid { get; set; }
        public int ReporterId { get; set; }
        public string Reason { get; set; }
        public string? Description { get; set; }
        public ReportStatus Status { get; set; }
        public DateTime? ReportDate { get; set; }
    }
    public class ApiResponse {
        public bool Success { get; set; }
        public string Message { get; set; }
    }
    public class AddProductRequest {
        public int Uid { get; set; }
        public int Cid { get; set; }
        public string Pname { get; set; }
        public string Pdesc { get; set; }
        public decimal Price { get; set; }
        public ProductType Type { get; set; }
    }
    public class UpdateProductRequest {
        public int Cid { get; set; }
        public string Pname { get; set; }
        public string Pdesc { get; set; }
        public decimal Price { get; set; }
        public ProductStatus Status { get; set; }
        public ProductType Type { get; set; }
    }
    public class AddCategoryRequest {
        public string Cname { get; set; }
        public string? Description { get; set; }
    }
    public class UpdateCategoryRequest {
        public string Cname { get; set; }
        public string? Description { get; set; }
    }
    public class AddImageRequest {
        public int Pid { get; set; }
        public string ImageUrl { get; set; }
        public bool? IsPrimary { get; set; }
    }
    public class AddRentRequest {
        public int Pid { get; set; }
        public int? NoOfDays { get; set; }
        public decimal ChargePerDay { get; set; }
        public decimal SecurityDeposit { get; set; }
    }
    public class UpdateReportStatusRequest {
        public ReportStatus Status { get; set; }
    }
    public class AddReviewRequest {
        public int Pid { get; set; }
        public int Uid { get; set; }
        public int Rating { get; set; }
        public string? ReviewText { get; set; }
    }
    public class ReviewResponse {
        public int ReviewId { get; set; }
        public int Pid { get; set; }
        public int Uid { get; set; }
        public int Rating { get; set; }
        public string? ReviewText { get; set; }
        public DateTime? ReviewDate { get; set; }
    }
}
