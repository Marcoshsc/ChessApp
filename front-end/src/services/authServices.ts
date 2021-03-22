import axios from 'axios'
import { UserInfo } from '../atoms/auth'

export async function login(email: string, password: string): Promise<UserInfo> {
  
  const response = await axios.post('http://localhost:3001/user/login', { email, password })
  return response.data

}

export async function signUp(name: string, email: string, password: string): Promise<UserInfo> {
  const response = await axios.post('http://localhost:3001/user/signup', { name, email, password })
  return response.data
}