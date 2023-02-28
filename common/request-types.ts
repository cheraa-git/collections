import { Collection, Fields, Item, ItemConfigType, Tag } from "./common-types"

export interface CreateCollectionBody {
  userId: number
  token: string
  title: string
  description: string
  themeId: number
  imageUrl?: string
  itemConfigs?: ItemConfigType[]
}

export interface CreateItemBody {
  userId: number
  token: string
  collectionId: number
  tags: Tag[]
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
  collection: Omit<Collection, 'timestamp'>
  token: string
}

export interface EditProfileBody {
  email?: string
  password?: string
  nickname?: string
  oldPassword: string
  oldEmail: string
}


