import { UserStatus } from "../user"

export interface SetUsersStatusBody {
  token: string
  userIds: number[]
  status: UserStatus
}

export interface SetAdminStatusBody {
  token: string
  userIds: number[]
  status: boolean
}
