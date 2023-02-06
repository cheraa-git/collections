'use strict'

import { Router } from "express"
import { CollectionController } from "../controller/collection.controller"

const controller = new CollectionController()
export const collectionRouter = Router()

collectionRouter.post('/create', controller.createCollection)
collectionRouter.get('/:id', controller.getCollection)


