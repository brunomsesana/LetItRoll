using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
    public class Sistema
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string Criador { get; set; } = string.Empty;
        public List<Campo> Campos { get; set; } = new();
    }
}