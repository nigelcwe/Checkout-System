using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using checkoutsys.api.Models;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authorization;

namespace checkoutsys.api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly CheckoutSystemContext _context;

        public ProductsController(CheckoutSystemContext context)
        {
            _context = context;
        }

        // GET: api/Products/valid
        [HttpGet("valid"), Authorize(Roles = "customer")]
        public async Task<ActionResult<Product>> GetValidProducts()
        {
            List<Product> dbLst = await _context.Products.ToListAsync();
            List<Product> validLst = new List<Product>();
            foreach (var product in dbLst)
                if (product.Stock > 0) validLst.Add(product);

            return Ok(validLst);
        }

        // GET: api/Products/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(long id)
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null)
            {
                return NotFound();
            }

            return product;
        }

        // GET: api/Products/byUser
        [HttpGet("byUserId/{id}"), Authorize(Roles = "admin")]
        public async Task<ActionResult<Product>> GetProductsByUser(long id)
        {
            List<Product> dbLst = await _context.Products.ToListAsync();
            List<Product> productLst = new List<Product>();
            foreach (var product in dbLst)
                if (product.AdminId == id) productLst.Add(product);

            if (productLst.IsNullOrEmpty()) return NotFound("No products found.");
            else return Ok(productLst);
        }

        // PUT: api/Products/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}"), Authorize(Roles = "admin")]
        public async Task<IActionResult> PutProduct(long id, PutProductRequest req)
        {
            var product = await _context.Products.FindAsync(id);

            if (product != null)
            {
                product.Name = req.Name;
                product.Details = req.Details;
                product.Price = req.Price;
                product.Stock = req.Stock;

                await _context.SaveChangesAsync();

                return Ok(product);
            }

            return NotFound();
        }

        // PUT: api/Products/PutStock/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("PutStock/{id}"), Authorize]
        public async Task<IActionResult> PutProductStock(long id, PutProductStockRequest req)
        {
            var product = await _context.Products.FindAsync(id);

            if (product != null)
            {
                product.Stock = req.Stock;

                await _context.SaveChangesAsync();

                return Ok(product);
            }

            return NotFound();
        }

        // PUT: api/Products/DecreaseStock/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("DecreaseStock/{id}"), Authorize(Roles = "customer")]
        public async Task<IActionResult> DecreaseProductStock(long id)
        {
            var product = await _context.Products.FindAsync(id);

            if (product != null)
            {
                product.Stock --;

                await _context.SaveChangesAsync();

                return Ok(product);
            }

            return NotFound();
        }

        // POST: api/Products
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost, Authorize(Roles = "admin")]
        public async Task<ActionResult<Product>> PostProduct(AddProductRequest request)
        {
            Product product = new Product();
            product.AdminId = request.AdminId;
            product.Name = request.Name;
            product.Details = request.Details;
            product.Price = request.Price;
            product.Stock = request.Stock;

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetProduct", new { id = product.Id }, product);
        }

        private bool ProductExists(long id)
        {
            return _context.Products.Any(e => e.Id == id);
        }
    }
}
