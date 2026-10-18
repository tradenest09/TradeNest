using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using TradeNest.ProductService.Data;
using TradeNest.ProductService.DTOs;
using TradeNest.ProductService.Entities;

namespace TradeNest.ProductService.Services
{
    public interface IProductImageService
    {
        Task<ImageResponse> AddImageAsync(AddImageRequest request);
        Task<List<ImageResponse>> GetImagesByProductAsync(int pid);
        Task<ApiResponse> DeleteImageAsync(int imageId);
        Task<ImageResponse> UploadImageAsync(int productId, IFormFile file);
    }

    public class ProductImageServiceImpl : IProductImageService
    {
        private readonly ProductDbContext _context;
        private readonly IWebHostEnvironment _environment;

        public ProductImageServiceImpl(ProductDbContext context, IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
        }

        public async Task<ImageResponse> AddImageAsync(AddImageRequest request)
        {
            var product = await _context.Products.FindAsync(request.Pid);
            if (product == null) throw new KeyNotFoundException("Product not found");

            var image = new ProductImage
            {
                Pid = request.Pid,
                ImageUrl = request.ImageUrl,
                IsPrimary = request.IsPrimary
            };

            _context.ProductImages.Add(image);
            await _context.SaveChangesAsync();
            return MapToResponse(image);
        }

        public async Task<List<ImageResponse>> GetImagesByProductAsync(int pid)
        {
            var images = await _context.ProductImages.Where(i => i.Pid == pid).ToListAsync();
            return images.Select(MapToResponse).ToList();
        }

        public async Task<ApiResponse> DeleteImageAsync(int imageId)
        {
            var image = await _context.ProductImages.FindAsync(imageId);
            if (image == null) throw new KeyNotFoundException("Image not found");

            try
            {
                var safeFilename = Path.GetFileName(image.ImageUrl);
                var basePath = Path.Combine(_environment.ContentRootPath, "uploads", "products");
                var filePath = Path.Combine(basePath, safeFilename);
                if (File.Exists(filePath))
                {
                    File.Delete(filePath);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Failed to delete physical image file: " + ex.Message);
            }

            _context.ProductImages.Remove(image);
            await _context.SaveChangesAsync();
            return new ApiResponse { Success = true, Message = "Image deleted successfully" };
        }

        public async Task<ImageResponse> UploadImageAsync(int productId, IFormFile file)
        {
            var product = await _context.Products.FindAsync(productId);
            if (product == null) throw new KeyNotFoundException("Product not found");

            if (file == null || file.Length == 0) throw new ArgumentException("Failed to store empty file");

            var basePath = Path.Combine(_environment.ContentRootPath, "uploads", "products");
            if (!Directory.Exists(basePath))
            {
                Directory.CreateDirectory(basePath);
            }

            var extension = Path.GetExtension(file.FileName);
            var newFilename = Guid.NewGuid().ToString() + extension;
            var filePath = Path.Combine(basePath, newFilename);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var isFirstImage = !await _context.ProductImages.AnyAsync(i => i.Pid == productId);

            var image = new ProductImage
            {
                Pid = productId,
                ImageUrl = newFilename,
                IsPrimary = isFirstImage
            };

            _context.ProductImages.Add(image);
            await _context.SaveChangesAsync();
            return MapToResponse(image);
        }

        private ImageResponse MapToResponse(ProductImage image)
        {
            return new ImageResponse
            {
                ImageId = image.ImageId,
                Pid = image.Pid,
                ImageUrl = image.ImageUrl,
                IsPrimary = image.IsPrimary
            };
        }
    }
}
