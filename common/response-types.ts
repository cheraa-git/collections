import { Collection } from "./common-types"

export interface GetProfileResponse {
  collections: Collection[]
  user: { id: number, nickname: string, avatarUrl?: string, status: 'active' | 'blocked' | 'deleted' }
}

