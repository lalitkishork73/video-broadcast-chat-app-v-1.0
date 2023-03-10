import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import { v4 as uuidv4 } from 'uuid';

const PORT = 3000;
const app = express()
const server = http.createServer(app);

app.set('view engine', 'ejs')
app.use(express.static('public'))

const IO = new Server().listen(server);

app.get('/', (req, res) => {
    res.redirect(`/${uuidv4()}`);
})
app.get('/:room', (req, res) => {
    res.render('room', { roomId: req.params.room })
});

IO.on("connection", socket => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId)
        socket.to(roomId).emit('user-connected', userId)
        console.log(userId)
    })
    
        // socket.on('disconnect', () => {
        //     socket.broadcast.to(roomId).emit('user-disconnected', userId)
            
        // })
})

server.listen(process.env.PORT || PORT, () => {
    console.log(`Server listening on port ${process.env.PORT || PORT}`);
})