import { atom } from "recoil";

export interface PlayerInfo {
  id: number
  name: string
}

export interface PlayerGame {
  id: number
  creationDate: Date
  winner: string
  whitePlayer: PlayerInfo
  blackPlayer: PlayerInfo
  rithm: string
  reasonEnd: string
}

export const loadedGamesAtom = atom<boolean>({
  key: 'loadedGames',
  default: false
})

export const playerGamesAtom = atom<PlayerGame[]>({
  key: 'playerGames',
  default: []
})