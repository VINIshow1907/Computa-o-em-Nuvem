using Backend.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[Authorize]
[ApiController]
[Route("api/stats")]
public class StatsController : ControllerBase
{
    private readonly AppDbContext _context;

    public StatsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetSummary()
    {
        // Consultas otimizadas (Count e Sum executam direto no banco)
        var totalClients = await _context.Clients.CountAsync();
        var totalProducts = await _context.Products.CountAsync();
        var totalSalesValue = await _context.Sales.SumAsync(s => s.Total);

        return Ok(new
        {
            clients = totalClients,
            products = totalProducts,
            sales = totalSalesValue
        });
    }
}