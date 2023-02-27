export class NotFoundError extends Error {
  name: 'NotFoundError' = 'NotFoundError'

  constructor(message: string) {
    super()
    this.message = message
  }
}
