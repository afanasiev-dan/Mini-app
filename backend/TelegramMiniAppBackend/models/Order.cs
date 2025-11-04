using System.ComponentModel.DataAnnotations.Schema;

namespace TelegramMiniAppBackend.Models;

[Table("orders")]
public class Order
{
    public int Id { get; set; }
    public long UserId { get; set; }
    public long UID { get; set; }
    public string Type { get; set; } = "buy";
    public string Currency { get; set; } = "USDT";
    public string Bank { get; set; } = "";
    public decimal Amount { get; set; }
    public string ContactInfo { get; set; } = "";
    public string PaymentUserData { get; set; } = "";
    public string Status { get; set; } = OrderStatus.Created;
    public bool Sync { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ChangeAt { get; set; }
}
