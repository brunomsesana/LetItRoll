using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public User()
        {
            Id = 0;
            Name = string.Empty;
            LastName = string.Empty;
            Email = string.Empty;
            Password = string.Empty;
        }
    }
}