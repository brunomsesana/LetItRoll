using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
    public class LoginRequest
    {
        public string EmailOrUsername { get; set; }
        public string Password { get; set; }

        public LoginRequest()
        {
            EmailOrUsername = string.Empty;
            Password = string.Empty;
        }
    }
}
