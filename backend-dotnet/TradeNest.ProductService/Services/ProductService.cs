using Microsoft.EntityFrameworkCore;
using TradeNest.ProductService.Data;
using TradeNest.ProductService.DTOs;
using TradeNest.ProductService.Entities;
using TradeNest.ProductService.Enums;

namespace TradeNest.ProductService.Services
{
    public interface IProductService
    {
        Task<ProductResponse> AddProductAsync(AddProductRequest request);
        Task<ProductResponse> GetProductByIdAsync(int pid);
        Task<List<ProductResponse>> GetAllProductsAsync();
        Task<List<ProductResponse>> GetProductsByCategoryAsync(int cid);
        Task<List<ProductResponse>> GetProductsBySellerAsync(int uid);
        Task<List<ProductResponse>> GetProductsByTypeAsync(ProductType type);
        Task<List<ProductResponse>> SearchProductsAsync(string keyword);
        Task<ProductResponse> UpdateProductAsync(int pid, UpdateProductRequest request);
        Task<ApiResponse> DeleteProductAsync(int pid);
        Task<ProductResponse> UpdateProductStatusAsync(int pid, ProductStatus status, int? currentUserId = null, bool isAdmin = false, bool isService = false);
        Task<long> GetTotalProductsAsync();
    }

    public class ProductServiceImpl : IProductService
    {
        private readonly ProductDbContext _context;

        public ProductServiceImpl(ProductDbContext context)
        {
            _context = context;
        }

        public async Task<ProductResponse> AddProductAsync(AddProductRequest request)
        {
            var category = await _context.Categories.FindAsync(request.Cid);
            if (category == null) throw new KeyNotFoundException("Category not found");

            var product = new Product
            {
                Uid = request.Uid,
                Cid = request.Cid,
                Category = category,
                Pname = request.Pname,
                Pdesc = request.Pdesc,
                Price = request.Price,
                Type = request.Type,
                Status = ProductStatus.AVAILABLE
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            return MapToResponse(product);
        }

        public async Task<ProductResponse> GetProductByIdAsync(int pid)
        {
            var product = await _context.Products
                .Include(p => p.Category)
                .Include(p => p.Images)
                .FirstOrDefaultAsync(p => p.Pid == pid);
            if (product == null) throw new KeyNotFoundException("Product not found");

            var response = MapToResponse(product);
            var rent = await _context.ProductRents.FirstOrDefaultAsync(r => r.Pid == pid);
            if (rent != null)
            {
                response.RentDetails = new ProductRentResponse
                {
                    Prid = rent.Prid,
                    Pid = rent.Pid,
                    NoOfDays = rent.NoOfDays,
                    ChargePerDay = rent.ChargePerDay,
                    SecurityDeposit = rent.SecurityDeposit
                };
            }
            return response;
        }

        public async Task<List<ProductResponse>> GetAllProductsAsync()
        {
            var products = await _context.Products
                .Include(p => p.Category)
                .Include(p => p.Images)
                .ToListAsync();
            return products.Select(MapToResponse).ToList();
        }

        public async Task<List<ProductResponse>> GetProductsByCategoryAsync(int cid)
        {
            var products = await _context.Products
                .Include(p => p.Category)
                .Include(p => p.Images)
                .Where(p => p.Cid == cid)
                .ToListAsync();
            return products.Select(MapToResponse).ToList();
        }

        public async Task<List<ProductResponse>> GetProductsBySellerAsync(int uid)
        {
            var products = await _context.Products
                .Include(p => p.Category)
                .Include(p => p.Images)
                .Where(p => p.Uid == uid)
                .ToListAsync();
            return products.Select(MapToResponse).ToList();
        }

        public async Task<List<ProductResponse>> GetProductsByTypeAsync(ProductType type)
        {
            var products = await _context.Products
                .Include(p => p.Category)
                .Include(p => p.Images)
                .Where(p => p.Type == type)
                .ToListAsync();
            return products.Select(MapToResponse).ToList();
        }

        public async Task<List<ProductResponse>> SearchProductsAsync(string keyword)
        {
            var products = await _context.Products
                .Include(p => p.Category)
                .Include(p => p.Images)
                .Where(p => p.Pname.Contains(keyword) || p.Pdesc.Contains(keyword))
                .ToListAsync();
            return products.Select(MapToResponse).ToList();
        }

        public async Task<ProductResponse> UpdateProductAsync(int pid, UpdateProductRequest request)
        {
            var product = await _context.Products
                .Include(p => p.Category)
                .Include(p => p.Images)
                .FirstOrDefaultAsync(p => p.Pid == pid);
            if (product == null) throw new KeyNotFoundException("Product not found");

            var category = await _context.Categories.FindAsync(request.Cid);
            if (category == null) throw new KeyNotFoundException("Category not found");

            product.Cid = request.Cid;
            product.Category = category;
            product.Pname = request.Pname;
            product.Pdesc = request.Pdesc;
            product.Price = request.Price;
            product.Status = request.Status;
            product.Type = request.Type;

            await _context.SaveChangesAsync();
            return MapToResponse(product);
        }

        public async Task<ProductResponse> UpdateProductStatusAsync(int pid, ProductStatus status, int? currentUserId = null, bool isAdmin = false, bool isService = false)
        {
            var product = await _context.Products
                .Include(p => p.Category)
                .Include(p => p.Images)
                .FirstOrDefaultAsync(p => p.Pid == pid);
            if (product == null) throw new KeyNotFoundException("Product not found");

            if (!isAdmin && !isService)
            {
                if (!currentUserId.HasValue)
                {
                    throw new System.UnauthorizedAccessException("User identification is missing or invalid.");
                }

                if (product.Uid != currentUserId.Value)
                {
                    throw new System.UnauthorizedAccessException("You are not authorized to update another user's product status.");
                }

                if (status == ProductStatus.SOLD || status == ProductStatus.RENTED)
                {
                    throw new System.UnauthorizedAccessException("Only authorized payment services or administrators can mark products as SOLD or RENTED.");
                }
            }

            if (status == ProductStatus.SOLD && product.Status != ProductStatus.AVAILABLE)
            {
                throw new InvalidOperationException("This product has already been sold.");
            }

            if (status == ProductStatus.RENTED && product.Status != ProductStatus.AVAILABLE)
            {
                throw new InvalidOperationException("This product is unavailable for rent.");
            }

            product.Status = status;
            await _context.SaveChangesAsync();
            return MapToResponse(product);
        }

        public async Task<ApiResponse> DeleteProductAsync(int pid)
        {
            var product = await _context.Products.FindAsync(pid);
            if (product == null) throw new KeyNotFoundException("Product not found");

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
            return new ApiResponse { Success = true, Message = "Product deleted successfully" };
        }

        public async Task<long> GetTotalProductsAsync()
        {
            return await _context.Products.CountAsync();
        }

        private ProductResponse MapToResponse(Product product)
        {
            return new ProductResponse
            {
                Pid = product.Pid,
                Uid = product.Uid,
                Cid = product.Cid,
                CategoryName = product.Category?.Cname,
                Pname = product.Pname,
                Pdesc = product.Pdesc,
                Price = product.Price,
                Status = product.Status,
                Type = product.Type,
                CreatedAt = product.CreatedAt,
                Images = product.Images?.Select(img => new ImageResponse
                {
                    ImageId = img.ImageId,
                    Pid = img.Pid,
                    ImageUrl = img.ImageUrl,
                    IsPrimary = img.IsPrimary
                }).ToList()
            };
        }
    }
}

