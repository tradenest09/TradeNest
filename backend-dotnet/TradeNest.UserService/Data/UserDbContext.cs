using Microsoft.EntityFrameworkCore;
using TradeNest.UserService.Entities;
using TradeNest.UserService.Enums;

namespace TradeNest.UserService.Data
{
    public class UserDbContext : DbContext
    {
        public UserDbContext(DbContextOptions<UserDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Complaint> Complaints { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .Property(u => u.Status)
                .HasConversion(
                    v => v.ToString(),
                    v => (UserStatus)Enum.Parse(typeof(UserStatus), v));

            modelBuilder.Entity<Complaint>()
                .Property(c => c.Status)
                .HasConversion(
                    v => v.ToString(),
                    v => (ComplaintStatus)Enum.Parse(typeof(ComplaintStatus), v));

            modelBuilder.Entity<Role>()
                .HasData(
                    new Role { Rid = 1, Rname = "ROLE_ADMIN" },
                    new Role { Rid = 2, Rname = "ROLE_USER" },
                    new Role { Rid = 3, Rname = "ROLE_SELLER" }
                );
        }
    }
}
