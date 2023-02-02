'use strict'

import { Router } from "express"
import controller from '../controller/auth.controller'

export const authRouter = Router()

authRouter.post('/login', controller.loginUser)
authRouter.post('/register', controller.registerUser)

