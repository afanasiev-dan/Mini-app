using System.ComponentModel.DataAnnotations.Schema;

namespace TelegramMiniAppBackend.Models;

[Table("notification_chats")]
public class NotificationChat
{
    public long ChatId { get; set; }
    public string? Title { get; set; } // Название чата (опционально)
}
