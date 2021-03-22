import axios from "axios";
import { PlayerGame } from "../atoms/game";

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