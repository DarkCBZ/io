let wsUrl = location.origin.replace(/^http/, "ws");
let ws = new WebSocket(wsUrl);
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");


function render() {
  renderGrid();
}

function renderPlayer(x, y) {
  ctx.fillStyle = "#FF0000";
  ctx.fillRect(x, y, 50, 50);
}

function renderGrid() {
  ctx.fillStyle = "#252525";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const gridSize = 50;
  const numColumns = Math.ceil(canvas.width / 50);
  const numRows = Math.ceil(canvas.height / gridSize);
  ctx.strokeStyle = "#353535";
  ctx.lineWidth = 1;

  for (let i = 0; i < numColumns; i++) {
    const x = i * gridSize;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let j = 0; j < numRows; j++) {
    const y = j * gridSize;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
}

window.onresize = resize;
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  render();
}
window.onload = () => {
  resize();
}

ws.onmessage = onWsMessage;

function onWsMessage(x) {
  render();
  let data = JSON.parse(x.data);
  for (var i = 0; i < data.length; i++) {
    renderPlayer(data[i].x, data[i].y);
  }
}

function send(x) {
  let data = JSON.stringify(x);
  ws.send(data);
}

document.addEventListener("keydown", x => {
  if (x.code === "KeyW") send({ input: "KeyW", state: true });
  if (x.code === "KeyA") send({ input: "KeyA", state: true });
  if (x.code === "KeyS") send({ input: "KeyS", state: true });
  if (x.code === "KeyD") send({ input: "KeyD", state: true });
});
document.addEventListener("keyup", x => {
  if (x.code === "KeyW") send({ input: "KeyW", state: false });
  if (x.code === "KeyA") send({ input: "KeyA", state: false });
  if (x.code === "KeyS") send({ input: "KeyS", state: false });
  if (x.code === "KeyD") send({ input: "KeyD", state: false });
});