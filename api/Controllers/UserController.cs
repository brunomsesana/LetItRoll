using api.DTOs;
using api.Models;
using api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly JwtService _jwtService;

        public UserController(AppDbContext context, JwtService jwtService)
        {
            _context = context;
            _jwtService = jwtService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterRequest register)
        {
            if (_context.Users.Any(u => u.Email == register.Email))
            {
                return BadRequest(new { message = "Email já cadastrado. " });
            }
            var user = new User
            {
                Name = register.Name,
                LastName = register.LastName,
                Email = register.Email,
                Password = BCrypt.Net.BCrypt.HashPassword(register.Password)
            };
            var userDTO = new UserDTO
            {
                Name = user.Name,
                LastName = user.LastName,
                Email = user.Email
            };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            HttpContext.Session.SetString("UserId", user.Id.ToString());
            return Ok(new { message = "Usuário registrado com sucesso", usuario = userDTO });
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest login)
        {
            var result = await _jwtService.Authenticate(login);
            if (result is null)
            {
                return Unauthorized();
            }
            return Ok(result);
            // var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == login.Email);

            // if (user == null)
            // {
            //     return Unauthorized(new { message = "Usuário não encontrado" });
            // }
            // if (!BCrypt.Net.BCrypt.Verify(login.Password, user.Password))
            // {
            //     return Unauthorized(new { message = "Senha incorreta" });
            // }
            // var userDTO = new UserDTO
            // {
            //     Name = user.Name,
            //     LastName = user.LastName,
            //     Email = user.Email
            // };
            // HttpContext.Session.SetString("UserId", user.Id.ToString());
            // return Ok(new { message = "Login realizado com sucesso!", usuario = userDTO });
        }
    }
}