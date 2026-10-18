using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using TradeNest.OrderService.Data;
using TradeNest.OrderService.DTOs;
using TradeNest.OrderService.Entities;

namespace TradeNest.OrderService.Services
{
    public interface IPaymentService
    {
        Task<PaymentResponse> AddPaymentAsync(AddPaymentRequest request);
        Task<List<PaymentResponse>> GetPaymentsByPayerAsync(int payerId);
        Task<PaymentResponse> UpdatePaymentStatusAsync(int paymentId, PaymentStatus status);
    }

    public class PaymentServiceImpl : IPaymentService
    {
        private readonly OrderDbContext _context;
        private readonly HttpClient _httpClient;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IConfiguration _config;

        public PaymentServiceImpl(
            OrderDbContext context, 
            IHttpClientFactory httpClientFactory,
            IHttpContextAccessor httpContextAccessor,
            IConfiguration config)
        {
            _context = context;
            _httpClient = httpClientFactory.CreateClient("ProductServiceClient");
            _httpContextAccessor = httpContextAccessor;
            _config = config;
        }

        public async Task<PaymentResponse> AddPaymentAsync(AddPaymentRequest request)
        {
            Purchase purchase = null;
            if (request.PurchaseId.HasValue)
            {
                purchase = await _context.Purchases.FindAsync(request.PurchaseId.Value);
                if (purchase == null) throw new Exception("Purchase not found");
            }

            RentalTransaction rental = null;
            if (request.RentalId.HasValue)
            {
                rental = await _context.RentalTransactions.FindAsync(request.RentalId.Value);
                if (rental == null) throw new Exception("Rental not found");
            }

            if (!Enum.TryParse<PaymentMethod>(request.PaymentMethod, out var paymentMethod))
                throw new Exception("Invalid payment method");

            var payment = new Payment
            {
                PurchaseId = purchase?.PurchaseId,
                RentalId = rental?.RentalId,
                PayerId = request.PayerId,
                Amount = request.Amount,
                PaymentMethod = paymentMethod,
                TransactionRef = request.TransactionRef,
                PaymentStatus = PaymentStatus.PENDING,
                PaymentDate = DateTime.UtcNow
            };

            _context.Payments.Add(payment);
            await _context.SaveChangesAsync();

            // Load navigations manually
            payment.Purchase = purchase;
            payment.RentalTransaction = rental;

            return MapToResponse(payment);
        }

        public async Task<List<PaymentResponse>> GetPaymentsByPayerAsync(int payerId)
        {
            var payments = await _context.Payments
                .Include(p => p.Purchase)
                .Include(p => p.RentalTransaction)
                .Where(p => p.PayerId == payerId)
                .ToListAsync();

            return payments.Select(MapToResponse).ToList();
        }

        public async Task<PaymentResponse> UpdatePaymentStatusAsync(int paymentId, PaymentStatus status)
        {
            var payment = await _context.Payments
                .Include(p => p.Purchase)
                .Include(p => p.RentalTransaction)
                .FirstOrDefaultAsync(p => p.PaymentId == paymentId);

            if (payment == null) throw new Exception("Payment not found");

            if (payment.PaymentStatus == status)
            {
                return MapToResponse(payment); // Idempotent
            }

            if (payment.PaymentStatus == PaymentStatus.SUCCESS && status != PaymentStatus.SUCCESS)
            {
                throw new InvalidOperationException("Cannot modify status of a payment that has already succeeded.");
            }

            payment.PaymentStatus = status;

            if (status == PaymentStatus.SUCCESS)
            {
                if (payment.Purchase != null)
                {
                    var productUrl = $"api/products/{payment.Purchase.Pid}/status?status=SOLD";
                    using var request = CreateAuthenticatedPutRequest(productUrl);
                    var response = await _httpClient.SendAsync(request);
                    
                    if (response.StatusCode == System.Net.HttpStatusCode.Conflict)
                    {
                        throw new InvalidOperationException("This product has already been sold.");
                    }
                    else if (!response.IsSuccessStatusCode)
                    {
                        throw new Exception($"Failed to update product status: {response.StatusCode}");
                    }

                    payment.Purchase.Status = PurchaseStatus.COMPLETED;
                }

                if (payment.RentalTransaction != null)
                {
                    var productUrl = $"api/products/{payment.RentalTransaction.Pid}/status?status=RENTED";
                    using var request = CreateAuthenticatedPutRequest(productUrl);
                    var response = await _httpClient.SendAsync(request);

                    if (response.StatusCode == System.Net.HttpStatusCode.Conflict)
                    {
                        throw new InvalidOperationException("This product is unavailable for rent.");
                    }
                    else if (!response.IsSuccessStatusCode)
                    {
                        throw new Exception($"Failed to update product status: {response.StatusCode}");
                    }

                    payment.RentalTransaction.Status = RentalStatus.ACTIVE;
                }
            }

            await _context.SaveChangesAsync();
            return MapToResponse(payment);
        }

        private HttpRequestMessage CreateAuthenticatedPutRequest(string relativeUrl)
        {
            var request = new HttpRequestMessage(HttpMethod.Put, relativeUrl);
            var token = GenerateServiceToken();
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
            return request;
        }

        private string GenerateServiceToken()
        {
            var secret = _config["Jwt:Secret"];
            if (string.IsNullOrEmpty(secret)) secret = "supersecretkeywhichmustbeverylongformacsha256";
            var keyBytes = Convert.FromBase64String(secret);
            var key = new SymmetricSecurityKey(keyBytes);

            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, "order-service"),
                new Claim(ClaimTypes.NameIdentifier, "order-service"),
                new Claim(ClaimTypes.Name, "order-service"),
                new Claim(ClaimTypes.Role, "SERVICE"),
                new Claim("role", "SERVICE"),
                new Claim(JwtRegisteredClaimNames.Iat, DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString(), ClaimValueTypes.Integer64)
            };

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(5),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private PaymentResponse MapToResponse(Payment payment)
        {
            return new PaymentResponse
            {
                PaymentId = payment.PaymentId,
                PurchaseId = payment.Purchase?.PurchaseId,
                RentalId = payment.RentalTransaction?.RentalId,
                PayerId = payment.PayerId,
                Amount = payment.Amount,
                PaymentMethod = payment.PaymentMethod.ToString(),
                PaymentStatus = payment.PaymentStatus.ToString(),
                TransactionRef = payment.TransactionRef,
                PaymentDate = payment.PaymentDate
            };
        }
    }
}
