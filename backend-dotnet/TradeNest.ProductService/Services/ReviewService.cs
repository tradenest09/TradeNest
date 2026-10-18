using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TradeNest.ProductService.Data;
using TradeNest.ProductService.DTOs;
using TradeNest.ProductService.Entities;

namespace TradeNest.ProductService.Services
{
    public interface IReviewService
    {
        Task<ReviewResponse> AddReviewAsync(AddReviewRequest request);
        Task<List<ReviewResponse>> GetReviewsByProductAsync(int pid);
        Task<List<ReviewResponse>> GetReviewsByUserAsync(int uid);
        Task<ApiResponse> DeleteReviewAsync(int reviewId, int? currentUserId = null, bool isAdmin = false);
    }

    public class ReviewServiceImpl : IReviewService
    {
        private readonly ProductDbContext _context;

        public ReviewServiceImpl(ProductDbContext context)
        {
            _context = context;
        }

        public async Task<ReviewResponse> AddReviewAsync(AddReviewRequest request)
        {
            var product = await _context.Products.FindAsync(request.Pid);
            if (product == null) throw new KeyNotFoundException("Product not found");

            var review = new Review
            {
                Pid = request.Pid,
                Uid = request.Uid,
                Rating = request.Rating,
                ReviewText = request.ReviewText
            };

            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();
            return MapToResponse(review);
        }

        public async Task<List<ReviewResponse>> GetReviewsByProductAsync(int pid)
        {
            var reviews = await _context.Reviews
                .Where(r => r.Pid == pid)
                .ToListAsync();
            return reviews.Select(MapToResponse).ToList();
        }

        public async Task<List<ReviewResponse>> GetReviewsByUserAsync(int uid)
        {
            var reviews = await _context.Reviews
                .Where(r => r.Uid == uid)
                .ToListAsync();
            return reviews.Select(MapToResponse).ToList();
        }

        public async Task<ApiResponse> DeleteReviewAsync(int reviewId, int? currentUserId = null, bool isAdmin = false)
        {
            var review = await _context.Reviews.FindAsync(reviewId);
            if (review == null) throw new KeyNotFoundException("Review not found");

            if (!isAdmin)
            {
                if (!currentUserId.HasValue)
                {
                    throw new System.UnauthorizedAccessException("User identification is missing or invalid.");
                }

                if (review.Uid != currentUserId.Value)
                {
                    throw new System.UnauthorizedAccessException("You are not authorized to delete this review.");
                }
            }

            _context.Reviews.Remove(review);
            await _context.SaveChangesAsync();
            return new ApiResponse { Success = true, Message = "Review deleted successfully" };
        }

        private ReviewResponse MapToResponse(Review review)
        {
            return new ReviewResponse
            {
                ReviewId = review.ReviewId,
                Pid = review.Pid,
                Uid = review.Uid,
                Rating = review.Rating,
                ReviewText = review.ReviewText,
                ReviewDate = review.ReviewDate
            };
        }
    }
}
