namespace MussaApi.Models;

public class ProductMaterial
{
    public Guid ProductId { get; set; }
    public Product Product { get; set; } = null!;

    public int MaterialId { get; set; }
    public Material Material { get; set; } = null!;

    public int Quantity { get; set; }
}
