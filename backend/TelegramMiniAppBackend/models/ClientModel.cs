using System.ComponentModel.DataAnnotations.Schema;

namespace TelegramMiniAppBackend.Models;

[Table("clients")]
public class ClientModel
{
    public long TelegramId { get; set; }
    public string? Username { get; set; }
    public string? FullName { get; set; }
}
