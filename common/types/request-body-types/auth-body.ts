import { AuthProviderName } from "../user"

export interface AuthByProviderBody  {
  email: string
  nickname: string
  authProvider: AuthProviderName
}

export interface RegisterBody {
  token: string
}

export interface LoginBody {
  email: string
  password: string
}

export interface SendConfirmEmailBody {
  nickname: string
  email: string
  password: string
}
