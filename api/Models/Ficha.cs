using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
    public class Ficha
    {
        public int id { get; set; }
        public string personagem { get; set; } = string.Empty;
        public string user { get; set; } = string.Empty;
    }
}