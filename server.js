// app.js
var express = require('express');  
var app = express();  
var server = require('http').createServer(app);  
var io = require('socket.io')(server);

var logfile   = /var/log/user.log

// to be able to make system calls
var exec = require('child_process').execSync;


app.use(express.static(__dirname + '/node_modules'));  
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res,next) {  
    res.sendFile(__dirname + '/index.html');
});

bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require('./api/routes/routes'); //importing route
routes(app); //register the route

Tail = require('tail').Tail;
var options= {separator: /[\r]{0,1}\n/, fromBeginning: true, fsWatchOptions: {}, follow: true, logger: console};

function ConnectionLog(client, logFile, clientEmitMsg) {
  exec('rm -f '+logFile);
  exec('touch '+logFile);
  tail = new Tail(logFile, options);
  console.log('Client connected...');
  tail.on("line", function(data) {
    console.log('socket.emit ' + data);
    client.emit(clientEmitMsg, {logs: data});
  });
  client.on('join', function(data) {
      console.log(data);
      client.emit('messages', 'Hello from server');
  });
}

console.log('Read logfile at ' + logfile);

io.on('connection', function(client) {
  ConnectionLog(client, logfile,   'Message');
});


server.listen(4200);
console.log('Server started');


