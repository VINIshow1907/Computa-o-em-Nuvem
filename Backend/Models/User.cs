namespace Backend.Models;
public class User
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty; // Em produção, usaríamos Hash!
    public string Role { get; set; } = string.Empty; // "admin" ou "vendedor"
}