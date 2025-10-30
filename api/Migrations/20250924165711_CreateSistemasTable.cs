using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class CreateSistemasTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: "c97c1283-1cbe-42fb-b03a-e7207395d930"
            );

            migrationBuilder
                .CreateTable(
                    name: "Sistemas",
                    columns: table => new
                    {
                        Id = table
                            .Column<string>(type: "varchar(255)", nullable: false)
                            .Annotation("MySql:CharSet", "utf8mb4"),
                        Nome = table
                            .Column<string>(type: "longtext", nullable: false)
                            .Annotation("MySql:CharSet", "utf8mb4"),
                        Criador = table
                            .Column<string>(type: "longtext", nullable: false)
                            .Annotation("MySql:CharSet", "utf8mb4"),
                        CamposJson = table
                            .Column<string>(type: "longtext", nullable: false)
                            .Annotation("MySql:CharSet", "utf8mb4"),
                    },
                    constraints: table =>
                    {
                        table.PrimaryKey("PK_Sistemas", x => x.Id);
                    }
                )
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[]
                {
                    "Id",
                    "Admin",
                    "Email",
                    "LastName",
                    "Name",
                    "Password",
                    "Username",
                },
                values: new object[]
                {
                    "f67c78ce-7891-4c9c-b658-9cd003229aaa",
                    true,
                    "admin@admin.admin",
                    "Admin",
                    "Admin",
                    "$2a$11$cupuLXxBBCkgbH3NQwWQAOEjrQGUMSh9DyWZGhPFCBPNJ/dmUQ4eK",
                    "admin",
                }
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(name: "Sistemas");

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: "f67c78ce-7891-4c9c-b658-9cd003229aaa"
            );

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[]
                {
                    "Id",
                    "Admin",
                    "Email",
                    "LastName",
                    "Name",
                    "Password",
                    "Username",
                },
                values: new object[]
                {
                    "c97c1283-1cbe-42fb-b03a-e7207395d930",
                    true,
                    "admin@admin.admin",
                    "Admin",
                    "Admin",
                    "$2a$11$QOIMwVfDhFHZffVr5Ayfqeh3gbODnenRSSgA3fIS15GKb9APVLUZi",
                    "admin",
                }
            );
        }
    }
}
