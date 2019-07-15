var io = null;

exports.initialize = function(server) {

    var io = require('socket.io').listen(server);
    
    io.on('connection', function(socket) {
       
        socket.on('disconnect', function(){
            console.log('Disconnected.');
        })

    });
    return io;
};