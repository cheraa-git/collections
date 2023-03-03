import { Comment, Like } from "./item"

export interface ClientToServerEvents {
  "get:comments": (itemId: number) => void
  "get:likes": (itemId: number) => void
  "add:comment": ({}: { token: string, userId: number, itemId: number, text: string, nickname: string }) => void
  "set:like": ({}: { token: string, userId: number, itemId: number, nickname: string }) => void
}

export interface ServerToClientEvents {
  comments: (comments: Comment[]) => void
  new_comment: (comment: Comment) => void
  likes: (likes: Like[]) => void
  like: (like: Like) => void
  cancel_like: (userId: number) => void
  token_error: () => void
}

export interface SocketData {
}
