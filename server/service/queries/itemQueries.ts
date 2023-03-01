import { Items } from "../../db/models/Items"
import { Tags } from "../../db/models/Tags"
import { Sequelize } from "sequelize-typescript"

export const getRangeItemsQuery = async (params: { offset: number, limit: number, tagIds?: number[] }) => {
  return await Items.findAll({
    offset: params.offset,
    limit: params.limit,
    include: [
      {
        model: Tags,
        through: { attributes: [] },
        where: (params.tagIds && params.tagIds.length > 0) ? { id: params.tagIds } : undefined,
      },
    ],
    order: [Sequelize.literal('timestamp DESC')]
  })
}

export const getItemWithTagsQuery = async (params: { itemId: number }) => {
  return await Items.findOne({
    where: { id: params.itemId },
    include: {
      model: Tags,
      through: { attributes: [] }
    }
  })
}
