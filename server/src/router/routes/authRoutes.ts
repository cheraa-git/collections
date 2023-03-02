'use strict'

import { Router } from "express"
import AuthController from '../controller/authController'

const controller = new AuthController()
export const authRouter = Router()

authRouter.post('/login', controller.handleLoginUser)
authRouter.post('/register', controller.handleRegisterUser)
authRouter.post('/autologin', controller.handleAutoLogin)

