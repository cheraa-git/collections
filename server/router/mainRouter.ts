import { Express } from "express"
import { authRouter } from "./routes/auth.routes"
import { collectionRouter } from "./routes/collection.routes"
import { itemRouter } from "./routes/item.router"
import { profileRouter } from "./routes/profile.routes"

export class MainRouter {
  constructor(private app: Express) {
  }

  useRoutes() {
    this.app.use('/auth', authRouter)
    this.app.use('/collection', collectionRouter)
    this.app.use('/item', itemRouter)
    this.app.use('/profile', profileRouter)
  }
}
