export interface User {
  id: string
  nickname: string
  avatar?: string
  email: string
  token: string
}

export interface AuthData {
  email: string
  password: string
  nickname?: string
  avatarUrl?: string
}
