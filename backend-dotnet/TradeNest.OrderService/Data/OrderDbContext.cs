using Microsoft.EntityFrameworkCore;
using TradeNest.OrderService.Entities;

namespace TradeNest.OrderService.Data
{
    public class OrderDbContext : DbContext
    {
        public OrderDbContext(DbContextOptions<OrderDbContext> options) : base(options) { }

        public DbSet<Purchase> Purchases { get; set; }
        public DbSet<RentalTransaction> RentalTransactions { get; set; }
        public DbSet<Payment> Payments { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // The mapping is done via DataAnnotations on the Entities themselves,
            // but we ensure the names match the MySQL DB exactly.
            modelBuilder.Entity<Purchase>().ToTable("purchases");
            modelBuilder.Entity<RentalTransaction>().ToTable("rental_transactions");
            modelBuilder.Entity<Payment>().ToTable("payments");

            modelBuilder.Entity<RentalTransaction>()
                .Property(r => r.Status)
                .HasConversion(
                    v => v.ToString(),
                    v => (RentalStatus)Enum.Parse(typeof(RentalStatus), v));

            modelBuilder.Entity<Purchase>()
                .Property(p => p.Status)
                .HasConversion(
                    v => v.ToString(),
                    v => (PurchaseStatus)Enum.Parse(typeof(PurchaseStatus), v));

            modelBuilder.Entity<Payment>()
                .Property(p => p.PaymentMethod)
                .HasConversion(
                    v => v.ToString(),
                    v => (PaymentMethod)Enum.Parse(typeof(PaymentMethod), v));

            modelBuilder.Entity<Payment>()
                .Property(p => p.PaymentStatus)
                .HasConversion(
                    v => v.ToString(),
                    v => (PaymentStatus)Enum.Parse(typeof(PaymentStatus), v));
        }
    }
}
