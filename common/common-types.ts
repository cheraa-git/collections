export interface UserType {
  id: number
  nickname: string
  email: string
  password?: string
  avatarUrl?: string
}

export interface Collection {
  id: number
  userId: number
  userName?: string
  title: string
  description: string
  theme: string
  timestamp: string
  imageUrl?: string
}

export interface Item {
  id: number
  collectionId: number
  name: string
  timestamp: string
  [type: string]: string | number | boolean
}

export interface Fields {
  name: string

  [type: string]: string | number | boolean
}

export interface ItemConfigType {
  id?: number
  collectionId?: number
  // type: 'str1' | 'str2' | 'str3' | 'txt1' | 'txt2' | 'txt3' | 'numb1' | 'numb2' | 'numb3' | 'bool1' | 'bool2' | 'bool3' | 'date1' | 'date2' | 'date3'
  type: string
  label: string
}
