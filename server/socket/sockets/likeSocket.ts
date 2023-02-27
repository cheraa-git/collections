import { AppServer, AppSocket, SocketController } from "../../types"
import { Likes } from "../../db/models/Likes"
import { Users } from "../../db/models/Users"
import { flatJoinedModel } from "../../utils"
import { ClientToServerEvents, Like } from "../../../common/common-types"
import { EmptyResultError } from "sequelize"
import { checkToken } from "../../service/tokenService"

export class LikeSocket implements SocketController {

  constructor(private io: AppServer, private socket: AppSocket) {
  }

  getLikes: ClientToServerEvents['get:likes'] = async (itemId: number) => {
    this.socket.join(`item:${itemId}`)
    const likes = await Likes.findAll({ where: { itemId }, include: [{ model: Users, attributes: ['nickname'] }] })
    const flatLikes = likes.map(like => flatJoinedModel(like, [like.users]) as Like)

    this.socket.emit('likes', flatLikes)
  }

  setLike: ClientToServerEvents['set:like'] = async ({ token, userId, itemId, nickname }) => {
    try {
      if (!checkToken(token, userId)) {
        return this.socket.emit('token_error')
      }
      const like = await Likes.create({ userId, itemId }, { ignoreDuplicates: true, }) as unknown as Likes
      this.io.to(`item:${itemId}`).emit('like', { ...like.dataValues, nickname })
    } catch (e) {
      if (e instanceof EmptyResultError) {
        await Likes.destroy({ where: { userId, itemId } })
        this.io.to(`item:${itemId}`).emit('cancel_like', userId)
      }
    }

  }

  onEvents() {
    this.socket.on('get:likes', this.getLikes)
    this.socket.on('set:like', this.setLike)
  }
}
