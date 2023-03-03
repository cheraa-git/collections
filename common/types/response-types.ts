import { Collection, ItemConfigType } from "./collection"
import { ProfileUser } from "./user"
import { Item } from "./item"

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
