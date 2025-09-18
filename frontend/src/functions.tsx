export default function Roll(
  macro: string,
  campos: { id: string; value: string }[],
  setNotificationText: (a: string) => void,
  setNotificationSubText: (a: string) => void,
  setNotificationTitle: (a: string) => void,
  label?: string
) {
  // Substitui placeholders {campo}
  const resultado = macro.replace(/\{(.*?)\}/g, (_, chave) => {
    const campo = campos.find(c => c.id === chave);
    if (!campo) return `{${chave}}`;
    const valor = String(campo.value ?? "").trim();
    return valor.length === 0 ? "0" : valor;
  });

  fetch(`https://diceroller.up.railway.app/roll?macro=${encodeURIComponent(resultado)}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
    .then(res => {
      if (!res.ok) throw new Error(`Erro na requisição: ${res.status}`);
      return res.json();
    })
    .then(data => {
      let macroSubstituido = resultado;

      data["rolagens"].forEach((roll: any) => {
        // Se for um #if, mantém apenas o lado executado
        const ifMatch = roll.macro.match(/\[#if:(.*?);(.*?);(.*?)\]/);
        if (ifMatch) {
          // const [, condicao, ladoVerdadeiro, ladoFalso] = ifMatch;
          // // lado executado: se o roll.resultados bate com o ladoVerdadeiro ou ladoFalso
          // const ladoExecutado = roll.resultados.join(", ") === ladoVerdadeiro.replace(/\[|\]/g, "")
          //   ? ladoVerdadeiro
          //   : ladoFalso;
          macroSubstituido = macroSubstituido.replace(
            new RegExp(roll.macro.replace(/([.*+?^${}()|[\]\\])/g, "\\$1")),
            `[${roll.resultados.join(", ")}]`
          );
        } else {
          macroSubstituido = macroSubstituido.replace(
            new RegExp(roll.macro.replace(/([.*+?^${}()|[\]\\])/g, "\\$1")),
            `[${roll.resultados.join(", ")}]`
          );
        }
      });

      let textoFormatadoHTML = macroSubstituido.replace(
        /(?<!~)\b\d+\b(?!~)/g,
        `<span style="color: black;">$&</span>`
      );

      textoFormatadoHTML = textoFormatadoHTML.replace(
        /~(\d+)~/g,
        `<span style="text-decoration: line-through; color: red;">$1</span>`
      );

      const textoFinalHTML = `${resultado}: ${textoFormatadoHTML} = ${data["resultado"]}`;

      setNotificationText(data["resultado"]);
      setNotificationSubText(textoFinalHTML);
      label ? setNotificationTitle(label) : null;
    })
    .catch(err => {
      console.error("Falha ao rolar o dado:", err);
      return null;
    });
}
