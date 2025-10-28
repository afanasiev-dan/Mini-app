using Microsoft.EntityFrameworkCore;
using TelegramMiniAppBackend.Models;

namespace TelegramMiniAppBackend.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<ClientModel> Users => Set<ClientModel>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<NotificationChat> NotificationChats => Set<NotificationChat>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<ClientModel>().HasKey(u => u.TelegramId);
        modelBuilder.Entity<NotificationChat>().HasKey(n => n.ChatId);
    }
}
