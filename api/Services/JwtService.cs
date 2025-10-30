using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using api.DTOs;
using api.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace api.Services
{
    public class JwtService
    {
        private readonly AppDbContext _dbContext;
        private readonly IConfiguration _configuration;

        public JwtService(AppDbContext dbContext, IConfiguration configuration)
        {
            _dbContext = dbContext;
            _configuration = configuration;
        }

        public async Task<LoginResponse?> Authenticate(LoginRequest request)
        {
            if (
                string.IsNullOrWhiteSpace(request.EmailOrUsername)
                || string.IsNullOrWhiteSpace(request.Password)
            )
                return null;

            var user = await _dbContext.Users.FirstOrDefaultAsync(u =>
                u.Email == request.EmailOrUsername
            );
            if (user == null)
                user = await _dbContext.Users.FirstOrDefaultAsync(u =>
                    u.Username == request.EmailOrUsername
                );
            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.Password))
                return null;

            return await GenerateJWTToken(user);
        }

        public async Task<LoginResponse> GenerateJWTToken(User user)
        {
            var issuer = _configuration["Jwt:Issuer"];
            var audience = _configuration["Jwt:Audience"];
            var key = _configuration["Jwt:Key"];
            var tokenValidityMins = _configuration.GetValue<int>("Jwt:TokenValidityMins");
            var tokenExpiryTimeStamp = DateTime.UtcNow.AddMinutes(tokenValidityMins);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()), // Id do usuário
                new Claim(ClaimTypes.Name, user.Username),
            };
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = tokenExpiryTimeStamp,
                Issuer = issuer,
                Audience = audience,
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(Encoding.ASCII.GetBytes(key!)),
                    SecurityAlgorithms.HmacSha512Signature
                ),
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var securityToken = tokenHandler.CreateToken(tokenDescriptor);
            var accessToken = tokenHandler.WriteToken(securityToken);

            return new LoginResponse
            {
                User = user,
                Token = accessToken,
                ExpiresIn = (int)tokenExpiryTimeStamp.Subtract(DateTime.UtcNow).TotalSeconds,
                RefreshToken = await GenerateRefreshToken(user.Id),
            };
        }

        private async Task<string> GenerateRefreshToken(string userId)
        {
            var refreshTokenValidityDays = _configuration.GetValue<int>(
                "Jwt:RefreshTokenValidityDays"
            );
            var refreshToken = new RefreshToken
            {
                Token = Guid.NewGuid().ToString(),
                ExpiresIn = DateTime.UtcNow.AddDays(refreshTokenValidityDays),
                UserId = userId,
            };
            await _dbContext.RefreshTokens.AddAsync(refreshToken);
            try
            {
                await _dbContext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                // Token já foi removido (chamada duplicada ou corrida)
                // Não há problema, apenas segue.
            }

            _dbContext.Entry(refreshToken).State = EntityState.Detached;

            return refreshToken.Token;
        }

        public async Task<LoginResponse?> ValidateRefreshToken(string token)
        {
            var refreshToken = await _dbContext
                .RefreshTokens.AsNoTracking()
                .FirstOrDefaultAsync(r => r.Token == token);
            if (refreshToken == null || refreshToken.ExpiresIn < DateTime.UtcNow)
                return null;
            _dbContext.RefreshTokens.Remove(refreshToken);
            try
            {
                await _dbContext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                // Token já foi removido (chamada duplicada ou corrida)
                // Não há problema, apenas segue.
            }

            var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == refreshToken.UserId);
            if (user == null)
                return null;

            return await GenerateJWTToken(user);
        }
    }
}
