let ioInstance = null;

const initSockets = (io) => {
    ioInstance = io;
    io.on('connection', (socket) => {
        console.log('Client connected:', socket.id);
        
        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });
    });
};

const getIo = () => {
    if (!ioInstance) throw new Error("Socket.io not initialized!");
    return ioInstance;
};

module.exports = {
    initSockets,
    getIo
};
