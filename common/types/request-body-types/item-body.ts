import { Fields, Item, Tag } from "../item"


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
