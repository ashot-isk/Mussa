using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MussaApi.Data;
using MussaApi.Models;

namespace MussaApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IWebHostEnvironment _environment;

    public ProductsController(ApplicationDbContext context, IWebHostEnvironment environment)
    {
        _context = context;
        _environment = environment;
    }

    // GET: api/products
    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<object>>> GetProducts()
    {
        var products = await _context.Products
            .Include(p => p.Category)
            .ToListAsync();
        
        // Return products with simplified category info to avoid circular references
        return Ok(products.Select(p => new
        {
            p.Id,
            p.Name,
            p.Description,
            p.Price,
            p.ImageUrl,
            p.Stock,
            p.CategoryId,
            p.IsFeatured,
            p.IsAvailable,
            p.CreatedAt,
            p.UpdatedAt,
            CategoryName = p.Category != null ? p.Category.Name : null
        }));
    }

    // GET: api/products/5
    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<ActionResult<object>> GetProduct(Guid id)
    {
        var product = await _context.Products
            .Include(p => p.Category)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (product == null)
        {
            return NotFound();
        }

        // Return product with simplified category info
        return Ok(new
        {
            product.Id,
            product.Name,
            product.Description,
            product.Price,
            product.ImageUrl,
            product.Stock,
            product.CategoryId,
            product.IsFeatured,
            product.IsAvailable,
            product.CreatedAt,
            product.UpdatedAt,
            CategoryName = product.Category?.Name
        });
    }

    // POST: api/products
    [HttpPost]
    [Authorize]
    public async Task<ActionResult<Product>> PostProduct(Product product)
    {
        product.Id = Guid.NewGuid();
        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);
    }

    // PUT: api/products/5
    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> PutProduct(Guid id, Product product)
    {
        if (id != product.Id)
        {
            return BadRequest();
        }

        _context.Entry(product).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!ProductExists(id))
            {
                return NotFound();
            }

            throw;
        }

        return NoContent();
    }

    // DELETE: api/products/5
    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> DeleteProduct(Guid id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null)
        {
            return NotFound();
        }

        _context.Products.Remove(product);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // POST: api/products/{id}/upload-image
    [HttpPost("{id}/upload-image")]
    [Authorize]
    public async Task<IActionResult> UploadProductImage(Guid id, IFormFile? file)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null)
        {
            return NotFound();
        }

        if (file == null || file.Length == 0)
        {
            return BadRequest("No file uploaded.");
        }

        var uploadsFolder = Path.Combine(_environment.WebRootPath, "images");
        if (!Directory.Exists(uploadsFolder))
        {
            Directory.CreateDirectory(uploadsFolder);
        }

        var uniqueFileName = Guid.NewGuid() + "_" + file.FileName;
        var filePath = Path.Combine(uploadsFolder, uniqueFileName);

        await using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        var imageUrl = $"/images/{uniqueFileName}";
        product.ImageUrl = imageUrl;
        product.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return Ok(new { imageUrl, productId = id });
    }

    private bool ProductExists(Guid id)
    {
        return _context.Products.Any(e => e.Id == id);
    }
}