import axios from 'axios'
import { FollowInfo, UserInfo, UserInfoProfile } from '../atoms/user'

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
  isFollowing: boolean
}

export interface FollowerSingleDTO {
  data_criacao: string
  seguidor: Omit<UserInfo, 'jwt'>
}

export interface FollowingSingleDTO {
  data_criacao: string
  seguindo: Omit<UserInfo, 'jwt'>
}

export interface FollowInfoDTO {
  user: Omit<UserInfo, 'jwt'>
  followers: FollowerSingleDTO[]
  following: FollowingSingleDTO[]
}

export async function login(
  email: string,
  password: string,
): Promise<UserInfo> {
  const response = await axios.post('http://localhost:3001/user/login', {
    email,
    password,
  })
  return response.data
}

export async function signUp(
  name: string,
  email: string,
  password: string,
): Promise<UserInfo> {
  const response = await axios.post('http://localhost:3001/user/signup', {
    name,
    email,
    password,
  })
  return response.data
}

export async function followOrUnfollow(
  token: string,
  following: number,
): Promise<void> {
  await axios.post(
    `http://localhost:3001/user/follow/${following}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
}

export async function getFollowInfo(
  token: string,
  userId: number,
): Promise<FollowInfo> {
  const response = await axios.get(
    `http://localhost:3001/user/follows/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )

  const dto: FollowInfoDTO = response.data

  console.log(dto)

  return {
    user: dto.user,
    followers: dto.followers.map((el) => ({
      creationDate: new Date(el.data_criacao),
      info: el.seguidor,
    })),
    following: dto.following.map((el) => ({
      creationDate: new Date(el.data_criacao),
      info: el.seguindo,
    })),
  }
}

export async function getProfile(
  token: string,
  userId: number,
): Promise<UserInfoProfile> {
  const response = await axios.get(
    `http://localhost:3001/user/profile/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )

  const dto: UserInfoProfileDTO = response.data
  return {
    user: {
      memberSince: new Date(dto.user.data_criacao),
      id: dto.user.id,
      nome: dto.user.nome,
    },
    gamesInfo: {
      won: dto.gamesInfo.won.map((el) => ({
        total: Number.parseInt(el.total),
        rithm: el.ritmo,
      })),
      lost: dto.gamesInfo.lost.map((el) => ({
        total: Number.parseInt(el.total),
        rithm: el.ritmo,
      })),
      drawn: dto.gamesInfo.drawn.map((el) => ({
        total: Number.parseInt(el.total),
        rithm: el.ritmo,
      })),
    },
    isFollowing: dto.isFollowing,
  }
}

export async function searchUser(
  token: string,
  username: string,
): Promise<(Omit<UserInfo, 'jwt'> & { data_criacao: Date })[]> {
  const response = await axios.get(
    `http://localhost:3001/user/search/${username}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )

  return response.data.map((el: any): Omit<UserInfo, 'jwt'> & {
    data_criacao: Date
  } => {
    return {
      ...el,
      data_criacao: new Date(el.data_criacao),
    }
  })
}
