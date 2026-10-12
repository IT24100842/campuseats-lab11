using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace CampusEats.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController(IConfiguration config) : ControllerBase
{
    public record DemoUser(string Name, string StudentId, string Role);
    public record LoginRequest(string Role);
    public record LoginResponse(string Token, DemoUser User);

    // Demo accounts (same as the Lab 02 frontend). The token is a real JWT
    // signed with Jwt__Key, which comes from an environment variable in production.
    static readonly Dictionary<string, DemoUser> Users = new()
    {
        ["student"] = new("Kasun Perera", "IT22045678", "student"),
        ["admin"] = new("Canteen Admin", "STAFF001", "admin"),
    };

    [HttpPost("login")]
    public ActionResult<LoginResponse> Login(LoginRequest request)
    {
        if (!Users.TryGetValue(request.Role, out var user)) return Unauthorized();

        var jwt = config.GetSection("Jwt");
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt["Key"]!));
        var token = new JwtSecurityToken(
            issuer: jwt["Issuer"],
            audience: jwt["Audience"],
            claims:
            [
                new Claim(ClaimTypes.Name, user.Name),
                new Claim(ClaimTypes.Role, user.Role),
                new Claim("studentId", user.StudentId),
            ],
            expires: DateTime.UtcNow.AddHours(2),
            signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256));

        return new LoginResponse(new JwtSecurityTokenHandler().WriteToken(token), user);
    }
}
