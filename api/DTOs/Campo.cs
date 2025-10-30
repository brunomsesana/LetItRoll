using System.Text.Json.Serialization;
using api.DTOs;

namespace api.DTOs
{
    public class Campo
    {
        [JsonPropertyName("id")]
        public string Id { get; set; } = string.Empty;

        [JsonPropertyName("x")]
        public double X { get; set; }

        [JsonPropertyName("y")]
        public double Y { get; set; }

        [JsonPropertyName("title")]
        public string? Title { get; set; }

        [JsonPropertyName("inputType")]
        public string? InputType { get; set; }

        [JsonPropertyName("placeholder")]
        public string? Placeholder { get; set; }

        [JsonPropertyName("macro")]
        public string? Macro { get; set; }

        [JsonPropertyName("value")]
        public string? Value { get; set; }

        [JsonPropertyName("selectOptions")]
        public List<SelectOption> SelectOptions { get; set; } = new();

        [JsonPropertyName("semFundo")]
        public bool SemFundo { get; set; }

        [JsonPropertyName("corFundo")]
        public string? CorFundo { get; set; }

        [JsonPropertyName("corBorda")]
        public string? CorBorda { get; set; }

        [JsonPropertyName("corTexto")]
        public string? CorTexto { get; set; }

        [JsonPropertyName("corTextoSelected")]
        public string? CorTextoSelected { get; set; }

        [JsonPropertyName("corFundoInput")]
        public string? CorFundoInput { get; set; }

        [JsonPropertyName("corTextoInput")]
        public string? CorTextoInput { get; set; }

        [JsonPropertyName("inputSemFundo")]
        public bool InputSemFundo { get; set; }

        [JsonPropertyName("imagem")]
        public string? Imagem { get; set; }

        [JsonPropertyName("tamanhoImagem")]
        public double? TamanhoImagem { get; set; }

        [JsonPropertyName("layer")]
        public int Layer { get; set; }
    }
}
