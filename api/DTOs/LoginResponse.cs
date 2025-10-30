using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Models;

namespace api.DTOs
{
    public class LoginResponse
    {
        public User User { get; set; } = new User();
        public string Token { get; set; } = string.Empty;
        public int ExpiresIn { get; set; } = 0;
        public string RefreshToken { get; set; } = string.Empty;
    }
}
