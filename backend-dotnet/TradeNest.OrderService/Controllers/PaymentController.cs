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
    [Route("api/payments")]
    public class PaymentController : ControllerBase
    {
        private readonly IPaymentService _paymentService;

        public PaymentController(IPaymentService paymentService)
        {
            _paymentService = paymentService;
        }

        [HttpPost]
        public async Task<IActionResult> AddPayment([FromBody] AddPaymentRequest request)
        {
            try
            {
                var response = await _paymentService.AddPaymentAsync(request);
                return Created("", response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("payer/{payerId}")]
        public async Task<IActionResult> GetPaymentsByPayer(int payerId)
        {
            return Ok(await _paymentService.GetPaymentsByPayerAsync(payerId));
        }

        [HttpPut("{paymentId}/status")]
        public async Task<IActionResult> UpdatePaymentStatus(int paymentId, [FromBody] UpdatePaymentStatusRequest request)
        {
            try
            {
                if(!Enum.TryParse<PaymentStatus>(request.Status.ToUpper(), out var status))
                {
                    return BadRequest(new { message = "Invalid status" });
                }
                var response = await _paymentService.UpdatePaymentStatusAsync(paymentId, status);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
