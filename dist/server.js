"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./app/config"));
const socket_1 = require("./socket");
let server;
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect(config_1.default.database_url);
            server = app_1.default.listen(config_1.default.port, () => {
                console.log(`app is listening on port ${config_1.default.port}`);
            });
            (0, socket_1.initializeSocket)(server);
            // const io = require("socket.io")(server, {
            //   pingTimeout: 60000,
            //   cors: {
            //     origin: "*",
            //     methods: ["GET", "POST"],
            //   },
            // });
            // io.on("connection", (socket: any) => {
            //   // console.log("connected to socket.io");
            //   // socket.on("setup", (userData: any) => {
            //   //   socket.join(userData._id);
            //   //   // console.log(userData._id);
            //   //   socket.emit("connected");
            //   // });
            //   // socket.on("join chat", (room: any) => {
            //   //   socket.join(room);
            //   //   // console.log("user joined room " + room);
            //   // });
            //   // socket.on("typing", (typer: any) => {
            //   //   const {room, user} = typer;
            //   //   socket.broadcast.to(room).emit("typing", typer);
            //   // });
            //   // socket.on("stop typing", (typer: any) => {
            //   //   const {room, user} = typer;
            //   //   socket.broadcast.to(room).emit("stop typing", typer);
            //   // });
            //   // socket.on("new message", (newMessageReceived: any) => {
            //   //   let chat = newMessageReceived?.data?.data;
            //   //   // console.log(chat)
            //   //   if (!chat.authorId) {
            //   //     return console.log("chat.users not defined");
            //   //   }
            //   //   // chat?.users?.forEach((user: any) => {
            //   //   //   if (user?._id === newMessageReceived.sender?._id) {
            //   //   //     return;
            //   //   //   }
            //   //   // });
            //   //   else if(chat?.authorId !== chat?.otherUser){
            //   //     socket
            //   //       .in(chat.otherUser)
            //   //       .emit("message received", newMessageReceived);
            //   //   }
            //   //   if (chat?.otherUserArr) {
            //   //     chat?.otherUserArr.forEach((user: any) => {
            //   //       socket.in(user?._id).emit("message received", newMessageReceived);
            //   //     });
            //   //   }
            //   // }
            //   // );
            //   // socket.off("setup", (userData: any) => {
            //   //   socket.leave(userData._id);
            //   // });
            // });
        }
        catch (err) {
            console.log(err);
        }
    });
}
main();
process.on("unhandledRejection", (err) => {
    console.log(`😈 unahandledRejection is detected , shutting down ...`, err);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
process.on("uncaughtException", () => {
    console.log(`😈 uncaughtException is detected , shutting down ...`);
    process.exit(1);
});
