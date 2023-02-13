import { Items } from "./db/models/Items"

export const filterItem = (item: Items | null ) => {
    const filterItem: { [key: string]: any } = {}
    Object.entries(item?.dataValues).forEach(([key, value]) => {
      if (value) {
        filterItem[key] = value
      }
    })
    return filterItem
}
