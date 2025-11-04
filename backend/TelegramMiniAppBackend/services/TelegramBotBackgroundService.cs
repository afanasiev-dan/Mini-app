using Microsoft.Extensions.Hosting;
using Telegram.Bot;
using Telegram.Bot.Polling;
using Telegram.Bot.Types;
using Telegram.Bot.Types.Enums;

namespace TelegramMiniAppBackend.Services;

public class TelegramBotBackgroundService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<TelegramBotBackgroundService> _logger;

    public TelegramBotBackgroundService(IServiceProvider serviceProvider, ILogger<TelegramBotBackgroundService> logger)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Telegram Bot Background Service is starting.");

        using var scope = _serviceProvider.CreateScope();
        var botClient = scope.ServiceProvider.GetRequiredService<TelegramBotClient>();
        // var botService = scope.ServiceProvider.GetRequiredService<TelegramBotService>();

        // Удаляем текущий webhook, чтобы использовать polling
        try
        {
            await botClient.DeleteWebhook();
            _logger.LogInformation("Webhook deleted, switching to polling mode");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting webhook");
        }

        var receiverOptions = new ReceiverOptions()
        {
            AllowedUpdates = Array.Empty<UpdateType>()
        };

        // Настраиваем обработку обновлений
        var updateHandler = new Func<ITelegramBotClient, Update, CancellationToken, Task>(HandleUpdateAsync);
        var errorHandler = new Func<ITelegramBotClient, Exception, CancellationToken, Task>(HandleErrorAsync);

        _logger.LogInformation("Starting bot polling...");
        
        try
        {
            // Запускаем получение обновлений
             botClient.StartReceiving(
                updateHandler: updateHandler,
                errorHandler: errorHandler,
                receiverOptions: receiverOptions,
                cancellationToken: stoppingToken
            );
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in bot receiving");
        }

        async Task HandleUpdateAsync(ITelegramBotClient bot, Update update, CancellationToken cancellationToken)
        {
            try
            {
                _logger.LogInformation("Received update ID: {UpdateId}, Type: {UpdateType}", update.Id, update.Type);
                using var scope = _serviceProvider.CreateScope();
                var botService = scope.ServiceProvider.GetRequiredService<TelegramBotService>();
                await botService.HandleUpdateAsync(update);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error handling update");
            }
        }

        Task HandleErrorAsync(ITelegramBotClient bot, Exception exception, CancellationToken cancellationToken)
        {
            _logger.LogError(exception, "Error in bot client");
            return Task.CompletedTask;
        }

        // _logger.LogInformation("Starting bot polling...");
        
        // try
        // {
        //     // Запускаем получение обновлений
        //     await botClient.StartReceiving(
        //         cancellationToken: stoppingToken
        //     );
        // }
        // catch (Exception ex)
        // {
        //     _logger.LogError(ex, "Error in bot receiving");
        // }

        _logger.LogInformation("Telegram Bot Background Service is stopping.");
    }
}