'use strict'

import { Router } from "express"
import { DevController } from "../controller/devController"

const controller = new DevController()
export const devRouter = Router()


devRouter.post('/meilisearch_setup', controller.meiliSearchSetup)
devRouter.post('/indexing/collections', controller.indexingCollections)
devRouter.post('/indexing/items', controller.indexingItems)
devRouter.post('/indexing/comments', controller.indexingComments)




