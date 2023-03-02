'use strict'

import { Router } from "express"
import { ItemController } from "../controller/itemController"

const controller = new ItemController()
export const itemRoutes = Router()

itemRoutes.post('/', controller.handlerCreateItem)
itemRoutes.patch('/', controller.handleEditItem)
itemRoutes.delete('/', controller.handleDeleteItem)
itemRoutes.get('/tags', controller.getTags)
itemRoutes.get('/popular_tags', controller.handleGetMostPopularTags)
itemRoutes.get('/next', controller.handleGetNextItems)
itemRoutes.get('/:id', controller.handleGetItem)



