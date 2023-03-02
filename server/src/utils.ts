import { Items } from "./db/models/Items"
import { Model } from "sequelize-typescript"

export const filterItem = (item: Items | null) => {
  if (!item) return {}
  const filterItem: { [key: string]: any } = {}
  Object.entries(item?.dataValues || item).forEach(([key, value]) => {
    if (value) {
      filterItem[key] = value
    }
  })
  return filterItem
}

export const flatJoinedModel = (obj: Model, from: Model[]) => {
  let flatObj: { [key: string]: any } = {}
  Object.entries(obj?.dataValues).forEach(([key, value]) => {
    if (typeof value !== "object") {
      flatObj[key] = value
    }
  })
  const joinedValues = from.reduce((acc, model) => ({ ...acc, ...model?.dataValues }), {})
  return { ...flatObj, ...joinedValues }
}
