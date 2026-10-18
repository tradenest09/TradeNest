using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TradeNest.OrderService.DTOs;
using TradeNest.OrderService.Services;
using System;
using System.Threading.Tasks;

namespace TradeNest.OrderService.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/purchases")]
    public class PurchaseController : ControllerBase
    {
        private readonly IPurchaseService _purchaseService;

        public PurchaseController(IPurchaseService purchaseService)
        {
            _purchaseService = purchaseService;
        }

        [HttpPost]
        public async Task<IActionResult> CreatePurchase([FromBody] PurchaseRequest request)
        {
            try
            {
                var response = await _purchaseService.CreatePurchaseAsync(request);
                return Created("", response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("{purchaseId}")]
        public async Task<IActionResult> GetPurchaseById(int purchaseId)
        {
            try { return Ok(await _purchaseService.GetPurchaseByIdAsync(purchaseId)); }
            catch (Exception ex) { return BadRequest(new { message = ex.Message }); }
        }

        [HttpGet]
        public async Task<IActionResult> GetAllPurchases()
        {
            return Ok(await _purchaseService.GetAllPurchasesAsync());
        }

        [HttpGet("buyer/{buyerId}")]
        public async Task<IActionResult> GetPurchasesByBuyer(int buyerId)
        {
            return Ok(await _purchaseService.GetPurchasesByBuyerAsync(buyerId));
        }

        [HttpGet("seller/{sellerId}")]
        public async Task<IActionResult> GetPurchasesBySeller(int sellerId)
        {
            return Ok(await _purchaseService.GetPurchasesBySellerAsync(sellerId));
        }

        [HttpDelete("{purchaseId}")]
        public async Task<IActionResult> CancelPurchase(int purchaseId)
        {
            try { return Ok(await _purchaseService.CancelPurchaseAsync(purchaseId)); }
            catch (Exception ex) { return BadRequest(new { message = ex.Message }); }
        }

        [HttpGet("count")]
        public async Task<IActionResult> GetTotalOrders()
        {
            return Ok(await _purchaseService.GetTotalOrdersAsync());
        }
    }
}
