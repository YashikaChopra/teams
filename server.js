const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')
const { ExpressPeerServer } = require('peer')
const peerServer = ExpressPeerServer(server, {
    debug: true
});

const recordScreen = require('record-screen')

// rendering views, using ejs lib
app.set('view engine', 'ejs')
// setting up static folder -> all of js, css in *public* folder
app.use(express.static('public'))

app.use('/peerjs', peerServer)

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/homepage', (req, res) => {
    res.redirect(`/${uuidV4()}`)
})

app.get('/:room', (req, res) => {
    res.render('room', { roomId: req.params.room})
})

//runs anytime a user connects to web page
//join-room is event
io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        // for current socket to join a room
        socket.join(roomId)
        // send a msg to everyone in the room that a new user connected
        socket.broadcast.to(roomId).emit('user-connected', userId)

        socket.on('message', message => {
            io.to(roomId).emit('createMessage', message)
        })

        socket.on('disconnect', () => {
            socket.broadcast.to(roomId).emit('user-disconnected', userId)
        })
    })
})

server.listen(process.env.PORT || 4000)