using System.Security.Claims;
using api.DTOs;
using api.Models;
using api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
            // Validações básicas
            if (_context.Users.Any(u => u.Email == register.Email))
                return BadRequest(new { message = "Email já cadastrado." });

            if (_context.Users.Any(u => u.Username == register.Username))
                return BadRequest(new { message = "Username já cadastrado." });

            if (register.Password != register.ConfirmPassword)
                return BadRequest(new { message = "As senhas não coincidem." });

            // Cria usuário
            var user = new User
            {
                Id = Guid.NewGuid().ToString(),
                Name = register.Name,
                LastName = register.LastName,
                Email = register.Email,
                Username = register.Username,
                Password = BCrypt.Net.BCrypt.HashPassword(register.Password),
                Admin = false,
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Gera tokens diretamente
            var tokens = await _jwtService.GenerateJWTToken(user);

            // Define cookies HttpOnly
            Response.Cookies.Append(
                "access_token",
                tokens.Token!,
                new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.Strict,
                    Expires = DateTime.UtcNow.AddMinutes(30),
                }
            );

            Response.Cookies.Append(
                "refresh_token",
                tokens.RefreshToken!,
                new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.Strict,
                    Expires = DateTime.UtcNow.AddDays(30),
                }
            );
            var userRes = new UserDTO
            {
                Name = user.Name,
                LastName = user.LastName,
                Username = user.Username,
                Email = user.Email,
            };

            return Ok(new { user = userRes, message = "Usuário registrado e logado com sucesso" });
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest login)
        {
            var result = await _jwtService.Authenticate(login);

            if (result is null || result.Token is null)
            {
                return Unauthorized();
            }

            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddMinutes(30),
            };

            Response.Cookies.Append("access_token", result.Token, cookieOptions);
            Response.Cookies.Append(
                "refresh_token",
                result.RefreshToken,
                new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.Strict,
                    Expires = DateTime.UtcNow.AddDays(30),
                }
            );
            var userRes = new UserDTO
            {
                Name = result.User.Name,
                LastName = result.User.LastName,
                Username = result.User.Username,
                Email = result.User.Email,
            };

            return Ok(new { user = userRes, message = "Login realizado com sucesso" });
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

        [Authorize]
        [HttpGet("{username}")]
        public async Task<IActionResult> GetUser(string username)
        {
            var currentUsername = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;
            var currentUser = await _context.Users.FirstOrDefaultAsync(u =>
                u.Username == currentUsername
            );
            if (username != currentUsername && (currentUser == null || !currentUser.Admin))
            {
                return Unauthorized(
                    new { message = "Você não tem acesso a informações de outros usuários" }
                );
            }
            User? userOg = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
            if (userOg == null)
            {
                return NotFound(new { message = "Usuário não encontrado" });
            }
            UserDTO user = new UserDTO
            {
                Name = userOg.Name,
                LastName = userOg.LastName,
                Username = userOg.Username,
                Email = userOg.Email,
            };
            return Ok(user);
        }

        [AllowAnonymous]
        [HttpPost("refresh")]
        public async Task<ActionResult<LoginResponse>> Refresh()
        {
            if (!Request.Cookies.TryGetValue("refresh_token", out var refreshToken))
                return Unauthorized();
            if (string.IsNullOrWhiteSpace(refreshToken))
                return BadRequest("Invalid Token");

            var result = await _jwtService.ValidateRefreshToken(refreshToken);
            if (result is null)
            {
                return Unauthorized();
            }
            if (
                string.IsNullOrWhiteSpace(result.Token)
                || string.IsNullOrWhiteSpace(result.RefreshToken)
            )
                return StatusCode(500, "Erro ao gerar tokens");
            Response.Cookies.Append(
                "access_token",
                result.Token,
                new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.Strict,
                    Expires = DateTime.UtcNow.AddMinutes(30),
                }
            );

            Response.Cookies.Append(
                "refresh_token",
                result.RefreshToken,
                new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.Strict,
                    Expires = DateTime.UtcNow.AddDays(30),
                }
            );
            var userRes = new UserDTO
            {
                Name = result.User.Name,
                LastName = result.User.LastName,
                Username = result.User.Username,
                Email = result.User.Email,
            };

            return Ok(new { user = userRes, message = "Tokens atualizados" });
        }

        [Authorize]
        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            // Tenta obter o refresh token do cookie
            if (!Request.Cookies.TryGetValue("refresh_token", out var refreshToken))
                return BadRequest(new { message = "Nenhum token encontrado" });

            // Remove o refresh token do banco (invalida)
            var storedToken = await _context.RefreshTokens.FirstOrDefaultAsync(r =>
                r.Token == refreshToken
            );
            if (storedToken != null)
            {
                _context.RefreshTokens.Remove(storedToken);
                await _context.SaveChangesAsync();
            }

            // Remove os cookies no cliente
            Response.Cookies.Delete("access_token");
            Response.Cookies.Delete("refresh_token");

            return Ok(new { message = "Logout realizado com sucesso" });
        }
    }
}
