using CampusEats.Api.Data;
using CampusEats.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CampusEats.Api.Controllers;

[ApiController]
public class MenuController(CampusEatsDbContext db, ILogger<MenuController> logger) : ControllerBase
{
    // Simple public endpoint used for smoke-testing a deployment:
    // GET https://<api-host>/api/menu
    [HttpGet("api/menu")]
    public async Task<IEnumerable<MenuItem>> GetAll() =>
        await db.MenuItems.AsNoTracking().OrderBy(m => m.Name).ToListAsync();

    // Paged/filtered list used by the React MenuPage. Keeps the same query
    // shape the Lab 02 frontend used with json-server, so the frontend only
    // had to change its base URL.
    [HttpGet("api/menuItems")]
    public async Task<IEnumerable<MenuItem>> Search(
        [FromQuery(Name = "q")] string? search,
        [FromQuery] string? category,
        [FromQuery(Name = "_page")] int page = 1,
        [FromQuery(Name = "_limit")] int pageSize = 6)
    {
        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 50);

        var query = db.MenuItems.AsNoTracking();
        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(m => EF.Functions.ILike(m.Name, $"%{search}%"));
        if (!string.IsNullOrWhiteSpace(category) && category != "All")
            query = query.Where(m => m.Category == category);

        var total = await query.CountAsync();
        Response.Headers["X-Total-Count"] = total.ToString();

        return await query.OrderBy(m => m.Name)
            .Skip((page - 1) * pageSize).Take(pageSize)
            .ToListAsync();
    }

    public record FavouriteUpdate(bool IsFavourite);

    [HttpPatch("api/menuItems/{id:int}")]
    public async Task<ActionResult<MenuItem>> SetFavourite(int id, FavouriteUpdate body)
    {
        var item = await db.MenuItems.FindAsync(id);
        if (item is null) return NotFound();

        item.IsFavourite = body.IsFavourite;
        await db.SaveChangesAsync();
        logger.LogInformation("Menu item {Id} favourite set to {Fav}", id, body.IsFavourite);
        return item;
    }
}
