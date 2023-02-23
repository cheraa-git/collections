import { Express } from "express"
import { authRouter } from "./routes/authRoutes"
import { collectionRouter } from "./routes/collectionRoutes"
import { itemRouter } from "./routes/itemRouter"
import { profileRouter } from "./routes/profileRoutes"
import { adminRouter } from "./routes/adminRoutes"

export class MainRouter {
  constructor(private app: Express) {
  }

  useRoutes() {
    this.app.use('/auth', authRouter)
    this.app.use('/collection', collectionRouter)
    this.app.use('/item', itemRouter)
    this.app.use('/profile', profileRouter)
    this.app.use('/admin', adminRouter)
  }
}
