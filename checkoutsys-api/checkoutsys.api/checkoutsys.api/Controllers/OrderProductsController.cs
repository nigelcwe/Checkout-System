using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using checkoutsys.api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using System.Data;

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

        // GET: api/OrdersProducts/GetByOrder/5
        [HttpGet("GetByOrder/{id}"), Authorize(Roles = "customer")]
        public async Task<ActionResult<IEnumerable<OrderProducts>>> GetByOrder(long id)
        {
            List<OrderProducts> dbLst = await _context.OrdersProducts.ToListAsync();
            List<OrderProducts> productLst = new List<OrderProducts>();
            foreach (var orderProduct in dbLst)
                if (orderProduct.OrderId == id) productLst.Add(orderProduct);

            if (productLst.IsNullOrEmpty()) return BadRequest("No products in cart.");
            else return Ok(productLst);
        }

        // PUT: api/OrderProducts/PutByOrder/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("PutByOrder/{id}"), Authorize(Roles = "customer")]
        public async Task<IActionResult> PutByOrder(long id, IEnumerable<OrderProducts> newLst)
        {
            List<OrderProducts> dbLst = await _context.OrdersProducts.ToListAsync();
            try
            {
                foreach (var orderProduct in dbLst)
                {
                    if (orderProduct.OrderId == id) _context.OrdersProducts.Remove(orderProduct);
                }

                foreach (var orderProduct in newLst)
                {
                    _context.Add(orderProduct);
                }

                await _context.SaveChangesAsync();

                return Ok();

            } catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        // POST: api/OrderProducts/PostByOrder/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost("PostByOrder/{id}"), Authorize(Roles = "customer")]
        public async Task<IActionResult> PostByOrder(long id, IEnumerable<OrderProducts> newLst)
        {
            List<OrderProducts> dbLst = await _context.OrdersProducts.ToListAsync();

            try
            {
                foreach (var orderProduct in dbLst)
                {
                    if (orderProduct.OrderId == id) return BadRequest("Order data already exists.");
                }

                foreach (var orderProduct in newLst)
                {
                    _context.Add(orderProduct);
                }

                await _context.SaveChangesAsync();

                return Ok();

            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        private bool OrdersProductExists(long id)
        {
            return _context.OrdersProducts.Any(e => e.OrderId == id);
        }
    }
}
