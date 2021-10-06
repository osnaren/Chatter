const express = require('express')
const socket = require("socket.io");
const http = require('http');
const port = process.env.PORT || 3030
const app = express()
const path = require('path')

// Create server & host static files
var server = http.createServer(app);
app.use(express.static(path.join(__dirname, 'public')))

const io = socket(server);


// Render Homepage
app.get('/', (req, res) => {
    //console.log('hello');
    res.sendFile(__dirname + '/public/index.html');
});

// Check server routing
app.get('/hello', (req, res) => {
    res.end("{'hi': 'osn'}");
});

var name;

// Socket functions
io.on('connection', (socket) => {

    socket.on('joining msg', (username) => {
        name = username;
        if (name === 'null') {
            name = `User${Math.floor(Math.random() * 1000000)}`;
        }
        socket.username = name;
        //console.log(socket.username, ' connected');
        io.emit('chat message', {msg: `--- ${name} Joined the Chat ---`, mynm: name});
        io.emit('chatusr', name);
    });

    socket.on('disconnect', (name) => {
        //console.log(socket.username, ' disconnected');
        io.emit('chat message', {msg: `--- ${socket.username} Left the Chat ---`, mynm: name});

    });
    socket.on('chat message', (msg) => {
        socket.broadcast.emit('chat message', msg);         //sending message to all except the sender
    });
    socket.on('user message', (msg) => {
        //console.log(msg);
        io.emit('user message', msg);
        //socket.broadcast.emit('user message', msg);         //sending message to all except the sender
    });
    socket.on('typing', (data) => {
        const {isTyping, nick} = data;
        if (!isTyping)
            io.emit('typing', data)
        else
            io.emit('typing', data)
    })
});

// Server Listening
server.listen(port, () => {
    console.log('Node Server running', port)
    console.log(('http://localhost:' + port))
})
