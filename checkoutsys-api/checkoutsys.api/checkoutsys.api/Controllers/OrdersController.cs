using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using checkoutsys.api.Models;
using Microsoft.AspNetCore.Authorization;
using System.Data;
using System.Globalization;

namespace checkoutsys.api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly CheckoutSystemContext _context;

        public OrdersController(CheckoutSystemContext context)
        {
            _context = context;
        }

        // GET: api/Orders
        [HttpGet]
        public async Task<ActionResult<Order>> GetOrder(long id)
        {
            var order = await _context.Orders.FindAsync(id);

            if (order == null)
            {
                return NotFound();
            }

            return Ok(order);
        }

        // GET: api/Orders/GetIncomplete/5
        [HttpGet("GetIncomplete/{id}"), Authorize(Roles = "customer")]
        public async Task<ActionResult<Order>> GetIncompleteOrder(long id)
        {
            List<Order> dbLst = await _context.Orders.ToListAsync();
            foreach (var order in dbLst)
                if (order.CustomerId == id && order.IsCompleted == "false") return Ok(order);

            return NotFound("No valid orders found.");
        }

        // PUT: api/Orders/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}"), Authorize(Roles = "customer")]
        public async Task<IActionResult> PutOrder(long id, Order order)
        {
            if (id != order.Id)
            {
                return NotFound("Order id does not match.");
            }

            _context.Entry(order).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OrderExists(id))
                {
                    return NotFound("Order not found.");
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Orders
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost, Authorize(Roles = "customer")]
        public async Task<ActionResult<Order>> PostOrder(AddOrderRequest request)
        {
            Order order = new Order();
            order.CustomerId = request.CustomerId;
            order.Date = request.Date;
            order.IsCompleted = request.IsCompleted;

            _context.Add(order);

            await _context.SaveChangesAsync();

            return CreatedAtAction("GetOrder", new { id = order.Id }, order);
        }

        private bool OrderExists(long id)
        {
            return _context.Orders.Any(e => e.Id == id);
        }
    }
}
