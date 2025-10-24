using Microsoft.EntityFrameworkCore;
using Telegram.Bot;
using Telegram.Bot.Types.Enums;
using TelegramMiniAppBackend.Data;
using TelegramMiniAppBackend.Models;

namespace TelegramMiniAppBackend.Services;

public class TelegramBotService
{
    private readonly TelegramBotClient _botClient;
    private readonly AppDbContext _dbContext;
    private readonly ILogger<TelegramBotService> _logger;

    public TelegramBotService(TelegramBotClient botClient, AppDbContext dbContext, ILogger<TelegramBotService> logger)
    {
        _botClient = botClient;
        _dbContext = dbContext;
        _logger = logger;
    }

    public async Task NotifyNewOrder(Order order)
    {
        var notificationChats = await _dbContext.NotificationChats.ToListAsync();

        var message = $@"🆕 <b>Новая заявка!</b>
Тип: {(order.Type == "buy" ? "Покупка" : "Продажа")}
Валюта: {order.Currency}
Банк: {order.Bank}
Сумма: {order.Amount}
Контакт: {order.ContactInfo}";

        foreach (var chat in notificationChats)
        {
            try
            {
                await _botClient.SendTextMessageAsync(
                    chatId: chat.ChatId,
                    text: message,
                    parseMode: ParseMode.Html,
                    cancellationToken: CancellationToken.None
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Не удалось отправить уведомление в чат {ChatId}", chat.ChatId);
            }
        }
    }
}
