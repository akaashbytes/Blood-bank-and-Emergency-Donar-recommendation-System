using System;
using Microsoft.EntityFrameworkCore.Migrations;
using NetTopologySuite.Geometries;

#nullable disable

namespace LifeLink.Blood.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class M002_AddBloodStockAndExpiryAlerts : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "blood_stock_items",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    BloodGroup = table.Column<string>(type: "text", nullable: false),
                    Component = table.Column<string>(type: "text", nullable: false),
                    UnitsAvailable = table.Column<int>(type: "integer", nullable: false),
                    ReservedUnits = table.Column<int>(type: "integer", nullable: false),
                    CriticalThreshold = table.Column<int>(type: "integer", nullable: false),
                    LastUpdated = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ExpiryAlertsCount = table.Column<int>(type: "integer", nullable: false),
                    StorageUnit = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    VaultLocation = table.Column<Point>(type: "geography (point, 4326)", nullable: true),
                    xmin = table.Column<uint>(type: "xid", rowVersion: true, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_blood_stock_items", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "expiry_alerts",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    BloodStockItemId = table.Column<Guid>(type: "uuid", nullable: true),
                    UnitId = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    BloodGroup = table.Column<string>(type: "text", nullable: false),
                    Component = table.Column<string>(type: "text", nullable: false),
                    QuantityUnits = table.Column<int>(type: "integer", nullable: false),
                    ExpiryDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DaysRemaining = table.Column<int>(type: "integer", nullable: false),
                    Status = table.Column<string>(type: "text", nullable: false),
                    Location = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_expiry_alerts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_expiry_alerts_blood_stock_items_BloodStockItemId",
                        column: x => x.BloodStockItemId,
                        principalTable: "blood_stock_items",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateIndex(
                name: "IX_expiry_alerts_BloodStockItemId",
                table: "expiry_alerts",
                column: "BloodStockItemId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "expiry_alerts");

            migrationBuilder.DropTable(
                name: "blood_stock_items");
        }
    }
}
