using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.DTOs
{
    public class UserDTO
    {
        public string Name { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public UserDTO()
        {
            Name = string.Empty;
            LastName = string.Empty;
            Email = string.Empty;
        }
    }
}