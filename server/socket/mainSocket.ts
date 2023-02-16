import { AppServer, SocketController } from "../types"
import { CommentSocket } from "./sockets/commentSocket"
import http from "http"
import { Server } from "socket.io"

export class MainSocket implements SocketController {
  private readonly io: AppServer

  constructor(server: http.Server) {
    this.io = new Server(server)
  }

  private onDisconnect = () => {
    console.log('DISCONNECT:', this.io.sockets.sockets.size)
  }

  private onError = (error: Error) => {
    console.log("ERROR", error)
  }

  onEvents() {
    this.io.on('connection', (socket) => {
      socket.on('disconnect', this.onDisconnect)
      socket.on('error', this.onError)
      new CommentSocket(this.io, socket).onEvents()
    })
  }

}
