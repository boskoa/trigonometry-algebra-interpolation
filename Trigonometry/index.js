const myCanvas = document.getElementById("myCanvas");
const ctx = myCanvas.getContext("2d");

const chartCanvas = document.getElementById("chartCanvas");
const chartCtx = chartCanvas.getContext("2d");

const offset = {
  x: myCanvas.width / 2,
  y: myCanvas.height / 2,
};
ctx.translate(offset.x, offset.y);

const chartOffset = {
  x: chartCanvas.width / 2,
  y: chartCanvas.height / 2,
};
chartCtx.translate(chartOffset.x, chartOffset.y);

let theta = Math.PI / 4;
const distanceC = 100;

const a = { x: 0, y: 0 };
const b = { x: Math.cos(theta) * distanceC, y: Math.sin(theta) * distanceC };
const c = { x: b.x, y: 0 };

function drawCoordSystem(ctx, offset) {
  ctx.beginPath();
  ctx.moveTo(-offset.x, 0);
  ctx.lineTo(offset.x, 0);
  ctx.moveTo(0, -offset.y);
  ctx.lineTo(0, offset.y);
  ctx.setLineDash([4, 2]);
  ctx.lineWidth = 2;
  ctx.strokeStyle = "grey";
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawPoint(ctx = ctx, point, size = 20, color = "black") {
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.arc(point.x, point.y, size / 2, 0, Math.PI * 2);
  ctx.fill();
}

function drawText(text, point, color = "white") {
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "bold 18px Courier";
  ctx.strokeStyle = "white";
  ctx.lineWidth = 7;
  ctx.strokeText(text, point.x, point.y);
  ctx.fillText(text, point.x, point.y);
}

function drawLine(m, n, color = "coral") {
  ctx.beginPath();
  ctx.moveTo(m.x, m.y);
  ctx.lineTo(n.x, n.y);
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.stroke();
}

function movePoint(e) {
  theta -= toRad(Math.sign(e.deltaY));

  b.x = Math.cos(theta) * distanceC;
  b.y = Math.sin(theta) * distanceC;
  c.x = b.x;
  //a.y = b.y;

  update();
}

function average(m, n) {
  return {
    x: (m.x + n.x) / 2,
    y: (m.y + n.y) / 2,
  };
}

function distance(m, n) {
  return Math.hypot(m.x - n.x, m.y - n.y);
}

function toDeg(rad) {
  return (rad * 180) / Math.PI;
}

function toRad(deg) {
  return (deg * Math.PI) / 180;
}

function update() {
  /*
  const distanceA = distance(b, c);
  const distanceB = distance(a, c);
  const distanceC = distance(a, b);
  */
  const sin = Math.sin(theta);
  const cos = Math.cos(theta);
  const tan = Math.tan(theta);

  const t = {
    x: Math.sign(cos) * Math.hypot(1, tan) * distanceC,
    y: 0,
  };

  ctx.clearRect(-offset.x, -offset.y, offset.x * 2, offset.y * 2);
  drawCoordSystem(ctx, offset);

  drawText(
    "sin = " + sin.toFixed(2),
    { x: -offset.x * 0.5, y: offset.y * 0.7 },
    "red"
  );

  drawText(
    "cos = " + cos.toFixed(2),
    { x: -offset.x * 0.5, y: offset.y * 0.8 },
    "blue"
  );

  drawText(
    "tan = " + tan.toFixed(2),
    { x: -offset.x * 0.5, y: offset.y * 0.9 },
    "magenta"
  );

  drawText(
    "θ = " + theta.toFixed(2) + `(${toDeg(theta).toFixed(2)} deg)`,
    { x: offset.x * 0.5, y: offset.y * 0.9 },
    "black"
  );

  drawLine(a, b, "black");
  drawText("1", average(a, b), "black");
  drawLine(a, c, "blue");
  drawText("cos", average(a, c), "blue");
  drawLine(b, c, "red");
  drawText("sin", average(b, c), "red");

  drawText("θ", a, "black");

  drawLine(b, t, "magenta");
  drawText("tan", average(b, t), "magenta");

  ctx.beginPath();
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  /*
  const start = b.x > a.x ? 0 : Math.PI;
  const clockwise = (b.y < c.y) ^ (b.x > a.x);
  let end = b.y < c.y ? -theta : theta;
  if (b.x < a.x) {
    end = Math.PI - end;
  }
  */
  //ctx.arc(0, 0, 20, start, end, !clockwise);
  ctx.arc(0, 0, distanceC, 0, theta, theta < 0);
  ctx.stroke();

  const chartScaler = chartOffset.y * 0.5;
  // sin
  drawPoint(
    chartCtx,
    { x: theta * chartScaler, y: sin * chartScaler },
    2,
    "red"
  );
  // cos
  drawPoint(
    chartCtx,
    { x: theta * chartScaler, y: cos * chartScaler },
    2,
    "blue"
  );
  // tan
  drawPoint(
    chartCtx,
    { x: theta * chartScaler, y: tan * chartScaler },
    2,
    "magenta"
  );
  /*
  drawPoint(a);
  drawText("A", a);
  drawPoint(b);
  drawText("B", b);
  drawPoint(c);
  drawText("C", c);
  */
}

drawCoordSystem(chartCtx, chartOffset);

update();
document.addEventListener("wheel", movePoint);

/*
sine: ratio of the side opposite of the angle and the hypotenuse.
cosine: ratio of the side adjacent to the angle and the hypotenuse.
tangent: ratio of sine and cosine (or catheti - a/b).
*/
