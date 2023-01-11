using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using checkoutsys.api.Models;

namespace checkoutsys.api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderProductsController : ControllerBase
    {
        private readonly CheckoutSystemContext _context;

        public OrderProductsController(CheckoutSystemContext context)
        {
            _context = context;
        }

        // GET: api/OrderProducts
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderProducts>>> GetOrdersProducts()
        {
            return await _context.OrdersProducts.ToListAsync();
        }

        // GET: api/OrderProducts/5
        [HttpGet("{id}")]
        public async Task<ActionResult<OrderProducts>> GetOrderProducts(long id)
        {
            var orderProducts = await _context.OrdersProducts.FindAsync(id);

            if (orderProducts == null)
            {
                return NotFound();
            }

            return orderProducts;
        }

        // PUT: api/OrderProducts/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutOrderProducts(long id, OrderProducts orderProducts)
        {
            if (id != orderProducts.OrderId)
            {
                return BadRequest();
            }

            _context.Entry(orderProducts).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OrderProductsExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/OrderProducts
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<OrderProducts>> PostOrderProducts(OrderProducts orderProducts)
        {
            _context.OrdersProducts.Add(orderProducts);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (OrderProductsExists(orderProducts.OrderId))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetOrderProducts", new { id = orderProducts.OrderId }, orderProducts);
        }

        // DELETE: api/OrderProducts/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrderProducts(long id)
        {
            var orderProducts = await _context.OrdersProducts.FindAsync(id);
            if (orderProducts == null)
            {
                return NotFound();
            }

            _context.OrdersProducts.Remove(orderProducts);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool OrderProductsExists(long id)
        {
            return _context.OrdersProducts.Any(e => e.OrderId == id);
        }
    }
}
