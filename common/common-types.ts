export interface UserType {
  id: number
  nickname: string
  email: string
  password?: string
  avatarUrl?: string
}

export interface Collection {
  id: number
  userId: number
  userName?: string
  title: string
  description: string
  theme: string
  timestamp: string
  imageUrl?: string
}

export interface Item {
  id: number
  collectionId: number
  name: string
  timestamp: string
  [type: string]: string | number | boolean
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
