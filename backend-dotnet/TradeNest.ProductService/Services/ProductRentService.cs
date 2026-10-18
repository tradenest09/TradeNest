using Microsoft.EntityFrameworkCore;
using TradeNest.ProductService.Data;
using TradeNest.ProductService.DTOs;
using TradeNest.ProductService.Entities;

namespace TradeNest.ProductService.Services
{
    public interface IProductRentService
    {
        Task<ProductRentResponse> AddRentAsync(AddRentRequest request);
        Task<ProductRentResponse> GetRentByProductAsync(int pid);
        Task<ApiResponse> DeleteRentAsync(int prid);
    }

    public class ProductRentServiceImpl : IProductRentService
    {
        private readonly ProductDbContext _context;

        public ProductRentServiceImpl(ProductDbContext context)
        {
            _context = context;
        }

        public async Task<ProductRentResponse> AddRentAsync(AddRentRequest request)
        {
            var rent = new ProductRent
            {
                Pid = request.Pid,
                NoOfDays = request.NoOfDays ?? 1,
                ChargePerDay = request.ChargePerDay,
                SecurityDeposit = request.SecurityDeposit
            };
            _context.ProductRents.Add(rent);
            await _context.SaveChangesAsync();
            return MapToResponse(rent);
        }

        public async Task<ProductRentResponse> GetRentByProductAsync(int pid)
        {
            var rent = await _context.ProductRents.FirstOrDefaultAsync(r => r.Pid == pid);
            if (rent == null) throw new KeyNotFoundException("Rent not found");
            return MapToResponse(rent);
        }

        public async Task<ApiResponse> DeleteRentAsync(int prid)
        {
            var rent = await _context.ProductRents.FindAsync(prid);
            if (rent == null) throw new KeyNotFoundException("Rent not found");

            _context.ProductRents.Remove(rent);
            await _context.SaveChangesAsync();
            return new ApiResponse { Success = true, Message = "Rent deleted successfully" };
        }

        private ProductRentResponse MapToResponse(ProductRent rent)
        {
            return new ProductRentResponse
            {
                Prid = rent.Prid,
                Pid = rent.Pid,
                NoOfDays = rent.NoOfDays,
                ChargePerDay = rent.ChargePerDay,
                SecurityDeposit = rent.SecurityDeposit
            };
        }
    }
}
