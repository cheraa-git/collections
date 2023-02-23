export interface User {
  id: number
  nickname: string
  avatar?: string
  email: string
  token: string
  isAdmin: boolean
  status: 'active' | 'blocked' | 'deleted'
}

export type ProfileUser = Omit<User, "token" | "email" | 'isAdmin'>

export interface AuthData {
  email: string
  password: string
  nickname?: string
  avatarUrl?: string
}
