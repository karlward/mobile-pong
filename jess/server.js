var http = require("http");
var fs = require("fs");
var httpServer = http.createServer(requestHandler);
httpServer.listen(8080);

function requestHandler (req, res){

	fs.readFile(__dirname + '/index.html',
		function (err, data) {
			if (err) {
				res.writeHead(500);
				return res.end('Error loading index.html');
			}

			res.writeHead(200);
			res.end(data);
		});
}

var users = [];
var displaySocket = null;
var io = require('socket.io').listen(httpServer);
	
io.sockets.on('connection',

		// We are given a websocket object in our function
	function (socket) {
		
		if(displaySocket === null){
			displaySocket = socket.id;
			io.sockets.socket(displaySocket).emit('news', {id: displaySocket, type: "display"});
		
		}else if(displaySocket !== null){
			users[users.length] = socket.id;
			console.log("We have a new player: " + socket.id);
			if(users.length < 3){
			for(var i = 1; i < users.length; i++){
				io.sockets.socket(displaySocket).emit('news', {id: users[i], type: "player" + i});
			}
		}

	}
		
		// When this user "send" from clientside javascript, we get a "message"
		// client side: socket.send("the message");  or socket.emit('message', "the message");
		socket.on('message', function (data) {
				console.log("message: " + data);

			}
		);
		
		socket.on('disconnect', function() {
			console.log("Client has disconnected");
		});
	}

);
