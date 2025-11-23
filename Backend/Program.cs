using Backend.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// 1. Banco de Dados
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

// 2. Configuração JWT (NOVO)
// MUDE PARA ISTO (Chave Longa):
var key = Encoding.ASCII.GetBytes(builder.Configuration["Jwt:Key"] ?? "EstaEUmaChaveSuperSecretaComMaisDe32Caracteres123456"); builder.Services.AddAuthentication(x =>
{
    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(x =>
{
    x.RequireHttpsMetadata = false;
    x.SaveToken = true;
    x.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = false,
        ValidateAudience = false
    };
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 3. CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});

var app = builder.Build();

// 4. Migration Automática
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    try
    {
        // db.Database.Migrate();
        db.Database.EnsureCreated(); // <--- COLOQUE ESSA. Ela cria tudo que falta.
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Erro ao criar banco: {ex.Message}");
    }

}

app.UseSwagger();
app.UseSwaggerUI();

app.UseCors("AllowAll");

// 5. Ordem Importante: Autenticação antes de Autorização
app.UseAuthentication(); // <--- Quem é você?
app.UseAuthorization();  // <--- O que você pode fazer?

app.MapControllers();

app.Run();