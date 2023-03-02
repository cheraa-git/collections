import { Collection, Item, ItemConfigType } from "./common-types"
import { ProfileUser } from "../client/src/types/user"

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
