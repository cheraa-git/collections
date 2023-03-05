import { signInWithPopup } from "firebase/auth"
import { auth, ProviderType } from "../firebase"
import { Either, left, right } from "@sweet-monads/either"
import { AuthByProviderBody } from "../../../../../common/types/request-body-types/auth"
import { AuthProviderName } from "../../../../../common/types/user"
import { FirebaseError } from 'firebase/app'


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
