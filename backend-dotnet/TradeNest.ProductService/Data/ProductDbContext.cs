using Microsoft.EntityFrameworkCore;
using TradeNest.ProductService.Entities;
using TradeNest.ProductService.Enums;

namespace TradeNest.ProductService.Data
{
    public class ProductDbContext : DbContext
    {
        public ProductDbContext(DbContextOptions<ProductDbContext> options) : base(options) { }

        public DbSet<Product> Products { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<ProductImage> ProductImages { get; set; }
        public DbSet<ProductRent> ProductRents { get; set; }
        public DbSet<Report> Reports { get; set; }
        public DbSet<Review> Reviews { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Review>()
                .ToTable("reviews");

            modelBuilder.Entity<ProductRent>()
                .ToTable("product_rent");

            modelBuilder.Entity<ProductImage>()
                .ToTable("image_table");

            modelBuilder.Entity<Product>()
                .Property(p => p.Status)
                .HasConversion(
                    v => v.ToString(),
                    v => (ProductStatus)Enum.Parse(typeof(ProductStatus), v));

            modelBuilder.Entity<Product>()
                .Property(p => p.Type)
                .HasConversion(
                    v => v.ToString(),
                    v => (ProductType)Enum.Parse(typeof(ProductType), v));

            modelBuilder.Entity<Report>()
                .Property(r => r.Status)
                .HasConversion(
                    v => v.ToString(),
                    v => (ReportStatus)Enum.Parse(typeof(ReportStatus), v));

            modelBuilder.Entity<Category>()
                .Property(c => c.Description)
                .IsRequired(false);

            modelBuilder.Entity<Product>()
                .Property(p => p.Pdesc)
                .IsRequired(false);

            modelBuilder.Entity<Product>()
                .Property(p => p.Pname)
                .IsRequired(false);

            modelBuilder.Entity<Report>()
                .Property(r => r.Description)
                .IsRequired(false);
        }
    }
}
