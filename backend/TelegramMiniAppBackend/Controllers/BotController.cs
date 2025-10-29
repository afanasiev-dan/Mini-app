using Microsoft.AspNetCore.Mvc;
using Telegram.Bot;
using Telegram.Bot.Types;
using TelegramMiniAppBackend.Services;

namespace TelegramMiniAppBackend.Controllers;

[ApiController]
[Route("api/bot")]
public class BotController : ControllerBase
{
    private readonly TelegramBotService _botService;
    private readonly ILogger<BotController> _logger;

    public BotController(TelegramBotService botService, ILogger<BotController> logger)
    {
        _botService = botService;
        _logger = logger;
    }

    [HttpPost("webhook")]
    public async Task<IActionResult> HandleUpdate([FromBody] Update update)
    {
        if (update == null)
        {
            _logger.LogWarning("Received null update");
            return Ok();
        }

        try
        {
            _logger.LogInformation("Received update ID: {UpdateId}, Type: {UpdateType}", update.Id, update.Type);
            
            // Добавим логирование деталей обновления
            if (update.Message != null)
            {
                _logger.LogInformation("Message text: {MessageText}, From: {FromUser}", 
                    update.Message.Text, 
                    update.Message.From?.Username ?? update.Message.From?.Id.ToString());
            }
            
            await _botService.HandleUpdateAsync(update);
            return Ok();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing update: {UpdateId}, Type: {UpdateType}", update.Id, update.Type);
            return BadRequest();
        }
    }

    [HttpGet("webhook-info")]
    public async Task<IActionResult> GetWebhookInfo()
    {
        try
        {
            var botClient = HttpContext.RequestServices.GetRequiredService<Telegram.Bot.TelegramBotClient>();
            var webhookInfo = await botClient.GetWebhookInfo();
            return Ok(webhookInfo);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting webhook info");
            return StatusCode(500, new { error = ex.Message });
        }
    }

    [HttpPost("set-webhook")]
    public async Task<IActionResult> SetWebhook([FromQuery] string? webhookUrl = null)
    {
        try
        {
            var botClient = HttpContext.RequestServices.GetRequiredService<Telegram.Bot.TelegramBotClient>();

            var url = webhookUrl ?? $"{Request.Scheme}://{Request.Host}/api/bot/webhook";

            await botClient.SetWebhook(url);

            return Ok(new { message = "Webhook set successfully", url = url });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error setting webhook");
            return StatusCode(500, new { error = ex.Message });
        }
    }

    [HttpPost("delete-webhook")]
    public async Task<IActionResult> DeleteWebhook()
    {
        try
        {
            var botClient = HttpContext.RequestServices.GetRequiredService<Telegram.Bot.TelegramBotClient>();

            await botClient.DeleteWebhook();

            return Ok(new { message = "Webhook deleted successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting webhook");
            return StatusCode(500, new { error = ex.Message });
        }
    }
}
