import { Comments } from "../db/models/Comments"
import { Either, left, right } from "@sweet-monads/either"
import { DatabaseError } from "../../common/errors/DatabaseError"

export const getAllComments = async (): Promise<Either<DatabaseError, Comments[]>> => {
  try {
    return right(await Comments.findAll())
  } catch (e) {
    return left(new DatabaseError('Get all comments error', e))
  }
}

