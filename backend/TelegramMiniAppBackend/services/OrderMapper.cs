using TelegramMiniAppBackend.Models;

namespace TelegramMiniAppBackend.Services
{
    public static class OrderMapper
    {
        public static Order ToOrder(this OrderBuyForm buyForm)
        {
            return new Order
            {
                UserId = buyForm.UserId, // Using UserId from the form as the user identifier
                Type = "buy",
                Currency = buyForm.Currency ?? "USDT",
                Bank = buyForm.Bank ?? "",
                Amount = buyForm.Amount,
                ContactInfo = buyForm.ContactInfo ?? "",
                Status = OrderStatus.Created,
                CreatedAt = DateTime.UtcNow
            };
        }

        public static Order ToOrder(this OrderSellForm sellForm)
        {
            return new Order
            {
                UserId = sellForm.UserId, // Using UserId from the form as the user identifier
                Type = "sell",
                Currency = sellForm.Currency ?? "USDT",
                Bank = sellForm.Bank ?? "",
                Amount = sellForm.Amount,
                PaymentUserData = sellForm.PaymentUserData ?? "",
                ContactInfo = sellForm.ContactInfo ?? "",
                Status = OrderStatus.Created,
                CreatedAt = DateTime.UtcNow
            };
        }
    }
}