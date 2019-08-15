var num = 0;
var t = setInterval(newsmoke, 300);
function newsmoke(){
    num++;
    if(num > 20){
        clearInterval(t);
    } else {
        var rndColorInt = Math.ceil(Math.random()*40)+190;
        var newp = document.createElement("div");
        newp.setAttribute("class", "particle");
        newp.style.transform = "translateX("+(Math.ceil(Math.random()*60)-30)+"px)";
        newp.style.backgroundColor = "rgb("+rndColorInt+", "+rndColorInt+", "+rndColorInt+")";
        var newp2 = document.createElement("div");
        newp2.setAttribute("class", "particle");
        newp2.style.transform = "translateX("+(Math.ceil(Math.random()*60)-30)+"px)";
        newp2.style.backgroundColor = "rgb("+rndColorInt+", "+rndColorInt+", "+rndColorInt+")";
        document.getElementById("smokewrapper").appendChild(newp);
        document.getElementById("smokewrapper2").appendChild(newp2);
    }
}