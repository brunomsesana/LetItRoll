using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using api.DTOs;

namespace api.Models
{
    public class Sistema
    {
        public string Id { get; set; } = string.Empty;
        public string Nome { get; set; } = string.Empty;
        public string Criador { get; set; } = string.Empty;
        public string CamposJson { get; set; } = "[]";

        [NotMapped]
        public List<Campo> Campos
        {
            get =>
                string.IsNullOrEmpty(CamposJson)
                    ? new List<Campo>()
                    : JsonSerializer.Deserialize<List<Campo>>(CamposJson)!;
            set => CamposJson = JsonSerializer.Serialize(value);
        }
    }
}
