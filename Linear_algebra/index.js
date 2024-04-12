const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

const point = {
  x: 90,
  y: 120,
};

const g = {
  x: 0,
  y: 80,
};

let dotValue = 0;

function drawCoordinateSystem() {
  ctx.beginPath();
  ctx.moveTo(-offset.x, 0);
  ctx.lineTo(offset.x, 0);
  ctx.moveTo(0, -offset.y);
  ctx.lineTo(0, offset.y);
  ctx.strokeStyle = "white";
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 4]);
  ctx.stroke();
}

function magnitude({ x, y }) {
  return Math.hypot(x, y);
}

function direction({ x, y }) {
  return Math.atan2(y, x);
}

function toPolar({ x, y }) {
  return {
    mag: magnitude({ x, y }),
    dir: direction({ x, y }),
  };
}

function movePoint(e) {
  point.x = e.x - offset.x;
  point.y = e.y - offset.y;

  update();
}

function update() {
  ctx.clearRect(-offset.x, -offset.y, myCanvas.width, myCanvas.height);
  drawCoordinateSystem();
  //drawPoint(point);
  const { mag, dir } = toPolar(point);
  //const same = toXY({ mag, dir });
  //drawPoint(same, 6, "red");

  const addResult = add(point, g);
  const substractResult = subtract(point, g);
  const scaledResult = scale(substractResult, 1.5);
  const normalizedResult = scale(normalize(substractResult), 50);
  const dotProduct = dot(normalize(g), normalize(point));

  legend();

  drawArrow({ x: 0, y: 0 }, point);
  drawArrow({ x: 0, y: 0 }, g);

  drawArrow(point, addResult, "rgba(200, 50, 50, 0.5)");
  drawArrow(g, addResult, "rgba(200, 50, 50, 0.5)");

  drawArrow({ x: 0, y: 0 }, addResult, "teal");
  drawArrow({ x: 0, y: 0 }, substractResult, "gold");
  drawArrow(g, point, "rgba(255, 215, 0, 0.3)");
  drawArrow({ x: 0, y: 0 }, scaledResult, "grey");
  drawArrow({ x: 0, y: 0 }, normalizedResult, "pink");

  dotValue = dotProduct;

  console.log("MAG", dotValue);
}

function drawArrow(tail, { x, y }, color = "white", size = 30) {
  const { dir, mag } = toPolar(subtract({ x, y }, tail));
  // right
  const v1 = { dir: dir + Math.PI * 0.87, mag: size / 2 };
  const p1 = toXY(v1);
  const t1 = {
    x: p1.x + x,
    y: p1.y + y,
  };

  // left
  const v2 = { dir: dir - Math.PI * 0.87, mag: size / 2 };
  const p2 = toXY(v2);
  const t2 = {
    x: p2.x + x,
    y: p2.y + y,
  };

  ctx.setLineDash([]);
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(tail.x, tail.y);
  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.moveTo(x, y);
  ctx.lineTo(t1.x, t1.y);
  ctx.lineTo(t2.x, t2.y);
  ctx.closePath();
  ctx.stroke();
  ctx.fillStyle = color;
  ctx.fill();
}

function toXY({ mag, dir }) {
  return {
    x: Math.cos(dir) * mag,
    y: Math.sin(dir) * mag,
  };
}

function add(x, y) {
  return {
    x: x.x + y.x,
    y: x.y + y.y,
  };
}

function subtract(x, y) {
  return {
    x: x.x - y.x,
    y: x.y - y.y,
  };
}

function scale(p, scalar) {
  return {
    x: p.x * scalar,
    y: p.y * scalar,
  };
}

function normalize(p) {
  return scale(p, 1 / magnitude(p));
}

function dot(p1, p2) {
  return p1.x * p2.x + p1.y * p2.y;
}

function drawPoint(loc, size = 10, color = "white") {
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.arc(loc.x, loc.y, size, 0, Math.PI * 2);
  ctx.fill();
}

function legend() {
  ctx.strokeStyle = "white";
  ctx.fillStyle = "white";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.font = "16px Arial";
  ctx.fillText("X: " + point.x, myCanvas.width * 0.4, -myCanvas.height * 0.49);
  ctx.fillText("Y: " + point.y, myCanvas.width * 0.4, -myCanvas.height * 0.44);
  ctx.fillText(
    "Normalized dot product: " + Math.round(dotValue * 100) / 100,
    myCanvas.width * -0.49,
    myCanvas.height * -0.49
  );
  ctx.fillStyle = "teal";
  ctx.fillText("Addition", myCanvas.width * 0.3, myCanvas.height * 0.3);
  ctx.fillStyle = "gold";
  ctx.fillText("Subtraction", myCanvas.width * 0.3, myCanvas.height * 0.3 + 20);
  ctx.fillStyle = "grey";
  ctx.fillText("Scaling", myCanvas.width * 0.3, myCanvas.height * 0.3 + 40);
  ctx.fillStyle = "pink";
  ctx.fillText("Normalizing", myCanvas.width * 0.3, myCanvas.height * 0.3 + 60);
}

document.addEventListener("mousemove", movePoint);
// Set offset
const offset = {
  x: myCanvas.clientWidth / 2,
  y: myCanvas.height / 2,
};
ctx.translate(offset.x, offset.y);

drawCoordinateSystem();

drawPoint(point);

/*
CARTESIAN (x, y) and POLAR (magnitude, direction) representation of vectors;
magnitude - distance from the center, direction - angle from x-axis.
*/
