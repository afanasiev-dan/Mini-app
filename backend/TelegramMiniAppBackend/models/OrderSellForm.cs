namespace TelegramMiniAppBackend.Models;

public class OrderSellForm
{
    public long UserId { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Currency { get; set; } = "USDT";
    public string Bank { get; set; } = "";
    public decimal Amount { get; set; }
    public string PaymentUserData { get; set; } = "";
    public string ContactInfo { get; set; } = "";
}
