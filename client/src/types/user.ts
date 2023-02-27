import { User } from "../../../common/common-types"



export type ProfileUser = Omit<User, "token" | "email" | 'isAdmin'>

export interface AuthData {
  email: string
  password: string
  nickname?: string
  avatarUrl?: string
}
