export interface User {
  id: number
  nickname: string
  avatarUrl?: string
  email: string
  token: string
  isAdmin: boolean
  status: UserStatus
  authProvider?: AuthProviderName
}

export type ProfileUser = Omit<User, "token">

export type UserStatus = 'active' | 'blocked' | 'deleted'

export type AuthProviderName = 'google' | 'github' | 'facebook'

export interface EditProfileTokenData {
  email?: string,
  nickname?: string,
  password?: string
  oldEmail: string
  adminEmail?: string
}

export interface AuthData {
  email: string
  password: string
  nickname?: string
}
