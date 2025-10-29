using Microsoft.EntityFrameworkCore;
using TelegramMiniAppBackend.Data;
using TelegramMiniAppBackend.Models;

namespace TelegramMiniAppBackend.Services
{
    public class ClientService
    {
        private readonly AppDbContext _dbContext;

        public ClientService(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        // Check if user exists in database
        public async Task<bool> ClientExistsAsync(long telegramId)
        {
            return await _dbContext.Clients.AnyAsync(c => c.TelegramId == telegramId);
        }

        // Add user to database
        public async Task<ClientModel> AddClientAsync(ClientModel client)
        {
            _dbContext.Clients.Add(client);
            await _dbContext.SaveChangesAsync();
            return client;
        }

        // Update user values
        public async Task<ClientModel?> UpdateClientAsync(long telegramId, ClientModel updatedClient)
        {
            var existingClient = await _dbContext.Clients.FirstOrDefaultAsync(c => c.TelegramId == telegramId);
            if (existingClient == null)
            {
                return null;
            }

            existingClient.Username = updatedClient.Username;
            existingClient.FullName = updatedClient.FullName;

            await _dbContext.SaveChangesAsync();
            return existingClient;
        }

        // Get client by TelegramId
        public async Task<ClientModel?> GetClientAsync(long telegramId)
        {
            return await _dbContext.Clients.FirstOrDefaultAsync(c => c.TelegramId == telegramId);
        }

        // Create or update client
        public async Task<ClientModel> CreateOrUpdateClientAsync(ClientModel client)
        {
            var existingClient = await _dbContext.Clients.FirstOrDefaultAsync(c => c.TelegramId == client.TelegramId);
            
            if (existingClient != null)
            {
                // Update existing client
                existingClient.Username = client.Username;
                existingClient.FullName = client.FullName;
                
                await _dbContext.SaveChangesAsync();
                return existingClient;
            }
            else
            {
                // Create new client
                _dbContext.Clients.Add(client);
                await _dbContext.SaveChangesAsync();
                return client;
            }
        }
    }
}