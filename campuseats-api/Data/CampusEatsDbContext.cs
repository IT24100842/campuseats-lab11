using CampusEats.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace CampusEats.Api.Data;

public class CampusEatsDbContext(DbContextOptions<CampusEatsDbContext> options) : DbContext(options)
{
    public DbSet<MenuItem> MenuItems => Set<MenuItem>();
    public DbSet<Order> Orders => Set<Order>();

    protected override void OnModelCreating(ModelBuilder b)
    {
        b.Entity<MenuItem>(e =>
        {
            e.Property(m => m.Name).HasMaxLength(100).IsRequired();
            e.Property(m => m.Category).HasMaxLength(50).IsRequired();
            e.Property(m => m.Outlet).HasMaxLength(50).IsRequired();
            e.Property(m => m.Price).HasPrecision(10, 2);
        });

        b.Entity<Order>(e =>
        {
            e.Property(o => o.StudentId).HasMaxLength(20).IsRequired();
            e.Property(o => o.StudentName).HasMaxLength(100).IsRequired();
            e.Property(o => o.Items).HasMaxLength(500).IsRequired();
            e.Property(o => o.Status).HasMaxLength(20).IsRequired();
            e.Property(o => o.Total).HasPrecision(10, 2);
            e.HasIndex(o => o.StudentId);
        });

        // Seed data (same dishes/orders as the Lab 02 db.json) so the cloud
        // database has real rows as soon as the migration is applied.
        b.Entity<MenuItem>().HasData(
            new MenuItem { Id = 1, Name = "Chicken Kottu", Category = "Rice & Kottu", Price = 650, Outlet = "Main Canteen" },
            new MenuItem { Id = 2, Name = "Vegetable Rice & Curry", Category = "Rice & Kottu", Price = 400, Outlet = "Main Canteen", IsFavourite = true },
            new MenuItem { Id = 3, Name = "Fish Bun", Category = "Short Eats", Price = 120, Outlet = "Juice Bar" },
            new MenuItem { Id = 4, Name = "Egg Hopper (3 pcs)", Category = "Hoppers", Price = 300, Outlet = "Night Kade" },
            new MenuItem { Id = 5, Name = "Cheese Kottu", Category = "Rice & Kottu", Price = 800, Outlet = "Main Canteen" },
            new MenuItem { Id = 6, Name = "Vegetable Roti", Category = "Short Eats", Price = 100, Outlet = "Juice Bar" },
            new MenuItem { Id = 7, Name = "Chicken Fried Rice", Category = "Rice & Kottu", Price = 700, Outlet = "Main Canteen" },
            new MenuItem { Id = 8, Name = "Plain Hopper (5 pcs)", Category = "Hoppers", Price = 250, Outlet = "Night Kade" },
            new MenuItem { Id = 9, Name = "Wood Apple Juice", Category = "Drinks", Price = 200, Outlet = "Juice Bar" },
            new MenuItem { Id = 10, Name = "Iced Milo", Category = "Drinks", Price = 180, Outlet = "Juice Bar", IsFavourite = true },
            new MenuItem { Id = 11, Name = "String Hoppers (10 pcs)", Category = "Hoppers", Price = 350, Outlet = "Night Kade", Available = false },
            new MenuItem { Id = 12, Name = "Devilled Chicken", Category = "Rice & Kottu", Price = 900, Outlet = "Main Canteen" },
            new MenuItem { Id = 13, Name = "Faluda", Category = "Drinks", Price = 350, Outlet = "Juice Bar" },
            new MenuItem { Id = 14, Name = "Isso Wade", Category = "Short Eats", Price = 150, Outlet = "Night Kade" },
            new MenuItem { Id = 15, Name = "Seeni Sambol Bun", Category = "Short Eats", Price = 110, Outlet = "Juice Bar" },
            new MenuItem { Id = 16, Name = "Nasi Goreng", Category = "Rice & Kottu", Price = 750, Outlet = "Main Canteen" });

        b.Entity<Order>().HasData(
            new Order { Id = 101, StudentId = "IT22045678", StudentName = "Kasun Perera", Items = "Chicken Kottu x1, Iced Milo x1", Total = 830, Status = "Pending", PlacedAt = new DateTime(2026, 7, 17, 11, 20, 0, DateTimeKind.Utc) },
            new Order { Id = 102, StudentId = "IT22098765", StudentName = "Nethmi Silva", Items = "Rice & Curry x2", Total = 800, Status = "Preparing", PlacedAt = new DateTime(2026, 7, 17, 11, 35, 0, DateTimeKind.Utc) },
            new Order { Id = 103, StudentId = "IT22011223", StudentName = "Tharindu Jayasinghe", Items = "Egg Hopper x3, Faluda x1", Total = 1250, Status = "Ready", PlacedAt = new DateTime(2026, 7, 17, 11, 40, 0, DateTimeKind.Utc) },
            new Order { Id = 104, StudentId = "IT22045678", StudentName = "Kasun Perera", Items = "Cheese Kottu x1", Total = 800, Status = "Delivered", PlacedAt = new DateTime(2026, 7, 16, 13, 5, 0, DateTimeKind.Utc) },
            new Order { Id = 105, StudentId = "IT22076543", StudentName = "Dilki Fernando", Items = "Fish Bun x2, Wood Apple Juice x1", Total = 440, Status = "Pending", PlacedAt = new DateTime(2026, 7, 17, 11, 50, 0, DateTimeKind.Utc) });
    }
}
