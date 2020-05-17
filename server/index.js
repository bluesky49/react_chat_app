const express = require('express');
const app = express();
const http = require("http").Server(app);
const path = require('socket.io')(http)

const uri = process.env.MONGODB_URI;
const port = process.env.PORT || 5000;

const Message = require('./Message');
const mongoose = require('mongoose');

mongoose.connect(uri, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});

app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

io.on('connection', (socket) => {

    Message.find().sort({createdAt: -1}).limit(10).exec((err, messages) => {
        if (err) return console.error(err);

        socket.emit('init', messages);
        
    });

    socket.on('mesage',(msg) => {
        const message = new Message({
            content: msg.content,
            name: msg.name,
        });

        message.save((err) => {
            if (err) return console.error(err);
        });
        socket.broadcast.emit('push', msg);
    });
});

http.listen(port, () => {
    console.log('listening on *: ' + port);
});