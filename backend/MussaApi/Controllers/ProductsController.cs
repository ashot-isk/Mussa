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
            .Include(p => p.ProductFlowers)
                .ThenInclude(pf => pf.Flower)
            .Include(p => p.ProductMaterials)
                .ThenInclude(pm => pm.Material)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (product == null)
        {
            return NotFound();
        }

        // Return product with simplified category info and components
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
            CategoryName = product.Category?.Name,
            Flowers = product.ProductFlowers.Select(pf => new
            {
                pf.FlowerId,
                FlowerName = pf.Flower.Name,
                pf.Quantity,
                UnitPrice = pf.Flower.UnitPrice
            }),
            Materials = product.ProductMaterials.Select(pm => new
            {
                pm.MaterialId,
                MaterialName = pm.Material.Name,
                pm.Quantity,
                UnitPrice = pm.Material.UnitPrice
            })
        });
    }

    // POST: api/products
    [HttpPost]
    [Authorize]
    public async Task<ActionResult<object>> PostProduct(ProductCreateDto productDto)
    {
        var product = new Product
        {
            Id = Guid.NewGuid(),
            Name = productDto.Name,
            Description = productDto.Description,
            Price = productDto.Price,
            ImageUrl = productDto.ImageUrl ?? string.Empty,
            Stock = productDto.Stock,
            CategoryId = productDto.CategoryId,
            IsFeatured = productDto.IsFeatured,
            IsAvailable = productDto.IsAvailable,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Products.Add(product);

        // Add flowers to product
        if (productDto.Flowers != null && productDto.Flowers.Any())
        {
            foreach (var flower in productDto.Flowers)
            {
                var productFlower = new ProductFlower
                {
                    ProductId = product.Id,
                    FlowerId = flower.FlowerId,
                    Quantity = flower.Quantity
                };
                _context.ProductFlowers.Add(productFlower);

                // Decrease flower stock (multiply by product stock quantity)
                var flowerEntity = await _context.Flowers.FindAsync(flower.FlowerId);
              
                if (flowerEntity != null)
                {
                    flowerEntity.StockQuantity -= flower.Quantity * product.Stock;
                }
            }
        }

        // Add materials to product
        if (productDto.Materials != null && productDto.Materials.Any())
        {
            foreach (var material in productDto.Materials)
            {
                var productMaterial = new ProductMaterial
                {
                    ProductId = product.Id,
                    MaterialId = material.MaterialId,
                    Quantity = material.Quantity
                };
                _context.ProductMaterials.Add(productMaterial);

                // Decrease material stock (convert cm to meters and multiply by product stock)
                var materialEntity = await _context.Materials.FindAsync(material.MaterialId);
                if (materialEntity != null)
                {
                    // Material stock is in meters, quantity is in cm, so divide by 100
                    // Multiply by product stock quantity
                    materialEntity.StockQuantity -= ((decimal)material.Quantity / 100m) * product.Stock;
                }
            }
        }

        await _context.SaveChangesAsync();

        var result = new
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
            product.UpdatedAt
        };

        return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, result);
    }

    // PUT: api/products/5
    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> PutProduct(Guid id, ProductCreateDto productDto)
    {
        var product = await _context.Products
            .Include(p => p.ProductFlowers)
            .Include(p => p.ProductMaterials)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (product == null)
        {
            return NotFound();
        }

        // Restore stock for old flowers and materials before updating (multiply by old stock)
        var oldStock = product.Stock;
        foreach (var oldFlower in product.ProductFlowers)
        {
            var flowerEntity = await _context.Flowers.FindAsync(oldFlower.FlowerId);
            if (flowerEntity != null)
            {
                flowerEntity.StockQuantity += oldFlower.Quantity * oldStock;
            }
        }

        foreach (var oldMaterial in product.ProductMaterials)
        {
            var materialEntity = await _context.Materials.FindAsync(oldMaterial.MaterialId);
            if (materialEntity != null)
            {
                // Material stock is in meters, quantity is in cm
                materialEntity.StockQuantity += ((decimal)oldMaterial.Quantity / 100m) * oldStock;
            }
        }

        // Remove old flower and material associations
        _context.ProductFlowers.RemoveRange(product.ProductFlowers);
        _context.ProductMaterials.RemoveRange(product.ProductMaterials);

        // Update product basic info
        product.Name = productDto.Name;
        product.Description = productDto.Description;
        product.Price = productDto.Price;
        product.Stock = productDto.Stock;
        product.CategoryId = productDto.CategoryId;
        product.IsFeatured = productDto.IsFeatured;
        product.IsAvailable = productDto.IsAvailable;
        product.UpdatedAt = DateTime.UtcNow;

        // Add new flowers (multiply by new stock)
        if (productDto.Flowers != null && productDto.Flowers.Any())
        {
            foreach (var flower in productDto.Flowers)
            {
                var productFlower = new ProductFlower
                {
                    ProductId = product.Id,
                    FlowerId = flower.FlowerId,
                    Quantity = flower.Quantity
                };
                _context.ProductFlowers.Add(productFlower);

                // Decrease flower stock (multiply by new product stock)
                var flowerEntity = await _context.Flowers.FindAsync(flower.FlowerId);
                if (flowerEntity != null)
                {
                    flowerEntity.StockQuantity -= flower.Quantity * productDto.Stock;
                }
            }
        }

        // Add new materials (multiply by new stock)
        if (productDto.Materials != null && productDto.Materials.Any())
        {
            foreach (var material in productDto.Materials)
            {
                var productMaterial = new ProductMaterial
                {
                    ProductId = product.Id,
                    MaterialId = material.MaterialId,
                    Quantity = material.Quantity
                };
                _context.ProductMaterials.Add(productMaterial);

                // Decrease material stock (convert cm to meters and multiply by new product stock)
                var materialEntity = await _context.Materials.FindAsync(material.MaterialId);
                if (materialEntity != null)
                {
                    // Material stock is in meters, quantity is in cm, so divide by 100
                    materialEntity.StockQuantity -= ((decimal)material.Quantity / 100m) * productDto.Stock;
                }
            }
        }

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

public class ProductCreateDto
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string? ImageUrl { get; set; }
    public int Stock { get; set; }
    public Guid? CategoryId { get; set; }
    public bool IsFeatured { get; set; } = false;
    public bool IsAvailable { get; set; } = true;
    public List<ProductFlowerDto>? Flowers { get; set; }
    public List<ProductMaterialDto>? Materials { get; set; }
}

public class ProductFlowerDto
{
    public int FlowerId { get; set; }
    public int Quantity { get; set; }
}

public class ProductMaterialDto
{
    public int MaterialId { get; set; }
    public int Quantity { get; set; }
}
