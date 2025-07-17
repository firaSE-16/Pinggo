import {createServer} from 'node:http';
import next from 'next';
import {Server} from "socket.io"
import type { Server as SocketIOServer } from 'socket.io';


const dev = process.env.NODE_ENV !== "production";

const hostname="localhost"
const port = 4000;

const app=next({dev,hostname,port})

const handler = app.getRequestHandler();

let io: SocketIOServer | undefined;
let onlineUsers: Map<string, string> | undefined;

app.prepare().then(()=>{
    const httpServer = createServer(async (req, res) => {
        try {
            // Handle API routes and all other requests
            await handler(req, res);
        } catch (error) {
            console.error('Server error:', error);
            res.statusCode = 500;
            res.end('Internal Server Error');
        }
    })
    io = new Server(httpServer, {
        cors: {
            origin: '*', // Adjust as needed for production
        },
    })

    // Online users: { userId: socketId }
    onlineUsers = new Map();

    io!.on("connection",(socket)=>{
        console.log("New client connected: ",socket.id)

        // Listen for user identification
        socket.on("user:online", (userId) => {
            onlineUsers!.set(userId, socket.id);
            io!.emit("users:online", Array.from(onlineUsers!.keys()));
            socket.data.userId = userId;
        });

        // Listen for chat messages
        socket.on("chat:message", (data) => {
            // data: { to, from, message, timestamp }
            const toSocketId = onlineUsers!.get(data.to);
            if (toSocketId) {
                io!.to(toSocketId).emit("chat:message", data);
            }
            // Optionally, echo to sender for instant UI update
            socket.emit("chat:message", data);
        });

        // On disconnect, remove from online users
        socket.on("disconnect", () => {
            const userId = socket.data.userId;
            if (userId) {
                onlineUsers!.delete(userId);
                io!.emit("users:online", Array.from(onlineUsers!.keys()));
            }
        });

        socket.on("hello",(data)=>{
            console.log("Hello received:",data)
        })

        socket.emit("welcome","welcome to the server!")
    })

    httpServer.listen(port,()=>{
        console.log(`> Ready on http://${hostname}:${port}`)
    })
})

// Export io and onlineUsers for use in API routes (ESM syntax)
export { io, onlineUsers };