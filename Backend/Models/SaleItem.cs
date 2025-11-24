namespace Backend.Models;

public class SaleItem
{
    public int Id { get; set; }
    public int ProductId { get; set; } // O que comprou?
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; } // Preço na época da venda
}