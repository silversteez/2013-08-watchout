var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')

app.listen(8012);

var players = { 
  host: undefined,
  slave: undefined
};

function handler (req, res) {
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

io.sockets.on('connection', function (socket) {
  socket.emit('connected', { connection: 'occurred' });

  socket.on('hostQuery', function(data) {
    if (!players.host) {
      players.host = true;
      data.youAreHost = true;
    } 
    socket.emit('hostResponse', data);
  });

  socket.on('hostEnemyData', function(data){
    socket.emit('enemyData', data);
    socket.broadcast.emit('enemyData', data);
  });

  socket.on('hostPosition', function(data){
    socket.broadcast.emit('recHostPosition', data);
  });

  socket.on('slavePosition', function(data) {
    socket.broadcast.emit('recSlavePosition', data);
  });
});