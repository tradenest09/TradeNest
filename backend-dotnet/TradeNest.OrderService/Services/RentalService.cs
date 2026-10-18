using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using TradeNest.OrderService.Data;
using TradeNest.OrderService.DTOs;
using TradeNest.OrderService.Entities;

namespace TradeNest.OrderService.Services
{
    public interface IRentalService
    {
        Task<RentalResponse> CreateRentalAsync(RentalRequest request);
        Task<RentalResponse> GetRentalByIdAsync(int rentalId);
        Task<List<RentalResponse>> GetAllRentalsAsync();
        Task<List<RentalResponse>> GetRentalsByOwnerAsync(int ownerId);
        Task<List<RentalResponse>> GetRentalsByRenterAsync(int renterId);
        Task<RentalResponse> UpdateRentalStatusAsync(UpdateRentalStatusRequest request);
        Task<RentalResponse> UpdateRentalStatusAsync(int rentalId, RentalStatus status);
        Task<ApiResponse> CancelRentalAsync(int rentalId);
    }

    public class RentalServiceImpl : IRentalService
    {
        private readonly OrderDbContext _context;

        public RentalServiceImpl(OrderDbContext context)
        {
            _context = context;
        }

        public async Task<RentalResponse> CreateRentalAsync(RentalRequest request)
        {
            if (request.EndDate <= request.StartDate)
            {
                throw new System.ArgumentException("End date must be after start date");
            }

            var rental = new RentalTransaction
            {
                Pid = request.Pid,
                OwnerId = request.OwnerId,
                RenterId = request.RenterId,
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                TotalAmount = request.TotalAmount,
                Status = RentalStatus.REQUESTED
            };

            _context.RentalTransactions.Add(rental);
            await _context.SaveChangesAsync();

            return MapToResponse(rental);
        }

        public async Task<RentalResponse> GetRentalByIdAsync(int rentalId)
        {
            var r = await _context.RentalTransactions.FindAsync(rentalId);
            if (r == null) throw new System.Exception("Rental not found");
            return MapToResponse(r);
        }

        public async Task<List<RentalResponse>> GetAllRentalsAsync()
        {
            var list = await _context.RentalTransactions.ToListAsync();
            return list.Select(MapToResponse).ToList();
        }

        public async Task<List<RentalResponse>> GetRentalsByOwnerAsync(int ownerId)
        {
            var list = await _context.RentalTransactions.Where(r => r.OwnerId == ownerId).ToListAsync();
            return list.Select(MapToResponse).ToList();
        }

        public async Task<List<RentalResponse>> GetRentalsByRenterAsync(int renterId)
        {
            var list = await _context.RentalTransactions.Where(r => r.RenterId == renterId).ToListAsync();
            return list.Select(MapToResponse).ToList();
        }

        public async Task<RentalResponse> UpdateRentalStatusAsync(UpdateRentalStatusRequest request)
        {
            var r = await _context.RentalTransactions.FindAsync(request.RentalId);
            if (r == null) throw new System.Exception("Rental not found");

            if (!System.Enum.TryParse<RentalStatus>(request.Status?.ToUpper(), out var status))
            {
                throw new System.ArgumentException("Invalid rental status");
            }

            r.Status = status;
            await _context.SaveChangesAsync();
            return MapToResponse(r);
        }

        public async Task<RentalResponse> UpdateRentalStatusAsync(int rentalId, RentalStatus status)
        {
            var r = await _context.RentalTransactions.FindAsync(rentalId);
            if (r == null) throw new System.Exception("Rental not found");

            r.Status = status;
            await _context.SaveChangesAsync();
            return MapToResponse(r);
        }

        public async Task<ApiResponse> CancelRentalAsync(int rentalId)
        {
            var r = await _context.RentalTransactions.FindAsync(rentalId);
            if (r == null) throw new System.Exception("Rental not found");

            r.Status = RentalStatus.CANCELLED;
            await _context.SaveChangesAsync();
            return new ApiResponse { Success = true, Message = "Rental cancelled successfully" };
        }

        private RentalResponse MapToResponse(RentalTransaction r)
        {
            return new RentalResponse
            {
                RentalId = r.RentalId,
                Pid = r.Pid,
                OwnerId = r.OwnerId,
                RenterId = r.RenterId,
                StartDate = r.StartDate,
                EndDate = r.EndDate,
                TotalAmount = r.TotalAmount,
                Status = r.Status.ToString()
            };
        }
    }
}
