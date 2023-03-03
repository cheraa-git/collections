import { Socket } from "socket.io-client"
import { ClientToServerEvents, ServerToClientEvents } from "../../../common/types/socket"

export type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>
