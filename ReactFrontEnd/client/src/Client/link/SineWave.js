var canvas;
var ctx;
var width;
var height;
var step = -6;
var Animation;
export function Init(Canvas){
    canvas = Canvas
    ctx = canvas.getContext("2d");
    width = ctx.canvas.width;
    height = ctx.canvas.height;
    step = -6;
}
export function start() {
    if(Animation !== undefined){
        window.cancelAnimationFrame(Animation);
    }
    Animation = window.requestAnimationFrame(start);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawWave(450,"sin"); 
    drawWave(220,"cos");
    drawWave(75,"sin");
  
  step += .40; 
}
function drawWave(amplitude,trig){
  // trig is the trigonometric function to be used: sin or cos
  ctx.beginPath();
  ctx.lineWidth = 6;
  ctx.strokeStyle = "#61DBFB";

  var x = 0;
  var y = 0;
  //var amplitude = 10;
  var frequency = height / (2 * Math.PI);
  ctx.save();
  ctx.translate(-amplitude * Math[trig](step / frequency), 0);
  while (y < height) {
    x = width / 2 + amplitude * Math[trig]((y + step) / frequency);
    ctx.lineTo(x, y);
    y++;
  }

  ctx.stroke();
  ctx.restore();
}