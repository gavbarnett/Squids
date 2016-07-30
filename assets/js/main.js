var squids = [];
var foods = [];

function startGame() {
    for (i = 0; i <5; i++){
      squids[i] = new squid(Math.round(Math.random()*20), "#006699", Math.round(Math.random()*700), Math.round(Math.random()*700),50+Math.round(Math.random()*100));
    }
    for (i = 0; i <40; i++){
      foods[i] = new food(Math.round(Math.random()*4), "#006666", Math.round(Math.random()*700), Math.round(Math.random()*700));
    }
    myGameArea.start();
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 700;
        this.canvas.height = 700;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 20);
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function squid(size, color, x, y, divspeed) {
    this.size = size;
    this.x = x;
    this.y = y;
    this.divspeed = divspeed;
    this.update = function(){
        ctx = myGameArea.context;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, 2*Math.PI, false);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.stroke();
    }
}

function food(size, color, x, y) {
    this.size = size;
    this.x = x;
    this.y = y;
    this.update = function(){
        ctx = myGameArea.context;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, 2*Math.PI, false);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.stroke();
    }
}

function updateGameArea() {
    myGameArea.clear();
    for (i = 0; i <5; i++){
      hunt(i);
      squids[i].update();
    }
    for (i = 0; i <40; i++){
      foods[i].update();
    }
}

function hunt(squid_id) {
  var target = 0;
  var targetdist = 100000;
  var dist = 10;
  for (j = 0; j <40; j++){
    dist = Math.pow(Math.pow((foods[j].x-squids[squid_id].x),2) + Math.pow((foods[j].y-squids[squid_id].y),2),0.5);
    if (dist < targetdist) {
      targetdist = dist;
      target = j;
    }
  }
  squids[squid_id].x += (foods[target].x-squids[squid_id].x)/squids[squid_id].divspeed;
  squids[squid_id].y += (foods[target].y-squids[squid_id].y)/squids[squid_id].divspeed;

}
