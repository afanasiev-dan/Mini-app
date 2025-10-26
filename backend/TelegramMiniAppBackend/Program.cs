using Microsoft.EntityFrameworkCore;
using Telegram.Bot;
using TelegramMiniAppBackend.Data;
using TelegramMiniAppBackend.Models;
using TelegramMiniAppBackend.Services;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors();

// Токен бота — из переменной окружения или appsettings.json
var botToken = Environment.GetEnvironmentVariable("BOT_TOKEN") ?? builder.Configuration["BotToken"];
if (string.IsNullOrWhiteSpace(botToken))
    throw new InvalidOperationException("BOT_TOKEN не задан в переменных окружения или appsettings.json");

// Регистрация TelegramBotClient как singleton
builder.Services.AddSingleton<TelegramBotClient>(_ => new TelegramBotClient(botToken));

// Регистрация нашего сервиса
builder.Services.AddScoped<TelegramBotService>();

// Настройка SQLite
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=app.db"));

var app = builder.Build();
app.UseCors(policy => policy
    .WithOrigins("*") // или "*" для теста
    .AllowAnyHeader()
    .AllowAnyMethod()
);

// Создаём БД при старте
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    context.Database.EnsureCreated();
}

var logger = app.Services.GetRequiredService<ILogger<Program>>();

// --- Endpoints ---
app.MapGet("/api/live", async () =>
{
    return Results.Ok("i'm ok");
});

app.MapPost("/api/orders", async (
    AppDbContext db,
    TelegramBotService botService,
    HttpRequest request) =>
{
    try
    {
        using var reader = new StreamReader(request.Body);
        var body = await reader.ReadToEndAsync();
        var json = System.Text.Json.JsonDocument.Parse(body);
        var root = json.RootElement;

        if (!root.TryGetProperty("userId", out var userIdElem))
            return Results.BadRequest("userId обязателен");

        var userId = userIdElem.GetInt64();
        var type = root.TryGetProperty("type", out var t) ? t.GetString() ?? "buy" : "buy";
        var currency = root.TryGetProperty("currency", out var c) ? c.GetString() ?? "USDT" : "USDT";
        var bank = root.TryGetProperty("bank", out var b) ? b.GetString() ?? "Т-Банк" : "Т-Банк";
        var amount = root.TryGetProperty("amount", out var a) ? decimal.Parse(a.GetString() ?? "0") : 0;
        var contactInfo = root.TryGetProperty("contactInfo", out var ci) ? ci.GetString() ?? "" : "";

        var order = new Order
        {
            UserId = userId,
            Type = type,
            Currency = currency,
            Bank = bank,
            Amount = amount,
            ContactInfo = contactInfo,
            Status = "active",
            CreatedAt = DateTime.UtcNow
        };

        db.Orders.Add(order);
        await db.SaveChangesAsync();

        await botService.NotifyNewOrder(order);

        logger.LogInformation("Ордер обработа и отправлен в телеграм");

        return Results.Ok(new { id = order.Id });
    }
    catch (System.Exception ex)
    {
        logger.LogError($"Ошибка при обработке ордера: {ex.Message}");
        throw;
    }
});

app.MapGet("/api/orders/user/{userId}", async (AppDbContext db, long userId) =>
{
    var orders = await db.Orders
        .Where(o => o.UserId == userId)
        .OrderByDescending(o => o.CreatedAt)
        .Take(20)
        .ToListAsync();

    logger.LogInformation("Ордера получены");
    return Results.Ok(orders);
});

app.MapPost("/api/notify-here", async (AppDbContext db, HttpRequest request) =>
{
    using var reader = new StreamReader(request.Body);
    var body = await reader.ReadToEndAsync();
    var json = System.Text.Json.JsonDocument.Parse(body);
    var root = json.RootElement;

    if (!root.TryGetProperty("chatId", out var chatIdElem))
        return Results.BadRequest("chatId обязателен");

    var chatId = chatIdElem.GetInt64();
    var title = root.TryGetProperty("title", out var t) ? t.GetString() : null;

    var existing = await db.NotificationChats.FindAsync(chatId);
    if (existing == null)
    {
        db.NotificationChats.Add(new NotificationChat
        {
            ChatId = chatId,
            Title = title
        });
        await db.SaveChangesAsync();
    }

    return Results.Ok(new { success = true });
});

app.Run();
