import { Items } from "../../db/models/Items"
import { Sequelize } from "sequelize"
import { Collections } from "../../db/models/Collections"
import { Users } from "../../db/models/Users"
import { ItemConfigs } from "../../db/models/ItemConfigs"
import { Tags } from "../../db/models/Tags"

export const getCollectionsByItemCountQuery = async (params: { offset?: number, limit?: number, themeId: number }) => {
  return await Items.findAll({
    offset: params.offset,
    limit: params.limit,
    attributes: [[Sequelize.fn('count', Sequelize.col('collectionId')), 'count']],
    include: [{
      model: Collections,
      where: params.themeId ? { themeId: params.themeId } : undefined,
      attributes: ['title', 'description', 'themeId', 'imageUrl', 'timestamp', 'id'],
      include: [{ model: Users, attributes: ['nickname'] }]
    }],
    group: ['Items.collectionId', 'collections.id', 'collections.users.id'],
    order: Sequelize.literal('count DESC'),
  })
}

export const getFullCollectionDataQuery = async (id: number) => {
  return await Collections.findOne({
    where: { id },
    include: [
      { model: ItemConfigs },
      { model: Users },
      { model: Items, include: [{ model: Tags, through: { attributes: [] } }] }
    ]
  })
}
