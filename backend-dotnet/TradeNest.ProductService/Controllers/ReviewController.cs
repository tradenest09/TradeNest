using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using TradeNest.ProductService.DTOs;
using TradeNest.ProductService.Services;

namespace TradeNest.ProductService.Controllers
{
    [ApiController]
    [Route("api/reviews")]
    public class ReviewController : ControllerBase
    {
        private readonly IReviewService _reviewService;

        public ReviewController(IReviewService reviewService)
        {
            _reviewService = reviewService;
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> AddReview([FromBody] AddReviewRequest request)
        {
            try
            {
                var response = await _reviewService.AddReviewAsync(request);
                return Created("", response);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new ApiResponse { Success = false, Message = ex.Message });
            }
        }

        [AllowAnonymous]
        [HttpGet("product/{pid}")]
        public async Task<IActionResult> GetReviewsByProduct(int pid)
        {
            var response = await _reviewService.GetReviewsByProductAsync(pid);
            return Ok(response);
        }

        [AllowAnonymous]
        [HttpGet("user/{uid}")]
        public async Task<IActionResult> GetReviewsByUser(int uid)
        {
            var response = await _reviewService.GetReviewsByUserAsync(uid);
            return Ok(response);
        }

        [Authorize]
        [HttpDelete("{reviewId}")]
        public async Task<IActionResult> DeleteReview(int reviewId)
        {
            try
            {
                var isAdmin = User.IsInRole("ADMIN") || User.IsInRole("ROLE_ADMIN")
                           || User.FindFirst("role")?.Value == "ADMIN" || User.FindFirst("role")?.Value == "ROLE_ADMIN";
                int? currentUserId = null;
                var uidClaim = User.FindFirst("uid")?.Value ?? User.FindFirst("userId")?.Value;
                if (int.TryParse(uidClaim, out var uidVal))
                {
                    currentUserId = uidVal;
                }

                if (!isAdmin && !currentUserId.HasValue)
                {
                    return Unauthorized(new ApiResponse { Success = false, Message = "Invalid or unresolvable user identity" });
                }

                var response = await _reviewService.DeleteReviewAsync(reviewId, currentUserId, isAdmin);
                return Ok(response);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new ApiResponse { Success = false, Message = "Review not found" });
            }
            catch (System.UnauthorizedAccessException ex)
            {
                return StatusCode(403, new ApiResponse { Success = false, Message = ex.Message });
            }
        }
    }
}
