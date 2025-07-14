'use client'

import {io, Socket} from "socket.io-client"

interface ServerToClientEvents{
    welcome:(message:string)=>void;

}



interface ClientToServerEvents {
    hello:(message:string)=>void;
}

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io({
    autoConnect: false,
})