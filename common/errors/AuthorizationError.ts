export class AuthorizationError extends Error {
  name: "AuthorizationError" = "AuthorizationError"
  error: unknown
  constructor(message: string, error?: unknown) {
    super()
    this.message = message
    this.error = error
  }
}
