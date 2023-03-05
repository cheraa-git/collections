import { AuthProviderName } from "../user"

export interface AuthByProviderBody  {
  email: string
  nickname: string
  authProvider: AuthProviderName
}
