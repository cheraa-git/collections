
export interface Collection {
  id: number
  userId: number
  userName?: string
  title: string
  description: string
  themeId: number
  timestamp: string
  imageUrl?: string
}

export type Item = {
  id: number
  userId: number
  collectionId: number
  name: string
  tags: Tag[]
  timestamp: string
  [type: string]: any
}

export type Tag = {
  id?: number
  name: string
}


export interface Comment {
  id: number
  userId: number
  itemId: number
  text: string
  nickname: string
  timestamp: string
}

export interface Like {
  id: number
  userId: number
  itemId: number
  nickname: string
}

export interface Fields {
  name: string
  [type: string]: string | number | boolean
}

export type ItemConfigType = {
  id?: number
  collectionId?: number
  type: string
  label: string
}

export interface Theme {
  id: number
  name: string
}

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
