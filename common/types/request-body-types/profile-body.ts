export interface EditProfileByTokenBody {
  email?: string
  password?: string
  nickname?: string
  oldPassword: string
  oldEmail: string
  adminEmail?: string
}

export interface EditProfileByProviderBody {
  email: string
  password?: string
  nickname?: string
}

export interface EditAvatarBody {
  token: string
  userId: number
  avatarUrl: string
}
