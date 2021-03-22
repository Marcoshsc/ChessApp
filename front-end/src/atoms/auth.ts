import { atom } from "recoil";

export interface UserInfo {
  nome: string
  id: number
}

export const authAtom = atom<UserInfo | undefined>({
  key: 'auth',
  default: undefined
})