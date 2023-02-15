import { Fields } from "../../../common/common-types"

export interface CreateCollectionPayload {
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
  itemConfigs?: ItemConfigType[]
  themeId: number
  title: string
  userId: number
}

export interface CreateItemPayload {
  collectionId: number
  fields: Fields
}

export interface ItemConfigType {
  type: string
  label: string
}

