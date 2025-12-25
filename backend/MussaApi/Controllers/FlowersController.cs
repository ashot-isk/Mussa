using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MussaApi.Data;
using MussaApi.Models;
using Npgsql;

namespace MussaApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FlowersController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public FlowersController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/flowers
    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<object>>> GetFlowers()
    {
        var flowers = await _context.Flowers
            .Select(f => new
            {
                f.Id,
                f.Name,
                f.Description,
                f.StockQuantity,
                f.UnitPrice,
                f.ImageUrl,
                f.CreatedAt,
                f.UpdatedAt
            })
            .ToListAsync();

        return Ok(flowers);
    }

    // GET: api/flowers/5
    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<ActionResult<object>> GetFlower(int id)
    {
        var flower = await _context.Flowers
            .Where(f => f.Id == id)
            .Select(f => new
            {
                f.Id,
                f.Name,
                f.Description,
                f.StockQuantity,
                f.UnitPrice,
                f.ImageUrl,
                f.CreatedAt,
                f.UpdatedAt
            })
            .FirstOrDefaultAsync();

        if (flower == null)
        {
            return NotFound();
        }

        return Ok(flower);
    }

    // POST: api/flowers
    [Authorize(Roles = "Admin,Supervisor")]
    [HttpPost]
    public async Task<ActionResult<object>> PostFlower(FlowerDto flowerDto)
    {
        var flower = new Flower
        {
            Name = flowerDto.Name,
            Description = flowerDto.Description,
            StockQuantity = flowerDto.StockQuantity,
            UnitPrice = flowerDto.UnitPrice,
            ImageUrl = flowerDto.ImageUrl,
            CreatedAt = DateTime.UtcNow
        };

        _context.Flowers.Add(flower);
        await _context.SaveChangesAsync();

        var result = new
        {
            flower.Id,
            flower.Name,
            flower.Description,
            flower.StockQuantity,
            flower.UnitPrice,
            flower.ImageUrl,
            flower.CreatedAt,
            flower.UpdatedAt
        };

        return CreatedAtAction(nameof(GetFlower), new { id = flower.Id }, result);
    }

    // PUT: api/flowers/5
    [Authorize(Roles = "Admin,Supervisor")]
    [HttpPut("{id}")]
    public async Task<ActionResult<object>> PutFlower(int id, FlowerDto flowerDto)
    {
        var flower = await _context.Flowers.FindAsync(id);
        if (flower == null)
        {
            return NotFound();
        }

        flower.Name = flowerDto.Name;
        flower.Description = flowerDto.Description;
        flower.StockQuantity = flowerDto.StockQuantity;
        flower.UnitPrice = flowerDto.UnitPrice;
        flower.ImageUrl = flowerDto.ImageUrl;
        flower.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        var result = new
        {
            flower.Id,
            flower.Name,
            flower.Description,
            flower.StockQuantity,
            flower.UnitPrice,
            flower.ImageUrl,
            flower.CreatedAt,
            flower.UpdatedAt
        };

        return Ok(result);
    }

    // DELETE: api/flowers/5
    [Authorize(Roles = "Admin,Supervisor")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteFlower(int id)
    {
        var flower = await _context.Flowers.FindAsync(id);
        if (flower == null)
        {
            return NotFound();
        }

        const string inUseMessage = "This flower is used by one or more products. Remove it from those products before deleting it.";
        if (await _context.ProductFlowers.AnyAsync(pf => pf.FlowerId == id))
        {
            return Conflict(new { message = inUseMessage });
        }

        _context.Flowers.Remove(flower);
        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException ex) when (ex.InnerException is PostgresException
        {
            SqlState: PostgresErrorCodes.ForeignKeyViolation,
            ConstraintName: "FK_ProductFlowers_Flowers_FlowerId"
        })
        {
            // A product may have started using this flower after the check.
            return Conflict(new { message = inUseMessage });
        }

        return NoContent();
    }
}

public class FlowerDto
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int StockQuantity { get; set; }
    public decimal UnitPrice { get; set; }
    public string? ImageUrl { get; set; }
}
