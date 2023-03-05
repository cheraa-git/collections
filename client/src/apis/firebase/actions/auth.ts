import { signInWithPopup } from "firebase/auth"
import { auth, facebookProvider, githubProvider, googleProvider, ProviderType } from "../firebase"
import { Either, left, right } from "@sweet-monads/either"
import { AuthByProviderBody } from "../../../../../common/types/request-body-types/auth-body"
import { AuthProviderName } from "../../../../../common/types/user"
import { FirebaseError } from 'firebase/app'
import { FacebookIconPng, GithubDarkIconPng, GithubLightIconPng, GoogleIconPng } from "../../../common/icons"


interface AuthProvider {
  (provider: ProviderType, providerName: AuthProviderName): Promise<Either<FirebaseError, AuthByProviderBody>>
}

export const authProvider: AuthProvider = async (provider, providerName) => {
  try {
    const result = await signInWithPopup(auth, provider)
    if (result.user.email && result.user.displayName) {
      return right({ email: result.user.email, nickname: result.user.displayName, authProvider: providerName })
    } else {
      return left(new Error('Google provider data not found'))
    }
  } catch (error: any) {
    return left(error)
  }
}

export const getProviderImage = (providerName: AuthProviderName, theme: 'light' | 'dark') => {
  if (providerName === 'google') return GoogleIconPng
  if (providerName === 'github' && theme === 'light') return GithubDarkIconPng
  if (providerName === 'github' && theme === 'dark') return GithubLightIconPng
  if (providerName === 'facebook') return FacebookIconPng
}

export const getProvider = (providerName: AuthProviderName): ProviderType => {
  if (providerName === 'google') return googleProvider
  if (providerName === 'github') return githubProvider
  if (providerName === 'facebook') return facebookProvider
  return googleProvider
}
