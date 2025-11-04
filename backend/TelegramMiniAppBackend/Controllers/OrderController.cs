using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using TelegramMiniAppBackend.Data;
using TelegramMiniAppBackend.Models;
using TelegramMiniAppBackend.Services;

namespace TelegramMiniAppBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrderController : ControllerBase
{
    private readonly AppDbContext db;
    private readonly TelegramBotService botService;
    private readonly ClientService clientService;
    private readonly ILogger<OrderController> logger;

    public OrderController(AppDbContext db, TelegramBotService botService, ClientService clientService, ILogger<OrderController> logger)
    {
        this.db = db;
        this.botService = botService;
        this.clientService = clientService;
        this.logger = logger;
    }

    [HttpPost("buy_order")]
    public async Task<IActionResult> CreateBuyOrder([FromBody] OrderBuyForm userForm)
    {
        try
        {
            if (userForm == null || userForm.UserId == 0)
                return BadRequest("Неверные данные или UserId обязателен");

            // Check if client exists
            bool clientExists = await clientService.ClientExistsAsync(userForm.UserId);
            if (!clientExists)
            {
                logger.LogWarning("Попытка создания ордера пользователем с TelegramId {UserId}, который не зарегистрирован в системе", userForm.UserId);
                return BadRequest("Пользователь не найден в системе. Сначала зарегистрируйтесь.");
            }

            var order = userForm.ToOrder();
            logger.LogInformation("Получен ордер на покупку: {@Order}", userForm);

            db.Orders.Add(order);
            await db.SaveChangesAsync();

            await botService.NotifyNewOrder(order);
            return Ok(order);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Ошибка при создании ордера на покупку");
            return BadRequest("Ошибка сервера");
        }
    }

    [HttpPost("sell_order")]
    public async Task<IActionResult> CreateSellOrder([FromBody] OrderSellForm userForm)
    {
        try
        {
            if (userForm == null || userForm.UserId == 0)
                return BadRequest("Неверные данные или UserId обязателен");

            // Check if client exists
            bool clientExists = await clientService.ClientExistsAsync(userForm.UserId);
            if (!clientExists)
            {
                logger.LogWarning("Попытка создания ордера пользователем с TelegramId {UserId}, который не зарегистрирован в системе", userForm.UserId);
                return BadRequest("Пользователь не найден в системе. Сначала зарегистрируйтесь.");
            }

            var order = userForm.ToOrder();
            logger.LogInformation("Получен ордер на продажу: {@Order}", userForm);

            db.Orders.Add(order);
            await db.SaveChangesAsync();

            await botService.NotifyNewOrder(order);
            return Ok(order);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Ошибка при создании ордера на продажу");
            return BadRequest("Ошибка сервера");
        }
    }

    private string DetermineOrderType(JsonElement orderData)
    {
        // Check if the JSON contains PaymentUserData field (exists only in sell form)
        // Try to get the PaymentUserData property - if it exists, it's a sell order
        try
        {
            if (orderData.ValueKind != JsonValueKind.Object)
                return "buy"; // If it's not an object, default to buy

            if (orderData.TryGetProperty("PaymentUserData", out _))
            {
                return "sell";
            }
        }
        catch
        {
            // If there's an issue accessing properties, default to buy
            return "buy";
        }

        return "buy";
    }

    // Endpoint to update order status
    [HttpPut("order/{id}/status")]
    public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] UpdateOrderStatusRequest request)
    {
        try
        {
            if (request == null || string.IsNullOrEmpty(request.Status))
                return BadRequest("Статус не может быть пустым");

            var order = await db.Orders.FindAsync(id);
            if (order == null)
                return NotFound($"Ордер с ID {id} не найден");

            // Validate that the status is one of the allowed values
            if (request.Status != OrderStatus.Created &&
                request.Status != OrderStatus.InWork &&
                request.Status != OrderStatus.Completed &&
                request.Status != OrderStatus.Canceled)
            {
                return BadRequest($"Неверный статус. Допустимые значения: {OrderStatus.Created}, {OrderStatus.InWork}, {OrderStatus.Completed}, {OrderStatus.Canceled}");
            }

            // Update the status and change timestamp
            order.Status = request.Status;
            order.ChangeAt = DateTime.UtcNow;

            await db.SaveChangesAsync();

            logger.LogInformation("Статус ордера {OrderId} обновлён на {OrderStatus}", id, request.Status);

            return Ok(new
            {
                Id = order.Id,
                Status = order.Status,
                ChangeAt = order.ChangeAt
            });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Ошибка при обновлении статуса ордера {OrderId}", id);
            return BadRequest("Ошибка сервера при обновлении статуса");
        }
    }

    // Endpoint to get all orders
    [HttpGet]
    public async Task<IActionResult> GetOrders()
    {
        try
        {
            var orders = await db.Orders.ToListAsync();
            return Ok(orders);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Ошибка при получении списка ордеров");
            return BadRequest("Ошибка сервера при получении списка ордеров");
        }
    }

    // Endpoint to get order by ID
    [HttpGet("{id}")]
    public async Task<IActionResult> GetOrder(int id)
    {
        try
        {
            var order = await db.Orders.FindAsync(id);
            if (order == null)
                return NotFound($"Ордер с ID {id} не найден");

            return Ok(order);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Ошибка при получении ордера {OrderId}", id);
            return BadRequest("Ошибка сервера при получении ордера");
        }
    }

    [HttpGet("orders/user/{id}")]
    public async Task<IActionResult> GetOrdersByTelegramId(int id)
    {
        try
        {
            var order = await db.Orders.Where(o => o.UserId == id).ToListAsync();
            if (order == null || order.Count() == 0)
                return NotFound($"Ордера для пользователя с TelegramId {id} не найдены");

            return Ok(order);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Ошибка при получении ордера {OrderId}", id);
            return BadRequest("Ошибка сервера при получении ордера");
        }
    }

    [HttpPost("sync")]
    public async Task<IActionResult> GetOrdersByTelegramId(IEnumerable<string> ids)
    {
        try
        {
            var orders = await db.Orders.ToListAsync();
            if (orders == null || orders.Count() == 0)
                return NotFound($"Ордера в базе данных не найдены");

            var ordersToUpdate = orders.Where(o => ids.Contains(o.Id.ToString()));
            foreach (var order in ordersToUpdate)
                order.Sync = true;

            await db.SaveChangesAsync();

            return Ok(orders);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Ошибка при обновление статуса синхронизации ордеров");
            return BadRequest("Ошибка при обновление статуса синхронизации ордеров");
        }
    }
}
