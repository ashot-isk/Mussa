using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MussaApi.Data;
using MussaApi.Models;

namespace MussaApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MaterialsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public MaterialsController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/materials
    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<object>>> GetMaterials()
    {
        var materials = await _context.Materials
            .Select(m => new
            {
                m.Id,
                m.Name,
                m.Description,
                m.StockQuantity,
                m.UnitPrice,
                m.ImageUrl,
                m.CreatedAt,
                m.UpdatedAt
            })
            .ToListAsync();

        return Ok(materials);
    }

    // GET: api/materials/5
    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<ActionResult<object>> GetMaterial(int id)
    {
        var material = await _context.Materials
            .Where(m => m.Id == id)
            .Select(m => new
            {
                m.Id,
                m.Name,
                m.Description,
                m.StockQuantity,
                m.UnitPrice,
                m.ImageUrl,
                m.CreatedAt,
                m.UpdatedAt
            })
            .FirstOrDefaultAsync();

        if (material == null)
        {
            return NotFound();
        }

        return Ok(material);
    }

    // POST: api/materials
    [Authorize(Roles = "Admin,Supervisor")]
    [HttpPost]
    public async Task<ActionResult<object>> PostMaterial(MaterialDto materialDto)
    {
        var material = new Material
        {
            Name = materialDto.Name,
            Description = materialDto.Description,
            StockQuantity = materialDto.StockQuantity,
            UnitPrice = materialDto.UnitPrice,
            ImageUrl = materialDto.ImageUrl,
            CreatedAt = DateTime.UtcNow
        };

        _context.Materials.Add(material);
        await _context.SaveChangesAsync();

        var result = new
        {
            material.Id,
            material.Name,
            material.Description,
            material.StockQuantity,
            material.UnitPrice,
            material.ImageUrl,
            material.CreatedAt,
            material.UpdatedAt
        };

        return CreatedAtAction(nameof(GetMaterial), new { id = material.Id }, result);
    }

    // PUT: api/materials/5
    [Authorize(Roles = "Admin,Supervisor")]
    [HttpPut("{id}")]
    public async Task<ActionResult<object>> PutMaterial(int id, MaterialDto materialDto)
    {
        var material = await _context.Materials.FindAsync(id);
        if (material == null)
        {
            return NotFound();
        }

        material.Name = materialDto.Name;
        material.Description = materialDto.Description;
        material.StockQuantity = materialDto.StockQuantity;
        material.UnitPrice = materialDto.UnitPrice;
        material.ImageUrl = materialDto.ImageUrl;
        material.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        var result = new
        {
            material.Id,
            material.Name,
            material.Description,
            material.StockQuantity,
            material.UnitPrice,
            material.ImageUrl,
            material.CreatedAt,
            material.UpdatedAt
        };

        return Ok(result);
    }

    // DELETE: api/materials/5
    [Authorize(Roles = "Admin,Supervisor")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteMaterial(int id)
    {
        var material = await _context.Materials.FindAsync(id);
        if (material == null)
        {
            return NotFound();
        }

        _context.Materials.Remove(material);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}

public class MaterialDto
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int StockQuantity { get; set; }
    public decimal UnitPrice { get; set; }
    public string? ImageUrl { get; set; }
}
