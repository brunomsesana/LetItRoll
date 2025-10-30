using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class AddRefreshToken : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: "f67c78ce-7891-4c9c-b658-9cd003229aaa");

            migrationBuilder.CreateTable(
                name: "RefreshTokens",
                columns: table => new
                {
                    Token = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ExpiresIn = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UserId = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RefreshTokens", x => x.Token);
                    table.ForeignKey(
                        name: "FK_RefreshTokens_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Admin", "Email", "LastName", "Name", "Password", "Username" },
                values: new object[] { "2f03b68e-ead6-4f66-9099-0552126904e1", true, "admin@admin.admin", "Admin", "Admin", "$2a$11$elQsLmMPkbUm66aDD9nGCOpCO8e9bhAXL/5B3PwjAwSKSVyiCD1.K", "admin" });

            migrationBuilder.CreateIndex(
                name: "IX_RefreshTokens_UserId",
                table: "RefreshTokens",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RefreshTokens");

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: "2f03b68e-ead6-4f66-9099-0552126904e1");

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Admin", "Email", "LastName", "Name", "Password", "Username" },
                values: new object[] { "f67c78ce-7891-4c9c-b658-9cd003229aaa", true, "admin@admin.admin", "Admin", "Admin", "$2a$11$cupuLXxBBCkgbH3NQwWQAOEjrQGUMSh9DyWZGhPFCBPNJ/dmUQ4eK", "admin" });
        }
    }
}
