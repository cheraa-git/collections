import { Fields } from "../../../common/common-types"

export interface CreateCollectionPayload {
  title: string
  description: string,
  theme: string
  image?: File
  itemConfigs?: ItemConfigType[]
}

export interface CreateItemPayload {
  collectionId: number
  fields: Fields
}

export interface ItemConfigType {
  type: string
  label: string
}

