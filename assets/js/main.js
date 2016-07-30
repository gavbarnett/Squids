var squids = [];
var foods = [];

function startGame() {
    for (i = 0; i <5; i++){
      squids[i] = new squid(2+Math.round(Math.random()*20), "#006699", Math.round(Math.random()*700), Math.round(Math.random()*700),50+Math.round(Math.random()*100));
    }
    for (i = 0; i <40; i++){
      foods[i] = new food(2+Math.round(Math.random()*4), "#006666", Math.round(Math.random()*700), Math.round(Math.random()*700));
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
    for (i = 0; i <squids.length; i++){
      //squids[i].size -= 0.01
      hunt(i);
      eat(i);
      spawn(i);
      squids[i].update();
    }
    for (i = 0; i <foods.length; i++){
      foods[i].update();
    }
}

function hunt(squid_id) {
  var target = 0;
  var targetdist = 100000;
  var dist = 0;
  for (j = 0; j <foods.length; j++){
    dist = Math.pow(Math.pow((foods[j].x-squids[squid_id].x),2) + Math.pow((foods[j].y-squids[squid_id].y),2),0.5);
    if (dist < targetdist) {
      targetdist = dist;
      target = j;
    }
  }
  squids[squid_id].x += (foods[target].x-squids[squid_id].x)/squids[squid_id].divspeed;
  squids[squid_id].y += (foods[target].y-squids[squid_id].y)/squids[squid_id].divspeed;
}

function eat(squid_id) {
  var dist = 100;
  var targetdist = 0;
  for (j = 0; j <foods.length; j++){
    targetdist = (squids[squid_id].size + foods[j].size)*0.8;
    dist = Math.pow(Math.pow((foods[j].x-squids[squid_id].x),2) + Math.pow((foods[j].y-squids[squid_id].y),2),0.5);
    if (dist < targetdist) {
      squids[squid_id].size += foods[j].size
      foods[j] = new food(Math.round(Math.random()*4), "#006666", Math.round(Math.random()*700), Math.round(Math.random()*700));
    }
    squids[squid_id].size -=0.0001;
    if (squids[squid_id].size <1){
      squids.splice(squid_id, squid_id);
    }
  }
}

function spawn(squid_id) {

  if (squids[squid_id].size > 70){
    var size = squids[squid_id].size/3;
    var x = squids[squid_id].x+squids[squid_id].size;
    var y = squids[squid_id].y+squids[squid_id].size;
    squids[squid_id].size /= 3;
    var color = squids[squid_id].color;
    var divspeed = squids[squid_id].divspeed * (0.9+ 0.2*Math.random());
    squids[squids.length] = new squid(size, color, x, y, divspeed);
  }
}
