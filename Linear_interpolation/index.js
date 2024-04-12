const myCanvas = document.getElementById("myCanvas");
myCanvas.width = window.innerWidth;
myCanvas.height = window.innerHeight;
const ctx = myCanvas.getContext("2d");

const a = {
  x: 100,
  y: 300,
};
const b = {
  x: 400,
  y: 100,
};
const t = 1.1;
const c = vLerp(a, b, t);

const low = 200;
const high = 600;

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function vLerp(a, b, t) {
  const res = {};

  for (const attr in a) {
    res[attr] = lerp(a[attr], b[attr], t);
  }
  return res;
}

function animate() {
  ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
  const s = new Date().getTime() / 1000;
  const t = (Math.sin(s * Math.PI) + 1) / 2;
  const d = vLerp(a, b, t);
  drawDot(d, t.toFixed(1).toString().slice(1));
  drawDot(a, "A");
  drawDot(b, "B");

  const { r, g, be } = vLerp(
    { r: 230, g: 100, be: 150 },
    { r: 30, g: 130, be: 250 },
    t
  );
  myCanvas.style.backgroundColor = `rgb(${r}, ${g}, ${be})`;

  if (osc) {
    console.log(low, high, t);
    osc.frequency.value = lerp(low, high, t);
  }

  ctx.strokeStyle = "white";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.font = "bold 40px Arial";
  ctx.setLineDash([lerp(50, 130, t), 130]);
  ctx.strokeText("Click for sound", myCanvas.width / 2, 10);
  ctx.setLineDash([]);
  ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
  ctx.fillText("Click for sound", myCanvas.width / 2, 10);

  requestAnimationFrame(animate);
}

function drawDot(position, label) {
  ctx.beginPath();
  ctx.fillStyle = "white";
  ctx.strokeStyle = "black";
  ctx.arc(position.x, position.y, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "black";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "bold 14px Arial";
  ctx.fillText(label, position.x, position.y);
}

let osc = null;
let audioCtx = null;
myCanvas.onclick = function () {
  if (audioCtx === null) {
    audioCtx = new AudioContext();
  }

  osc = audioCtx.createOscillator();
  osc.frequency.value = 200;
  osc.start();

  const node = audioCtx.createGain();
  node.gain.value = 0.1;
  osc.connect(node);
  node.connect(audioCtx.destination);
};

animate();

drawDot(a, "A");
drawDot(b, "B");
drawDot(c, "C");
/*
const n = 10;
for (let i = 1; i < n; i++) {
    const d = vLerp(a, b, i / 10)
    drawDot(d, i.toString())
}
*/
