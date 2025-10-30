using System.Security.Claims;
using api.DTOs;
using api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SistemaController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SistemaController(AppDbContext context)
        {
            _context = context;
        }

        [Authorize]
        [HttpPost()]
        public async Task<IActionResult> SaveSystem(SistemaRequest sistema)
        {
            var sistemaModel = new Sistema
            {
                Id = Guid.NewGuid().ToString(),
                Nome = sistema.Nome,
                Criador = User
                    .Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)
                    ?.Value!,
                Campos = sistema.Campos,
            };
            _context.Sistemas.Add(sistemaModel);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Sistema salvo com sucesso", id = sistemaModel.Id });
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSystem(string id, SistemaRequest sistema)
        {
            var sistemaModel = await _context.Sistemas.FirstOrDefaultAsync(s => s.Id == id);
            if (sistemaModel == null)
            {
                return NotFound(new { message = "Sistema não encontrado" });
            }
            if (
                User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value
                != sistemaModel.Criador
            )
            {
                return Unauthorized(
                    new { message = "Você não pode alterar o sistema de outro usuário" }
                );
            }
            sistemaModel.Nome = sistema.Nome;
            sistemaModel.Campos = sistema.Campos;
            await _context.SaveChangesAsync();
            return Ok(new { message = "Sistema atualizado com sucesso" });
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSystem(string id)
        {
            var sistemaModel = await _context.Sistemas.FirstOrDefaultAsync(s => s.Id == id);
            if (sistemaModel == null)
            {
                return NotFound(new { message = "Sistema não encontrado" });
            }
            if (
                User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value
                != (sistemaModel.Criador)
            )
            {
                return Unauthorized(
                    new { message = "Você não pode alterar o sistema de outro usuário" }
                );
            }
            _context.Sistemas.Remove(sistemaModel);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Sistema deletado com sucesso" });
        }

        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetSystem(string id)
        {
            var sistemaModel = await _context.Sistemas.FirstOrDefaultAsync(s => s.Id == id);
            if (sistemaModel == null)
            {
                return NotFound(new { message = "Sistema não encontrado" });
            }
            return Ok(sistemaModel);
        }
    }
}
