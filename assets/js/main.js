var squids = [];
var foods = [];

function startGame() {
    for (i = 0; i <5; i++){
      squids[i] = new squid(2+Math.round(Math.random()*20), '#'+('00000'+(Math.random()*(1<<24)|0).toString(16)).slice(-6), Math.round(Math.random()*700), Math.round(Math.random()*700),50+Math.round(Math.random()*100), 30+Math.random()*100);
    }
    for (i = 0; i <40; i++){
      foods[i] = new food(2+Math.round(Math.random()*4), '#'+('00000'+(Math.random()*(1<<24)|0).toString(16)).slice(-6), Math.round(Math.random()*700), Math.round(Math.random()*700), 3+Math.random()*10);
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

function squid(size, shcolor, x, y, divspeed, split) {
    this.size = size;
    this.x = x;
    this.y = y;
    this.shcolor = shcolor;
    this.divspeed = divspeed;
    this.drain = 0.01*divspeed/50;
    this.split = split;
    this.update = function(){
        ctx = myGameArea.context;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, 2*Math.PI, false);
        ctx.fillStyle = this.shcolor;
        ctx.fill();
        ctx.strokeStyle = '#ffffff'
        ctx.stroke();
    }
}

function food(size, shcolor, x, y, split) {
    this.size = size;
    this.x = x;
    this.y = y;
    this.shcolor = shcolor;
    this.growth = 0.01*6/split;
    this.split = split;
    this.update = function(){
        ctx = myGameArea.context;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, 2*Math.PI, false);
        ctx.fillStyle = this.shcolor;
        ctx.fill();
        ctx.strokeStyle = '#000000'
        ctx.stroke();
    }
}

function updateGameArea() {
    myGameArea.clear();
    for (i = squids.length-1; i >=0; i--){
      hunt(i);
      eat(i);
      spawn(i);
      squids[i].size -=squids[i].drain;
      if (squids[i].size <2){
        squids.splice(i, 1);
        if (squids.length<=2){
          startGame();
        }
      }
      squids[i].update();
    }
    for (i = 1; i < foods.length; i++){
      foods[i].size += foods[i].growth;
      if (foods[i].size > foods[i].split){
        foods.push(new food(foods[i].size/3, foods[i].shcolor, foods[i].x-100+Math.random()*200, foods[i].y-100+Math.random()*200, Math.max(foods[i].split* (0.9+ 0.2*Math.random()),2.9)));
        foods[i].size /= 3;
      }
      foods[i].update();
    }
    if (foods.length <5){
      foods[i] = new food(2+Math.round(Math.random()*4), '#'+('00000'+(Math.random()*(1<<24)|0).toString(16)).slice(-6), Math.round(Math.random()*700), Math.round(Math.random()*700), 3+Math.random()*10);
    }
}

function hunt(squid_id) {
  var target = 0;
  var targetdist = 100000;
  var dist = 0;
  for (j = foods.length-1; j >=1; j--){
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
  var dist = 100000;
  var targetdist = 0;
  for (j = foods.length-1; j >=1; j--){
    targetdist = (squids[squid_id].size + foods[j].size)*0.8;
    dist = Math.pow(Math.pow((foods[j].x-squids[squid_id].x),2) + Math.pow((foods[j].y-squids[squid_id].y),2),0.5);
    if (dist < targetdist) {
      squids[squid_id].size += foods[j].size;
      foods.splice(j,1);
      j=0;
      return;
      //foods[j] = new food(Math.round(Math.random()*4), "#006666", Math.round(Math.random()*700), Math.round(Math.random()*700));
    }
  }
}

function spawn(squid_id) {

  if (squids[squid_id].size > squids[squid_id].split){
    var size = squids[squid_id].size/3;
    var x = squids[squid_id].x-squids[squid_id].size+Math.random()*squids[squid_id].size*2;
    var y = squids[squid_id].y-squids[squid_id].size+Math.random()*squids[squid_id].size*2;
    squids[squid_id].size /= 3;
    var tempcolor = squids[squid_id].shcolor;
    var divspeed = squids[squid_id].divspeed * (0.9+ 0.2*Math.random());
    var split = squids[squid_id].split * (0.9+ 0.2*Math.random());
    squids[squids.length] = new squid(size, tempcolor, x, y, divspeed, split);
  }
}
