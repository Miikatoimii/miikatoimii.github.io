var num = 0;
var t = setInterval(newsmoke, 200);
function newsmoke(){
    num++;
    if(num > 30){
        clearInterval(t);
    } else {
        const collors = 235;
        var rndColorInt = Math.ceil(Math.random()*20)+collors;
        var newp = document.createElement("div");
        newp.setAttribute("class", "particle");
        newp.style.transform = "translateX("+(Math.ceil(Math.random()*90)-60)+"px)";
        newp.style.backgroundColor = "rgb("+rndColorInt+", "+rndColorInt+", "+rndColorInt+")";
        document.getElementById("smokewrapper").appendChild(newp);
    }
}
newsmoke();