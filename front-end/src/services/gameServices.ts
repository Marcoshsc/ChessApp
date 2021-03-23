import axios from "axios";
import { PlayerGame, PlayerGameWithMoves } from "../atoms/game";

interface PlayerInfoDTO {
  id: number
  nome: string
}

interface PlayerGameDTO {
  id: number
  data_criacao: string
  vencedor: string
  ritmo: string
  motivo_final: string
  player_brancas: PlayerInfoDTO
  player_pretas: PlayerInfoDTO
}

interface GameMoveDTO {
  sequencial: number
  de: string
  para: string
  tempo: number
}

interface PlayerGameWithMovesDTO {
  game: PlayerGameDTO,
  moves: GameMoveDTO[]
}

export async function getGame(token: string, gameId: number): Promise<PlayerGameWithMoves> {
  const response = await axios.get(`http://localhost:3001/games/game/${gameId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })

  const gameDTO: PlayerGameWithMovesDTO = response.data
  return {
    game: {
      blackPlayer: {
        id: gameDTO.game.player_pretas.id,
        name: gameDTO.game.player_pretas.nome
      },
      whitePlayer: {
        id: gameDTO.game.player_brancas.id,
        name: gameDTO.game.player_brancas.nome
      },
      creationDate: new Date(gameDTO.game.data_criacao),
      id: gameDTO.game.id,
      reasonEnd: gameDTO.game.motivo_final,
      rithm: gameDTO.game.ritmo,
      winner: gameDTO.game.vencedor
    },
    moves: gameDTO.moves.map(move => {
      return {
        ...move,
        from: move.de,
        to: move.para,
        time: move.tempo
      }
    })
  }
}

export async function getGames(token: string, userId: number): Promise<PlayerGame[]> {
  const response = await axios.get(`http://localhost:3001/games/${userId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  return response.data.map((el: PlayerGameDTO): PlayerGame => ({
    blackPlayer: {
      id: el.player_pretas.id,
      name: el.player_pretas.nome
    },
    whitePlayer: {
      id: el.player_brancas.id,
      name: el.player_brancas.nome
    },
    creationDate: new Date(el.data_criacao),
    id: el.id,
    reasonEnd: el.motivo_final,
    rithm: el.ritmo,
    winner: el.vencedor
  }))
}