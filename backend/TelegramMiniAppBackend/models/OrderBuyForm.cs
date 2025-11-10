namespace TelegramMiniAppBackend.Models;

public class OrderBuyForm
{
    public long UserId { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Currency { get; set; } = "USDT";
    public string CurrencyPaymentType { get; set; } = "RUB";
    public string Bank { get; set; } = "";
    public decimal Amount { get; set; }
    public long UID { get; set; }
    public string ContactInfo { get; set; } = "";
}