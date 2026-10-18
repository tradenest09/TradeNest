using Microsoft.EntityFrameworkCore;
using TradeNest.ProductService.Data;
using TradeNest.ProductService.DTOs;
using TradeNest.ProductService.Entities;

namespace TradeNest.ProductService.Services
{
    public interface ICategoryService
    {
        Task<CategoryResponse> AddCategoryAsync(AddCategoryRequest request);
        Task<List<CategoryResponse>> GetAllCategoriesAsync();
        Task<CategoryResponse> GetCategoryByIdAsync(int cid);
        Task<CategoryResponse> UpdateCategoryAsync(int cid, UpdateCategoryRequest request);
        Task<ApiResponse> DeleteCategoryAsync(int cid);
    }

    public class CategoryServiceImpl : ICategoryService
    {
        private readonly ProductDbContext _context;

        public CategoryServiceImpl(ProductDbContext context)
        {
            _context = context;
        }

        public async Task<CategoryResponse> AddCategoryAsync(AddCategoryRequest request)
        {
            var category = new Category
            {
                Cname = request.Cname,
                Description = request.Description
            };
            _context.Categories.Add(category);
            await _context.SaveChangesAsync();
            return MapToResponse(category);
        }

        public async Task<List<CategoryResponse>> GetAllCategoriesAsync()
        {
            var categories = await _context.Categories.ToListAsync();
            return categories.Select(MapToResponse).ToList();
        }

        public async Task<CategoryResponse> GetCategoryByIdAsync(int cid)
        {
            var category = await _context.Categories.FindAsync(cid);
            if (category == null) throw new KeyNotFoundException("Category not found");
            return MapToResponse(category);
        }

        public async Task<CategoryResponse> UpdateCategoryAsync(int cid, UpdateCategoryRequest request)
        {
            var category = await _context.Categories.FindAsync(cid);
            if (category == null) throw new KeyNotFoundException("Category not found");

            category.Cname = request.Cname;
            category.Description = request.Description;
            await _context.SaveChangesAsync();
            return MapToResponse(category);
        }

        public async Task<ApiResponse> DeleteCategoryAsync(int cid)
        {
            var category = await _context.Categories.FindAsync(cid);
            if (category == null) throw new KeyNotFoundException("Category not found");

            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();
            return new ApiResponse { Success = true, Message = "Category deleted successfully" };
        }

        private CategoryResponse MapToResponse(Category category)
        {
            return new CategoryResponse
            {
                Cid = category.Cid,
                Cname = category.Cname,
                Description = category.Description
            };
        }
    }
}
