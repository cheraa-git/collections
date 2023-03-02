import { Collection, Item, ItemConfigType, ProfileUser } from "./common-types"

export interface GetProfileResponse {
  collections: Collection[]
  user: ProfileUser
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
