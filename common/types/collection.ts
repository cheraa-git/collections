export interface Collection {
  id: number
  userId: number
  userName?: string
  title: string
  description: string
  themeId: number
  timestamp: string
  imageUrl?: string
  countItems?: string
}

export interface Theme {
  id: number
  name: string
}

export type ItemConfigType = {
  id?: number
  collectionId?: number
  hidden?: boolean
  type: string
  label: string
}
