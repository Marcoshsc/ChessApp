import axios from 'axios'
import { UserInfo, UserInfoProfile } from '../atoms/auth'

interface GameInfoDTO {
  total: string
  ritmo: string
}

interface GamesInfoDTO {
  won: GameInfoDTO[]
  lost: GameInfoDTO[]
  drawn: GameInfoDTO[]
}

interface UserInfoProfileDTO {
  user: Omit<UserInfo, 'jwt'> & { data_criacao: string }
  gamesInfo: GamesInfoDTO
}

export async function login(email: string, password: string): Promise<UserInfo> {
  
  const response = await axios.post('http://localhost:3001/user/login', { email, password })
  return response.data

}

export async function signUp(name: string, email: string, password: string): Promise<UserInfo> {
  const response = await axios.post('http://localhost:3001/user/signup', { name, email, password })
  return response.data
}

export async function getProfile(token: string, userId: number): Promise<UserInfoProfile> {
  const response = await axios.get(`http://localhost:3001/user/profile/${userId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })

  const dto: UserInfoProfileDTO = response.data
  return {
    user: {
      memberSince: new Date(dto.user.data_criacao),
      id: dto.user.id,
      nome: dto.user.nome
    },
    gamesInfo: {
      won: dto.gamesInfo.won.map(el => ({ total: Number.parseInt(el.total), rithm: el.ritmo })),
      lost: dto.gamesInfo.lost.map(el => ({ total: Number.parseInt(el.total), rithm: el.ritmo })),
      drawn: dto.gamesInfo.drawn.map(el => ({ total: Number.parseInt(el.total), rithm: el.ritmo }))
    }
  }
}