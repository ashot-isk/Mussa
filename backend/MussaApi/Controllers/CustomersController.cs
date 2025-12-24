using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MussaApi.Data;
using MussaApi.Models;

namespace MussaApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CustomersController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public CustomersController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/customers
    [HttpGet]
    [Authorize(Roles = "Supervisor")]
    public async Task<ActionResult<IEnumerable<Customer>>> GetCustomers()
    {
        return await _context.Customers
            .Include(c => c.Orders)
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync();
    }

    // GET: api/customers/5
    [HttpGet("{id}")]
    [Authorize(Roles = "Supervisor")]
    public async Task<ActionResult<Customer>> GetCustomer(Guid id)
    {
        var customer = await _context.Customers
            .Include(c => c.Orders)
                .ThenInclude(o => o.OrderItems)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (customer == null)
        {
            return NotFound();
        }

        return customer;
    }

    // GET: api/customers/email/{email}
    [HttpGet("email/{email}")]
    public async Task<ActionResult<Customer>> GetCustomerByEmail(string email)
    {
        var customer = await _context.Customers
            .Include(c => c.Orders)
                .ThenInclude(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product)
            .FirstOrDefaultAsync(c => c.Email == email);

        if (customer == null)
        {
            return NotFound();
        }

        return customer;
    }
}
