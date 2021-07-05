# ChessApp

Author: Marcos Henrique Santos Cunha (Marcoshsc)

Vídeo de Apresentação: https://youtu.be/87WDu5pI2dg

EN-US: Chess app developed to the Databases I class.

PT-BR: Aplicativo de xadrez desenvolvido para a disciplina de Banco de Dados I.

# Description / Descrição
EN-US: ChessApp is a platform where people can create an account and play chess with random opponents from everywhere in the world, in a wide variety of time controls. 
They can after analyse their games, with a powerful tool that allows the user to see the game in the exact same way it was really played. Time for each move, perspectives, game finish, etc.
There is a interface that allows the user to select the game that it wants to analyse, using a wide variety of filters. E.g, you can search for games that you played and won with checkmate.
Every user has a profile, where statistics about each player are shown, like its win rate on each time control. A user can see the profile every other user profile, and see their games too.
There is also a follow system, where users can follow each other, to ease future interactions. An user can follow/unfollow another by its profile, and have a better management with a dedicated following interface, where users can see who are their followers and who they are following, and eventually unfollow some people.
The information about follows is public, so users can se who is following who.
Finally, users can search for another users with a powerful search mechanism, entering a username and seeing the results. Since an user is found, the user that made the search can go to its profile and use all the software functionalities described above.

PT-BR: ChessApp é uma plataforma onde as pessoas podem criar uma conta e jogar xadrez com oponentes aleatórios de todo o mundo, em uma ampla variedade de controles de tempo.
Eles podem depois de analisar seus jogos, com uma ferramenta poderosa que permite ao usuário ver o jogo exatamente da mesma forma que foi realmente jogado. Tempo para cada movimento, perspectivas, final do jogo, etc.
Existe uma interface que permite ao usuário selecionar o jogo que deseja analisar, utilizando uma grande variedade de filtros. Por exemplo, você pode pesquisar jogos que jogou e ganhou com xeque-mate.
Cada usuário possui um perfil, onde são mostradas estatísticas sobre cada jogador, como sua taxa de vitórias em cada controle de tempo. Um usuário pode ver o perfil de todos os outros perfis de usuário e ver seus jogos também.
Também existe um sistema de acompanhamento, onde os usuários podem seguir uns aos outros, para facilitar futuras interações. Um usuário pode seguir / deixar de seguir outro pelo seu perfil, e ter um melhor gerenciamento com uma interface de acompanhamento dedicada, onde os usuários podem ver quem são seus seguidores e quem estão seguindo, e eventualmente deixar de seguir algumas pessoas.
As informações sobre os seguidores são públicas, para que os usuários possam ver quem está seguindo quem.
Finalmente, os usuários podem pesquisar outros usuários com um poderoso mecanismo de pesquisa, inserindo um nome de usuário e vendo os resultados. Uma vez que um usuário foi encontrado, o usuário que fez a busca pode ir ao seu perfil e utilizar todas as funcionalidades do software descritas acima.

# App Structure / Estrutura do aplicativo

EN-US: This is a web-based app, that consists of a back-end running an express server, that provides HTTP endpoints and WebSocket connection, and deals with a PostgreSQL database to store the data.
Then, there is a front-end written in React that consumes the back-end data and interacts with the final user. The used technologies are described below:

- Database: PostgreSQL 12
- Back-end: Express, Socket.io, node-pg.
- Front-end: Typescript, ReactJS, RecoilJS, React-Router, Socket.io.

PT-BR: Esse é um sistema web, que consiste em um back-end rodando um servidor express, que expôe rotas HTTP e conexão WebSocket, e consulta um banco de dados PostgreSQL para guardar os dados.
Além disso, existe um front-end em React que consome os dados do back-end e interage com o usuário final. As tecnologias utilizadas são descritas abaixo:

- Banco de Dados: PostgreSQL 12
- Back-end: Express, Socket.io, node-pg.
- Front-end: Typescript, ReactJS, RecoilJS, React-Router, Socket.io.

# Requirements / Requerimentos

EN-US: PostgreSQL 12.0 and node version >= 14.15.1.

PT-BR: PostgreSQL 12.0 e node de versão >= 14.15.1.

# Run / Execução

EN-US: Firstly, set up a PostgreSQL database named chessapp and run [this script](https://github.com/Marcoshsc/ChessApp/blob/master/database/db-init.sql) on the database, in order to create the tables. Then, clone the repository on your machine, navigate to the directory and set up the back-end as described below:

    cd back-end
    yarn
    yarn start

Now you are ready to start the front-end application. The steps are described below:

    cd front-end
    yarn
    yarn start

Connection data can be changed on [this file](https://github.com/Marcoshsc/ChessApp/blob/master/back-end/src/database/connection.js).
 
PT-BR: Primeiramente, crie um banco de dados PostgreSQL chamado chessapp e rode [esse script](https://github.com/Marcoshsc/ChessApp/blob/master/database/db-init.sql) no banco, para criar as tabelas. Então, clone o repositório na sua máquina, navegue até o diretório e faça o setup do back-end como descrito abaixo:

    cd back-end
    yarn
    yarn start

Agora você está pronto para iniciar o front-end. Os passos são descritos abaixo:

    cd front-end
    yarn
    yarn start

Dados da conexão com o banco de dados podem ser mudados [neste arquivo](https://github.com/Marcoshsc/ChessApp/blob/master/back-end/src/database/connection.js).
