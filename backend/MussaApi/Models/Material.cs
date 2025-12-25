namespace MussaApi.Models;

public class Material
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int StockQuantity { get; set; }
    public decimal UnitPrice { get; set; }
    public string? ImageUrl { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    // Navigation property
    public ICollection<ProductMaterial> ProductMaterials { get; set; } = new List<ProductMaterial>();
}
