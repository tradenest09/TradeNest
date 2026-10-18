using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using TradeNest.ProductService.DTOs;
using TradeNest.ProductService.Services;

namespace TradeNest.ProductService.Controllers
{
    [ApiController]
    [Route("api/images")]
    [Route("api/product-images")]
    public class ProductImageController : ControllerBase
    {
        private readonly IProductImageService _productImageService;
        private readonly IWebHostEnvironment _environment;

        public ProductImageController(IProductImageService productImageService, IWebHostEnvironment environment)
        {
            _productImageService = productImageService;
            _environment = environment;
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> AddImage([FromBody] AddImageRequest request)
        {
            try
            {
                var response = await _productImageService.AddImageAsync(request);
                return Created("", response);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new ApiResponse { Success = false, Message = ex.Message });
            }
        }

        [AllowAnonymous]
        [HttpGet("product/{pid}")]
        public async Task<IActionResult> GetImagesByProduct(int pid)
        {
            var response = await _productImageService.GetImagesByProductAsync(pid);
            return Ok(response);
        }

        [Authorize]
        [HttpDelete("{imageId}")]
        public async Task<IActionResult> DeleteImage(int imageId)
        {
            try
            {
                var response = await _productImageService.DeleteImageAsync(imageId);
                return Ok(response);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new ApiResponse { Success = false, Message = "Image not found" });
            }
        }

        [Authorize]
        [HttpPost("/api/products/{productId}/images")]
        [HttpPost("upload/{productId}")]
        public async Task<IActionResult> UploadImage(int productId, [FromForm(Name = "file")] IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest(new ApiResponse { Success = false, Message = "Failed to store empty file" });
            }

            try
            {
                var response = await _productImageService.UploadImageAsync(productId, file);
                return Ok(response);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new ApiResponse { Success = false, Message = ex.Message });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new ApiResponse { Success = false, Message = ex.Message });
            }
        }

        // Route to serve the physical files if accessed via controller
        [AllowAnonymous]
        [HttpGet("view/{filename}")]
        public IActionResult ViewImage(string filename)
        {
            var safeFilename = Path.GetFileName(filename);
            var basePath = Path.Combine(_environment.ContentRootPath, "uploads", "products");
            var filePath = Path.Combine(basePath, safeFilename);

            if (!System.IO.File.Exists(filePath))
            {
                var fallbackPath = Path.GetFullPath(Path.Combine(_environment.ContentRootPath, "..", "..", "backend", "product-service", "uploads", "products", safeFilename));
                if (System.IO.File.Exists(fallbackPath))
                {
                    filePath = fallbackPath;
                }
                else
                {
                    return NotFound();
                }
            }
            
            var provider = new Microsoft.AspNetCore.StaticFiles.FileExtensionContentTypeProvider();
            if (!provider.TryGetContentType(filePath, out string? contentType))
            {
                contentType = "application/octet-stream";
            }
            
            return PhysicalFile(filePath, contentType);
        }
    }
}
