namespace CampusEats.Api.Models;

public class Order
{
    public int Id { get; set; }
    public string StudentId { get; set; } = "";
    public string StudentName { get; set; } = "";
    public string Items { get; set; } = "";
    public decimal Total { get; set; }
    public string Status { get; set; } = "Pending";
    public DateTime PlacedAt { get; set; }
}
