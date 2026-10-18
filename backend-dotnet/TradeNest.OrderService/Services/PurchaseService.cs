using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Net.Http.Json;
using Microsoft.EntityFrameworkCore;
using TradeNest.OrderService.Data;
using TradeNest.OrderService.DTOs;
using TradeNest.OrderService.Entities;

namespace TradeNest.OrderService.Services
{
    public interface IPurchaseService
    {
        Task<PurchaseResponse> CreatePurchaseAsync(PurchaseRequest request);
        Task<PurchaseResponse> GetPurchaseByIdAsync(int purchaseId);
        Task<List<PurchaseResponse>> GetAllPurchasesAsync();
        Task<List<PurchaseResponse>> GetPurchasesByBuyerAsync(int buyerId);
        Task<List<PurchaseResponse>> GetPurchasesBySellerAsync(int sellerId);
        Task<ApiResponse> CancelPurchaseAsync(int purchaseId);
        Task<long> GetTotalOrdersAsync();
    }

    public class PurchaseServiceImpl : IPurchaseService
    {
        private readonly OrderDbContext _context;
        private readonly System.Net.Http.HttpClient _httpClient;

        public PurchaseServiceImpl(OrderDbContext context, System.Net.Http.IHttpClientFactory httpClientFactory)
        {
            _context = context;
            _httpClient = httpClientFactory.CreateClient("ProductServiceClient");
        }

        public async Task<PurchaseResponse> CreatePurchaseAsync(PurchaseRequest request)
        {
            var sellerId = request.SellerId;
            var amount = request.Amount;

            try
            {
                var product = await _httpClient.GetFromJsonAsync<ProductDto>($"api/products/{request.Pid}");
                if (product != null)
                {
                    if (product.Uid == request.BuyerId)
                    {
                        throw new System.InvalidOperationException("You cannot buy your own product");
                    }
                    if ("SOLD".Equals(product.Status, System.StringComparison.OrdinalIgnoreCase))
                    {
                        throw new System.InvalidOperationException("This product has already been sold.");
                    }
                    if ("INACTIVE".Equals(product.Status, System.StringComparison.OrdinalIgnoreCase))
                    {
                        throw new System.InvalidOperationException("This product is unavailable.");
                    }
                    sellerId = product.Uid;
                    amount = product.Price > 0 ? product.Price : request.Amount;
                }
            }
            catch (System.InvalidOperationException)
            {
                throw;
            }
            catch
            {
                // Fall back to request values if inter-service call fails or service offline
            }

            var purchase = new Purchase
            {
                Pid = request.Pid,
                BuyerId = request.BuyerId,
                SellerId = sellerId,
                Amount = amount,
                PurchaseDate = System.DateTime.UtcNow,
                Status = PurchaseStatus.PENDING
            };

            _context.Purchases.Add(purchase);
            await _context.SaveChangesAsync();

            return MapToResponse(purchase);
        }

        public async Task<PurchaseResponse> GetPurchaseByIdAsync(int purchaseId)
        {
            var p = await _context.Purchases.FindAsync(purchaseId);
            if (p == null) throw new System.Exception("Purchase not found");
            return MapToResponse(p);
        }

        public async Task<List<PurchaseResponse>> GetAllPurchasesAsync()
        {
            var list = await _context.Purchases.ToListAsync();
            return list.Select(MapToResponse).ToList();
        }

        public async Task<List<PurchaseResponse>> GetPurchasesByBuyerAsync(int buyerId)
        {
            var list = await _context.Purchases.Where(p => p.BuyerId == buyerId).ToListAsync();
            return list.Select(MapToResponse).ToList();
        }

        public async Task<List<PurchaseResponse>> GetPurchasesBySellerAsync(int sellerId)
        {
            var list = await _context.Purchases.Where(p => p.SellerId == sellerId).ToListAsync();
            return list.Select(MapToResponse).ToList();
        }

        public async Task<ApiResponse> CancelPurchaseAsync(int purchaseId)
        {
            var purchase = await _context.Purchases.FindAsync(purchaseId);
            if (purchase == null) throw new System.Exception("Purchase not found");

            purchase.Status = PurchaseStatus.CANCELLED;
            await _context.SaveChangesAsync();

            return new ApiResponse { Success = true, Message = "Purchase cancelled successfully" };
        }

        public async Task<long> GetTotalOrdersAsync()
        {
            return await _context.Purchases.CountAsync();
        }

        private PurchaseResponse MapToResponse(Purchase purchase)
        {
            return new PurchaseResponse
            {
                PurchaseId = purchase.PurchaseId,
                Pid = purchase.Pid,
                BuyerId = purchase.BuyerId,
                SellerId = purchase.SellerId,
                PurchaseDate = purchase.PurchaseDate,
                Amount = purchase.Amount,
                Status = purchase.Status.ToString()
            };
        }
    }
}


