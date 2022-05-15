using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MediBot.API.Migrations
{
    public partial class TimeSlotsToDoctor : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "TimeSlotIds",
                table: "Doctors",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TimeSlotIds",
                table: "Doctors");
        }
    }
}
