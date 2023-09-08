//Server Code
let express = require("express");
let WebSocket = require("ws");
let app = express();

app.use("/shared", express.static("shared"));
app.use("/", express.static("public"));

let server = app.listen(8008, () => {
  console.log("Server started.");
});

let wss = new WebSocket.Server({ server });

wss.on("connection", onWsConnection);

let socketList = {};
let playerList = {};

function onWsConnection(ws) {
  console.log("some rat connected");

  ws.id = Math.floor(Math.random() * 1E12);
  socketList[ws.id] = ws;

  let player = Player(ws.id);
  playerList[ws.id] = player;

  ws.on('close', () => {
    delete socketList[ws.id];
    delete playerList[ws.id]
  });

  ws.onmessage = (x) => {
    let data = JSON.parse(x.data);

    if (data.input === "KeyW") player.wDown = data.state;
    if (data.input === "KeyA") player.aDown = data.state;
    if (data.input === "KeyS") player.sDown = data.state;
    if (data.input === "KeyD") player.dDown = data.state;
  }
}

function tick() {
  let pack = [];

  for (var i in playerList) {
    var player = playerList[i];
    player.updatePosition();
    pack.push({
      x: player.x,
      y: player.y,
      number: player.number
    });
  }

  for (let i in socketList) {
    let socket = socketList[i];
    socket.send(JSON.stringify(pack));
  }
}


setInterval(tick, 1000 / 30);

let Player = (id) => {
  let self = {
    x: 250,
    y: 250,
    id: id,
    wDown: false,
    aDown: false,
    sDown: false,
    dDown: false,
    maxSpd: 10,
  }
  self.updatePosition = () => {
    if (self.wDown) self.y -= self.maxSpd;
    if (self.aDown) self.x -= self.maxSpd;
    if (self.sDown) self.y += self.maxSpd;
    if (self.dDown) self.x += self.maxSpd;
  }
  return self;
}
