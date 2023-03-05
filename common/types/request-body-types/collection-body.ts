import { Collection, ItemConfigType } from "../collection"


export interface CreateCollectionBody {
  userId: number
  token: string
  title: string
  description: string
  themeId: number
  imageUrl?: string
  itemConfigs?: ItemConfigType[]
}

export interface DeleteCollectionBody {
  collection: Collection
  token: string
}

export interface EditCollectionBody {
  itemConfigs: ItemConfigType[]
  removedConfigs: ItemConfigType[]
  collection: Omit<Collection, 'timestamp'>
  token: string
}
