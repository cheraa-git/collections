import { Collection, Item, ItemConfigType, UserStatus } from "./common-types"

export interface GetProfileResponse {
  collections: Collection[]
  user: { id: number, nickname: string, avatarUrl?: string, status: UserStatus }
}

export interface GetItemResponse {
  item: Item,
  itemConfigs: ItemConfigType[]
}

export interface GetCollectionResponse {
  itemConfigs: ItemConfigType[],
  collection: Collection,
  items: Item[]
}

export interface EditCollectionResponse {
  collection: Collection
  itemConfigs: ItemConfigType[]
}
