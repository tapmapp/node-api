var io = null;

exports.initialize = function(server) {

    const PORT = 3030;
    var io = require('socket.io')(PORT);
    
    io.on('connection', function(socket) {
       
        socket.on('disconnect', function(){
            console.log('Disconnected.');
        })

    });
    return io;
};