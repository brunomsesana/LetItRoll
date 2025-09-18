using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
    public class LoginResponse
    {
        public string Email { get; set; }
        public string Token { get; set; }
        public int ExpiresIn { get; set; }
        public LoginResponse(string email, string token, int expiresIn)
        {
            Email = email;
            Token = token;
            ExpiresIn = expiresIn;
        }
    }
}