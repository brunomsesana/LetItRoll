using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DiceController : ControllerBase
    {
        private readonly Dictionary<string, string> _variables = new();
        private readonly List<Rolagem> _rollLogs = new();
        private readonly Random _random = new();

        [HttpGet("roll")]
        public IActionResult Roll(string macro)
        {
            _variables.Clear();
            _rollLogs.Clear();

            string resultadoFinal = ProcessarTexto(macro);

            return Ok(new { resultado = resultadoFinal, rolagens = _rollLogs });
        }

        private string ProcessarTexto(string texto)
        {
            int startIndex = texto.IndexOf('[');
            if (startIndex == -1)
            {
                return ResolverVariaveisEFormulas(texto);
            }

            int endIndex = EncontrarFechamento(texto, startIndex);
            if (endIndex == -1)
            {
                return "ERRO: Colchete de abertura sem fechamento.";
            }

            string conteudoBloco = texto.Substring(startIndex + 1, endIndex - startIndex - 1);

            string resultadoDoBloco;

            // Se for #if, não processa o bloco inteiro antes, apenas avalia a condicional
            if (conteudoBloco.TrimStart().StartsWith("#if:"))
            {
                resultadoDoBloco = AvaliarCondicional(conteudoBloco);
            }
            else
            {
                // Para outros blocos normais, processa recursivamente
                string conteudoResolvido = ProcessarTexto(conteudoBloco);
                resultadoDoBloco = AvaliarExpressaoSimples(conteudoResolvido);
            }

            string textoModificado = texto.Remove(startIndex, endIndex - startIndex + 1)
                                        .Insert(startIndex, resultadoDoBloco);

            // Continua processando o restante do texto
            return ProcessarTexto(textoModificado);
        }

        private int EncontrarFechamento(string texto, int startIndex)
        {
            int contador = 1;
            for (int i = startIndex + 1; i < texto.Length; i++)
            {
                if (texto[i] == '[') contador++;
                else if (texto[i] == ']')
                {
                    contador--;
                    if (contador == 0) return i;
                }
            }
            return -1;
        }

        private string AvaliarExpressaoSimples(string expressao)
        {
            expressao = expressao.Trim();

            if (expressao.StartsWith("#var:"))
            {
                DefinirVariavel(expressao);
                return "";
            }

            if (expressao.StartsWith("#if:"))
            {
                return AvaliarCondicional(expressao);
            }

            if (Regex.IsMatch(expressao, @"\d*d\d+", RegexOptions.IgnoreCase))
            {
                var resultadoRolagem = RolarDados(expressao);
                if (resultadoRolagem != null)
                {
                    _rollLogs.Add(resultadoRolagem);
                    return resultadoRolagem.Soma.ToString();
                }
                return "0";
            }

            return ResolverVariaveisEFormulas(expressao);
        }

        private void DefinirVariavel(string comandoVar)
        {
            string definicao = comandoVar.Substring(5);
            var partes = definicao.Split(new[] { ';' }, 2);
            if (partes.Length == 2 && !string.IsNullOrWhiteSpace(partes[0]))
            {
                string nome = partes[0].Trim();
                string valor = partes[1].Trim();
                _variables[nome] = valor;
            }
        }

        private string AvaliarCondicional(string comandoIf)
        {
            string definicao = comandoIf.Substring(4);
            var partes = definicao.Split(new[] { ';' }, 3);
            if (partes.Length != 3) return "[ERRO DE SINTAXE IF]";

            // Avalia a condição
            bool resultado = AvaliarCondicaoMatematica(partes[0]);

            // Escolhe apenas o ramo correto
            string ramoSelecionado = resultado ? partes[1] : partes[2];

            // Processa recursivamente apenas o ramo escolhido
            return ProcessarTexto(ramoSelecionado);
        }

        private bool AvaliarCondicaoMatematica(string condicao)
        {
            string[] operadores = { "<=", ">=", "==", "!=", "<", ">" };
            string? op = operadores.FirstOrDefault(o => condicao.Contains(o));
            if (op == null) return false;

            var partes = condicao.Split(new[] { op }, 2, StringSplitOptions.None);
            if (partes.Length < 2) return false;

            string? valEsq = ResolverVariaveisEFormulas(partes[0]).Trim();
            string? valDir = ResolverVariaveisEFormulas(partes[1]).Trim();

            if (double.TryParse(valEsq, out double vEsq) && double.TryParse(valDir, out double vDir))
            {
                return op switch
                {
                    "<=" => vEsq <= vDir,
                    ">=" => vEsq >= vDir,
                    "==" => vEsq == vDir,
                    "!=" => vEsq != vDir,
                    "<" => vEsq < vDir,
                    ">" => vEsq > vDir,
                    _ => false
                };
            }
            return false;
        }

        private string ResolverVariaveisEFormulas(string expressao)
        {
            if (string.IsNullOrWhiteSpace(expressao)) return expressao;
            string processada = expressao.Trim();
            processada = Regex.Replace(processada, @"\{(.+?)\}", m =>
                _variables.TryGetValue(m.Groups[1].Value, out var v) ? v : m.Value);
            try { return new DataTable().Compute(processada, null)?.ToString() ?? ""; }
            catch { return processada; }
        }

        public class Rolagem
        {
            public string Macro { get; set; }
            public List<string> Resultados { get; set; }
            public int Soma { get; set; }

            public Rolagem(string m, List<string> r, int s)
            {
                Macro = m;
                Resultados = r;
                Soma = s;
            }
        }

        private Rolagem? RolarDados(string macro)
        {
            // Regex: [qtdDados]d[qtdFaces][operador][count]
            var match = Regex.Match(macro, @"^(\d*)d(\d+)(kh|kl|dh|dl)?(\d+)?$", RegexOptions.IgnoreCase);
            if (!match.Success) return null;

            int qtdDados = string.IsNullOrEmpty(match.Groups[1].Value) ? 1 : int.Parse(match.Groups[1].Value);
            int qtdFaces = int.Parse(match.Groups[2].Value);
            string operador = match.Groups[3].Value.ToLower();
            int count = string.IsNullOrEmpty(match.Groups[4].Value) ? 0 : int.Parse(match.Groups[4].Value);

            if (!string.IsNullOrEmpty(operador))
            {
                if (count < 1)
                    count = 1;
                if (count > qtdDados)
                    count = qtdDados;
            }

            var todasAsRolagens = Enumerable.Range(0, qtdDados)
                .Select(i => (valor: _random.Next(1, qtdFaces + 1), index: i))
                .ToList();

            HashSet<int> indicesMantidos;

            if (string.IsNullOrEmpty(operador))
            {
                indicesMantidos = todasAsRolagens.Select(r => r.index).ToHashSet();
            }
            else
            {
                var rolagensOrdenadas = todasAsRolagens.OrderBy(r => r.valor).ToList();

                switch (operador)
                {
                    case "kh":
                        indicesMantidos = rolagensOrdenadas.Skip(qtdDados - count).Select(r => r.index).ToHashSet();
                        break;
                    case "kl":
                        indicesMantidos = rolagensOrdenadas.Take(count).Select(r => r.index).ToHashSet();
                        break;
                    case "dh":
                        indicesMantidos = rolagensOrdenadas.Take(qtdDados - count).Select(r => r.index).ToHashSet();
                        break;
                    case "dl":
                        indicesMantidos = rolagensOrdenadas.Skip(count).Select(r => r.index).ToHashSet();
                        break;
                    default:
                        return null;
                }
            }

            var resultadosFormatados = new List<string>();
            int soma = 0;

            foreach (var rolagem in todasAsRolagens)
            {
                if (indicesMantidos.Contains(rolagem.index))
                {
                    resultadosFormatados.Add(rolagem.valor.ToString());
                    soma += rolagem.valor;
                }
                else
                {
                    resultadosFormatados.Add($"~{rolagem.valor}~");
                }
            }

            return new Rolagem(macro, resultadosFormatados, soma);
        }
    }
}
