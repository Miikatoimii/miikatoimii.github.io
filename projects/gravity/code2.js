var bhposX = 0;
var bhposY = 0;
var itemPosX = 0;
var itemPosY = 0;
var bHole = document.getElementById("blackhole");
var item1 = document.getElementById("item");

var gravForce =  parseFloat(document.getElementById("gravity").value);
function blackholeposition(){
    bhposX = parseInt(document.getElementById("blkhX").value);
    bhposY = parseInt(document.getElementById("blkhY").value);
    bHole.style.left = bhposX+"px";
    bHole.style.top = bhposY+"px";
}
function greenballposition(){
    itemPosX = parseInt(document.getElementById("gbpX").value);
    itemPosY = parseInt(document.getElementById("gbpY").value);
    item1.style.left =itemPosX+"px";
    item1.style.top = itemPosY+"px";
}
blackholeposition();
greenballposition();

function positions(){
    blackholeposition();
    greenballposition();
    gravForce =  parseFloat(document.getElementById("gravity").value);
}

setInterval(pullX, 20);
var rot = 0;
function pullX(){
    var multip = ((gravForce*=1.001)/10);
    var rotspeed = (multip*50);
    var actualROTspeed =(rotspeed *= 2.3);
    rot += actualROTspeed;
    
    if(itemPosX > 75){
        itemPosX -= (multip);
    } else {
        positions();
        rot = 0;
    }
    item1.style.left =itemPosX+"px";
    document.getElementById("blackhole").style.transform =" rotate("+rot+"deg)";
    document.getElementById("sdf").innerHTML = "Gravity force: "+multip.toFixed(4)+"<br> Distance from center: "+Math.abs(itemPosX-75).toFixed(4)+"<br> rotation speed: "+actualROTspeed.toFixed(4);
}

