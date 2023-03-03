import { DefaultEventsMap } from "socket.io/dist/typed-events"
import { Server, Socket } from "socket.io"
import { ClientToServerEvents, ServerToClientEvents, SocketData } from "../../../common/types/socket"


export type AppServer = Server<ClientToServerEvents, ServerToClientEvents, DefaultEventsMap, SocketData>
export type AppSocket = Socket<ClientToServerEvents, ServerToClientEvents, DefaultEventsMap, SocketData>

export interface SocketController {
  onEvents(): void
}
