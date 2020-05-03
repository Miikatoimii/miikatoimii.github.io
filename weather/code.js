var canvas = document.querySelector('canvas');
var c = canvas.getContext('2d')
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
window.addEventListener('resize', function(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
})
var clouds = [];
var air = [];
var rain = [];

var weather = {
    wind: 0.4,
    airpressure: 0.8,
    humidity: 30
}

function Particle(x,y, moist, color){
    this.x = x;
    this.y = y,
    this.moist = moist;
    this.color= color;
    this.move = function(){
        if(this.x > canvas.width)
            this.x = 0;
        if(this.x < 0)
            this.x = canvas.width;
        
        this.x += weather.wind;
        this.y -= (0.2-this.moist)*10; // edit moist speed here !! !!! ! !
        c.globalAlpha = 0.3;
        c.beginPath();
        c.arc(this.x, this.y, this.moist*3, 0, Math.PI*180);
        c.fillStyle = this.color;
        c.fill();
        c.globalAlpha = 1;
        
        if(clouds.length > 0){
            for(var b = 0; b < clouds.length; b++){
                if( this.moist < 0.2 && getDistance(this.x, this.y, clouds[b].x, clouds[b].y) <= clouds[b].r){
                    clouds[b].charge += weather.humidity/2000 + Math.abs(weather.wind)/100
                    clouds[b].r += weather.humidity/5000
                }
            }
        }
    }
}

function Cloud(x, radius){
    this.x = x;
    this.y = 0;
    this.boulge = 1.3;
    this.r = radius;
    this.alpha = 0.005;
    this.color = 235-this.r;
    this.weight = this.r / 10;
    this.isRaining = false;
    this.rainCounter = 5;
    this.charge = 0;
    this.cloudParticles = [];
    this.move = function(){
        // this.alpha = (this.r/2)/255
        this.r += weather.humidity/2000 
        if(this.x > canvas.width)
            this.x = 0;
        if(this.x < 0)
            this.x = canvas.width;
        this.x += weather.wind + (0.2/this.weight);
        this.y = (this.r+this.weight) / weather.airpressure;
        this.color = Math.ceil(235-this.r);
        this.weight = this.r / 10;
        c.globalAlpha = this.alpha;
        for(var i = 1; i < 7; i++){
            c.beginPath();
            c.ellipse(
                this.x, 
                this.y+(i*(this.r/8)), 
                this.r+(i*(this.r/4)), 
                this.r+(i*(this.r/8)), 
                0, 0, Math.PI*180
            );
            c.fillStyle = "rgb("+this.color+","+this.color+","+this.color+")";
            c.fill();
        }
        c.globalAlpha = 1;
    }
    this.rain = function(){
        this.rainCounter--;
        if(this.rainCounter <= 0){
            this.rainCounter = 6;
            if(this.r > 80)
                rain.push(new Particle(this.x-(this.r*this.boulge)+Math.ceil(Math.random()*(this.r*this.boulge*2)), this.y+this.r, 1, "blue"));
        }
        this.r -= 0.1
    }
    this.strike = function(a,b,s){
        step = s;
        newX = a;
        newY = b;
        dist = 300;
        while(dist > 0){ 
            dist--;
            newAngle = toRadians(-150+Math.ceil(Math.random()*300));
            newX += Math.sin(newAngle) * step;
            newY += Math.cos(newAngle) * step;
            c.beginPath();
            c.arc(newX, newY, step/2, 0, Math.PI*180*2);
            c.fillStyle = "rgb(255,255,0)";
            c.shadowBlur = 40;
            c.shadowColor = "white"
            c.fill();
            if(Math.ceil(Math.random()*80) == 80)
                strikeLight(newX,newY, 2)
        }
    }
}

function strikeLight( a,b,s ){
    step1 = s;
    newX1 = a;
    newY1 = b;
    dist1 = 200;
    while(dist1 > 0){ 
        dist1--;
        newAngle1 = toRadians(-90+Math.ceil(Math.random()*180));
        newX1 += Math.sin(newAngle1) * step1;
        newY1 += Math.cos(newAngle1) * step1;
        c.beginPath();
        c.arc(newX1, newY1, step1/2, 0, Math.PI*180*2);
        c.fillStyle = "rgb(255,255,0)";
        c.fill();
    }
}

function loop(){
    requestAnimationFrame(loop);
    c.clearRect(0,0,canvas.width, canvas.height)
    rndm = Math.random()
    if(rndm <= weather.humidity/100 ){
        air.push(new Particle(Math.ceil(Math.random()*canvas.width), canvas.height-10, 0.03, "white"))
    }


    if(clouds.length > 0){
        c.shadowBlur = 0;
        for(var i = 0; i < clouds.length; i++){
            clouds[i].move();
            if(clouds[i].r > 150)
                clouds[i].isRaining = true;
            if(clouds[i].isRaining && clouds[i].x > 0 && clouds[i].x < canvas.width)
                clouds[i].rain();
            if(clouds[i].charge >= 100){
                clouds[i].strike(clouds[i].x-clouds[i].r+(Math.ceil(Math.random()*(clouds[i].r*2))), clouds[i].y, 5);
                for(var v = 0; v < clouds.length; v++){
                    if(getDistance(clouds[i].x,clouds[i].y,clouds[v].x,clouds[v].y) < clouds[i].r+clouds[v].r){
                        clouds[v].charge -= 40;
                        if(weather.humidity > 2)
                            weather.humidity -= 0.05;
                    }
                }
            }
            if(clouds[i].r < 20 && clouds[i].isRaining == true){
                // clouds.splice(i,i+1)
                clouds[i].charge = 0;
                clouds[i].isRaining = false
            }
        }
    }
    if(air.length > 0){
        for(var i = 0; i < air.length; i++){
            air[i].move();
            if(air[i].y < 0){
                if(clouds.length < 120) clouds.push(new Cloud(air[i].x , 1));
                weather.humidity += air[i].moist/2;
                air.splice(i,i+1)
            }
            
            
        }
    }
    if(rain.length > 0){
        for(var i = 0; i < rain.length; i++){
            rain[i].move();
            if(rain[i].y > canvas.height || rain[i].x < 0 || rain[i].x > canvas.width){
                weather.humidity += rain[i].moist/100
                rain.splice(i,i+1)
            }
        }
    }
    document.getElementById('kosteus').innerHTML = "humidity: "+weather.humidity;
}
loop();
document.getElementById('tuuli').innerHTML = "wind: "+weather.wind;

function toRadians(angle){
    return angle * (Math.PI/180);
}
function getDistance(x1, y1, x2, y2){
    var xDistance = x2 - x1;
    var yDistance = y2 - y1;
    return Math.abs(Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2)));
}