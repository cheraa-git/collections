import { Collection, ItemConfigType } from "./collection"
import { Fields, Item, Tag } from "./item"

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
  removedConfigs: ItemConfigType[]
  collection: Omit<Collection, 'timestamp'>
  token: string
}

export interface EditProfileByTokenBody {
  email?: string
  password?: string
  nickname?: string
  oldPassword: string
  oldEmail: string
  adminEmail?: string
}

export interface EditProfileByProviderBody {
  email: string
  password?: string
  nickname?: string
}
