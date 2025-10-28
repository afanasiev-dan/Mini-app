using System.Text.Json;

namespace TelegramMiniAppBackend.Models
{
    public class CreateOrderRequest
    {
        public string? Type { get; set; } // "buy" or "sell"
        public JsonElement Data { get; set; }
    }
}