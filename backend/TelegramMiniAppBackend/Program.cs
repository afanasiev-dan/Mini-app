using Microsoft.EntityFrameworkCore;
using Telegram.Bot;
using TelegramMiniAppBackend.Data;
using TelegramMiniAppBackend.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors();
builder.Services.AddControllers();

var botToken = Environment.GetEnvironmentVariable("BOT_TOKEN") ?? builder.Configuration["BotToken"];
if (string.IsNullOrWhiteSpace(botToken))
    throw new InvalidOperationException("BOT_TOKEN не задан в переменных окружения или appsettings.json");

builder.Services.AddSingleton<TelegramBotClient>(_ => new TelegramBotClient(botToken));
builder.Services.AddScoped<TelegramBotService>();
builder.Services.AddScoped<ClientService>();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=app.db"));

// Регистрируем фоновый сервис для бота
builder.Services.AddHostedService<TelegramBotBackgroundService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(policy => policy
    .WithOrigins("*")
    .AllowAnyHeader()
    .AllowAnyMethod()
);

app.MapControllers();

// Создаём БД
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    context.Database.EnsureCreated();
}

app.Run();
