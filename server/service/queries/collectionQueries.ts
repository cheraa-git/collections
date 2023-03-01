import { Items } from "../../db/models/Items"
import { Sequelize } from "sequelize"
import { Collections } from "../../db/models/Collections"
import { Users } from "../../db/models/Users"

export const getCollectionsByItemCountQuery = async (params: { offset?: number, limit?: number }) => {
  return  await Items.findAll({
    offset: params.offset,
    limit: params.limit,
    attributes: [[Sequelize.fn('count', Sequelize.col('collectionId')), 'count']],
    include: [{
      model: Collections,
      attributes: ['title', 'description', 'themeId', 'imageUrl', 'timestamp', 'id'],
      include: [{ model: Users, attributes: ['nickname'] }]
    }],
    group: ['Items.collectionId', 'collections.id', 'collections.users.id'],
    order: Sequelize.literal('count DESC'),
  })
}
