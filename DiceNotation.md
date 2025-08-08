# **Documentação da Linguagem de Macros**

Bem-vindo\! Este guia vai te ensinar a usar nosso sistema de macros para criar textos dinâmicos, rolar dados, definir variáveis e usar lógica condicional para gerar resultados complexos e interessantes.

## **1\. O Conceito Principal: Expressões \[...\]**

Tudo no nosso sistema é uma **expressão**, e toda expressão deve estar entre colchetes \[\]. O sistema resolve as expressões de dentro para fora e da esquerda para a direita.

Exemplo Simples:  
Olá, mundo\! (não faz nada)  
Exemplo com Expressão:  
\[\#var:forca;15\]Você tem {forca} de força.

* **Resultado:** Você tem 15 de força.

Você pode aninhar expressões, colocando colchetes dentro de outros colchetes.  
\[\#var:dado;\[1d20\]\]Você rolou um {dado}.

## **2\. Definindo Variáveis: \#var**

Você pode criar e armazenar valores usando o comando \#var. As variáveis guardam informações que podem ser usadas depois.

#### **Sintaxe**

\[\#var: nomeDaVariavel ; valor \]

* **\#var:**: O comando para criar uma variável.  
* **nomeDaVariavel**: O nome que você quer dar à variável. Não use espaços ou caracteres especiais.  
* **;**: O separador obrigatório.  
* **valor**: O valor que você quer armazenar. Pode ser um número, um texto ou até mesmo outra expressão.

#### **Exemplos**

* **Definindo um número:** \[\#var:vida;100\]  
* **Definindo um texto:** \[\#var:nome;Aragorn\]  
* **Definindo com o resultado de um dado:** \[\#var:ataque;\[1d20\]\]

**Importante:** A definição de uma variável (\#var) não gera nenhum texto no resultado final. Ela apenas armazena a informação para uso futuro.

## **3\. Usando Variáveis e Fórmulas: {}**

Para usar o valor que você guardou em uma variável, coloque o nome dela entre chaves {}. Você também pode fazer cálculos matemáticos simples.

#### **Sintaxe**

{nomeDaVariavel}

#### **Exemplos**

* **Exibindo uma variável:**  
  * \[\#var:mana;50\]Sua mana é {mana}.  
  * **Resultado:** Sua mana é 50\.  
* **Usando em cálculos:**  
  * \[\#var:forca;18\]Seu dano é {forca}+4.  
  * **Resultado:** Seu dano é 22\. (O sistema calcula a soma automaticamente)

## **4\. Rolando Dados: d**

A sintaxe para rolar dados é simples e pode ser usada em qualquer lugar onde um valor é esperado.

#### **Sintaxe**

\[NdX\] ou NdX (dentro de outra expressão)

* **N**: O número de dados a serem rolados.  
* **d**: O separador literal "d".  
* **X**: O número de faces do dado.

#### **Exemplos**

* **Rolagem simples:** \[2d6\]  
* **Usando para definir uma variável:** \[\#var:danoDeFogo;\[8d6\]\]  
* **Usando dentro de um if:** \[\#if:\[1d100\]\<50;Sucesso;Falha\]

O sistema também suporta mecânicas mais avançadas como "manter os maiores/menores" e "descartar os maiores/menores".

* **kh (Keep Highest):** Manter os X maiores. Ex: \[4d6kh3\] (role 4d6, some os 3 maiores resultados).  
* **kl (Keep Lowest):** Manter os X menores.  
* **dh (Drop Highest):** Descartar os X maiores.  
* **dl (Drop Lowest):** Descartar os X menores.

## **5\. Lógica Condicional: \#if**

O comando \#if é a ferramenta mais poderosa. Ele permite que o texto mude com base em uma condição. A estrutura dele é **muito rigorosa**.

#### **Sintaxe**

\[\#if: condição ; resultadoSeVerdadeiro ; resultadoSeFalso \]

* **\#if:**: O comando condicional.  
* **condição**: Uma expressão lógica que resulta em verdadeiro ou falso.  
* **;**: O primeiro separador. **Obrigatório.**  
* **resultadoSeVerdadeiro**: O que será exibido se a condição for verdadeira.  
* **;**: O segundo separador. **Obrigatório.**  
* **resultadoSeFalso**: O que será exibido se a condição for falsa.

**É CRUCIAL ter sempre as 3 partes e os 2 ponto e vírgulas.**

#### **Operadores de Comparação**

* \== : Igual a  
* \!= : Diferente de  
* \> : Maior que  
* \< : Menor que  
* \>= : Maior ou igual a  
* \<= : Menor ou igual a

#### **Exemplos**

* **Simples:**  
  * \[\#var:ouro;500\]\[\#if:{ouro}\>100;Você é rico\!;Você é pobre.\]  
  * **Resultado:** Você é rico\!  
* **Aninhado (um if dentro de outro):**  
  * \[\#var:x;\[1d100\]\]\[\#if:{x}\<50;\[\#if:{x}\<10;Crítico\!;Normal\];Falha\]  
  * **Análise:**  
    1. O primeiro if checa se {x} é menor que 50\.  
    2. Se for, ele executa a parte "verdadeira", que é **outro if**: \[\#if:{x}\<10;Crítico\!;Normal\].  
    3. Se não for, ele executa a parte "falsa": Falha.

## **6\. Exemplo Completo**

Vamos juntar tudo em um ataque de um personagem.

\[\#var:bonusAtaque;5\]\[\#var:rolagemAtaque;\[1d20\]\]\[\#var:defesaInimigo;15\]\[\#if:{rolagemAtaque}+{bonusAtaque}\>={defesaInimigo};Você acertou o inimigo com um ataque de \[{rolagemAtaque}+{bonusAtaque}\]\! Você causa \[3d8\] de dano.;Você errou o ataque com uma rolagem de \[{rolagemAtaque}+{bonusAtaque}\].\]

Este exemplo:

1. Define um bônus de ataque.  
2. Rola um d20 para o ataque.  
3. Define a defesa do inimigo.  
4. Usa um \#if para comparar o ataque total com a defesa.  
5. Se acertar, mostra uma mensagem de sucesso e rola o dano (\[3d8\]).  
6. Se errar, mostra uma mensagem de falha.

Resultado Esperado (com rolagens de exemplo):  
Se a rolagem do 1d20 for 15 e a do 3d8 for 11, o resultado final será:  
Você acertou o inimigo com um ataque de 20\! Você causa 11 de dano.