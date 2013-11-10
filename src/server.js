var http = require("http");
var fs = require("fs");
var httpServer = http.createServer(requestHandler);
httpServer.listen(8080);

function requestHandler (req, res){
  fs.readFile(__dirname + '/' + req.url,
      function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading ' + req.url);
    }

    res.writeHead(200);
    res.end(data);
  });
}

var users = new Array();
var displaySocket = null;
var io = require('socket.io').listen(httpServer);

io.sockets.on('connection', function (socket) {
  if (displaySocket === null){
    console.log('setting displaySocket');
    displaySocket = socket.id;
//    io.sockets.socket(displaySocket).emit('players', {id: displaySocket, type: "display"});
    io.sockets.emit('players', {id: displaySocket, type: "display"});
  }
  else if (displaySocket !== null){
    if (users.length < 2) {
      console.log("We have a new player: " + socket.id);
      users[users.length] = socket.id;
      io.sockets.emit('players', {socketId: socket.id, type: "player" + users.length});
    }
  }

  socket.on('move', function (data) {
    console.log("move: " + JSON.stringify(data));
    io.sockets.emit('move', data);
  });

  socket.on('disconnect', function() {
    console.log("Client has disconnected");
  });
}

);
