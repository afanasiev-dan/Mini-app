namespace TelegramMiniAppBackend.Models;

public class User
{
    public long TelegramId { get; set; }
    public string? Username { get; set; }
    public string? FullName { get; set; }
    public string? WalletAddress { get; set; }
    public string? WalletNetwork { get; set; }
}
