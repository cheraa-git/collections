import { Collections } from "../db/models/Collections"
import { Users } from "../db/models/Users"

export const getProfile = async (userId: number) => {
  const collections = await Collections.findAll({ where: { userId } })
  const user = await Users.findOne({
    where: { id: userId },
    attributes: ['id', 'nickname', 'avatarUrl']
  })
  return { collections, user: user?.dataValues }
}
