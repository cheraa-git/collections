import { Collections } from "../db/models/Collections"
import { Users } from "../db/models/Users"
import { Either, left, right } from "@sweet-monads/either"
import { DatabaseError } from "../../common/errors/DatabaseError"
import { GetProfileResponse } from "../../common/response-types"


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

