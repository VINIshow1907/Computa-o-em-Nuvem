namespace Backend.Models;

public class Sale
{
    public int Id { get; set; }
    public DateTime Date { get; set; } = DateTime.UtcNow; // Data atual automática
    public int ClientId { get; set; } // Quem comprou?
    public decimal Total { get; set; }

    // Lista de itens desta venda
    public List<SaleItem> Items { get; set; } = new();
}