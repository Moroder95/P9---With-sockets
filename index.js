const express = require('express');
const path = require('path');

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

app.

// An api endpoint that returns a short list of items
app.get('/api/getList', (req,res) => {
    var list = ["item1", "item2", "item3"];
    res.json(list);
    console.log('Sent list of items');
});
app.get('/phone', (req, res)=>{
    res.sendFile(path.join(__dirname, '/phone.html'));
});

// Handles any requests that don't match the ones above
app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('navigation', (input) => {
        console.log('user action: ' + input);
        io.sockets.emit('navigation', input);
    })

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