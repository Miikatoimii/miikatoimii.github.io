var canvas = document.querySelector('#canvasball');
canvas.width = 740;
canvas.height = 400;
var c = canvas.getContext("2d");

var ballList = [];
var Ball = function() {
    this.id = ballList.length,
    this.x = Math.ceil(Math.random()*canvas.width),
    this.y = Math.ceil(Math.random()*canvas.height),
    this.r = Math.random()+9,
    this.co1 = Math.ceil(Math.random()*80)+120, //color values
    this.co2 = Math.ceil(Math.random()*80)+120, 
    this.co3 = Math.ceil(Math.random()*80)+120, 
    this.spdX = (Math.random()),
    this.spdY = (Math.random()),
    this.dirX = Math.ceil(Math.random()*2),
    this.dirY = Math.ceil(Math.random()*2),
    this.reset = function(){
        this.r = Math.random()+9
        this.x = Math.ceil(Math.random()*canvas.width)
        this.y = Math.ceil(Math.random()*canvas.height)
        this.co1 = Math.ceil(Math.random()*80)+80 //color values
        this.co2 = Math.ceil(Math.random()*80)+80 //color values
        this.co3 = Math.ceil(Math.random()*80)+80 //color values
        this.spdX = (Math.random())
        this.spdY = (Math.random())
        this.dirX = Math.ceil(Math.random()*2)
        this.dirY = Math.ceil(Math.random()*2)
    }
    this.draw = function(){
        c.beginPath();
        c.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
        c.fillStyle = "rgba("+this.co1+", "+this.co2+", "+this.co3+", 0.7)";
        c.fill()
        this.move()
    }
    this.move = function(){
        if(this.x - this.r > canvas.width){
            this.x = canvas.width-canvas.width -this.r
        }
        if(this.x + this.r < canvas.width-canvas.width){
            this.x = canvas.width +this.r
        }
        if(this.y + this.r >= canvas.height){
            this.dirY = 1
        }
        if(this.y -this.r <= canvas.height-canvas.height){
            this.dirY = 2
        }

        if(this.dirX === 2){
            this.x += this.spdX;
        }
        if(this.dirX === 1){
            this.x -= this.spdX;
        }
        if(this.dirY === 2){
            this.y += this.spdY;
        }
        if(this.dirY === 1){
            this.y -= this.spdY;
        }

        /* this loop explained:
            when the the objects collides within the ballist[j] , (which is the array where all created objects are stored)
            AND when the coordinates of THIS OBJECT don't match with the other ballList[j] objects */
        for(var j = 0; j < ballList.length; j++){
            if(    getDistance(this.x, this.y, ballList[j].x, ballList[j].y) < this.r + ballList[j].r   && this.x != ballList[j].x && this.y != ballList[j].y  ){
                if(this.r > ballList[j].r){

                    this.r += (ballList[j].r/50)
                    this.spdX = this.spdX/1.0005
                         
                    if(this.co1 > 0){
                        this.co1 -= 0.5
                    }
                    if(this.co2 > 0){
                        this.co2 -= 0.5
                    }
                    if(this.co3 > 0){
                        this.co3 -= 0.5
                    }

                } else{
                    this.r -= 1
                    this.spdX += 0.01
                    if(this.x > ballList[j].x){ this.x -= 1 } else { this.x += 1 }
                    if(this.y > ballList[j].y){ this.y -= 1 } else { this.y += 1 }
                }
            }
        }
        if(this.r > 100){
            this.reset();
        }
        if(this.r < 5){
            this.reset();
        }
    }
}
var numofballs = 60// <----- change this to render the number of balls
let ball;
function newBall(){
    ballList.push(new Ball());
}
for(var i = 0; i < numofballs; i++){
    newBall()
}


// Distance between two individual object
function getDistance(x1, y1, x2, y2){
    var xDistance = x2 - x1;
    var yDistance = y2 - y1;

    return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
}


var mouseOverCanvas = false;
var move = function(){
        requestAnimationFrame(move) //the animation loop 
        c.clearRect(canvas.width-canvas.width, canvas.height-canvas.height, canvas.width, canvas.height);
        for(var i = 0; i < ballList.length; i++){
            ballList[i].draw();
        }
    
}
move();
