using Backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace Backend.Data;

public class AppDbContext : DbContext
{
    // Este construtor é OBRIGATÓRIO para resolver o erro "não contém um construtor que aceita 1 argumento"
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }
    public DbSet<Product> Products { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<Client> Clients { get; set; }
}