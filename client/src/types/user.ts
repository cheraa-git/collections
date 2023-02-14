export interface User {
  id: number
  nickname: string
  avatar?: string
  email: string
  token: string
}

export type ProfileUser = Omit<User, "token" | "email">

export interface AuthData {
  email: string
  password: string
  nickname?: string
  avatarUrl?: string
}
