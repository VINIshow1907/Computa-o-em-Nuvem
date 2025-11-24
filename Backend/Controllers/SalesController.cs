using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[Authorize]
[ApiController]
[Route("api/sales")]
public class SalesController : ControllerBase
{
    private readonly AppDbContext _context;

    public SalesController(AppDbContext context)
    {
        _context = context;
    }

    // 1. GET: api/sales (Histórico de Vendas)
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Sale>>> GetSales()
    {
        return await _context.Sales
            .Include(s => s.Items) // Traz os itens
            .OrderByDescending(s => s.Date) // Mais recentes primeiro
            .ToListAsync();
    }

    // 2. GET: api/sales/5 (Detalhes de uma venda específica)
    [HttpGet("{id}")]
    public async Task<ActionResult<Sale>> GetSale(int id)
    {
        var sale = await _context.Sales
            .Include(s => s.Items)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (sale == null) return NotFound();

        return sale;
    }

    // 3. POST: api/sales (Realizar Venda)
    [HttpPost]
    public async Task<ActionResult<Sale>> PostSale(Sale sale)
    {
        if (sale.Items == null || sale.Items.Count == 0)
            return BadRequest("A venda precisa ter itens.");

        sale.Date = DateTime.UtcNow;

        _context.Sales.Add(sale);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetSales), new { id = sale.Id }, sale);
    }

    // 4. DELETE: api/sales/5 (Cancelar Venda)
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteSale(int id)
    {
        var sale = await _context.Sales.FindAsync(id);
        if (sale == null) return NotFound();

        _context.Sales.Remove(sale);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}