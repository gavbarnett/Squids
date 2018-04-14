var squids = [];
var foods = [];
var msgs = [];
var paused = false;
var canvwidth = 0;
var canvheight = 0;
function startGame() {
    msgs[0] = new msg('hello world', 20, 30);
    msgs[1] = new msg('hello world', 20, 50);
    myGameArea.start();
}

var myGameArea = {   
  start : function() {
        this.canvas = document.getElementById('mycanvas'); 
        this.context = this.canvas.getContext("2d");
        canvwidth = this.canvas.width;
        canvheight = this.canvas.height;
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        for (i = 0; i <15; i++){
          squids[i] = new squid(2+Math.round(Math.random()*20), '#'+('00000'+(Math.random()*(1<<24)|0).toString(16)).slice(-6), Math.round(Math.random()*this.canvas.width), Math.round(Math.random()*this.canvas.height),50+Math.round(Math.random()*100), 30+Math.random()*100);
        }
        for (i = 0; i <40; i++){
          foods[i] = new food(2+Math.round(Math.random()*4), '#'+('00000'+(Math.random()*(1<<24)|0).toString(16)).slice(-6), Math.round(Math.random()*this.canvas.width), Math.round(Math.random()*this.canvas.height), 3+Math.random()*10);
        }
        updateGameArea();
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
    this.split = Math.max(2, split);
    this.growth = 0.01*6/split;
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

function msg(text, x, y){
  this.text = text;
  this.color = 'white';
  this.x = x;
  this.y = y;
  this.update = function(){
    ctx = myGameArea.context;
    ctx.font = "16px Arial";
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = "left";
    ctx.fillText(this.text,this.x, this.y);//this.text, this.x, this.y);
  }
}

function updateGameArea() {
  if (!paused) {
    requestAnimationFrame(updateGameArea);
  } else {
      return false;
  }
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
    var mindist = 10000;
    var dist = 0 ;
    for (i = 1; i < foods.length; i++){
      if (foods[i].size > foods[i].split){
        mindist = 10000;
        for (j = foods.length-1; j >=1; j--){
          dist = Math.pow(Math.pow((foods[j].x-foods[i].x),2) + Math.pow((foods[j].y-foods[i].y),2),0.5);
          if (dist<mindist && j !=i) {
            mindist=dist;
          }
        }
        if (mindist > 20){
          foods.push(new food(foods[i].size/3, colorshaker(foods[i].shcolor), foods[i].x-100+Math.random()*200, foods[i].y-100+Math.random()*200, Math.max(foods[i].split* (0.9+ 0.2*Math.random()),2.7)))
          if (foods[foods.length-1].x<0 ||foods[foods.length-1].x>canvwidth || foods[foods.length-1].y<0 ||foods[foods.length-1].y>canvheight){
            foods.splice(foods.length-1,1);
          } else {
            foods[i].size /= 3;
          } 
        }
      } else {
        foods[i].size += foods[i].growth;
      }
      foods[i].update();
    }
    if (foods.length <20){
      foods[i] = new food(2+Math.round(Math.random()*4), '#'+('00000'+(Math.random()*(1<<24)|0).toString(16)).slice(-6), Math.round(Math.random()*700), Math.round(Math.random()*700), 3+Math.random()*10);
    }
    msgs[0].text = 'squids: ' + squids.length;
    msgs[1].text = 'plants: ' + foods.length;
    msgs[0].update();
    msgs[1].update();
}

function hunt(squid_id) {
  var target = 0;
  var targetdist = 100000;
  var dist = 0;
  var col_adj;
  var f_col = [];
  var s_col = [];
  s_col[1] = parseInt(squids[squid_id].shcolor.substring(1,3),16);
  s_col[2] = parseInt(squids[squid_id].shcolor.substring(3,5),16);
  s_col[3] = parseInt(squids[squid_id].shcolor.substring(5,7),16);
  for (j = foods.length-1; j >=1; j--){
    dist = Math.pow(Math.pow((foods[j].x-squids[squid_id].x),2) + Math.pow((foods[j].y-squids[squid_id].y),2),0.5);
    //dist adjustment based on colour
    f_col[1] = parseInt(foods[j].shcolor.substring(1,3),16);
    f_col[2] = parseInt(foods[j].shcolor.substring(3,5),16);
    f_col[3] = parseInt(foods[j].shcolor.substring(5,7),16);
    col_adj = Math.pow(Math.pow(f_col[1]-s_col[1],2)+Math.pow(f_col[2]-s_col[2],2)+Math.pow(f_col[2]-s_col[2],2),0.5);
    dist *= 2*(col_adj/442);
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
  var col_adj;
  var f_col = [];
  var s_col = [];
  var carbs = 0;
  s_col[1] = parseInt(squids[squid_id].shcolor.substring(1,3),16);
  s_col[2] = parseInt(squids[squid_id].shcolor.substring(3,5),16);
  s_col[3] = parseInt(squids[squid_id].shcolor.substring(5,7),16);
  for (j = foods.length-1; j >=1; j--){
    targetdist = (squids[squid_id].size + foods[j].size)*0.8;
    dist = Math.pow(Math.pow((foods[j].x-squids[squid_id].x),2) + Math.pow((foods[j].y-squids[squid_id].y),2),0.5);
    f_col[1] = parseInt(foods[j].shcolor.substring(1,3),16);
    f_col[2] = parseInt(foods[j].shcolor.substring(3,5),16);
    f_col[3] = parseInt(foods[j].shcolor.substring(5,7),16);
    col_adj = Math.pow(Math.pow(f_col[1]-s_col[1],2)+Math.pow(f_col[2]-s_col[2],2)+Math.pow(f_col[2]-s_col[2],2),0.5);
    carbs = 2*(foods[j].size * (0.4-col_adj/442))
    if (dist < targetdist) {
      squids[squid_id].size += carbs;
      foods.splice(j,1);
    }
    if (squids[squid_id].size > squids[squid_id].split){
      return;
    }
  }
}

function spawn(squid_id) {

  if (squids[squid_id].size > squids[squid_id].split){
    var size = squids[squid_id].size/3;
    var x = squids[squid_id].x-squids[squid_id].size+Math.random()*squids[squid_id].size*2;
    var y = squids[squid_id].y-squids[squid_id].size+Math.random()*squids[squid_id].size*2;
    squids[squid_id].size /= 3;
    var tempcolor = colorshaker(squids[squid_id].shcolor);
    var divspeed = Math.max(squids[squid_id].divspeed * (0.9+ 0.2*Math.random()),50);
    var split = Math.min(squids[squid_id].split * (0.9+ 0.2*Math.random()), 75);
    squids[squids.length] = new squid(size, tempcolor, x, y, divspeed, split);
  }
}

function colorshaker(color){
  /*takes in a color and randomly adjusts it*/
  var p1 = parseInt(color.substring(1,3),16);
  var p2 = parseInt(color.substring(3,5),16);
  var p3 = parseInt(color.substring(5,7),16);
  p1 = p1+(-30+Math.round(60*Math.random()));
  p2 = p2+(-30+Math.round(60*Math.random()));
  p3 = p3+(-30+Math.round(60*Math.random()));
  if (p1 > 255){
    p1 = 255;
  } else if (p1 < 0){
    p1 = 0;
  }
  if (p2 > 255){
    p2 = 255;
  } else if (p2 < 0){
    p2 = 0;
  }
  if (p3 > 255){
    p3 = 255;
  } else if (p3 < 0){
    p3 = 0;
  }
  p1 = p1.toString(16);
  p2 = p2.toString(16);
  p3 = p3.toString(16);
  while (p1.length < 2) {
        p1 = "0" + p1;
    }
    while (p2.length < 2) {
          p2 = "0" + p2;
      }
      while (p3.length < 2) {
            p3 = "0" + p3;
        }
  color = '#'+p1+p2+p3;
  return color;
}
