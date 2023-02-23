import { Items } from "./db/models/Items"
import dotenv from "dotenv"
import * as jwt from "jsonwebtoken"
import { JwtPayload } from "jsonwebtoken"
import { Model } from "sequelize-typescript"

export const filterItem = (item: Items | null) => {
  if (!item) return {}
  const filterItem: { [key: string]: any } = {}
  Object.entries(item?.dataValues).forEach(([key, value]) => {
    if (value) {
      filterItem[key] = value
    }
  })
  return filterItem
}

export const checkToken = (token?: string, userId?: number): boolean => {
  if (!token || !userId) return false
  dotenv.config()
  const jwtPayload = jwt.verify(token, String(process.env.TOKEN_SECTET_KEY)) as JwtPayload
  return (jwtPayload.id === userId || jwtPayload.isAdmin) ?? jwtPayload.status === 'active'
}

export const checkAdminToken = (token?: string) => {
  if (!token) return false
  dotenv.config()
  const jwtPayload = jwt.verify(token, String(process.env.TOKEN_SECTET_KEY)) as JwtPayload
  return jwtPayload.isAdmin && jwtPayload.status === 'active'
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
