import { Comments } from "../db/models/Comments"

export const getAllComments = async () => {
  return await Comments.findAll()
}

