var canvas = document.querySelector('canvas');
var c = canvas.getContext("2d");
canvas.width = 600;
canvas.height = 520;
var tile = 40;
var gridX = canvas.width/tile;
var gridY = canvas.height/tile;
var offsetX = 50;
var offsetY = 0;

/**    */
/**    */
var pysakit = {
    a:{
        x: 50,
        y: 50,
        name: "a", 
        color: "blue",
        childStops: [
            {name: "b",distance: 14},
            {name: "d",distance: 11},
            {name: "e",distance: 20},
        ]
    },
    b:{
        x: 50,
        y: 150,
        name: "b", 
        color: "blue",
        childStops: [
            {name: "a",distance: 14},
            {name: "c",distance: 16},
        ]
    },
    c:{
        x: 150,
        y: 200,
        name: "c", 
        color: "blue",
        childStops: [
            {name: "b",distance: 16},
            {name: "d",distance: 18},
            {name: "o",distance: 22},
            {name: "f",distance: 13},
        ]
    },
    d:{
        x: 150,
        y: 100,
        name: "d", 
        color: "blue",
        childStops: [
            {name: "a",distance: 11},
            {name: "e",distance: 12},
            {name: "c",distance: 18},
        ]
    },
    e:{
        x: 250,
        y: 50,
        name: "e", 
        color: "blue",
        childStops: [
            {name: "a",distance: 20},
            {name: "d",distance: 12},
            {name: "n",distance: 10},
        ]
    },
    f:{
        x: 50,
        y: 300,
        name: "f", 
        color: "blue",
        childStops: [
            {name: "c",distance: 13},
            {name: "i",distance: 7},
            {name: "g",distance: 9},
        ]
    },
    g:{
        x: 50,
        y: 400,
        name: "g", 
        color: "blue",
        childStops: [
            {name: "f",distance: 9},
            {name: "h",distance: 7},
        ]
    },
    h:{
        x: 150,
        y: 400,
        name: "h", 
        color: "blue",
        childStops: [
            {name: "j",distance: 4},
            {name: "g",distance: 7},
            {name: "i",distance: 9},
        ]
    },
    i:{
        x: 150,
        y: 300,
        name: "i", 
        color: "blue",
        childStops: [
            {name: "f",distance: 7},
            {name: "h",distance: 9},
            {name: "k",distance: 8},
        ]
    },
    j:{
        x: 150,
        y: 460,
        name: "j", 
        color: "blue",
        childStops: [
            {name: "h",distance: 4},
        ]
    },
    k:{
        x: 350,
        y: 300,
        name: "k", 
        color: "blue",
        childStops: [
            {name: "i",distance: 8},
            {name: "l",distance: 10},
            {name: "o",distance: 12},
        ]
    },
    l:{
        x: 450,
        y: 400,
        name: "l", 
        color: "blue",
        childStops: [
            {name: "m",distance: 5},
            {name: "k",distance: 10},
            {name: "o",distance: 20},
        ]
    },
    m:{
        x: 450,
        y: 460,
        name: "m", 
        color: "blue",
        childStops: [
            {name: "l",distance: 5},
        ]
    },
    o:{
        x: 450,
        y: 200,
        name: "o", 
        color: "blue",
        childStops: [
            {name: "n",distance: 12},
            {name: "c",distance: 22},
            {name: "k",distance: 12},
            {name: "l",distance: 20},
        ]
    },
    n:{
        x: 450,
        y: 100,
        name: "n", 
        color: "blue",
        childStops: [
            {name: "e",distance: 10},
            {name: "o",distance: 12},
        ]
    },
}
  
function drawCanvas(init){   
    for(var p in pysakit){
        X = pysakit[p].x+offsetX;
        Y = pysakit[p].y+offsetY;
    
        c.beginPath();
        c.lineWidth = 1;
        for(var b = 0; b < pysakit[p].childStops.length; b++){
            c.strokeStyle = "darkblue"
            c.moveTo(X,Y);
            toX = pysakit[pysakit[p].childStops[b].name].x+offsetX;
            toY = pysakit[pysakit[p].childStops[b].name].y+offsetY;
            c.lineTo(toX, toY);
        }
        c.stroke();
        if(init){
            document.getElementById('start').innerHTML += `<option>${pysakit[p].name.toUpperCase()}</option>`;
            document.getElementById('end').innerHTML += `<option>${pysakit[p].name.toUpperCase()}</option>`;
        }
    }
    for(var p in pysakit){
        X = pysakit[p].x+offsetX;
        Y = pysakit[p].y+offsetY;
        c.beginPath();
        c.fillStyle = pysakit[p].color;
        c.arc(X, Y, tile/2, 0, Math.PI*2);
        c.fill()
        c.fillStyle = "white";
        c.font ="20pt Arial "
        c.fillText(pysakit[p].name.toUpperCase(), X-8, Y+10)
    }
    c.font ="12pt Arial black";
    c.fillStyle = "red";
    c.fillText(20, 180, 45);c.fillText(14, 70, 105);c.fillText(11, 140, 95);c.fillText(12, 240, 95);
    c.fillText(10, 390, 70);c.fillText(18, 205, 160);c.fillText(16, 140, 195);c.fillText(22, 340, 195);
    c.fillText(13, 125, 250);c.fillText(9, 80, 355);c.fillText(9, 205, 355);c.fillText(4, 205, 435);
    c.fillText(7, 145, 415);c.fillText(7, 145, 315);c.fillText(8, 290, 315);c.fillText(10, 420, 355);
    c.fillText(12, 420, 255);c.fillText(20, 505, 315);c.fillText(12, 505, 160);c.fillText(5, 505, 435);
}
drawCanvas(true)

// reitin valinta koodi
function setRoute(){
    var start = document.getElementById('start').value;
    var end = document.getElementById('end').value;
    var sortByNumber = document.getElementById('sort').value;
    if(start != 0 && end != 0){
        var routes = getRoute(start.toLowerCase(), end.toLowerCase()).sort((a, b) => a.totalDistance - b.totalDistance);
        document.getElementById('info').innerHTML = routes.length+" routes!";
        document.getElementById('routes').innerHTML = "";
        clickRoute(showRoute(routes[0]).join(","))
        var routenum = 0;
        if(routes.length > 0){
            routes.forEach(route => {
                if(routenum < sortByNumber){
                    routenum++;
                    document.getElementById('routes').innerHTML += `<a style="background-color: rgba(`+(routenum*10)+`,`+((255)-(routenum*10))+`,0,0.3)" onclick="clickRoute('${showRoute(route)}')" id="route${routenum}" class="routeCard">
                        <p>Route: ${routenum}</p>
                        <p style="text-align:center;font-weight:bold;">${showRoute(route).join(", ")}</p>
                        <p>total distance:</p>
                        <p style="text-align:center;font-weight:bold;font-size:16pt;">${route.totalDistance}</p>
                        </a>`
                }
                else if(sortByNumber == "null"){
                    routenum++;
                    document.getElementById('routes').innerHTML += `<a style="background-color: rgba(`+(routenum*10)+`,`+((255)-(routenum*10))+`,0,0.3)" onclick="clickRoute('${showRoute(route)}')" id="route${routenum}" class="routeCard">
                        <p>Route: ${routenum}</p>
                        <p style="text-align:center;font-weight:bold;">${showRoute(route).join(", ")}</p>
                        <p>total distance:</p>
                        <p style="text-align:center;font-weight:bold;font-size:16pt;">${route.totalDistance}</p>
                        </a>`
                }
    
            })
        }
        drawCanvas(false)
    }
}

function clickRoute(route){
    c.clearRect(0,0,canvas.width, canvas.height)
    var ar = route.toLowerCase()
    for(var s in pysakit){
        pysakit[s].color = "blue";
    }
    for(var i = 0; i < ar.length; i++){
        if(ar[i] != ','){
            if(i == 0){
                pysakit[ar[i]].color = "green";
                c.beginPath();
                c.strokeStyle = "violet";
                c.lineWidth = 6;
                c.moveTo(pysakit[ar[i]].x+offsetX, pysakit[ar[i]].y+offsetY)
            }
            else if(i == ar.length-1) {
                pysakit[ar[i]].color = "red";
                c.lineTo(pysakit[ar[i]].x+offsetX, pysakit[ar[i]].y+offsetY)
            }
            else {
                pysakit[ar[i]].color = "orange";
                c.lineTo(pysakit[ar[i]].x+offsetX, pysakit[ar[i]].y+offsetY)
            }
                
        }
    }
    c.stroke()
    drawCanvas(false)

}

function showRoute(route){
    var str = [];
    hasParent(route);
    function hasParent(route){
        if(route.parent != null){
            str.push(route.name.toUpperCase());
            hasParent(route.parent);
        } else {
            str.push(route.name.toUpperCase())
        }
    }
    return str.reverse();
}

function getRoute(start, end){
    var route = {};
    var routes = [];
    var Node = function(td, parent, children, name){
        this.totalDistance = td;
        this.parent = parent;
        this.children = children;
        this.name = name
        this.checked = {};
    }
    route[start] = new Node(0, null, pysakit[start].childStops, start)
    route[start].checked[start] = true
    for(var s in pysakit){
        if(pysakit[s].name == start)
            pysakit[s].color = "green";
        else if(pysakit[s].name == end)
            pysakit[s].color = "red";
        else pysakit[s].color = "blue";
    }
    
    checkRoute(route[start])
    function checkRoute(node){ // node == route[start]
        //check the children
        for(var i = 0; i < node.children.length; i++) {

            //if node is not checked in the branch
            if(node.checked[node.children[i].name] == undefined){
                var totalDistance = node.children[i].distance+node.totalDistance;
                var parent = node;
                var child = pysakit[node.children[i].name].childStops;
                var name = node.children[i].name
                route[node.children[i].name] = new Node(totalDistance, parent, child, name);
                for(var d in node.checked){
                    route[node.children[i].name].checked[d] = true
                }
                route[node.children[i].name].checked[name] = true
                //is the child the end node?
                if(route[node.children[i].name].name == end){
                    routes.push(route[node.children[i].name])
                } else {
                    checkRoute(route[node.children[i].name])
                }    
            } 
        }
    }
    return routes;
}
var endpoint = 0;
canvas.addEventListener('click', (e)=>{
    var mouseX = e.clientX-canvas.offsetLeft;
    var mouseY = e.clientY-canvas.offsetTop;
    for(var r in pysakit){

        if(getDistance(mouseX, mouseY, pysakit[r].x+offsetX, pysakit[r].y+offsetY) < 20){
            if(endpoint == 0){
                endpoint = 1;
                document.getElementById('start').value = pysakit[r].name.toUpperCase();
                pysakit[r].color = "green";
            } else {
                document.getElementById('end').value = pysakit[r].name.toUpperCase();
                pysakit[r].color = "red";
                endpoint = 0;
            }
        }
    }
    drawCanvas(false)
    setRoute()
})

function getDistance(x1, y1, x2, y2){
    var xDistance = x2 - x1;
    var yDistance = y2 - y1;
    return Math.abs(Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2)));
}