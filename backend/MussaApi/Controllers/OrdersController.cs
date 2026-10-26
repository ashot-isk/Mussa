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
    public async Task<ActionResult<IEnumerable<object>>> GetOrders()
    {
        var orders = await _context.Orders
            .Include(o => o.Customer)
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();

        // Return simplified orders without circular references
        return Ok(orders.Select(o => new
        {
            o.Id,
            o.CustomerId,
            CustomerName = o.Customer.FullName,
            CustomerEmail = o.Customer.Email,
            CustomerPhone = o.Customer.Phone,
            o.TotalAmount,
            o.Status,
            o.DeliveryAddress,
            o.DeliveryDate,
            o.DeliveryTime,
            o.Notes,
            o.PaymentMethod,
            o.IsPaid,
            o.CreatedAt,
            OrderItems = o.OrderItems.Select(oi => new
            {
                oi.Id,
                oi.ProductId,
                ProductName = oi.Product.Name,
                oi.Quantity,
                oi.UnitPrice,
                oi.Subtotal
            }).ToList()
        }));
    }

    // GET: api/orders/5
    [HttpGet("{id}")]
    public async Task<ActionResult<object>> GetOrder(Guid id)
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

        // Return simplified order without circular references
        return Ok(new
        {
            order.Id,
            order.CustomerId,
            CustomerName = order.Customer.FullName,
            CustomerEmail = order.Customer.Email,
            CustomerPhone = order.Customer.Phone,
            order.TotalAmount,
            order.Status,
            order.DeliveryAddress,
            order.DeliveryDate,
            order.DeliveryTime,
            order.Notes,
            order.PaymentMethod,
            order.IsPaid,
            order.CreatedAt,
            OrderItems = order.OrderItems.Select(oi => new
            {
                oi.Id,
                oi.ProductId,
                ProductName = oi.Product.Name,
                oi.Quantity,
                oi.UnitPrice,
                oi.Subtotal
            }).ToList()
        });
    }

    // POST: api/orders
    [HttpPost]
    public async Task<ActionResult<Order>> PostOrder(CreateOrderRequest request)
    {
        if (request.Items.Count == 0 || request.Items.Any(item => item.Quantity <= 0))
        {
            return BadRequest("Your bag must contain products with positive quantities.");
        }

        // Combine repeated product IDs so their total cannot exceed stock.
        var quantities = request.Items.GroupBy(item => item.ProductId)
            .Select(group => new { ProductId = group.Key, Quantity = group.Sum(item => (long)item.Quantity) })
            .OrderBy(item => item.ProductId).ToList();
        if (quantities.Any(item => item.Quantity > int.MaxValue))
        {
            return BadRequest("Requested quantity is too large.");
        }

        // Stock reservations, customer changes and order creation commit together.
        await using var transaction = await _context.Database.BeginTransactionAsync();

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
        foreach (var item in quantities)
        {
            var product = await _context.Products.AsNoTracking()
                .FirstOrDefaultAsync(p => p.Id == item.ProductId);
            if (product == null)
            {
                return BadRequest("A product in your bag is no longer available. Please remove it.");
            }

            var quantity = (int)item.Quantity;
            // Conditional update prevents concurrent orders from overselling.
            var reserved = await _context.Products
                .Where(p => p.Id == item.ProductId && p.IsAvailable && p.Stock >= quantity)
                .ExecuteUpdateAsync(updates => updates
                    .SetProperty(p => p.Stock, p => p.Stock - quantity)
                    .SetProperty(p => p.UpdatedAt, DateTime.UtcNow));
            if (reserved == 0)
            {
                return BadRequest($"{product.Name} is out of stock, unavailable, or has fewer items remaining than requested. Please update your bag.");
            }

            var orderItem = new OrderItem
            {
                Id = Guid.NewGuid(),
                ProductId = item.ProductId,
                Quantity = quantity,
                UnitPrice = product.Price,
                Subtotal = product.Price * quantity
            };

            order.OrderItems.Add(orderItem);
            totalAmount += orderItem.Subtotal;

        }

        order.TotalAmount = totalAmount;
        _context.Orders.Add(order);
        await _context.SaveChangesAsync();

        await transaction.CommitAsync();

        // Return simplified order object without circular references
        var createdOrder = await _context.Orders
            .Include(o => o.Customer)
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
            .FirstOrDefaultAsync(o => o.Id == order.Id);

        if (createdOrder == null)
        {
            return NotFound();
        }

        return CreatedAtAction(nameof(GetOrder), new { id = createdOrder.Id }, new
        {
            createdOrder.Id,
            createdOrder.CustomerId,
            CustomerName = createdOrder.Customer.FullName,
            CustomerEmail = createdOrder.Customer.Email,
            createdOrder.TotalAmount,
            createdOrder.Status,
            createdOrder.DeliveryAddress,
            createdOrder.DeliveryDate,
            createdOrder.DeliveryTime,
            createdOrder.Notes,
            createdOrder.PaymentMethod,
            createdOrder.IsPaid,
            createdOrder.CreatedAt,
            OrderItems = createdOrder.OrderItems.Select(oi => new
            {
                oi.Id,
                oi.ProductId,
                ProductName = oi.Product.Name,
                oi.Quantity,
                oi.UnitPrice,
                oi.Subtotal
            }).ToList()
        });
    }

    // PUT: api/orders/5/status
    [HttpPut("{id}/status")]
    [Authorize(Roles = "Supervisor")]
    public async Task<ActionResult<object>> UpdateOrderStatus(Guid id, UpdateOrderStatusRequest request)
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

        order.Status = request.Status;
        order.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            order.Id,
            order.CustomerId,
            CustomerName = order.Customer.FullName,
            CustomerEmail = order.Customer.Email,
            CustomerPhone = order.Customer.Phone,
            order.TotalAmount,
            order.Status,
            order.DeliveryAddress,
            order.DeliveryDate,
            order.DeliveryTime,
            order.Notes,
            order.PaymentMethod,
            order.IsPaid,
            order.CreatedAt,
            OrderItems = order.OrderItems.Select(oi => new
            {
                oi.Id,
                oi.ProductId,
                ProductName = oi.Product.Name,
                oi.Quantity,
                oi.UnitPrice,
                oi.Subtotal
            }).ToList()
        });
    }

    // PUT: api/orders/5/payment
    [HttpPut("{id}/payment")]
    [Authorize(Roles = "Supervisor")]
    public async Task<ActionResult<object>> UpdatePaymentStatus(Guid id, UpdatePaymentStatusRequest request)
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

        order.IsPaid = request.IsPaid;
        order.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            order.Id,
            order.CustomerId,
            CustomerName = order.Customer.FullName,
            CustomerEmail = order.Customer.Email,
            CustomerPhone = order.Customer.Phone,
            order.TotalAmount,
            order.Status,
            order.DeliveryAddress,
            order.DeliveryDate,
            order.DeliveryTime,
            order.Notes,
            order.PaymentMethod,
            order.IsPaid,
            order.CreatedAt,
            OrderItems = order.OrderItems.Select(oi => new
            {
                oi.Id,
                oi.ProductId,
                ProductName = oi.Product.Name,
                oi.Quantity,
                oi.UnitPrice,
                oi.Subtotal
            }).ToList()
        });
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

public class UpdatePaymentStatusRequest
{
    public bool IsPaid { get; set; }
}
