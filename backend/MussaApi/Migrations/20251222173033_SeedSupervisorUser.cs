using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MussaApi.Migrations
{
    /// <inheritdoc />
    public partial class SeedSupervisorUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "CreatedAt", "PasswordHash", "Role", "UpdatedAt", "Username" },
                values: new object[] { 1, new DateTime(2025, 12, 22, 17, 30, 33, 569, DateTimeKind.Utc).AddTicks(2460), "$2a$11$5y1aU26z7LPJ/K5i6uKfFOBSnI45yWyjaetu954wSosOyacsSkFXm", "Supervisor", new DateTime(2025, 12, 22, 17, 30, 33, 569, DateTimeKind.Utc).AddTicks(2470), "supervisor" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1);
        }
    }
}
