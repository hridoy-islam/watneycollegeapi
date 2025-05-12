"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIO = exports.initializeSocket = void 0;
const socket_io_1 = require("socket.io");
let io = null;
const initializeSocket = (server) => {
    io = new socket_io_1.Server(server, {
        pingTimeout: 60000,
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });
    io.on("connection", (socket) => {
        console.log("Connected to socket.io");
        socket.on("setup", (userData) => {
            socket.join(userData._id);
            // console.log(userData._id);
            socket.emit("connected");
        });
        socket.on("join chat", (room) => {
            socket.join(room);
            // console.log("user joined room " + room);
        });
        socket.on("typing", (typer) => {
            const { room, user } = typer;
            socket.broadcast.to(room).emit("typing", typer);
        });
        socket.on("stop typing", (typer) => {
            const { room, user } = typer;
            socket.broadcast.to(room).emit("stop typing", typer);
        });
        socket.on("new message", (newMessageReceived) => {
            var _a;
            let chat = (_a = newMessageReceived === null || newMessageReceived === void 0 ? void 0 : newMessageReceived.data) === null || _a === void 0 ? void 0 : _a.data;
            // console.log(chat)
            if (!chat.authorId) {
                return console.log("chat.users not defined");
            }
            // chat?.users?.forEach((user: any) => {
            //   if (user?._id === newMessageReceived.sender?._id) {
            //     return;
            //   }
            // });
            else if ((chat === null || chat === void 0 ? void 0 : chat.authorId) !== (chat === null || chat === void 0 ? void 0 : chat.otherUser)) {
                socket
                    .in(chat.otherUser)
                    .emit("message received", newMessageReceived);
            }
            if (chat === null || chat === void 0 ? void 0 : chat.otherUserArr) {
                chat === null || chat === void 0 ? void 0 : chat.otherUserArr.forEach((user) => {
                    socket.in(user === null || user === void 0 ? void 0 : user._id).emit("message received", newMessageReceived);
                });
            }
        });
        // Handle new comment events
        socket.on("newComment", (commentData) => {
            const { taskId, authorId, otherUser } = commentData;
            // Ensure `io` is initialized before emitting
            if (!io) {
                console.error("Socket.io is not initialized!");
                return;
            }
            // Emit the new comment to the specific task's room
            if (taskId) {
                io.to(taskId.toString()).emit("newComment", commentData);
                console.log(`New comment emitted to task room: ${taskId}`);
            }
            // Notify the assigned user (otherUser) if they are not the author
            if (otherUser && otherUser !== authorId) {
                io.to(otherUser.toString()).emit("newComment", commentData);
                console.log(`New comment emitted to assigned user: ${otherUser}`);
            }
        });
        // Add other socket event handlers as needed
        socket.on("send notification", (notificationData) => {
            if (notificationData.userId) {
                socket.to(notificationData.userId).emit("notification", notificationData);
                console.log(`Notification sent to user ${notificationData.userId}`);
            }
        });
        socket.on("disconnect", () => {
            console.log("User disconnected");
        });
        socket.off("setup", (userData) => {
            socket.leave(userData._id);
        });
    });
};
exports.initializeSocket = initializeSocket;
const getIO = () => {
    if (!io) {
        throw new Error("Socket.io has not been initialized!");
    }
    return io;
};
exports.getIO = getIO;
