var myGamePiece;

function startGame() {
    myGamePiece = new squid(7, "#006699", 200, 300);
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

function squid(size, color, x, y) {
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
    myGamePiece.x += Math.round(Math.random()*4)-2;
    myGamePiece.y += Math.round(Math.random()*4)-2;
    myGamePiece.update();
}
