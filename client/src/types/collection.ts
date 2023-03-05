import { ItemConfigType } from "../../../common/types/collection"
import { Fields, Tag } from "../../../common/types/item"

export interface CreateCollectionPayload {
  userId: number
  title: string
  description: string,
  themeId: number
  image?: File
  itemConfigs?: ItemConfigType[]
}

export interface EditCollectionPayload {
  description: string
  existingImage?: string
  image?: File
  deletedImage?: string
  id: number
  itemConfigs: ItemConfigType[]
  removedConfigs: ItemConfigType[]
  themeId: number
  title: string
  userId: number
}

export interface CreateItemPayload {
  collectionId: number
  fields: Fields
  tags: Tag[]
}


