'use strict'

import { Router } from "express"
import { DevController } from "../controller/devController"
import { SearchClient } from "../../apis/meilisearch"

const controller = new DevController()
export const devRouter = Router()

const test = (req: any, res: any) => {
  const index = new SearchClient().index('comments')
  index.search('ni', { attributesToCrop: ['itemId'], })
    .then(r => res.json(r))

}
devRouter.post('/meilisearch_setup', controller.meiliSearchSetup)
devRouter.post('/indexing/collections', controller.indexingCollections)
devRouter.post('/indexing/items', controller.indexingItems)
devRouter.post('/indexing/comments', controller.indexingComments)
devRouter.post('/test', test)




