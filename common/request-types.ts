import { Collection, Fields, Item, ItemConfigType } from "./common-types"

export interface CreateCollectionBody {
  userId: number
  token: string
  title: string
  description: string
  theme: string
  imageUrl?: string
  itemConfigs?: ItemConfigType[]
}

export interface CreateItemBody {
  userId: number
  token: string
  collectionId: number
  tags: string
  fields: Fields
}

export interface EditItemBody {
  item: Item
  token: string
}

export interface DeleteItemBody {
  item: Item
  token: string
}

export interface DeleteCollectionBody {
  collection: Collection
  token: string
}

export interface EditCollectionBody {
  itemConfigs: ItemConfigType[]
  collection: Collection
  token: string
}

