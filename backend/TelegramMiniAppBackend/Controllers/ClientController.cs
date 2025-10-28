using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TelegramMiniAppBackend.Data;
using TelegramMiniAppBackend.Models;

namespace TelegramMiniAppBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ClientController : ControllerBase
{
    private readonly AppDbContext db;
    private readonly ILogger<ClientController> logger;

    public ClientController(AppDbContext db, ILogger<ClientController> logger)
    {
        this.db = db;
        this.logger = logger;
    }

    // Create or update a client
    [HttpPost]
    public async Task<IActionResult> CreateClient([FromBody] ClientModel client)
    {
        try
        {
            if (client == null)
                return BadRequest("Неверные данные клиента");

            if (client.TelegramId == 0)
                return BadRequest("TelegramId обязателен для создания клиента");

            // Check if client already exists
            var existingClient = await db.Clients.FirstOrDefaultAsync(c => c.TelegramId == client.TelegramId);
            
            if (existingClient != null)
            {
                // Update existing client
                existingClient.Username = client.Username;
                existingClient.FullName = client.FullName;
                
                await db.SaveChangesAsync();
                
                logger.LogInformation("Клиент с TelegramId {TelegramId} обновлён", client.TelegramId);
                return Ok(new { 
                    Message = "Клиент обновлён", 
                    Client = existingClient 
                });
            }
            else
            {
                // Create new client
                db.Clients.Add(client);
                await db.SaveChangesAsync();
                
                logger.LogInformation("Новый клиент с TelegramId {TelegramId} создан", client.TelegramId);
                return Ok(new { 
                    Message = "Клиент создан", 
                    Client = client 
                });
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Ошибка при создании/обновлении клиента с TelegramId {TelegramId}", client?.TelegramId);
            return BadRequest("Ошибка сервера при создании/обновлении клиента");
        }
    }

    // Check if client exists
    [HttpGet("exists/{telegramId}")]
    public async Task<IActionResult> CheckClientExists(long telegramId)
    {
        try
        {
            if (telegramId == 0)
                return BadRequest("TelegramId обязателен");

            var exists = await db.Clients.AnyAsync(c => c.TelegramId == telegramId);
            
            logger.LogInformation("Проверка существования клиента с TelegramId {TelegramId}: {Exists}", telegramId, exists);
            
            return Ok(new { 
                TelegramId = telegramId,
                Exists = exists
            });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Ошибка при проверке существования клиента с TelegramId {TelegramId}", telegramId);
            return BadRequest("Ошибка сервера при проверке существования клиента");
        }
    }

    // Get client by TelegramId
    [HttpGet("{telegramId}")]
    public async Task<IActionResult> GetClient(long telegramId)
    {
        try
        {
            if (telegramId == 0)
                return BadRequest("TelegramId обязателен");

            var client = await db.Clients.FirstOrDefaultAsync(c => c.TelegramId == telegramId);
            
            if (client == null)
                return NotFound($"Клиент с TelegramId {telegramId} не найден");

            logger.LogInformation("Клиент с TelegramId {TelegramId} получен", telegramId);
            
            return Ok(client);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Ошибка при получении клиента с TelegramId {TelegramId}", telegramId);
            return BadRequest("Ошибка сервера при получении клиента");
        }
    }

    // Get multiple clients with optional filtering
    [HttpGet]
    public async Task<IActionResult> GetClients([FromQuery] string? username = null, [FromQuery] string? fullName = null, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        try
        {
            var query = db.Clients.AsQueryable();

            // Apply filters if provided
            if (!string.IsNullOrEmpty(username))
            {
                query = query.Where(c => c.Username != null && c.Username.Contains(username));
            }

            if (!string.IsNullOrEmpty(fullName))
            {
                query = query.Where(c => c.FullName != null && c.FullName.Contains(fullName));
            }

            // Apply pagination
            var totalCount = await query.CountAsync();
            var clients = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            logger.LogInformation("Получено {Count} клиентов из {TotalCount} всего", clients.Count, totalCount);
            
            return Ok(new
            {
                Clients = clients,
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize,
                TotalPages = (int)Math.Ceiling((double)totalCount / pageSize)
            });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Ошибка при получении списка клиентов");
            return BadRequest("Ошибка сервера при получении списка клиентов");
        }
    }

    // Update client information
    [HttpPut("{telegramId}")]
    public async Task<IActionResult> UpdateClient(long telegramId, [FromBody] ClientModel updatedClient)
    {
        try
        {
            if (updatedClient == null)
                return BadRequest("Неверные данные клиента");

            if (telegramId == 0 || telegramId != updatedClient.TelegramId)
                return BadRequest("TelegramId в URL и в теле запроса должны совпадать");

            var existingClient = await db.Clients.FirstOrDefaultAsync(c => c.TelegramId == telegramId);
            if (existingClient == null)
                return NotFound($"Клиент с TelegramId {telegramId} не найден");

            // Update client properties
            existingClient.Username = updatedClient.Username;
            existingClient.FullName = updatedClient.FullName;

            await db.SaveChangesAsync();

            logger.LogInformation("Клиент с TelegramId {TelegramId} обновлён", telegramId);
            
            return Ok(new { 
                Message = "Клиент обновлён", 
                Client = existingClient 
            });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Ошибка при обновлении клиента с TelegramId {TelegramId}", telegramId);
            return BadRequest("Ошибка сервера при обновлении клиента");
        }
    }

    // Delete client
    [HttpDelete("{telegramId}")]
    public async Task<IActionResult> DeleteClient(long telegramId)
    {
        try
        {
            if (telegramId == 0)
                return BadRequest("TelegramId обязателен");

            var client = await db.Clients.FirstOrDefaultAsync(c => c.TelegramId == telegramId);
            if (client == null)
                return NotFound($"Клиент с TelegramId {telegramId} не найден");

            db.Clients.Remove(client);
            await db.SaveChangesAsync();

            logger.LogInformation("Клиент с TelegramId {TelegramId} удалён", telegramId);
            
            return Ok(new { 
                Message = "Клиент удалён", 
                TelegramId = telegramId 
            });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Ошибка при удалении клиента с TelegramId {TelegramId}", telegramId);
            return BadRequest("Ошибка сервера при удалении клиента");
        }
    }
}