var canvas = document.querySelector('canvas');
var c = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var gameTiles = [];

var player = {
    gravity: 0.9 ,
    x: 300,
    y: 200,
    size: 40,
    showCollisionPoint: false,
    color: "green",
    speed: 3.4,
    speedLeft: 0,
    speedRight: 0,
    jumpVelocity: 0.6,
    moveVelocity: 0.16,
    extraForce: 0,
    leftcollX: 0,
    leftcollY: 0,
    rightcollX: 0,
    rightcollY: 0,
    upcollX: 0,
    upcollY: 0,
    downcollX: 0,
    downcollY: 0,
    isJumping: false,
    isRunning: false,
    isGrounded: false,
    isMovingLeft: false,
    isMovingRight: false,
    extraJumpForce: false,
    jump: function(){
        this.y -= 0.1
        this.jumpVelocity = -9
        this.isGrounded = false;
    },
    resetJump: function(){
        this.isGrounded = true;
        this.jumpVelocity = 0;
    },
    checkCollision: function(){
        this.isGrounded = false;
        if(gameTiles.length > 0){
            this.leftcollX = this.x-1; this.leftcollY = this.y+(this.size/2)
            this.rightcollX = this.x+this.size+1; this.rightcollY = this.y+(this.size/2)
            this.upcollX = this.x+(this.size/2); this.upcollY = this.y-1
            this.downcollX = this.x+(this.size/2); this.downcollY = this.y+this.size;

            gameTiles.forEach(tile => {
                if(this.leftcollX < tile.x+tile.size && this.leftcollX > tile.x && this.leftcollY > tile.y && this.leftcollY < tile.y+tile.size ||
                    this.leftcollX < tile.x+tile.size && this.leftcollX > tile.x && this.leftcollY-5 > tile.y && this.leftcollY-5 < tile.y+tile.size ||
                    this.leftcollX < tile.x+tile.size && this.leftcollX > tile.x && this.leftcollY+5 > tile.y && this.leftcollY+5 < tile.y+tile.size){
                    this.x = tile.x+tile.size
                    this.speedLeft = 0;
                }
                if(this.rightcollX < tile.x+tile.size && this.rightcollX > tile.x && this.rightcollY > tile.y && this.rightcollY < tile.y+tile.size ||
                    this.rightcollX < tile.x+tile.size && this.rightcollX > tile.x && this.rightcollY-5 > tile.y && this.rightcollY-5 < tile.y+tile.size ||
                    this.rightcollX < tile.x+tile.size && this.rightcollX > tile.x && this.rightcollY+5 > tile.y && this.rightcollY+5 < tile.y+tile.size){
                    this.x = tile.x-this.size
                    this.speedRight = 0;
                }
                if(this.upcollX < tile.x+tile.size && this.upcollX > tile.x && this.upcollY > tile.y && this.upcollY < tile.y+tile.size ||
                    this.upcollX-5 < tile.x+tile.size && this.upcollX-5 > tile.x && this.upcollY > tile.y && this.upcollY < tile.y+tile.size ||
                    this.upcollX+5 < tile.x+tile.size && this.upcollX+5 > tile.x && this.upcollY > tile.y && this.upcollY < tile.y+tile.size){
                    this.jumpVelocity = 0.3
                }
                if(this.downcollX < tile.x+tile.size && this.downcollX > tile.x && this.downcollY >= tile.y && this.downcollY < tile.y+tile.size ||
                   this.downcollX-5 < tile.x+tile.size && this.downcollX-5 > tile.x && this.downcollY >= tile.y && this.downcollY < tile.y+tile.size ||
                   this.downcollX+5 < tile.x+tile.size && this.downcollX+5 > tile.x && this.downcollY >= tile.y && this.downcollY < tile.y+tile.size ){
                    this.y = tile.y-this.size
                    this.isGrounded = true;
                    this.jumpVelocity = 0;
                    
                }
            });
        }
    },
    movement: function(){
        
        if(this.isRunning){this.speed = 6 ; this.color ="darkgreen" } 
        else if(!this.isRunning) {this.speed = 3; this.color ="green" } 
     
  
        if(!this.isGrounded){
            if(this.jumpVelocity > 17) this.jumpVelocity = 17;
            if(this.extraJumpForce && this.jumpVelocity < 0) this.extraForce = 0.6;
            else this.extraForce = 0;
            this.y += this.jumpVelocity += this.gravity - (this.extraForce);
        }
        if(this.y+this.size > canvas.height) {
            this.resetJump();
            this.y = canvas.height-this.size;
        }
        if(this.isMovingLeft){
            if(this.speedLeft > this.speed)
                this.speedLeft = this.speed
            this.x -= this.speedLeft += this.moveVelocity
        } else if(!this.isMovingLeft){
            if(this.speedLeft > 0) this.speedLeft -= this.moveVelocity
            this.x -= this.speedLeft 
            if(this.speedLeft < 0){
                this.speedLeft = 0;
            } 
        }
        if(this.isMovingRight){
            if(this.speedRight > this.speed)
                this.speedRight = this.speed
            this.x += this.speedRight += this.moveVelocity
        } else if(!this.isMovingRight){
            if(this.speedRight > 0) this.speedRight -= this.moveVelocity
            this.x += this.speedRight
            if(this.speedRight < 0) {
                this.speedRight = 0;
            }
        }
    }
}

function worldCycle(){
    player.checkCollision();
    player.movement();
}

window.addEventListener('keydown',(e)=>{
    if(e.keyCode == 65){
        player.isMovingLeft = true;
    }
    if(e.keyCode == 68){ 
        player.isMovingRight = true;
    }
    if(e.keyCode == 16){
        player.isRunning = true
    }
    if(e.keyCode == 32 && player.isGrounded && !player.isJumping){
        player.jump();
        player.extraJumpForce = true;
        player.isJumping = true;
    }
})
window.addEventListener('keyup',(e)=>{
    if(e.keyCode == 65){
        player.isMovingLeft = false;
    }
    if(e.keyCode == 68){ 
        player.isMovingRight = false;
    }
    if(e.keyCode == 16){
        player.isRunning = false
    }
    if(e.keyCode == 32){
        player.extraJumpForce = false;
        player.isJumping = false;
    }
    
    if(e.keyCode == 49){
        if(player.showCollisionPoint){
            player.showCollisionPoint = false;
            console.log(player.showCollisionPoint)
        }
        else{
            player.showCollisionPoint = true;
            console.log(player.showCollisionPoint)
        }
    }
})
canvas.addEventListener('click', (e)=>{
    gameTiles.push(new Tile(Math.floor(e.clientX/40)*40, Math.floor(e.clientY/40)*40))
})

var loop = function() {
    requestAnimationFrame(loop);
    worldCycle();
    c.clearRect(0, 0, canvas.width, canvas.height)
    c.beginPath();
    c.rect(player.x,player.y,player.size,player.size);
    c.fillStyle = player.color;
    c.fillRect(player.x, player.y, player.size, player.size);

    if(player.showCollisionPoint){
        player.leftcollX = player.x-1; 
        player.leftcollY = player.y+(player.size/2)
        player.rightcollX = player.x+player.size+1; 
        player.rightcollY = player.y+(player.size/2)
        player.upcollX = player.x+(player.size/2); 
        player.upcollY = player.y-1
        player.downcollX = player.x+(player.size/2);
        player.downcollY = player.y+player.size;

        c.beginPath();
        c.fillStyle = "purple";
        c.arc(player.leftcollX, player.leftcollY+5, 2, 0, Math.PI * 2)
        c.arc(player.leftcollX, player.leftcollY-5, 2, 0, Math.PI * 2)
        c.fill();
        c.beginPath()
        c.arc(player.rightcollX, player.rightcollY+5, 2, 0, Math.PI * 2)
        c.arc(player.rightcollX, player.rightcollY-5, 2, 0, Math.PI * 2)
        c.fill();
        c.beginPath()
        c.arc(player.upcollX+5, player.upcollY, 2, 0, Math.PI * 2)
        c.arc(player.upcollX-5, player.upcollY, 2, 0, Math.PI * 2)
        c.fill();
        c.beginPath()
        c.arc(player.downcollX+5, player.downcollY, 2, 0, Math.PI * 2)
        c.arc(player.downcollX-5, player.downcollY, 2, 0, Math.PI * 2)
        c.fill();
    }
    
    if(gameTiles.length > 0){
        gameTiles.forEach(tile => {
            c.rect(tile.x,tile.y,tile.size,tile.size);
            c.fillStyle = "black";
            c.fillRect(tile.x, tile.y, tile.size, tile.size);
        });
    }
}
loop();

function Tile(x, y){
    this.x = x;
    this.y = y;
    this.size = 40;
}

function clearTiles(){
    gameTiles = [];
}

function setPlayerStats(value, mode){
    console.log(value, mode)
    if(mode == 'speed'){
        player.speed = value
    }
    if(mode == 'gravity'){
        player.gravity = value/10
    }
    if(mode == 'jVel'){
        player.jumpVelocity = value/10
    }
    if(mode == 'mVel'){
        player.moveVelocity = value/100
    }
}
function resetStats(){
    player.speed = 3;
    player.gravity = 0.6;
    player.jumpVelocity = 0.2;
    player.moveVelocity = 0.16
    document.getElementById('speedin').value = 3;
    document.getElementById('gravdin').value = 6;
    document.getElementById('jveldin').value = 2;
    document.getElementById('mvelin').value = 16;
}


window.addEventListener('resize', ()=>{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    player.x = 100;
    player.y = 100;
    clearTiles()
})