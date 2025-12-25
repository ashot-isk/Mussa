using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MussaApi.Migrations
{
    /// <inheritdoc />
    public partial class ChangeMaterialStockToDecimal : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<decimal>(
                name: "StockQuantity",
                table: "Materials",
                type: "numeric",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"),
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 12, 25, 20, 2, 16, 895, DateTimeKind.Utc).AddTicks(2360), new DateTime(2025, 12, 25, 20, 2, 16, 895, DateTimeKind.Utc).AddTicks(2360) });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("22222222-2222-2222-2222-222222222222"),
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 12, 25, 20, 2, 16, 895, DateTimeKind.Utc).AddTicks(2370), new DateTime(2025, 12, 25, 20, 2, 16, 895, DateTimeKind.Utc).AddTicks(2370) });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("33333333-3333-3333-3333-333333333333"),
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 12, 25, 20, 2, 16, 895, DateTimeKind.Utc).AddTicks(2370), new DateTime(2025, 12, 25, 20, 2, 16, 895, DateTimeKind.Utc).AddTicks(2370) });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("44444444-4444-4444-4444-444444444444"),
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 12, 25, 20, 2, 16, 895, DateTimeKind.Utc).AddTicks(2370), new DateTime(2025, 12, 25, 20, 2, 16, 895, DateTimeKind.Utc).AddTicks(2370) });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("550e8400-e29b-41d4-a716-446655440000"),
                columns: new[] { "CreatedAt", "PasswordHash", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 12, 25, 20, 2, 16, 895, DateTimeKind.Utc).AddTicks(1720), "$2a$11$6AuY237bLPHAr0U4BHczkOkmu56TyjKDnyHhkkx212NNz0pB76xyC", new DateTime(2025, 12, 25, 20, 2, 16, 895, DateTimeKind.Utc).AddTicks(1720) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "StockQuantity",
                table: "Materials",
                type: "integer",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "numeric");

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"),
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 12, 25, 18, 42, 19, 267, DateTimeKind.Utc).AddTicks(5920), new DateTime(2025, 12, 25, 18, 42, 19, 267, DateTimeKind.Utc).AddTicks(5920) });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("22222222-2222-2222-2222-222222222222"),
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 12, 25, 18, 42, 19, 267, DateTimeKind.Utc).AddTicks(5930), new DateTime(2025, 12, 25, 18, 42, 19, 267, DateTimeKind.Utc).AddTicks(5930) });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("33333333-3333-3333-3333-333333333333"),
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 12, 25, 18, 42, 19, 267, DateTimeKind.Utc).AddTicks(5930), new DateTime(2025, 12, 25, 18, 42, 19, 267, DateTimeKind.Utc).AddTicks(5930) });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("44444444-4444-4444-4444-444444444444"),
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 12, 25, 18, 42, 19, 267, DateTimeKind.Utc).AddTicks(5940), new DateTime(2025, 12, 25, 18, 42, 19, 267, DateTimeKind.Utc).AddTicks(5940) });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("550e8400-e29b-41d4-a716-446655440000"),
                columns: new[] { "CreatedAt", "PasswordHash", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 12, 25, 18, 42, 19, 267, DateTimeKind.Utc).AddTicks(5400), "$2a$11$vUjrRKXAIxFPYMN1eqFTm.EgCXyYOuBp3eIB9SJ8yJ5fArj9kGTKu", new DateTime(2025, 12, 25, 18, 42, 19, 267, DateTimeKind.Utc).AddTicks(5400) });
        }
    }
}
