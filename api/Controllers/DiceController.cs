using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DiceController : ControllerBase
    {
        // Dicionário e logs são agora membros para serem acessados por todo o processo.
        private readonly Dictionary<string, string> _variables = new();
        private readonly List<string> _rollLogs = new();
        private readonly Random _random = new();

        [HttpGet("roll")]
        public IActionResult Roll(string macro)
        {
            _variables.Clear();
            _rollLogs.Clear();

            // A chamada inicial para o novo motor recursivo.
            string resultadoFinal = ProcessarTexto(macro);
            
            return Ok(new { resultado = resultadoFinal, rolagens = _rollLogs });
        }

        // ------------------------------------------------------------------------------------
        // NOVO MOTOR DE PROCESSAMENTO RECURSIVO (CORRIGIDO)
        // ------------------------------------------------------------------------------------

        /// <summary>
        /// A função principal que processa o texto, garantindo a ordem correta (esquerda para direita).
        /// </summary>
        private string ProcessarTexto(string texto)
        {
            // 1. Encontra o primeiro bloco de expressão da esquerda.
            int startIndex = texto.IndexOf('[');

            // CASO BASE: Se não há mais blocos, apenas resolvemos as variáveis finais (ex: {vida}) e retornamos.
            if (startIndex == -1)
            {
                return ResolverVariaveisEFormulas(texto);
            }

            // 2. Encontra o colchete de fechamento correspondente, respeitando o aninhamento.
            int endIndex = EncontrarFechamento(texto, startIndex);
            if (endIndex == -1)
            {
                return "ERRO: Colchete de abertura sem fechamento.";
            }

            // 3. Isola o conteúdo do bloco.
            string conteudoBloco = texto.Substring(startIndex + 1, endIndex - startIndex - 1);

            // 4. CHAMADA RECURSIVA: Processa o *conteúdo* do bloco primeiro.
            // Isso resolve todo o aninhamento de dentro para fora.
            string conteudoResolvido = ProcessarTexto(conteudoBloco);

            // 5. Avalia o conteúdo já simplificado (ex: "#var:vida;10" ou "1d20").
            string resultadoDoBloco = AvaliarExpressaoSimples(conteudoResolvido);

            // 6. Constrói a nova string com o bloco resolvido.
            string textoModificado = texto.Remove(startIndex, endIndex - startIndex + 1)
                                        .Insert(startIndex, resultadoDoBloco);

            // 7. REINICIA O PROCESSO: Chama a recursão na string *inteira modificada* desde o início.
            return ProcessarTexto(textoModificado);
        }

        /// <summary>
        /// Função auxiliar para encontrar o ']' correspondente a um '[' inicial, contando os aninhados.
        /// </summary>
        private int EncontrarFechamento(string texto, int startIndex)
        {
            int contador = 1;
            for (int i = startIndex + 1; i < texto.Length; i++)
            {
                if (texto[i] == '[')
                {
                    contador++;
                }
                else if (texto[i] == ']')
                {
                    contador--;
                    if (contador == 0)
                    {
                        return i;
                    }
                }
            }
            return -1; // Não encontrou
        }

        /// <summary>
        /// Dispatcher: Recebe um conteúdo de bloco JÁ RESOLVIDO e decide o que fazer.
        /// </summary>
        private string AvaliarExpressaoSimples(string expressao)
        {
            expressao = expressao.Trim();

            if (expressao.StartsWith("#var:"))
            {
                DefinirVariavel(expressao);
                return ""; // Comandos #var não produzem texto.
            }
            
            if (expressao.StartsWith("#if:"))
            {
                return AvaliarCondicional(expressao);
            }
            
            if (expressao.Contains('d'))
            {
                var resultadoDados = RolarDados(expressao);
                if (resultadoDados != null)
                {
                    _rollLogs.Add(resultadoDados.resultado);
                    return resultadoDados.soma.ToString();
                }
                return "0";
            }
            
            return ResolverVariaveisEFormulas(expressao);
        }

        // ------------------------------------------------------------------------------------
        // FUNÇÕES AUXILIARES (praticamente inalteradas, mas agora funcionam na ordem correta)
        // ------------------------------------------------------------------------------------

        private void DefinirVariavel(string comandoVar)
        {
            string definicao = comandoVar.Substring(5);
            var partes = definicao.Split(new[] { ';' }, 2);
            if (partes.Length == 2 && !string.IsNullOrWhiteSpace(partes[0]))
            {
                string nome = partes[0].Trim();
                // O valor já foi pré-processado pela recursão.
                string valor = partes[1].Trim();
                _variables[nome] = valor;
            }
        }

        private string AvaliarCondicional(string comandoIf)
        {
            string definicao = comandoIf.Substring(4);
            var partes = definicao.Split(new[] { ';' }, 3);
            if (partes.Length != 3) return "[ERRO DE SINTAXE IF]";

            bool resultado = AvaliarCondicaoMatematica(partes[0]);
            // Retorna o caminho (verdadeiro ou falso), que será processado pela próxima iteração.
            return resultado ? partes[1] : partes[2];
        }

        private bool AvaliarCondicaoMatematica(string condicao)
        {
            string[] operadores = { "<=", ">=", "==", "!=", "<", ">" };
            string? op = operadores.FirstOrDefault(o => condicao.Contains(o));
            if (op == null) return false;

            var partes = condicao.Split(new[] { op }, 2, StringSplitOptions.None);
            if (partes.Length < 2) return false;

            string? valEsq = ResolverVariaveisEFormulas(partes[0]);
            string? valDir = ResolverVariaveisEFormulas(partes[1]);

            if (double.TryParse(valEsq, out double vEsq) && double.TryParse(valDir, out double vDir))
            {
                return op switch {
                    "<=" => vEsq <= vDir, ">=" => vEsq >= vDir, "==" => vEsq == vDir,
                    "!=" => vEsq != vDir, "<" => vEsq < vDir, ">" => vEsq > vDir, _ => false
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

        public class ResultadoDados {
            public int soma { get; set; }
            public string resultado { get; set; }
            public ResultadoDados(int s, string r) { soma = s; resultado = r; }
        }

        private ResultadoDados? RolarDados(string macro)
        {
            // Sua função de rolar dados permanece a mesma.
            // Apenas garanta que ela use a instância `_random` da classe.
            if (!macro.Contains('d')) return null;
            string[] dSplitted = macro.Split('d');
            if (dSplitted.Length != 2 || !int.TryParse(dSplitted[0], out int qtdDados)) return null;
            if (int.TryParse(dSplitted[1], out int qtdFaces)) {
                int soma = 0;
                List<int> rolagens = new();
                for (int i = 0; i < qtdDados; i++) {
                    int rollResult = _random.Next(1, qtdFaces + 1);
                    rolagens.Add(rollResult);
                    soma += rollResult;
                }
                return new ResultadoDados(soma, $"{macro}: [{string.Join(", ", rolagens)}] = {soma}");
            }
            // ... (sua outra lógica de kh, kl, etc. aqui)
            return null;
        }
    }
}
