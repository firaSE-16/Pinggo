import {createServer} from 'node:http';
import next from 'next';
import {Server} from "socket.io"


const dev = process.env.NODE_ENV !== "production";

const hostname="localhost"
const port = 4000;

const app=next({dev,hostname,port})

const handler = app.getRequestHandler();

app.prepare().then(()=>{
    const httpServer = createServer(handler)
    const io = new Server(httpServer)

    io.on("connection",(socket)=>{
        console.log("New client connected: ",socket.id)

        socket.on("hello",(data)=>{
            console.log("Hello received:",data)
        })

        socket.emit("welcome","welcome to the server!")
        

    })

    httpServer.listen(port,()=>{
        console.log(`> Ready on http://${hostname}:${port}`)
    })
})