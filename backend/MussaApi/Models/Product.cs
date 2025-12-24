namespace MussaApi.Models;

public class Product
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public int Stock { get; set; }
    public Guid? CategoryId { get; set; }
    public bool IsFeatured { get; set; } = false;
    public bool IsAvailable { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation property
    public Category? Category { get; set; }
    public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
}