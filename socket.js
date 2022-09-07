let io;

module.exports = {
    init: (httpServer) => {
        io = require("socket.io")(httpServer, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"],
            },
        });
        return io;
    },

    getIO: () => {
        if(!io) {
            const error = new Error("Socket.io not initialized!");
            throw error;
        }

        return io;
    }
};
