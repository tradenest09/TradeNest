using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TradeNest.ProductService.DTOs;
using TradeNest.ProductService.Services;

namespace TradeNest.ProductService.Controllers
{
    [ApiController]
    [Route("api/categories")]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryService _categoryService;

        public CategoryController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> AddCategory([FromBody] AddCategoryRequest request)
        {
            var response = await _categoryService.AddCategoryAsync(request);
            return Created("", response);
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetAllCategories()
        {
            var response = await _categoryService.GetAllCategoriesAsync();
            return Ok(response);
        }

        [AllowAnonymous]
        [HttpGet("{cid}")]
        public async Task<IActionResult> GetCategoryById(int cid)
        {
            try
            {
                var response = await _categoryService.GetCategoryByIdAsync(cid);
                return Ok(response);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new ApiResponse { Success = false, Message = "Category not found" });
            }
        }

        [Authorize]
        [HttpPut("{cid}")]
        public async Task<IActionResult> UpdateCategory(int cid, [FromBody] UpdateCategoryRequest request)
        {
            try
            {
                var response = await _categoryService.UpdateCategoryAsync(cid, request);
                return Ok(response);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new ApiResponse { Success = false, Message = "Category not found" });
            }
        }

        [Authorize]
        [HttpDelete("{cid}")]
        public async Task<IActionResult> DeleteCategory(int cid)
        {
            try
            {
                var response = await _categoryService.DeleteCategoryAsync(cid);
                return Ok(response);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new ApiResponse { Success = false, Message = "Category not found" });
            }
        }
    }
}
