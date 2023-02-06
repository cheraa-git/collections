import { ItemConfigType } from "./common-types"

export interface CreateCollectionBody {
  userId: number
  token: string
  title: string
  description: string
  theme: string
  imageUrl?: string
  itemConfigs?: ItemConfigType[]
}

