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
  imageUrl?: string
}

export interface ItemType {
  id: number
  collectionId: number
  str1?: string
  str2?: string
  str3?: string
  txt1?: string
  txt2?: string
  txt3?: string
  numb1?: number
  numb2?: number
  numb3?: number
  date1?: string
  date2?: string
  date3?: string
  bool1?: boolean
  bool2?: boolean
  bool3?: boolean
}

export interface ItemConfigType {
  id?: number
  collectionId?: number
  // type: 'str1' | 'str2' | 'str3' | 'txt1' | 'txt2' | 'txt3' | 'numb1' | 'numb2' | 'numb3' | 'bool1' | 'bool2' | 'bool3' | 'date1' | 'date2' | 'date3'
  type: string
  label: string
}
