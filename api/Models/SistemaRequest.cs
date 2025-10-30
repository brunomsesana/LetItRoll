using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs;

namespace api.Models
{
    public class SistemaRequest
    {
        public string Nome { get; set; } = string.Empty;
        public List<Campo> Campos { get; set; } = new();
    }
}
