export interface CreateCollectionData {
  title: string
  description: string,
  theme: string
  image?: File
  itemConfigs?: ItemConfigType[]
}

export interface ItemConfigType {
  type: string
  label: string
}

