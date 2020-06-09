var canvas = document.querySelector('canvas');
var c = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
window.addEventListener('resize', function(e){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
})

var magnets = [];
var magnetType = "negative";
var globalStrength = 20;

var plusMagnet = {
    x: window.innerWidth/2,
    y: window.innerHeight/2,
    r: 30,
    strength: globalStrength,
    pullRange: globalStrength*10,
    type: "positive",
    color: "red"
}

function Magnet(x, y, r, type, color, id){
    this.r = r;
    this.x = x;
    this.y = y;
    this.id = id;
    this.velocistyX = 0;
    this.velocistyY = 0;
    this.strength = this.r*4;
    this.pullRange = this.strength*10;
    this.type = type;
    this.color = color;
    this.move = function(){
        if(this.velocistyX > 0) this.velocistyX -= 0.02
        else if(this.velocistyX < 0) this.velocistyX += 0.02
        if(this.velocistyY > 0) this.velocistyY -= 0.02
        else if(this.velocistyY < 0) this.velocistyY += 0.02
        if(this.x < 0 || this.x > window.innerWidth)
            this.velocistyX = -this.velocistyX
        if(this.y < 0 || this.y > window.innerHeight)
            this.velocistyY = -this.velocistyY

        c.beginPath();
        c.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        c.fillStyle = this.color;
        c.fill();
    }
}
magnets.push(new Magnet(Math.random()*canvas.width, Math.random()*canvas.height, globalStrength, "negative", "blue", magnets.length ))
magnets.push(new Magnet(Math.random()*canvas.width, Math.random()*canvas.height, globalStrength, "negative", "blue", magnets.length ))
magnets.push(new Magnet(Math.random()*canvas.width, Math.random()*canvas.height, globalStrength, "positive", "red", magnets.length ))
magnets.push(new Magnet(Math.random()*canvas.width, Math.random()*canvas.height, globalStrength, "positive", "red", magnets.length ))
canvas.addEventListener('click', function(e){
    magnets.push(new Magnet(e.clientX, e.clientY, globalStrength, magnetType, magnetType=="positive"?"red":"blue", magnets.length ))
})
canvas.addEventListener('mousemove', function(e){
    plusMagnet.x = e.clientX;
    plusMagnet.y = e.clientY;
})
window.addEventListener('keyup', function(e){
    if(e.keyCode == 49)
        magnetType = "negative"
    if(e.keyCode == 50)
        magnetType = "positive"
})
window.addEventListener('wheel', function(e){
    if(e.deltaY > 0)
    globalStrength -= 10
    else
    globalStrength += 10

    plusMagnet.strength = globalStrength
    plusMagnet.pullRange = plusMagnet.strength*10
})

function getDistance(x1, y1, x2, y2){
    var distanceX = Math.abs(x1 - x2);
    var distanceY = Math.abs(y1 - y2);
    return Math.abs(Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2)))
}
function dist(d1, d2){
    var distance = (d1 - d2);
    return (distance)
}

function draw(){
    requestAnimationFrame(draw);
    c.clearRect(0,0,window.innerWidth, window.innerHeight)
    c.beginPath();
    c.arc(plusMagnet.x, plusMagnet.y, plusMagnet.r, 0, Math.PI * 2);
    c.fillStyle = plusMagnet.color;
    c.fill();

    c.globalAlpha = 0.03
    c.beginPath();
    c.arc(plusMagnet.x, plusMagnet.y, plusMagnet.pullRange, 0, Math.PI * 2);
    c.fillStyle = "purple";
    c.fill();
    c.globalAlpha = 1;

    if(magnets.length > 0){
        magnets.forEach(m => {
            magnetPull(plusMagnet, m)
            m.move();
        })
    }
}
draw();

function magnetPull(obj1, obj2){
    if(getDistance(obj1.x, obj1.y, obj2.x, obj2.y) < obj2.r + obj1.pullRange && getDistance(obj1.x, obj1.y, obj2.x, obj2.y) > obj1.r+obj2.r){
        //x axis
        distance = getDistance(obj1.x, obj1.y, obj2.x, obj2.y) 
        angle = Math.abs(Math.atan(dist(obj1.x, obj2.x) / dist(obj1.y, obj2.y)) )
        vX = (Math.sin(angle)/distance)*obj1.strength
        vY = (Math.cos(angle)/distance)*obj1.strength
        
        if(obj1.x > obj2.x && obj1.y > obj2.y){
            obj2.velocistyX += vX
            obj2.velocistyY += vY
        }
        else if(obj1.x < obj2.x && obj1.y > obj2.y){
            obj2.velocistyX += -vX
            obj2.velocistyY += vY
        }
        else if(obj1.x < obj2.x && obj1.y < obj2.y){
            obj2.velocistyX += -vX
            obj2.velocistyY += -vY
        } else {
            obj2.velocistyX += vX
            obj2.velocistyY += -vY
        }

    } else if(getDistance(obj1.x, obj1.y, obj2.x, obj2.y) < obj2.r+obj1.pullRange && getDistance(obj1.x, obj1.y, obj2.x, obj2.y) <= obj1.r+obj2.r+1){
       
        if(obj1.type != obj2.type){
            obj2.velocistyX = 0;
            obj2.velocistyY = 0;
        }
        if(obj1.x > obj2.x){
           obj2.x -= (obj1.r+obj2.r)-getDistance(obj1.x, obj1.y, obj2.x, obj2.y) 
        } else {
            obj2.x += (obj1.r+obj2.r)-getDistance(obj1.x, obj1.y, obj2.x, obj2.y)
        }
        if(obj1.y > obj2.y){
            obj2.y -= (obj1.r+obj2.r)-getDistance(obj1.x, obj1.y, obj2.x, obj2.y)
        } else {
            obj2.y += (obj1.r+obj2.r)-getDistance(obj1.x, obj1.y, obj2.x, obj2.y)
        }
        
    }
    if(obj1.type != obj2.type){
        obj2.x += obj2.velocistyX;
        obj2.y += obj2.velocistyY;
    } else if(obj1.type == obj2.type){
        obj2.x -= obj2.velocistyX;
        obj2.y -= obj2.velocistyY;
    }
    
}
