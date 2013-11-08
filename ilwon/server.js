// HTTP Portion
var http = require('http');
var fs = require('fs'); // Using the filesystem module
var httpServer = http.createServer(requestHandler);
httpServer.listen(8080);

function requestHandler(req, res) {
	// Read index.html
	fs.readFile(__dirname + '/index.html', 
		// Callback function for reading
		function (err, data) {
			// if there is an error
			if (err) {
				res.writeHead(500);
				return res.end('Error loading canvas_socket.html');
			}
			// Otherwise, send the data, the contents of the file
			res.writeHead(200);
			res.end(data);
  		}
  	);
};


// WebSocket Portion
// WebSockets work with the HTTP server
var io = require('socket.io').listen(httpServer);

var users = new Array();

//
// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection', 
	// We are given a websocket object in our function
	function (socket) {
		users[users.length] = socket.id;

		socket.emit('createMe', socket.id);

		for(var i = 0; i < users.length; i++){
		   socket.emit('createOthers', users[i]);	
		}

		socket.on('createOthers', function(data){

			socket.broadcast.emit('createOthers', data);
		});

		socket.on('coordinate',function(data){
			socket.broadcast.emit('display', data);
		});
		
		socket.on('disconnect', function() {
			console.log("Client has disconnected " + socket.id);

			for(var i = 0; i < users.length; i++){
			users.splice[socket.id,1];
			}
		});

	}
);
