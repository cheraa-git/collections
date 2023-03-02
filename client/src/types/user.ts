import { User } from "../../../common/common-types"



export type ProfileUser = Omit<User, "token">

export interface AuthData {
  email: string
  password: string
  nickname?: string
  avatarUrl?: string
}
