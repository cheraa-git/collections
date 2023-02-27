import { AppServer, AppSocket, SocketController } from "../../types"
import { Comments } from "../../db/models/Comments"
import { Users } from "../../db/models/Users"
import { flatJoinedModel } from "../../utils"
import { ClientToServerEvents, Comment } from "../../../common/common-types"
import { checkToken } from "../../service/tokenService"

export class CommentSocket implements SocketController {

  constructor(private io: AppServer, private socket: AppSocket) {
  }

  private getComments: ClientToServerEvents['get:comments'] = async (itemId: number) => {
    this.socket.join(`item:${itemId}`)
    const comments = await Comments.findAll({
      where: { itemId },
      include: [{ model: Users, attributes: ['nickname'] }]
    })
    this.socket.emit('comments', comments.map(c => flatJoinedModel(c, [c.users]) as Comment))
  }

  private addComment: ClientToServerEvents['add:comment'] = async ({ userId, itemId, text, nickname, token, }) => {
    if (!checkToken(token, userId)) {
      return this.socket.emit('token_error')
    }
    const newComment = await Comments.create({ userId, itemId, text, timestamp: `${Date.now()}` })
    this.io.to(`item:${itemId}`).emit('new_comment', { ...newComment.dataValues, nickname })
  }

  onEvents() {
    this.socket.on('get:comments', this.getComments)
    this.socket.on('add:comment', this.addComment)
  }
}
