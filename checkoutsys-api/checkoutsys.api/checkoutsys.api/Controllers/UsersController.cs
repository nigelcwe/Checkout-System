using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using checkoutsys.api.Models;
using NuGet.Protocol;

namespace checkoutsys.api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly CheckoutSystemContext _context;

        public UsersController(CheckoutSystemContext context)
        {
            _context = context;
        }

        // GET: api/Users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return await _context.Users.ToListAsync();
        }

        // GET: api/Users/byId/5
        [HttpGet("byId/{id}")]
        public async Task<ActionResult<User>> GetUser(long id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        // GET: api/Users/byUsername/5
        [HttpGet("byUsername/{username}")]
        private async Task<ActionResult<User>> GetUserByUsername(string username)
        {
            List<User> dbLst = await _context.Users.ToListAsync();
            foreach (var user in dbLst)
                if (user.Username == username) return Ok(user);

            return NotFound();
        }

        // POST: api/Users/login
        [HttpPost("login")]
        public async Task<ActionResult<User>> LoginUser(UserLoginRequest loginDetails)
        {
            Boolean usernameFound = false;
            List<User> dbLst = await _context.Users.ToListAsync();
            foreach (var user in dbLst)
                if (user.Username == loginDetails.Username)
                {
                    usernameFound = true;
                    if (user.Password == loginDetails.Password)
                        return Ok(user);
                }

            if (usernameFound)
                return BadRequest("Wrong username or password was provided.");
            else return NotFound();
        }

        // PUT: api/Users/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(long id, User user)
        {
            if (id != user.Id)
            {
                return BadRequest();
            }

            _context.Entry(user).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
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

        // POST: api/Users
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<User>> PostUser(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetUser", new { id = user.Id }, user);
        }

        // POST: api/Users/Register
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost("register")]
        public async Task<ActionResult<User>> RegisterUser(RegisterUserRequest newUserDetails)
        {
            List<User> dbLst = await _context.Users.ToListAsync();

            foreach (var dbUser in dbLst)
            {
                if (dbUser.Username == newUserDetails.Username)
                    return BadRequest("Username is already in use.");
                else if (dbUser.Email == newUserDetails.Email)
                    return BadRequest("Email is already in use.");
            }

            User user = new User();
            user.Name = newUserDetails.Name;
            user.Username = newUserDetails.Username;
            user.Email = newUserDetails.Email;
            user.Password = newUserDetails.Password;
            user.Role = "customer";

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetUser", new { id = user.Id }, user);
        }

        // DELETE: api/Users/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(long id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UserExists(long id)
        {
            return _context.Users.Any(e => e.Id == id);
        }
    }
}
