using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using api.DTOs;

namespace api.DTOs
{
    public class SistemaResponse
    {
        public string Id { get; set; } = string.Empty;
        public string Nome { get; set; } = string.Empty;
        public string Criador { get; set; } = string.Empty;
        public List<Campo> Campos { get; set; } = new();
    }
}
