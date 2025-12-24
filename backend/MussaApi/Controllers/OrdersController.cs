using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MussaApi.Data;
using MussaApi.Models;

namespace MussaApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public OrdersController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/orders
    [HttpGet]
    [Authorize(Roles = "Supervisor")]
    public async Task<ActionResult<IEnumerable<Order>>> GetOrders()
    {
        return await _context.Orders
            .Include(o => o.Customer)
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();
    }

    // GET: api/orders/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Order>> GetOrder(Guid id)
    {
        var order = await _context.Orders
            .Include(o => o.Customer)
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
            .FirstOrDefaultAsync(o => o.Id == id);

        if (order == null)
        {
            return NotFound();
        }

        return order;
    }

    // POST: api/orders
    [HttpPost]
    public async Task<ActionResult<Order>> PostOrder(CreateOrderRequest request)
    {
        // Create or find customer
        var customer = await _context.Customers
            .FirstOrDefaultAsync(c => c.Email == request.Customer.Email);

        if (customer == null)
        {
            customer = new Customer
            {
                Id = Guid.NewGuid(),
                FullName = request.Customer.FullName,
                Email = request.Customer.Email,
                Phone = request.Customer.Phone,
                Address = request.Customer.Address ?? string.Empty,
                City = request.Customer.City ?? string.Empty
            };
            _context.Customers.Add(customer);
        }
        else
        {
            // Update customer info
            customer.FullName = request.Customer.FullName;
            customer.Phone = request.Customer.Phone;
            customer.Address = request.Customer.Address ?? customer.Address;
            customer.City = request.Customer.City ?? customer.City;
            customer.UpdatedAt = DateTime.UtcNow;
        }

        // Create order
        var order = new Order
        {
            Id = Guid.NewGuid(),
            CustomerId = customer.Id,
            DeliveryAddress = request.DeliveryAddress,
            DeliveryDate = request.DeliveryDate,
            DeliveryTime = request.DeliveryTime ?? string.Empty,
            Notes = request.Notes ?? string.Empty,
            PaymentMethod = request.PaymentMethod ?? "Cash",
            Status = "Pending"
        };

        // Create order items and calculate total
        decimal totalAmount = 0;
        foreach (var item in request.Items)
        {
            var product = await _context.Products.FindAsync(item.ProductId);
            if (product == null || product.Stock < item.Quantity)
            {
                return BadRequest($"Product {item.ProductId} not available or insufficient stock");
            }

            var orderItem = new OrderItem
            {
                Id = Guid.NewGuid(),
                ProductId = item.ProductId,
                Quantity = item.Quantity,
                UnitPrice = product.Price,
                Subtotal = product.Price * item.Quantity
            };

            order.OrderItems.Add(orderItem);
            totalAmount += orderItem.Subtotal;

            // Update product stock
            product.Stock -= item.Quantity;
            product.UpdatedAt = DateTime.UtcNow;
        }

        order.TotalAmount = totalAmount;
        _context.Orders.Add(order);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, order);
    }

    // PUT: api/orders/5/status
    [HttpPut("{id}/status")]
    [Authorize(Roles = "Supervisor")]
    public async Task<IActionResult> UpdateOrderStatus(Guid id, UpdateOrderStatusRequest request)
    {
        var order = await _context.Orders.FindAsync(id);
        if (order == null)
        {
            return NotFound();
        }

        order.Status = request.Status;
        order.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    // PUT: api/orders/5/payment
    [HttpPut("{id}/payment")]
    [Authorize(Roles = "Supervisor")]
    public async Task<IActionResult> UpdatePaymentStatus(Guid id, bool isPaid)
    {
        var order = await _context.Orders.FindAsync(id);
        if (order == null)
        {
            return NotFound();
        }

        order.IsPaid = isPaid;
        order.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: api/orders/5
    [HttpDelete("{id}")]
    [Authorize(Roles = "Supervisor")]
    public async Task<IActionResult> DeleteOrder(Guid id)
    {
        var order = await _context.Orders
            .Include(o => o.OrderItems)
            .FirstOrDefaultAsync(o => o.Id == id);

        if (order == null)
        {
            return NotFound();
        }

        // Restore product stock
        foreach (var item in order.OrderItems)
        {
            var product = await _context.Products.FindAsync(item.ProductId);
            if (product != null)
            {
                product.Stock += item.Quantity;
                product.UpdatedAt = DateTime.UtcNow;
            }
        }

        _context.Orders.Remove(order);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}

public class CreateOrderRequest
{
    public CustomerRequest Customer { get; set; } = null!;
    public List<OrderItemRequest> Items { get; set; } = new();
    public string DeliveryAddress { get; set; } = string.Empty;
    public DateTime? DeliveryDate { get; set; }
    public string? DeliveryTime { get; set; }
    public string? Notes { get; set; }
    public string? PaymentMethod { get; set; }
}

public class CustomerRequest
{
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string? Address { get; set; }
    public string? City { get; set; }
}

public class OrderItemRequest
{
    public Guid ProductId { get; set; }
    public int Quantity { get; set; }
}

public class UpdateOrderStatusRequest
{
    public string Status { get; set; } = string.Empty;
}
