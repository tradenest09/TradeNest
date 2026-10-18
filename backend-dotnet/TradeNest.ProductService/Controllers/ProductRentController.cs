using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TradeNest.ProductService.DTOs;
using TradeNest.ProductService.Services;

namespace TradeNest.ProductService.Controllers
{
    [ApiController]
    [Route("api/rent")]
    [Route("api/product-rents")]
    public class ProductRentController : ControllerBase
    {
        private readonly IProductRentService _productRentService;

        public ProductRentController(IProductRentService productRentService)
        {
            _productRentService = productRentService;
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> AddRent([FromBody] AddRentRequest request)
        {
            var response = await _productRentService.AddRentAsync(request);
            return Created("", response);
        }

        [AllowAnonymous]
        [HttpGet("product/{pid}")]
        public async Task<IActionResult> GetRentByProduct(int pid)
        {
            try
            {
                var response = await _productRentService.GetRentByProductAsync(pid);
                return Ok(response);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new ApiResponse { Success = false, Message = "Rent not found" });
            }
        }

        [Authorize]
        [HttpDelete("{prid}")]
        public async Task<IActionResult> DeleteRent(int prid)
        {
            try
            {
                var response = await _productRentService.DeleteRentAsync(prid);
                return Ok(response);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new ApiResponse { Success = false, Message = "Rent not found" });
            }
        }
    }
}
