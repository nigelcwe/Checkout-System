using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using checkoutsys.api.Models;
using NuGet.Protocol;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Authorization;

namespace checkoutsys.api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly CheckoutSystemContext _context;
        private readonly IConfiguration _configuration;


        public UsersController(CheckoutSystemContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // GET: api/Users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return await _context.Users.ToListAsync();
        }

        // GET: api/Users/byId/5
        [HttpGet("byId/{id}")]
        public async Task<ActionResult<SafeUser>> GetUser(long id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            var safeUser = new SafeUser();
            safeUser.Id = user.Id;
            safeUser.Name = user.Name;
            safeUser.Username = user.Username;
            safeUser.Email = user.Email;
            safeUser.Role = user.Role;

            return Ok(safeUser);
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

        // GET: api/Users/byToken/{token}
        [HttpGet("byToken/{token}")]
        public async Task<ActionResult<SafeUser>> GetUserFromToken(string token)
        {
            var safeUser = new SafeUser();
            var clientToken = new JwtSecurityTokenHandler().ReadJwtToken(token);
            List<Claim> claimLst = clientToken.Payload.Claims.ToList();

            foreach (Claim tokenClaim in claimLst)
            {
                if (tokenClaim.Type == ClaimTypes.SerialNumber)
                    safeUser.Id = Convert.ToInt64(tokenClaim.Value);
                else if (tokenClaim.Type == ClaimTypes.Name)
                    safeUser.Name = tokenClaim.Value;
                else if (tokenClaim.Type == ClaimTypes.NameIdentifier)
                    safeUser.Username = tokenClaim.Value;
                else if (tokenClaim.Type == ClaimTypes.Email)
                    safeUser.Email = tokenClaim.Value;
                else if (tokenClaim.Type == ClaimTypes.Role)
                    safeUser.Role = tokenClaim.Value;
            }

            return Ok(safeUser);
        }

        // POST: api/Users/Register
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost("register")]
        public async Task<ActionResult<SafeUser>> Register(RegisterUserRequest request)
        {
            List<User> dbLst = await _context.Users.ToListAsync();

            foreach (var dbUser in dbLst)
            {
                if (dbUser.Username == request.Username)
                    return BadRequest("Username is already in use.");
                else if (dbUser.Email == request.Email)
                    return BadRequest("Email is already in use.");
            }

            CreatePasswordHash(request.Password, out byte[] passwordHash, out byte[] passwordSalt);

            User user = new User();
            user.Name = request.Name;
            user.Username = request.Username;
            user.Email = request.Email;
            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt;
            user.Role = "customer";

            SafeUser safeUser = new SafeUser();
            safeUser.Name = user.Name;
            safeUser.Username = user.Username;
            safeUser.Email = user.Email;
            safeUser.Role = user.Role;

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetUser", new { id = user.Id }, safeUser);
        }

        // POST: api/Users/login
        [HttpPost("login")]
        public async Task<ActionResult<string>> Login(UserLoginRequest request)
        {
            List<User> dbLst = await _context.Users.ToListAsync();
            foreach (var user in dbLst)
            {
                if (user.Username == request.Username && VerifyPasswordHash(request.Password, user.PasswordHash, user.PasswordSalt))
                {
                    string token = CreateToken(user);
                    return Ok(token);
                }
            }
            return BadRequest("Wrong username or password.");
        }

        private bool UserExists(long id)
        {
            return _context.Users.Any(e => e.Id == id);
        }

        private string CreateToken(User user)
        {
            List<Claim> claimLst = new List<Claim>
            {
                new Claim(ClaimTypes.SerialNumber, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Name),
                new Claim(ClaimTypes.NameIdentifier, user.Username),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role),
            };

            var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(
                _configuration.GetSection("AppSettings:Token").Value));

            var cred = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var token = new JwtSecurityToken(
                claims: claimLst,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: cred);

            var jwt = new JwtSecurityTokenHandler().WriteToken(token);

            return jwt;
        }

        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }

        private bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt)
        {
            using (var hmac = new HMACSHA512(passwordSalt))
            {
                var computeHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                return computeHash.SequenceEqual(passwordHash);
            }
        }
    }
}
