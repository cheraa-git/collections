import { Request, Response } from "express"
import { CreateItemBody, DeleteItemBody, EditItemBody } from "../../../common/request-types"
import { Tags } from "../../db/models/Tags"
import {
  createItem,
  deleteItem,
  editItem,
  getItem,
  getItemAuthorId,
  getMostPopularTags,
  getNextItems
} from "../../service/itemService"
import { checkToken } from "../../service/tokenService"
import { TokenError } from "../../../common/errors/TokenError"
import { DatabaseError } from "../../../common/errors/DatabaseError"

export class ItemController {

  handlerCreateItem = async (req: Request<any, any, CreateItemBody>, res: Response) => {
    const { collectionId, fields, userId, token, tags } = req.body
    if (!checkToken(token, userId)) return res.status(498).json(new TokenError())
    return (await createItem(userId, collectionId, fields, tags))
      .mapRight(item => res.json(item))
      .mapLeft(e => res.status(500).json(e))
  }

  handleGetItem = async ({ params: { id } }: Request, res: Response) => {
    return (await getItem(+id))
      .mapRight(data => res.json(data))
      .mapLeft(e => res.status(500).json(e))
  }

  handleEditItem = async (req: Request<any, any, EditItemBody>, res: Response) => {
    const { item, token } = req.body
    if (!checkToken(token, await getItemAuthorId(item.collectionId))) {
      return res.status(498).json(new TokenError())
    }
    return (await editItem(item))
      .mapRight(editedItem => res.json(editedItem))
      .mapLeft(e => res.status(500).json(e))
  }

  handleDeleteItem = async (req: Request<any, any, DeleteItemBody>, res: Response) => {
    const { item, token } = req.body
    if (!checkToken(token, await getItemAuthorId(item.collectionId))) {
      return res.status(498).json(new TokenError())
    }
    return (await deleteItem(item.id))
      .mapRight(r => res.json(r))
      .mapLeft(e => res.status(500).json(e))
  }

  async getTags(req: Request, res: Response) {
    try {
      res.json(await Tags.findAll())
    } catch (e) {
      res.status(500).json(new DatabaseError('Get tags error', e))
    }
  }

  async handleGetNextItems({ query: { offset, limit, tagIds } }: Request, res: Response) {
    if (!offset || !limit) return res.json([])
    const parsedTagIds = tagIds ? JSON.parse(tagIds as string) : undefined
    const itemsResponse = await getNextItems(Number(offset), Number(limit), parsedTagIds)
    itemsResponse
      .mapRight(items => res.json(items))
      .mapLeft(e => res.status(500).json(e))
  }

  async handleGetMostPopularTags(req: Request, res: Response) {
    const response = await getMostPopularTags()
    response
      .mapRight(r => res.json(r))
      .mapLeft(e => res.status(500).json(e))
  }

}
