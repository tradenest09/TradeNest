using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TradeNest.ProductService.DTOs;
using TradeNest.ProductService.Enums;
using TradeNest.ProductService.Services;

namespace TradeNest.ProductService.Controllers
{
    [ApiController]
    [Route("api/products")]
    public class ProductController : ControllerBase
    {
        private readonly IProductService _productService;

        public ProductController(IProductService productService)
        {
            _productService = productService;
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> AddProduct([FromBody] AddProductRequest request)
        {
            var response = await _productService.AddProductAsync(request);
            return Created("", response);
        }

        [AllowAnonymous]
        [HttpGet("{pid}")]
        public async Task<IActionResult> GetProductById(int pid)
        {
            try
            {
                var response = await _productService.GetProductByIdAsync(pid);
                return Ok(response);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new ApiResponse { Success = false, Message = "Product not found" });
            }
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetAllProducts()
        {
            var response = await _productService.GetAllProductsAsync();
            return Ok(response);
        }

        [AllowAnonymous]
        [HttpGet("category/{cid}")]
        public async Task<IActionResult> GetProductsByCategory(int cid)
        {
            var response = await _productService.GetProductsByCategoryAsync(cid);
            return Ok(response);
        }

        [AllowAnonymous]
        [HttpGet("seller/{uid}")]
        public async Task<IActionResult> GetProductsBySeller(int uid)
        {
            var response = await _productService.GetProductsBySellerAsync(uid);
            return Ok(response);
        }

        [AllowAnonymous]
        [HttpGet("type/{type}")]
        public async Task<IActionResult> GetProductsByType(ProductType type)
        {
            var response = await _productService.GetProductsByTypeAsync(type);
            return Ok(response);
        }

        [AllowAnonymous]
        [HttpGet("search")]
        public async Task<IActionResult> SearchProducts([FromQuery] string keyword)
        {
            var response = await _productService.SearchProductsAsync(keyword);
            return Ok(response);
        }

        [Authorize]
        [HttpPut("{pid}")]
        public async Task<IActionResult> UpdateProduct(int pid, [FromBody] UpdateProductRequest request)
        {
            try
            {
                var response = await _productService.UpdateProductAsync(pid, request);
                return Ok(response);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new ApiResponse { Success = false, Message = "Product not found" });
            }
        }

        [Authorize]
        [HttpPut("{pid}/status")]
        public async Task<IActionResult> UpdateProductStatus(int pid, [FromQuery] string status)
        {
            try
            {
                if (!Enum.TryParse<ProductStatus>(status.ToUpper(), out var productStatus))
                {
                    return BadRequest(new { message = "Invalid status" });
                }

                var isAdmin = User.IsInRole("ADMIN") || User.IsInRole("ROLE_ADMIN")
                           || User.FindFirst("role")?.Value == "ADMIN" || User.FindFirst("role")?.Value == "ROLE_ADMIN";
                var isService = User.IsInRole("SERVICE") || User.FindFirst("role")?.Value == "SERVICE";

                int? currentUserId = null;
                var uidClaim = User.FindFirst("uid")?.Value ?? User.FindFirst("userId")?.Value;
                if (int.TryParse(uidClaim, out var uidVal))
                {
                    currentUserId = uidVal;
                }

                if (!isAdmin && !isService && !currentUserId.HasValue)
                {
                    return Unauthorized(new ApiResponse { Success = false, Message = "Invalid or unresolvable user identity" });
                }

                var response = await _productService.UpdateProductStatusAsync(pid, productStatus, currentUserId, isAdmin, isService);
                return Ok(response);
            }
            catch (System.UnauthorizedAccessException ex)
            {
                return StatusCode(403, new ApiResponse { Success = false, Message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return StatusCode(409, new ApiResponse { Success = false, Message = ex.Message });
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new ApiResponse { Success = false, Message = "Product not found" });
            }
        }

        [Authorize]
        [HttpDelete("{pid}")]
        public async Task<IActionResult> DeleteProduct(int pid)
        {
            try
            {
                var response = await _productService.DeleteProductAsync(pid);
                return Ok(response);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new ApiResponse { Success = false, Message = "Product not found" });
            }
        }

        [AllowAnonymous]
        [HttpGet("count")]
        public async Task<IActionResult> GetTotalProducts()
        {
            var count = await _productService.GetTotalProductsAsync();
            return Ok(count);
        }
    }
}

