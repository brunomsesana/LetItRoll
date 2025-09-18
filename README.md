# LetItRoll

![GitHub License](https://img.shields.io/github/license/brunomsesana/LetItRoll?labelColor=260101)
![Static Badge](https://img.shields.io/badge/brunomsesana-LetItRoll-%23590202?logo=roll20&logoColor=white&labelColor=260101&link=https%3A%2F%2Fbrunomsesana.com.br&link=https%3A%2F%2Fgithub.com%2Fbrunomsesana%2FLetItRoll)


LetItRoll é um projeto que visa facilitar o uso de fichas virtuais de RPG, tanto para sistemas famosos como D&D ou Ordem Paranormal, quando sistemas menores ou homebrews, que acabam sendo difíceis de encontrar em outros sites.

Para atingir essa ampla variedade, usamos a ideia de criação de sistemas personalizados, disponibilizando ao usuário o poder de criar sistemas que ainda não foram implementados oficialmente no site.

## Sobre o Projeto
### Criação de Sistemas
Para a criação de sistemas, é utilizado a mecânica de criação de campos para montagem da ficha em um canvas, tendo possíbilidade de adicionar campos tanto de entrada quanto de design, como imagens, textos, entre outros.

Ao salvar um sistema, tem a possibilidade de deixar o mesmo disponível ao público, liberando assim um novo sistema não oficial no sistema do LetItRoll.

### Rolagem de dados
Como todo bom VTT (Virtual Tabletop) é necessário que ao criar os sistemas e durante o jogo, os usuários tenham a possibilidade de rolar dados.

No LetItRoll, isso é possível devido a uma API (também desenvolvida por mim) ASP.NET Core que faz a interpretação de macros e rolagens chamada [DiceRoller](https://github.com/brunomsesana/DiceRoller).


### License/Licença do Projeto
- [MIT](LICENSE)

## Estrutura do Projeto
### Tecnologias
#### Front-End
Todo o frontend do projeto é desenvolvido em React com TypeScript + Vite.

#### Back-End
O backend do projeto utiliza uma API RESTful criada com ASP.NET Core.

### Estruturação
- `./frontend`: É a pasta onde fica toda a estrutura do frontend com React + Typescript + Vite
    - `/src/components`: Todos os componentes principais usados durante o site, partes que se repetem, como botões ou partes de um formulário.
        - `<Canvas/>`: Parte da tela onde pode arrastar e ajustar a posição dos campos na ficha do sistema que está sendo criado
            - `campos`: Array de objetos contendo as informações dos campos
            - `setCampos`: Função para atualizar o array de campos
            - `setCampoSelecionado`: Função para selecionar um campo
            - `campoSelecionado`: Campo selecionado
            - `setErro`: Função para setar um erro
            - `onHeightChange`: Função para mudar a altura do canvas
            - `style`: Estilo `CSS` como `React.CSSProperties` a ser passado para o objeto
        - `<Navbar/>`: Barra de navegação do site
            - `selected`: Rota atual, para ficar marcada como selecionada
        - `<Notification/>`: Caixa de notificação para mostrar, principalmente, o resultado das rolagens de dados
            - `notificationText`: Texto da notificação
            - `setNotificationText`: Função para setar o texto da notificação
            - `notificationSubText`: Texto secundário da notificação
            - `setNotificationSubText`: Função para setar o texto secundário da notificação
    - `/src/contexts`: É a pasta onde ficam os contextos da aplicação, que são "variáveis" que podem ser acessadas em todas as páginas do site
        - `AppContext.tsx`: Define o contexto da aplicação
    - `/src/pages`: Pasta onde são definidas as rotas e páginas da aplicação.
        - `Home`: Página inicial da aplicação 
        - `Campanhas`: Página que o usuário terá uma visão geral de suas campanhas
        - `Comunidade`: Página onde os usuários poderão interagir e ter acesso aos sistemas de outros jogadores
        - `Fichas`: Tela onde o jogador poderá acessar todas as fichas de personagens (tanto as atreladas a uma campanha, quanto as independentes)
        - `Login`: Página de login de usuário
        - `Registro`: Página de cadastro de usuário
        - `Perfil`: Página de perfil do usuário
        - `CriarSistema`: Tela onde o usuário poderá criar um sistema que ainda não foi adicionado ao site
    - `App.tsx`: Arquivo onde são definidas as rotas do sistema
    - `functions.tsx`: Arquivo onde são definidas as funções gerais do sistema (Para que possam ser usadas em vários locais diferentes)
        - `Roll(macro: string)`: Função que recebe a macro, envia para a API de rolagem de dados e gera a notificação para o usuário.
    - `Interfaces.tsx`: Arquivo para definir as interfaces (classes) do projeto
        - `CampoData`: Classe base para um campo dentro da ficha.
            - `id`: ID do campo
            - `x`: Posição X do campo na ficha
            - `y`: Posição Y do campo na ficha
            - `title`: Título do campo (a ser mostrado)
            - `inputType`: Tipo de input do campo
            - `placeholder`: Placeholder do input do campo
            - `macro`: Macro para rolagem de dados
            - `value`: Valor do campo
            - `selectOptions`: Opções do select (caso o tipo seja esse)
            - `semFundo`: Se o campo terá um fundo
            - `corFundo`: Cor do fundo do campo
            - `corBorda`: Cor da borda do campo
            - `corTexto`: Cor do texto do campo
            - `corTextoSelected`: Cor do texto do campo quando selecionado
            - `corFundoInput`: Cor do fundo do input do campo
            - `corTextoInput`: Cor do texto do input do campo
            - `inputSemFundo`: Se o input do campo terá um fundo
            - `imagem`: Imagem do campo
            - `tamanhoImagem`: Tamanho da imagem do campo (em px)

## Proximos passos
- [ ] Sistema de Login com Jwt (WIP)
- [x] Desevolvimento da API de Rolagem de dados
- [ ] Criação de sistemas personalizados (WIP)
- [ ] Criação de fichas de personagens
- [ ] Criação de campanhas
- [ ] Suporte para multiplas línguas (i18n - Internacionalização)
- [ ] Documentar a API

### Como contribuir
Por enquanto, o projeto ainda está nas primeiras fases do desenvolvimento, por isso, ainda não disponibilizo maneiras de contribuir diretamente na produção de códigos.

Contanto, caso haja alguma funcionalidade que não esteja listada acima que sinta que há necessidade de ser incluida, basta entrar em contato pelo meu email: brunomsesana.dev@gmail.com.
