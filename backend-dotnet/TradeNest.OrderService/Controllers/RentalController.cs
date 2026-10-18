using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TradeNest.OrderService.DTOs;
using TradeNest.OrderService.Entities;
using TradeNest.OrderService.Services;
using System;
using System.Threading.Tasks;

namespace TradeNest.OrderService.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/rentals")]
    public class RentalController : ControllerBase
    {
        private readonly IRentalService _rentalService;

        public RentalController(IRentalService rentalService)
        {
            _rentalService = rentalService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateRental([FromBody] RentalRequest request)
        {
            try
            {
                var response = await _rentalService.CreateRentalAsync(request);
                return Created("", response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("{rentalId}")]
        public async Task<IActionResult> GetRentalById(int rentalId)
        {
            try { return Ok(await _rentalService.GetRentalByIdAsync(rentalId)); }
            catch (Exception ex) { return BadRequest(new { message = ex.Message }); }
        }

        [HttpGet]
        public async Task<IActionResult> GetAllRentals()
        {
            return Ok(await _rentalService.GetAllRentalsAsync());
        }

        [HttpGet("owner/{ownerId}")]
        public async Task<IActionResult> GetRentalsByOwner(int ownerId)
        {
            return Ok(await _rentalService.GetRentalsByOwnerAsync(ownerId));
        }

        [HttpGet("renter/{renterId}")]
        public async Task<IActionResult> GetRentalsByRenter(int renterId)
        {
            return Ok(await _rentalService.GetRentalsByRenterAsync(renterId));
        }

        [HttpPut("status")]
        public async Task<IActionResult> UpdateRentalStatus([FromBody] UpdateRentalStatusRequest request)
        {
            try
            {
                var response = await _rentalService.UpdateRentalStatusAsync(request);
                return Ok(response);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new ApiResponse { Success = false, Message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse { Success = false, Message = ex.Message });
            }
        }

        [HttpDelete("{rentalId}")]
        public async Task<IActionResult> CancelRental(int rentalId)
        {
            try 
            { 
                var response = await _rentalService.CancelRentalAsync(rentalId);
                return Ok(response); 
            }
            catch (Exception ex) 
            { 
                return BadRequest(new ApiResponse { Success = false, Message = ex.Message }); 
            }
        }
    }
}
