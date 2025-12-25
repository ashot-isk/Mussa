namespace MussaApi.Models;

public class ProductFlower
{
    public Guid ProductId { get; set; }
    public Product Product { get; set; } = null!;

    public int FlowerId { get; set; }
    public Flower Flower { get; set; } = null!;

    public int Quantity { get; set; }
}
