import { Comments } from "../db/models/Comments"
import { Either, left, right } from "@sweet-monads/either"
import { DbError } from "../../../common/errors/DbError"

export const getAllComments = async (): Promise<Either<DbError, Comments[]>> => {
  try {
    return right(await Comments.findAll())
  } catch (e) {
    return left(new DbError('Get all comments error', e))
  }
}

