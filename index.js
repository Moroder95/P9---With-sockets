const express = require('express');
const path = require('path');

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
let phoneId = '';

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// Serve the phone UI
app.get('/phone', (req, res)=>{
    res.sendFile(path.join(__dirname, '/phone.html'));
});

// An api endpoint that returns a short list of items
app.get('/api/getList', (req,res) => {
    var list = ["item1", "item2", "item3"];
    res.json(list);
    console.log('Sent list of items');
});

// Handles any requests that don't match the ones above
app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

io.on('connection', (socket) => {
    console.log('a user connected');
    let phoneRegex = /phone/;

    if(phoneRegex.test(socket.handshake.headers.referer)) {
        console.log('phone connected');

        if(phoneId !== socket.id) {
            io.emit('phone connected', 'swipe');
            phoneId = socket.id;
        }
    }

    socket.on('mobile navigation', (input) => {
        socket.broadcast.emit('tablet navigation', input);
    });

    socket.on('alphanumeric input', (input) => {
        socket.broadcast.emit('mobile AK', input);
    });

    socket.on('note input', (input) => {
        socket.broadcast.emit('note input', input);
    });

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
});



const port = process.env.PORT || 5000;
// app.listen(port);
http.listen(port, ()=>{
    console.log('listening on *:5000');
});

console.log('App is listening on port ' + port);