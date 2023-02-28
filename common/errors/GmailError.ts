export class GmailError extends Error {
  name: "GmailError" = "GmailError"
  error: unknown

  constructor(message: string, error?: unknown) {
    super()
    this.message = message
    this.error = error
  }
}
