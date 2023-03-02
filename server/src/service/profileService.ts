import { Collections } from "../db/models/Collections"
import { Users } from "../db/models/Users"
import { Either, left, right } from "@sweet-monads/either"
import { DatabaseError } from "../../../common/errors/DatabaseError"
import { GetProfileResponse } from "../../../common/response-types"
import { parseEditProfileToken } from "./tokenService"
import { TokenError } from "../../../common/errors/TokenError"


export const getProfile = async (userId: number): Promise<Either<DatabaseError, GetProfileResponse>> => {
  try {
    const collections = await Collections.findAll({ where: { userId } })
    const user = await Users.findOne({
      where: { id: userId },
      attributes: ['id', 'nickname', 'avatarUrl']
    })
    return right({ collections, user: user?.dataValues })
  } catch (e) {
    return left(new DatabaseError('Get profile error', e))
  }
}

export const editProfile = async (token: string): Promise<Either<DatabaseError | TokenError, number>> => {
  try {
    return parseEditProfileToken(token)
      .asyncMap(async (userData) => {
        const user = await Users.update(userData, { where: { email: userData.oldEmail }, returning: ['*'] })
        return user[1][0].id
      })
  } catch (e) {
    return left(new DatabaseError('editProfile: Error', e))
  }
}

export const editAvatar = async (userId: number, avatar: string): Promise<Either<DatabaseError, { avatarUrl: string }>> => {
  try {
    const updatedUser = (await Users.update({ avatarUrl: avatar }, {
      where: { id: userId },
      returning: ['avatarUrl']
    }))[1][0]
    return right({ avatarUrl: updatedUser.avatarUrl })
  } catch (e) {
    return left(new DatabaseError('editAvatar: Error', e))
  }
}
