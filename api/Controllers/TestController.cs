// Em algum controller, por exemplo TestController.cs
using api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TestController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TestController(AppDbContext db)
        {
            _context = db;
        }

        [Authorize]
        [HttpGet("dbconnection")]
        public async Task<IActionResult> TestDbConnection()
        {
            try
            {
                // Verifica se o banco responde
                var canConnect = await _context.Database.CanConnectAsync();
                return Ok(new { success = canConnect });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, error = ex.Message });
            }
        }
    }
}
