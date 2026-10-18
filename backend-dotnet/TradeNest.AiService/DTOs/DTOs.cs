using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace TradeNest.AiService.DTOs
{
    public class AiRecommendationRequest
    {
        public string Query { get; set; } = string.Empty;
    }

    public class ImageDto
    {
        public int ImageId { get; set; }
        public int Pid { get; set; }
        public string? ImageUrl { get; set; }
        public bool? IsPrimary { get; set; }
    }

    public class ProductDto
    {
        public int Pid { get; set; }
        public int Uid { get; set; }
        public int Cid { get; set; }
        public string? CategoryName { get; set; }
        public string? Pname { get; set; }
        public string? Pdesc { get; set; }
        public decimal Price { get; set; }
        public string? Status { get; set; }
        public string? Type { get; set; }
        public DateTime? CreatedAt { get; set; }
        public List<ImageDto>? Images { get; set; }
    }

    public class RecommendationItem
    {
        public int ProductId { get; set; }
        public int Score { get; set; }
        public string? Reason { get; set; }

        [JsonPropertyName("productDetails")]
        public ProductDto? ProductDetails { get; set; }

        [JsonIgnore]
        public ProductDto? Product => ProductDetails;
    }

    public class AiRecommendationResponse
    {
        public List<RecommendationItem> Recommendations { get; set; }

        public AiRecommendationResponse(List<RecommendationItem> recommendations)
        {
            Recommendations = recommendations ?? new List<RecommendationItem>();
        }
    }
}
