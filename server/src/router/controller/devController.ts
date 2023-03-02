import { SearchClient } from "../../apis/meilisearch"
import { Request, Response } from "express"
import { indexingAllCollections, indexingAllComments, indexingAllItems } from "../../service/searchService"

export class DevController {
  async meiliSearchSetup(req: Request, res: Response) {
    const password = req.body.password
    if (password !== process.env.DEVELOPER_PASSWORD) return res.status(500).json({ error: 'password invalid' })
    const client = new SearchClient()
    try {
      await client.createIndex('items', { primaryKey: 'id' })
      await client.createIndex('collections', { primaryKey: 'id' })
      await client.createIndex('comments', { primaryKey: 'id' })
      const itemsIndex = client.index('items')
      const commentsIndex = client.index('comments')
      const collectionsIndex = client.index('collections')
      await itemsIndex.updateSearchableAttributes(['name', 'str1', 'txt1', 'str2', 'txt2', 'str3', 'txt3'])
      await commentsIndex.updateSearchableAttributes(['text'])
      await collectionsIndex.updateSearchableAttributes(['title', 'description'])
      res.json({ status: 'completed' })
    } catch (e) {
      res.status(500).json(e)
    }
  }

  async indexingCollections(req: Request, res: Response) {
    const password = req.body.password
    if (password !== process.env.DEVELOPER_PASSWORD) return res.status(500).json({ error: 'password invalid' })
    const response = await indexingAllCollections()
    response
      .mapRight(r => res.json(r))
      .mapLeft(e => res.status(500).json(e))
  }

  async indexingComments(req: Request, res: Response) {
    const password = req.body.password
    if (password !== process.env.DEVELOPER_PASSWORD) return res.status(500).json({ error: 'password invalid' })
    const response = await indexingAllComments()
    response
      .mapRight(r => res.json(r))
      .mapLeft(e => res.status(500).json(e))
  }

  async indexingItems(req: Request, res: Response) {
    const password = req.body.password
    if (password !== process.env.DEVELOPER_PASSWORD) return res.status(500).json({ error: 'password invalid' })
    const response = await indexingAllItems()
    response
      .mapRight(r => res.json(r))
      .mapLeft(e => res.status(500).json(e))
  }
}
