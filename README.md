# ChessApp

Author: Marcos Henrique Santos Cunha (Marcoshsc)

EN-US: Chess app developed to the Databases I class.

PT-BR: Aplicativo de xadrez desenvolvido para a disciplina de Banco de Dados I.

# Description
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

# App Structure

EN-US: This is a web-based app, that consists of a back-end running an express server, that provides HTTP endpoints and WebSocket connection, and deals with a PostgreSQL database to store the data.
Then, there is a front-end written in React that consumes the back-end data and interacts with the final user. The used technologies are described below:

- Database: PostgreSQL 12
- Back-end: Express, Socket.io, node-pg.
- Front-end: Typescript, ReactJS, RecoilJS, React-Router, Socket.io.


