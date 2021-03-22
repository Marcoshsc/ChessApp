import { atom } from "recoil";

export interface UserInfo {
  nome: string
  id: number
  jwt: string
}

export const authAtom = atom<UserInfo | undefined>({
  key: 'auth',
  default: undefined
})