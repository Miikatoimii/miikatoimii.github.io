var canvas = document.querySelector('canvas');
var c = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', ()=>{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
})

var stars = [];

var worldSpeed = 5;
var comet = {
    distance: 0,
    health: 100,
    x: canvas.width/4,
    y: canvas.height/2,
    r: 50,
    speedY: 0,
    speedX:0,
    newTail: 0,
    tail: [],
    move: function() {
        this.r = this.health/3+30
        if(this.speedY < 0 )
            this.y -= this.speedY
        if(this.speedY > 0 )
            this.y -= this.speedY
            
        if(this.speedX < 0 )
        this.x -= this.speedX
        if(this.speedX > 0 )
            this.x -= this.speedX

        var grad = c.createRadialGradient(this.x, this.y, this.r+70, this.x, this.y+this.r/2, 0);
        grad.addColorStop(0, "#aaf8f8")
        grad.addColorStop(1, "white")
        c.beginPath();
        c.arc(this.x, this.y, this.r, 0, 2*Math.PI)
        c.fillStyle = grad
        c.fill();
        this.tail.push(new Tail(this.x, this.y, this.r))
 
        if(this.tail.length > 0){
            this.drawTail();
            for ( var i = 0; i < this.tail.length; i++ ){
                if(this.tail[i].r < 25){
                    this.tail.splice(0, 1)
                }
            }
        }
        
    },
    drawTail: function(){
        for(var x = 0; x < this.tail.length; x++){
            this.tail[x].x -= worldSpeed
            this.tail[x].r -= 0.5;
            var grad = c.createRadialGradient(this.tail[x].x, this.tail[x].y, this.tail[x].r, this.tail[x].x+this.tail[x].r/2, this.tail[x].y, 0); 
            grad.addColorStop(0, "#aaf8f8")
            grad.addColorStop(1, "white")
            c.globalAlpha = 0.04
            c.beginPath();
            c.shadowBlur = 20;
            c.shadowColor = "white"
            c.arc(this.tail[x].x, this.tail[x].y, this.tail[x].r+10, 0, 2*Math.PI) 
            c.fillStyle = grad 
            c.fill();
            c.globalAlpha = 1
            c.shadowBlur = 0; 
        }
    }
}

function Tail(x, y, r){ 
    this.x = x;
    this.y = y;
    this.r = r
    this.speed = 2;
}
function Star(x, y, r, id){
    this.id = id;
    this.x = x;
    this.y = y;
    this.r = r;
    this.move = function(){
        this.x -= worldSpeed-(this.r/50);
        var grad = c.createRadialGradient(this.x, this.y, this.r, this.x, this.y+this.r/2, 0);
        var colorVar = 255-(this.r/2)
        grad.addColorStop(0, "rgb(238, "+colorVar+", 170)")
        grad.addColorStop(1, "white")
        c.beginPath();
        c.globalAlpha = 0.8
        c.shadowBlur = this.r/2; 
        c.shadowColor = "white"
        c.arc(this.x, this.y, this.r+10, 0, 2*Math.PI) 
        c.fillStyle = grad 
        c.fill();
        c.globalAlpha = 1 
        
        c.shadowBlur = 0; 
        
        if(getDistance(this.x, this.y, comet.x, comet.y) < comet.r+this.r){ 
            comet.health -= 1;
            document.getElementById('health-bar').style.width = 5*comet.health+"px";
            newX = comet.x - (comet.x/2-this.x/2);
            newY = comet.y - (comet.y/2-this.y/2);
            this.x -= (comet.x-newX)/100
            this.y -= (comet.y-newY)/100
            comet.x -= (this.x-newX)/10
            comet.y -= (this.y-newY)/10
            // c.beginPath();
            // c.arc(newX, newY, 8, 0, Math.PI*180*2);
            // c.fillStyle = "white";
            // c.shadowBlur = 10;
            // c.shadowColor = "blue"
            // c.fill();
            // c.shadowBlur = 0;


        }
    }
}

canvas.addEventListener('mousemove', (e)=>{
    comet.speedY = ( comet.y - e.clientY ) / 60
    comet.speedX = ( comet.x - e.clientX ) / 60
})

function frameloop(){
    requestAnimationFrame(frameloop);
    c.clearRect(0,0,canvas.width,canvas.height)
    comet.move();
    if(stars.length > 0){
        stars.forEach(star => {
            star.move();
        });
    }
}
frameloop()
var difficulty = 0.1;
var extraDifficulty = 0.01;

var gameloop = setInterval(function(){
    var randomRadius = Math.random()*4 + (difficulty * (Math.random()*100)); 
    if(difficulty < 0.99){
        difficulty += 0.005 
    } else {
        extraDifficulty += 0.1
        randomRadius += extraDifficulty;
    }
    
    var random = Math.random();
    var randomHeight = Math.ceil(Math.random()*canvas.height); 

    if(random < difficulty){
        stars.push(new Star(canvas.width+(randomRadius*2), randomHeight, randomRadius, stars.length))  
    }


    
    comet.distance++;
    document.getElementById('distance').innerText = Math.round(comet.distance)
    
    if(comet.health < 0){
        location.reload()
        alert("total points: "+ comet.distance)
    }
    for(var i = 0; i < stars.length; i++){
        if(stars[i].x < -(stars[i].r*2))
            stars.splice(i, 1)
    }
 
}, 400)

function getDistance(x1, y1, x2, y2){
    var xDistance = x2 - x1;
    var yDistance = y2 - y1;
    return Math.abs(Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2))); 
}
function toRadians(angle){
    return angle * (Math.PI/180);
}
document.getElementById('health-bar').style.width = 5*comet.health+"px"
window.addEventListener('keyup', (e)=>{
    alert("pause")
})