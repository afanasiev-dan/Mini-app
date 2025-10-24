namespace TelegramMiniAppBackend.Models;

public class Order
{
    public int Id { get; set; }
    public long UserId { get; set; }
    public string Type { get; set; } = "buy"; // "buy" или "sell"
    public string Currency { get; set; } = "USDT";
    public string Bank { get; set; } = "Т-Банк";
    public decimal Amount { get; set; }
    public string ContactInfo { get; set; } = "";
    public string Status { get; set; } = "active"; // active, completed, cancelled
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
