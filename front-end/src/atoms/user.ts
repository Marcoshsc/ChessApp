import { atom } from "recoil";

export interface UserInfo {
  nome: string
  id: number
  jwt: string
}

export interface GameInfo {
  total: number
  rithm: string
}

export interface GamesInfo {
  won: GameInfo[],
  lost: GameInfo[],
  drawn: GameInfo[]
}

export interface UserInfoProfile {
  user: Omit<UserInfo, 'jwt'> & { memberSince: Date }
  gamesInfo: GamesInfo
  isFollowing: boolean
}

export interface FollowSingle {
  creationDate: Date
  info: Omit<UserInfo, 'jwt'>
}

export interface FollowInfo {
  user: Omit<UserInfo, 'jwt'>
  followers: FollowSingle[]
  following: FollowSingle[]
}

export const authAtom = atom<UserInfo | undefined>({
  key: 'auth',
  default: undefined
})