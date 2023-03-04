
export type Item = {
  id: number
  collectionId: number
  collectionTitle?: string
  userId?: number
  userNickname?: string
  name: string
  tags: Tag[]
  timestamp: string
  [type: string]: any
}

export type Tag = {
  id?: number
  name: string
}

export interface TagCount {
  tagId: number
  count: number
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
