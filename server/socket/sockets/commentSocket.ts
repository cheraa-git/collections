import { AppServer, AppSocket, SocketController } from "../../types"
import { Comments } from "../../db/models/Comments"
import { Users } from "../../db/models/Users"
import { checkToken, flatJoinedModel } from "../../utils"
import { Comment } from "../../../common/common-types"

export class CommentSocket implements SocketController {
  private socket: AppSocket
  private io: AppServer

  constructor(io: AppServer, socket: AppSocket) {
    this.socket = socket
    this.io = io
  }

  private getComments = async (itemId: number) => {
    const comments = await Comments.findAll({
      where: { itemId },
      include: [{ model: Users, attributes: ['nickname'] }]
    })
    this.socket.emit('comments', comments.map(c => flatJoinedModel(c, [c.users]) as Comment))
  }

  private addComment = async (token: string, userId: number, itemId: number, text: string, nickname: string) => {
    if (!checkToken(token, userId)) {
      return this.socket.emit('token_error')
    }
    const newComment = await Comments.create({ userId, itemId, text, timestamp: `${Date.now()}` })
    this.io.sockets.emit('new_comment', { ...newComment.dataValues, nickname })
  }

  onEvents() {
    this.socket.on('get_comments', this.getComments)
    this.socket.on('add_comment', this.addComment)
  }
}
