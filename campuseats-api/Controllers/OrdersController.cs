using System.Security.Claims;
using CampusEats.Api.Data;
using CampusEats.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CampusEats.Api.Controllers;

[ApiController]
[Route("api/orders")]
[Authorize]
public class OrdersController(CampusEatsDbContext db, ILogger<OrdersController> logger) : ControllerBase
{
    bool IsAdmin => User.IsInRole("admin");
    string? CurrentStudentId => User.FindFirstValue("studentId");

    // Students only ever see their own orders; admins see everything.
    [HttpGet]
    public async Task<IEnumerable<Order>> Get([FromQuery] string? studentId)
    {
        var query = db.Orders.AsNoTracking();
        if (!IsAdmin)
            query = query.Where(o => o.StudentId == CurrentStudentId);
        else if (!string.IsNullOrWhiteSpace(studentId))
            query = query.Where(o => o.StudentId == studentId);

        return await query.OrderByDescending(o => o.PlacedAt).ToListAsync();
    }

    public record StatusUpdate(string Status);

    [HttpPatch("{id:int}")]
    public async Task<ActionResult<Order>> UpdateStatus(int id, StatusUpdate body)
    {
        var order = await db.Orders.FindAsync(id);
        if (order is null) return NotFound();
        if (!IsAdmin && order.StudentId != CurrentStudentId) return Forbid();

        // Students may only cancel their own pending orders.
        if (!IsAdmin && (body.Status != "Cancelled" || order.Status != "Pending"))
            return BadRequest("Only pending orders can be cancelled.");

        order.Status = body.Status;
        await db.SaveChangesAsync();
        logger.LogInformation("Order {Id} status changed to {Status} by {User}", id, body.Status, User.Identity?.Name);
        return order;
    }
}
