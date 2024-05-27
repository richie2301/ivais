using ignis.Domain.Model.PostgreSQL;
using ignis.Domain.Model.RavenDB;
using ignis.Domain.Model.Request;
using ignis.Domain.Model.Response;
using ignis.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Raven.Client.Documents.Session;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;

namespace ignis.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly ILogger<UserController> _logger;
        private readonly DataContext _context;
        private readonly IConfiguration _configuration;
#if DEBUG
        static string Media_Root_Folder = "../../media";
#elif RELEASE
        static string Media_Root_Folder = "media";
#endif
        static string User_Root_Folder = Media_Root_Folder + "/user";

        public UserController(ILogger<UserController> logger, DataContext context, IConfiguration configuration)
        {
            _logger = logger;
            _context = context;
            _configuration = configuration;
        }

        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }

        private string CreateRandomToken()
        {
            return Convert.ToHexString(RandomNumberGenerator.GetBytes(64));
        }

        private bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt)
        {
            using (var hmac = new HMACSHA512(passwordSalt))
            {
                var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                return computedHash.SequenceEqual(passwordHash);
            }
        }

        private string CreateToken(User user)
        {
            List<Claim> claims = new List<Claim>
            {
                new Claim("UserId", user.UserId),
                new Claim("FirstName", user.FirstName),
                new Claim("LastName", user.LastName),
                new Claim("Email", user.Email),
                new Claim("Role", user.Type)
            };

            var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(
                _configuration.GetSection("AppSettings:Token").Value));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: creds);

            var jwt = new JwtSecurityTokenHandler().WriteToken(token);

            return jwt;
        }

        [HttpGet("register/systemadmin")]
        public async Task<ActionResult> RegisterSystemAdmin()
        {
            DateTime dateTime = DateTime.UtcNow;

            if (_context.User.Any(u => u.Type == "SYSTEM ADMIN"))
            {
                return BadRequest("System Admin already exists.");
            }

            CreatePasswordHash("ji7QSHDhnuOEi3P", out byte[] passwordHash, out byte[] passwordSalt);

            User user = new User()
            {
                UserId = string.Join("", Guid.NewGuid().ToString().ToArray()),
                FirstName = "System",
                LastName = "Admin",
                Email = "xitai@gmail.com",
                PasswordHash = passwordHash,
                PasswordSalt = passwordSalt,
                VerificationToken = CreateRandomToken(),
                VerifiedAt = dateTime,
                Type = "SYSTEM ADMIN",
                Status = "ACTIVE",
                CreatedAt = dateTime,
                UpdatedAt = dateTime
            };

            await _context.User.AddAsync(user);

            await _context.SaveChangesAsync();

            return Ok("System Admin registered.");
        }

        [HttpPost("register")]
        public async Task<ActionResult> RegisterUser(RegisterUserRequest request)
        {
            DateTime dateTime = DateTime.UtcNow;

            if (_context.User.Any(u => u.Email == request.email))
            {
                return BadRequest("User already exists.");
            }

            CreatePasswordHash(request.password, out byte[] passwordHash, out byte[] passwordSalt);
            
            User user = new User()
            {
                UserId = string.Join("", Guid.NewGuid().ToString().ToArray()),
                FirstName = request.firstName,
                LastName = request.lastName,
                Email = request.email,
                PasswordHash = passwordHash,
                PasswordSalt = passwordSalt,
                VerificationToken = CreateRandomToken(),
                VerifiedAt = dateTime,
                Type = "OPERATOR",
                Status = "ACTIVE",
                CreatedAt = dateTime,
                UpdatedAt = dateTime
            };

            await _context.User.AddAsync(user);

            await _context.SaveChangesAsync();

            return Ok("User registered.");
        }

        [HttpPost("verify")]
        public async Task<IActionResult> VerifyUser(string token)
        {
            DateTime dateTime = DateTime.UtcNow;

            User? user = await _context.User.FirstOrDefaultAsync(u => u.VerificationToken == token);
            
            if (user == null)
            {
                return BadRequest("Invalid token.");
            }

            user.VerifiedAt = dateTime;
            user.UpdatedAt = dateTime;

            await _context.SaveChangesAsync();

            return Ok("User verified.");
        }

        [HttpPost("login")]
        public async Task<IActionResult> LoginUser(LoginUserRequest request)
        {
            DateTime dateTime = DateTime.UtcNow;

            User? user = await _context.User.FirstOrDefaultAsync(u => u.Email == request.email);

            if (user == null)
            {
                return NotFound("User not found.");
            }

            if (!VerifyPasswordHash(request.password, user.PasswordHash, user.PasswordSalt))
            {
                return BadRequest("Wrong password.");
            }

            if (user.VerifiedAt == null)
            {
                return BadRequest("User not verified.");
            }

            string token = CreateToken(user);

            user.LastLogin = dateTime;
            user.UpdatedAt = dateTime;

            await _context.SaveChangesAsync();

            return Ok(token);
        }

        [HttpGet("systemadmin")]
        public async Task<ActionResult> GetSystemAdmin()
        {
            User? systemAdmin = await _context.User.Where(u => u.Type == "SYSTEM ADMIN").FirstOrDefaultAsync();

            if (systemAdmin == null)
            {
                return NotFound("System Admin not found.");
            }

            return Ok(systemAdmin);
        }

        [HttpGet("GetUserList")]
        public async Task<ActionResult> GetUserList()
        {
            return Ok(_context.User.Select(x => new
            {
                userId = x.UserId,
                name = x.FirstName + " " + x.LastName,
            }).ToList());
        }

        [HttpPut("update/profilepicture")]
        public async Task<ActionResult> UpdateUserProfilePicture([FromForm] UpdateUserProfilePictureRequest request)
        {
            DateTime dateTime = DateTime.UtcNow;

            User? user = await _context.User.FindAsync(request.userId);

            if (user == null)
            {
                return NotFound("User not found.");
            }

            string userDirectory = $"{User_Root_Folder}/{user.UserId}";

            if (!Directory.Exists(userDirectory))
            {
                Directory.CreateDirectory(userDirectory);
            }

            user.ProfilePictureUrl = $"{userDirectory}/{user.UserId}{Path.GetExtension(request.profilePictureFile.FileName)}";

            using (FileStream stream = new FileStream(user.ProfilePictureUrl, FileMode.Create))
            {
                request.profilePictureFile.CopyTo(stream);
            }

            user.UpdatedAt = dateTime;

            await _context.SaveChangesAsync();

            return Ok("Update successful.");
        }

        [HttpGet]
        public async Task<ActionResult> GetUser(string userId)
        {
            User? user = await _context.User.FindAsync(userId);

            if (user == null)
            {
                return NotFound("User not found.");
            }

            return Ok(new GetUserResponse
            {
                userId = user.UserId,
                firstName = user.FirstName,
                lastName = user.LastName,
                name = $"{user.FirstName} {user.LastName}",
                email = user.Email,
                type = user.Type,
                phoneNumber = user.PhoneNumber,
                address = user.Address,
                profilePicture = user.ProfilePictureUrl != null ? Convert.ToBase64String(System.IO.File.ReadAllBytes(user.ProfilePictureUrl)) : null,
                status = user.Status,
                lastLogin = user.LastLogin,
                createdAt = user.CreatedAt,
                updatedAt = user.UpdatedAt
            });
        }
    }
}