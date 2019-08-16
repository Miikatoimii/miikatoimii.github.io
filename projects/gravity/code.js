//blackhole position
var bhposX = 0;
var bhposY = 0;
var itemPosX = 0;
var itemPosY = 0;
var bHole = document.getElementById("blackhole");
var item1 = document.getElementById("item");

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

var gravOn = false;
function gravitMode(){
    blackholeposition();
    greenballposition();
    if(!gravOn){
        gravOn = true;
        createobject();
        setInterval(pullX, 10);
        setInterval(pullY, 10);
        var speedX =  parseInt(document.getElementById("speed").value);
        var speedY =  parseInt(document.getElementById("speed").value);
        var multip = 0.1;
        var gravForce =  parseFloat(document.getElementById("gravity").value);
        function pullX(){
            if(itemPosX < bhposX){
                itemPosX+=(speedX+=multip)+(gravForce);
            }
            if(itemPosX > bhposX){
                itemPosX+=(speedX-=multip)-(gravForce);
            }
            item1.style.left =itemPosX+"px";
        }
        function pullY(){
            if(itemPosY < bhposY){
                itemPosY+=(speedY+=multip)+(gravForce);
            }
            if(itemPosY > bhposY){
                itemPosY+=(speedY-=multip)-(gravForce);
            }
            item1.style.top =itemPosY+"px";
        }

    }
}

function createobject(){
    setInterval(addOneMore, 40);
    function addOneMore(){
        var newbal = document.createElement("div");
        newbal.setAttribute("class", "pyrsto");
        newbal.style.top = itemPosY+"px";
        newbal.style.left = itemPosX+"px";
        document.body.appendChild(newbal);
        setTimeout(delOneball, 1001);
        function delOneball(){
            document.body.removeChild(newbal)
        }
    }
}