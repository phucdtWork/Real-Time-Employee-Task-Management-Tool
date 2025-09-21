// app.js - Simple setup với TextLink
import express from "express";
import route from "./src/routes/index.js";
import cors from "cors";
import http from "http";
import dotenv from "dotenv";
import { Server } from 'socket.io';
import SocketManager from "./src/services/socketManager.js";

dotenv.config();


const app = express();


const hostname = process.env.HOSTNAME;
const port = process.env.PORT;
const clientPort = process.env.CLIENT_PORT;

app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//config socket.io
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: [`http://${hostname}:${clientPort}/`, `http://${hostname}:${port}/`],
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: false
    }
});

SocketManager.initialize(io);



route(app);

server.listen(port, hostname, () => {
    console.log(`Server is running at http://${hostname}:${port}/`);

});