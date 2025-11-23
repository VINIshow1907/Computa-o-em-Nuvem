using Backend.Data;
using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _configuration;

    public AuthController(AppDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    [HttpPost("login")]
    public async Task<ActionResult<dynamic>> Authenticate([FromBody] User model)
    {
        // 1. Recupera o usuário do banco
        var user = await _context.Users
            .FirstOrDefaultAsync(x => x.Username == model.Username && x.Password == model.Password);

        // 2. Verifica se existe
        if (user == null)
            return NotFound(new { message = "Usuário ou senha inválidos" });

        // 3. Gera o Token
        // Aumentei a chave para ter mais de 32 caracteres
        var secretKey = _configuration["Jwt:Key"] ?? "EstaEUmaChaveSuperSecretaComMaisDe32Caracteres123456"; var token = TokenService.GenerateToken(user, secretKey);

        // 4. Retorna o token para o Frontend
        return new
        {
            user = new { user.Id, user.Username, user.Role },
            token = token
        };
    }

    // Rota auxiliar para criar o primeiro admin (Seed)
    [HttpPost("register-admin")]
    public async Task<IActionResult> RegisterAdmin()
    {
        if (_context.Users.Any()) return BadRequest("Já existem usuários.");

        var admin = new User { Username = "admin", Password = "123", Role = "admin" };
        _context.Users.Add(admin);
        await _context.SaveChangesAsync();
        return Ok("Admin criado com sucesso!");
    }
}