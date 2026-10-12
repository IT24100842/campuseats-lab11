using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace CampusEats.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "MenuItems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Category = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Price = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    Outlet = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    IsFavourite = table.Column<bool>(type: "boolean", nullable: false),
                    Available = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MenuItems", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Orders",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    StudentId = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    StudentName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Items = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    Total = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    Status = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    PlacedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Orders", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "MenuItems",
                columns: new[] { "Id", "Available", "Category", "IsFavourite", "Name", "Outlet", "Price" },
                values: new object[,]
                {
                    { 1, true, "Rice & Kottu", false, "Chicken Kottu", "Main Canteen", 650m },
                    { 2, true, "Rice & Kottu", true, "Vegetable Rice & Curry", "Main Canteen", 400m },
                    { 3, true, "Short Eats", false, "Fish Bun", "Juice Bar", 120m },
                    { 4, true, "Hoppers", false, "Egg Hopper (3 pcs)", "Night Kade", 300m },
                    { 5, true, "Rice & Kottu", false, "Cheese Kottu", "Main Canteen", 800m },
                    { 6, true, "Short Eats", false, "Vegetable Roti", "Juice Bar", 100m },
                    { 7, true, "Rice & Kottu", false, "Chicken Fried Rice", "Main Canteen", 700m },
                    { 8, true, "Hoppers", false, "Plain Hopper (5 pcs)", "Night Kade", 250m },
                    { 9, true, "Drinks", false, "Wood Apple Juice", "Juice Bar", 200m },
                    { 10, true, "Drinks", true, "Iced Milo", "Juice Bar", 180m },
                    { 11, false, "Hoppers", false, "String Hoppers (10 pcs)", "Night Kade", 350m },
                    { 12, true, "Rice & Kottu", false, "Devilled Chicken", "Main Canteen", 900m },
                    { 13, true, "Drinks", false, "Faluda", "Juice Bar", 350m },
                    { 14, true, "Short Eats", false, "Isso Wade", "Night Kade", 150m },
                    { 15, true, "Short Eats", false, "Seeni Sambol Bun", "Juice Bar", 110m },
                    { 16, true, "Rice & Kottu", false, "Nasi Goreng", "Main Canteen", 750m }
                });

            migrationBuilder.InsertData(
                table: "Orders",
                columns: new[] { "Id", "Items", "PlacedAt", "Status", "StudentId", "StudentName", "Total" },
                values: new object[,]
                {
                    { 101, "Chicken Kottu x1, Iced Milo x1", new DateTime(2026, 7, 17, 11, 20, 0, 0, DateTimeKind.Utc), "Pending", "IT22045678", "Kasun Perera", 830m },
                    { 102, "Rice & Curry x2", new DateTime(2026, 7, 17, 11, 35, 0, 0, DateTimeKind.Utc), "Preparing", "IT22098765", "Nethmi Silva", 800m },
                    { 103, "Egg Hopper x3, Faluda x1", new DateTime(2026, 7, 17, 11, 40, 0, 0, DateTimeKind.Utc), "Ready", "IT22011223", "Tharindu Jayasinghe", 1250m },
                    { 104, "Cheese Kottu x1", new DateTime(2026, 7, 16, 13, 5, 0, 0, DateTimeKind.Utc), "Delivered", "IT22045678", "Kasun Perera", 800m },
                    { 105, "Fish Bun x2, Wood Apple Juice x1", new DateTime(2026, 7, 17, 11, 50, 0, 0, DateTimeKind.Utc), "Pending", "IT22076543", "Dilki Fernando", 440m }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Orders_StudentId",
                table: "Orders",
                column: "StudentId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MenuItems");

            migrationBuilder.DropTable(
                name: "Orders");
        }
    }
}
