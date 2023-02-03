'use strict'

import { Router } from "express"
import AuthController from '../controller/auth.controller'

const controller = new AuthController()
export const authRouter = Router()

authRouter.post('/login', controller.loginUser)
authRouter.post('/register', controller.registerUser)
authRouter.post('/autologin', controller.autoLogin)

