var canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var c = canvas.getContext('2d')
var gameObjects = [];
var instalaser = [];
var walldrawings = [];
var walls = [];
var mode = 3;
var isdrawing = false;

var linestart = {
    x:0,
    y:0
}
var lineend = {
    x:0,
    y:0
}

function Wall(x1,y1, x2, y2){
    this.start = {
        x: x1,
        y: y1
    };
    this.end = {
        x: x2,
        y: y2
    };
    this.cWidth = this.end.x - this.start.x;
    this.cHeight = this.end.y - this.start.y;
    this.isInArea = function(pos){
        
        if( this.start.x < this.end.x && 
            this.start.y < this.end.y && 
            pos.x > this.start.x && pos.y > this.start.y && pos.x < this.end.x && pos.y < this.end.y
            ){
            return true
        }
        else if( 
            this.start.x < this.end.x &&
            this.start.y > this.end.y &&
            pos.x > this.start.x && pos.y < this.start.y && pos.x < this.end.x && pos.y > this.end.y
            ){
            return true
        }
        else if( 
            this.start.x > this.end.x &&
            this.start.y < this.end.y &&
            pos.x < this.start.x && pos.y > this.start.y && pos.x > this.end.x && pos.y < this.end.y
            ){
            return true
        }
        else if( 
            this.start.x > this.end.x && 
            this.start.y > this.end.y && 
            pos.x < this.start.x && pos.y < this.start.y && pos.x > this.end.x && pos.y > this.end.y
            ){
            return true
        }
    }
}

function WallObject(x, y, radius, angle){
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.radius = radius;
    this.draw = function(){
        c.beginPath();
        c.arc(this.x,this.y,this.radius,0,2*Math.PI);
        c.fillStyle = "rgb(155,155,155)"
        c.fill();
    }
}


function Ball(radius, x, y, angle, mode, color){
    this.radius = radius;
    this.x = x;
    this.y = y;
    this.step = 1.25;
    this.alpha = 0.4;
    this.angle = angle;
    this.hitAngle = 0;
    this.hasBounced = false;
    this.collisionRule= 0;
    this.color = color;
    this.mode = mode;
    this.getDirection = function(){
        var x1 = Math.sin(toRadians(this.angle)) * this.step;
        var y1 = x1 / Math.tan(toRadians(this.angle))
        this.x += x1;
        this.y -= y1;
    }
    this.draw = function(){
        this.getDirection()
        c.globalAlpha = this.alpha;
        c.beginPath();
        c.arc(this.x,this.y,this.radius,0,2*Math.PI);
        c.fillStyle = this.color;
        c.fill();
        if(this.mode == 2){
            this.alpha -= 0.001
            this.radius += 0.006
        }
        c.globalAlpha = 1;
    }
    this.instaDraw = function(){
        while(this.alpha > 0){
            this.getDirection()
            c.globalAlpha = this.alpha;
            c.beginPath();
            c.arc(this.x,this.y,this.radius,0,2*Math.PI);
            c.fillStyle = this.color;
            c.fill();
            this.alpha -= 0.0001
            c.globalAlpha = 1;
            if(this.y < 0 || this.y > canvas.height){
                this.angle += 180-this.angle - this.angle
            }
            if(this.x < 0 || this.x > canvas.width){
                this.angle -= 180+this.angle - this.angle - (180-this.angle - this.angle)
            }
            //walls
            if(walls.length > 0){
                for(var b = 0; b < walls.length; b++){
                    
                    if(this.collisionRule > 0) {
                        this.collisionRule--;
                    }
                    
                        // var bDeg = Math.atan2( lineend.x-linestart.x, lineend.y-linestart.y)
                        var bDeg = Math.atan2( walls[b].end.x - walls[b].start.x, walls[b].end.y-walls[b].start.y)
                        if(Math.abs(toDegrees(bDeg)) <= 45 || Math.abs(toDegrees(bDeg)) >= 135 ){
                            var by = this.y-walls[b].end.y;
                            var bx = Math.tan(bDeg) * by; 
                            bx = bx+walls[b].start.x +(walls[b].end.x-walls[b].start.x);
                            by = by+walls[b].start.y+(walls[b].end.y-walls[b].start.y);
                        } else {
                            var bx = this.x-walls[b].end.x
                            var by = bx / Math.tan(bDeg);
                            bx = bx+walls[b].start.x +(walls[b].end.x-walls[b].start.x);
                            by = by+walls[b].start.y+(walls[b].end.y-walls[b].start.y);
                        }

                        if(getDistance(this.x, this.y, bx, by) <= this.radius && this.collisionRule <= 0){
                            if(walls[b].isInArea(this)){
                                this.collisionRule = 10;
                                
                                this.hitAngle = toDegrees(Math.atan2( walls[b].end.x-walls[b].start.x, walls[b].end.y-walls[b].start.y))
                                this.angle += (90 - this.angle - this.hitAngle)*2 - 180
                            }
                            
                        }
                    
                }
            }
        }
    }
}

canvas.addEventListener('mousedown',function(e){
    var x = e.clientX;
    var y = e.clientY;
    if(mode == 1 || mode == 4){
        
        linestart.x = x;
        linestart.y = y;
    } else if(mode == 2){
        for(var i = 0; i < 360; i++){
            gameObjects.push(new Ball(1, x, y, i+0.5, 2, "white"))
        }

    } else if(mode == 3){
        linestart.x = x;
        linestart.y = y;
    }
});
canvas.addEventListener('mouseup', function(e){
    var x = e.clientX;
    var y = e.clientY;
    isdrawing = false
    if(mode == 1){
        lineend.x = x;
        lineend.y = y;

        var wallAngle = toDegrees(Math.atan2( lineend.x-linestart.x, lineend.y-linestart.y));
        gameObjects.push(new Ball(1, linestart.x, linestart.y, -wallAngle+180, 1, "rgb(255,30,122)"))
    }
    if(mode == 4){
        lineend.x = x;
        lineend.y = y;
        var wallAngle = toDegrees(Math.atan2( lineend.x-linestart.x, lineend.y-linestart.y));
        instalaser.push(new Ball(1, linestart.x, linestart.y, -wallAngle+180, 1, "rgb(255,0,2553)"));
        instalaser[instalaser.length-1].instaDraw();
    }
    if(mode == 3){
        lineend.x = x;
        lineend.y = y;
        if(linestart.x == lineend.x) {
            lineend.x += 1
        }
        if(linestart.y == lineend.y) {
            lineend.y += 1
        }
        var lineLength = getDistance(linestart.x, linestart.y, lineend.x, lineend.y);
        var wallAngle = toDegrees(Math.atan2( lineend.x-linestart.x, lineend.y-linestart.y));
        
        for(var i = 0; i < lineLength; i++){
            newXpos = (lineend.x - linestart.x) / lineLength * i
            newYpos = (lineend.y - linestart.y) / lineLength * i
            walldrawings.push(new WallObject(linestart.x+newXpos, linestart.y+newYpos, 1, wallAngle))
        }
        walls.push(new Wall(linestart.x,linestart.y,lineend.x,lineend.y))

    }
    
})

window.addEventListener('keyup', function(e){
    if(e.keyCode == 49) {
        mode = 1
        document.getElementById("mode").innerText = "Laser (1)";
    }
    else if(e.keyCode == 50){
        mode = 2
        document.getElementById("mode").innerText = "Sun light (2)";
    }
    else if(e.keyCode == 70){ // "F", linear line
        mode = 3;
        document.getElementById("mode").innerText = "Draw wall (F)";
    }
    else if(e.keyCode == 51){
        mode = 4;
        document.getElementById("mode").innerText = "Insta laser (3)";
    }
    else if(e.keyCode == 32){ // enter
        gameObjects = [];
        walls = [];
        instalaser = [];
        c.clearRect(0,0,canvas.width, canvas.height)
    }
})

window.addEventListener('resize', function(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
})

function createWall(x, y, rads, angsl){
    walldrawings.push(new WallObject(x, y, rads, angsl))
}
var timer = setInterval(loop, 10)
function loop(){
    // c.clearRect(0,0, canvas.width, canvas.height);
    if(gameObjects.length > 0){
        for(var i = 0; i < gameObjects.length; i++){
            gameObjects[i].draw();
            if(gameObjects[i].y < 0 || gameObjects[i].y > canvas.height){
                gameObjects[i].angle += 180-gameObjects[i].angle - gameObjects[i].angle
            }
            if(gameObjects[i].x < 0 || gameObjects[i].x > canvas.width){
                gameObjects[i].angle -= 180+gameObjects[i].angle - gameObjects[i].angle - (180-gameObjects[i].angle - gameObjects[i].angle)
            }

            if(walls.length > 0){
                for(var b = 0; b < walls.length; b++){
                    
                    if(gameObjects[i].collisionRule > 0) {
                        gameObjects[i].collisionRule--;
                    }
                    
                        // var bDeg = Math.atan2( lineend.x-linestart.x, lineend.y-linestart.y)
                        var bDeg = Math.atan2( walls[b].end.x - walls[b].start.x, walls[b].end.y-walls[b].start.y)
                        if(Math.abs(toDegrees(bDeg)) <= 45 || Math.abs(toDegrees(bDeg)) >= 135 ){
                            var by = gameObjects[i].y-walls[b].end.y;
                            var bx = Math.tan(bDeg) * by; 
                            bx = bx+walls[b].start.x +(walls[b].end.x-walls[b].start.x);
                            by = by+walls[b].start.y+(walls[b].end.y-walls[b].start.y);
                        } else {
                            var bx = gameObjects[i].x-walls[b].end.x
                            var by = bx / Math.tan(bDeg);
                            bx = bx+walls[b].start.x +(walls[b].end.x-walls[b].start.x);
                            by = by+walls[b].start.y+(walls[b].end.y-walls[b].start.y);
                        }

                        if(getDistance(gameObjects[i].x, gameObjects[i].y, bx, by) <= gameObjects[i].radius && gameObjects[i].collisionRule <= 0){
                            if(walls[b].isInArea(gameObjects[i])){
                                gameObjects[i].collisionRule = 10;
                                
                                gameObjects[i].hitAngle = toDegrees(Math.atan2( walls[b].end.x-walls[b].start.x, walls[b].end.y-walls[b].start.y))
                                gameObjects[i].angle += (90 - gameObjects[i].angle - gameObjects[i].hitAngle)*2 - 180
                            }
                            
                        }
                    
                }
            }

            if(gameObjects[i].alpha < 0) {
                gameObjects.splice(i,i+1);
            }
        }
    }
    if(walldrawings.length > 0){
        for(var i = 0; i < walldrawings.length; i++){
            walldrawings[i].draw();
        }
        walldrawings = []
    }
    
}

// Distance between two individual object
function getDistance(x1, y1, x2, y2){
    var xDistance = x2 - x1;
    var yDistance = y2 - y1;
    return Math.abs(Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2)));
}
//to radians
function toRadians(angle){
    return angle * (Math.PI/180);
}
function toDegrees(rad){
    return rad / (Math.PI/180);
}