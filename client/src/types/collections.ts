import { Fields, ItemConfigType, Tag } from "../../../common/common-types"

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
  id: number
  image?: File
  itemConfigs: ItemConfigType[]
  themeId: number
  title: string
  userId: number
}

export interface CreateItemPayload {
  collectionId: number
  fields: Fields
  tags: Tag[]
}


