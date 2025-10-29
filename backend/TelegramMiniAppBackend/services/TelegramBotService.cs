using Microsoft.EntityFrameworkCore;
using Telegram.Bot;
using Telegram.Bot.Types;
using Telegram.Bot.Types.Enums;
using TelegramMiniAppBackend.Data;
using TelegramMiniAppBackend.Models;

namespace TelegramMiniAppBackend.Services;

public class TelegramBotService
{
    private readonly TelegramBotClient _botClient;
    private readonly ClientService _clientService;
    private readonly AppDbContext _dbContext;
    private readonly ILogger<TelegramBotService> _logger;

    public TelegramBotService(
        TelegramBotClient botClient,
        ClientService clientService,
        AppDbContext dbContext,
        ILogger<TelegramBotService> logger)
    {
        _botClient = botClient;
        this._clientService = clientService;
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
                await _botClient.SendMessage(
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

    public async Task HandleUpdateAsync(Update update)
        {
            try
            {
                _logger.LogInformation("Processing update of type: {UpdateType}", update.Type);
                
                switch (update.Type)
                {
                    case UpdateType.Message:
                        if (update.Message != null)
                        {
                            await HandleMessageAsync(update.Message);
                        }
                        else
                        {
                            _logger.LogWarning("Message in update is null");
                        }
                        break;
                    case UpdateType.CallbackQuery:
                        if (update.CallbackQuery != null)
                        {
                            await HandleCallbackQueryAsync(update.CallbackQuery);
                        }
                        else
                        {
                            _logger.LogWarning("CallbackQuery in update is null");
                        }
                        break;
                    case UpdateType.InlineQuery:
                        if (update.InlineQuery != null)
                        {
                            await HandleInlineQueryAsync(update.InlineQuery);
                        }
                        else
                        {
                            _logger.LogWarning("InlineQuery in update is null");
                        }
                        break;
                    default:
                        _logger.LogInformation("Received unsupported update type: {UpdateType}", update.Type);
                        break;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing update of type: {UpdateType}", update.Type);
            }
        }

        private async Task HandleMessageAsync(Message message)
        {
            if (message.Text == null)
            {
                _logger.LogInformation("Received message without text");
                return;
            }

            _logger.LogInformation("Received message: {MessageText} from user {UserId} (@{Username})", 
                message.Text, 
                message.From?.Id, 
                message.From?.Username);

            // Обработка команд
            if (message.Text.StartsWith('/'))
            {
                _logger.LogInformation("Processing command: {Command}", message.Text.Split(' ')[0]);
                await HandleCommandAsync(message);
            }
            else
            {
                _logger.LogInformation("Processing regular message");
                // Анализ обычных сообщений
                await AnalyzeAndRespondToMessage(message);
            }
        }

        private async Task HandleCommandAsync(Message message)
        {
            var commandParts = message.Text.Split(' ');
            var command = commandParts[0].ToLower();
            var commandArgs = commandParts.Length > 1 ? string.Join(" ", commandParts.Skip(1)) : "";

            _logger.LogInformation("Processing command: {Command} with args: {Args} from chat: {ChatId}", 
                command, commandArgs, message.Chat.Id);

            switch (command)
            {
                case "/start":
                    _logger.LogInformation("Sending /start response to chat: {ChatId}", message.Chat.Id);
                    var clientExist = await _clientService.ClientExistsAsync(message.From.Id);
                if (clientExist is false)
                {
                    ClientModel newClient = new ClientModel
                    {
                        TelegramId = message.From.Id,
                        Username = message.From.Username,
                        FullName = message.From.FirstName + " " + message.From.LastName
                    };
                    await _clientService.AddClientAsync(newClient);
                }
                    
                    await _botClient.SendMessage(
                        message.Chat.Id,
                        "Добро пожаловать! Я бот для анализа сообщений.",
                        cancellationToken: CancellationToken.None);
                    break;
                case "/help":
                    _logger.LogInformation("Sending /help response to chat: {ChatId}", message.Chat.Id);
                    await _botClient.SendMessage(
                        message.Chat.Id,
                        "Доступные команды:\n/start - начать работу\n/help - помощь\n/analyze - проанализировать чат",
                        cancellationToken: CancellationToken.None);
                    break;
                default:
                    _logger.LogInformation("Sending unknown command response to chat: {ChatId}", message.Chat.Id);
                    await _botClient.SendMessage(
                        message.Chat.Id,
                        "Неизвестная команда. Используйте /help для списка команд.",
                        cancellationToken: CancellationToken.None);
                    break;
            }
        }

        private async Task AnalyzeAndRespondToMessage(Message message)
        {
            // Простой анализ текста сообщения
            var text = message.Text.ToLower();
            var response = AnalyzeMessageText(text);

            if (!string.IsNullOrEmpty(response))
            {
                await _botClient.SendMessage(message.Chat.Id, response);
            }
        }

        private string AnalyzeMessageText(string text)
        {
            // Пример простого анализа текста
            if (text.Contains("привет") || text.Contains("здравствуй"))
                return "Привет! Как дела?";
            
            if (text.Contains("погода"))
                return "Я могу анализировать сообщения, но о погоде лучше спросить у метеосервиса :)";
            
            if (text.Contains("как дела") || text.Contains("как ты"))
                return "У меня всё отлично! Занимаюсь анализом сообщений.";

            // Возвращаем null, если не нужно отвечать
            return null;
        }

        private async Task HandleCallbackQueryAsync(CallbackQuery callbackQuery)
        {
            // Обработка callback-запросов от inline-кнопок
            await _botClient.AnswerCallbackQuery(callbackQuery.Id);
            await _botClient.SendMessage(
                callbackQuery.Message.Chat.Id,
                $"Обработана кнопка: {callbackQuery.Data}");
        }

        private async Task HandleInlineQueryAsync(InlineQuery inlineQuery)
        {
            // Обработка inline-запросов
            // Можно добавить свою логику
        }
}
