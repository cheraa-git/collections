'use strict'

import { Router } from "express"
import { ProfileController } from "../controller/profileController"

const controller = new ProfileController()
export const profileRouter = Router()

profileRouter.get('/:userId', controller.handleGetProfile)



