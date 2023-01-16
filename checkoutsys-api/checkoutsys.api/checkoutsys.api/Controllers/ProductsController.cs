using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using checkoutsys.api.Models;
using Microsoft.IdentityModel.Tokens;

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

        // GET: api/Products
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
        {
            return await _context.Products.ToListAsync();
        }

        // GET: api/Products/valid
        [HttpGet("valid")]
        public async Task<ActionResult<Product>> GetValidProducts()
        {
            List<Product> dbLst = await _context.Products.ToListAsync();
            List<Product> validLst = new List<Product>();
            foreach (var product in dbLst)
                if (product.Stock > 0) validLst.Add(product);

            return Ok(validLst);
        }

        // GET: api/Products/5
        [HttpGet("byId/{id}")]
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
        [HttpGet("byUserId/{id}")]
        public async Task<ActionResult<Product>> GetProductsByUser(long id)
        {
            List<Product> dbLst = await _context.Products.ToListAsync();
            List<Product> productLst = new List<Product>();
            foreach (var product in dbLst)
                if (product.AdminId == id) productLst.Add(product);

            if (productLst.IsNullOrEmpty()) return BadRequest("No products found.");
            else return Ok(productLst);
        }

        // PUT: api/Products/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProduct(long id, PutProductRequest putProductRequest)
        {
            var product = await _context.Products.FindAsync(id);

            if (product != null)
            {
                product.Name = putProductRequest.Name;
                product.Details = putProductRequest.Details;
                product.Price = putProductRequest.Price;
                product.Stock = putProductRequest.Stock;

                await _context.SaveChangesAsync();

                return Ok(product);
            }

            return NotFound();
        }

        // PUT: api/Products/PutStock/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("PutStock/{id}")]
        public async Task<IActionResult> PutProductStock(long id, int stock)
        {
            var product = await _context.Products.FindAsync(id);

            if (product != null)
            {
                product.Stock = stock;

                await _context.SaveChangesAsync();

                return Ok(product);
            }

            return NotFound();
        }

        // PUT: api/Products/DecreaseStock/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("DecreaseStock/{id}")]
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
        [HttpPost]
        public async Task<ActionResult<Product>> PostProduct(AddProductRequest addProductRequest)
        {
            Product product = new Product();
            product.AdminId = addProductRequest.AdminId;
            product.Name = addProductRequest.Name;
            product.Details = addProductRequest.Details;
            product.Price = addProductRequest.Price;
            product.Stock = addProductRequest.Stock;

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetProduct", new { id = product.Id }, product);
        }

        // DELETE: api/Products/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(long id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound();
            }

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ProductExists(long id)
        {
            return _context.Products.Any(e => e.Id == id);
        }
    }
}
