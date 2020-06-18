const width = 800;
const height = 600;
const hexRadius = 30;
const hexSides = 7;
let nodes = {};
var walls = {}

let ss = undefined;
let ee = undefined;
var nodeNumber = 0;
var checkedlist = [];
var nodeSearchRadius = 60;

var pathTimer = undefined
var drawing = false;
var drawMode = "draw";
var setRoute = false;

function initPage(){
    canvas.width = width;
    canvas.height = height;
    nodeNumber = 0;
    checkedlist = [];
    nodes = {};
    walls = {};
    ss = undefined;
    ee = undefined;
    drawing = false;
    drawMode = "draw";
    setRoute = false;
    createHexGrid(0,20,20)
    drawHexGrid();
    for(var i in nodes){
        nodes[i].markNearest();
    }
    
}
function drawHexGrid(){
    for(var i in nodes){
        drawHex(nodes[i].x, nodes[i].y, nodes[i])
    }
}
function drawRouteHex(){
    for(var i in nodes){
        if(nodes[i].route){
            drawHex(nodes[i].x, nodes[i].y, nodes[i])
        }
    }
}

function createHexGrid(n_num, x, y){
    if(nodes[n_num] == undefined){
        if(x >= -15 && x <= canvas.width+15 && y >= -15 && y <= canvas.height+15){
            nodes[n_num] = new Node(n_num, x, y, false, true);
            createHexNodesAround();
            createHexGrid(n_num+1, nodes[n_num+1].x, nodes[n_num+1].y)
        }
    }
    else {
        if(x >= -15 && x <= canvas.width+15 && y >= -15 && y <= canvas.height+15){
            nodes[n_num].markNearest();
            createHexNodesAround();
            if(nodes[n_num+1] != undefined)
                createHexGrid(n_num+1, nodes[n_num+1].x, nodes[n_num+1].y)  
        } 
    }

    function createHexNodesAround(){
        for(var i = 0; i < 6; i++){
            var distance = Math.cos(toRadians(30)) * 30;
            var H = distance*2;
            var angle = 30+(i*60);
            var X = Math.cos(toRadians(angle)) * H;
            var Y = Math.tan(toRadians(angle)) * X;
            var XX = x+X;
            var YY = y+Y;
            //if the node is within the canvas area
            if(XX >= -15 && XX <= canvas.width+15 && YY >= -15 && YY <= canvas.height+15){
                name = Object.keys(nodes).length;
                nodes[name] = new Node(name, XX, YY, false, true);
                for(var b in nodes[n_num].hexes){
                   if(Math.round(nodes[n_num].hexes[b].x) == Math.round(XX) && Math.round(nodes[n_num].hexes[b].y) == Math.round(YY)){
                       delete nodes[name]
                   }
                }
            } 
        }
    }
}


function drawHex(x, y, node){ // center coordinates of the hex
    c.beginPath();
    c.lineWidth = 2;
    var H = hexRadius;
    c.moveTo(x+hexRadius, y);
    for(var i = 0; i < 7; i++){
        var angle = (hexRadius*i) * 2;
        var X = Math.cos(toRadians(angle)) * H;
        var Y = Math.tan(toRadians(angle)) * X;
        c.lineTo(x+X, y+Y)
    }
    if(!node.walkable)
        c.fillStyle = "black";
    else
        c.fillStyle = node.color;
    c.fill();
    c.strokeStyle = "black";
    c.stroke();
    c.font = "16px Arial"
    c.fillStyle ="darkgray"
    c.fillText(node.name, x-16, y-4)
    if(node.walkable){
        c.fillStyle ="black"
        c.fillText(Math.round(node.dist), x-8, y+18)
    }
}

function Node(name, x, y, visited, walkable){
    this.name = name;
    this.x = x;
    this.y = y;
    this.color = 'lightblue';
    this.visited = visited;
    this.checked = false;
    this.walkable = walkable;
    this.route = false;
    this.parent = undefined;
    this.nearest = [];
    this.hexes = {};
    this.dist = 0;
    this.markNearest = function(){
        this.nearest = [];
        for(var i in nodes){
            if(getDistance(this.x, this.y, nodes[i].x, nodes[i].y) < nodeSearchRadius){
                if(this.name != i){
                    this.nearest.push(nodes[i])
                    this.hexes[nodes[i].name] = nodes[i];
                }
                    
            }
        }
    }
}
function setTask(value){
    drawMode = value;
    var taskTxt = document.getElementById('task');
    if(drawMode == "draw")
        taskTxt.innerText = "Draw walls"
    else if(drawMode == "route"){
        taskTxt.innerText = "Set route";
        setRoute = true;
    }
}
canvas.addEventListener('click', function(e){
    if(drawMode == "route" && setRoute){
        var mouseX = e.clientX-canvas.offsetLeft;
        var mouseY = e.clientY-canvas.offsetTop;
        for(var i in nodes){
            if(getDistance(mouseX, mouseY, nodes[i].x, nodes[i].y) < 25){
                if(nodes[i].walkable && drawMode == "route")
                    if(ss == undefined && ee == undefined){
                        ss = nodes[i].name;
                        nodes[i].color = "green";
                        document.getElementById('startnode').value = ss;
                    } else if(ss != undefined && ee == undefined){
                        ee = nodes[i].name
                        nodes[i].color = "salmon";
                        document.getElementById('endnode').value = ee;
                    }
                    
    
                drawHexGrid();
            }
        }
    }
})
canvas.addEventListener('contextmenu', function(e){
    e.preventDefault();
})
canvas.addEventListener('mousedown', function(e){
    drawing = true;
    if(!setRoute){
        if(e.button == 0)
            drawMode = "draw";
        else if(e.button == 2)
            drawMode = "erase";
    }
})
canvas.addEventListener('mouseup', function(e){
    drawing = false;
})
canvas.addEventListener('mousemove', function(e){
    if(drawing){
        var mouseX = e.clientX-canvas.offsetLeft;
        var mouseY = e.clientY-canvas.offsetTop;
        for(var i in nodes){
            if(getDistance(mouseX, mouseY, nodes[i].x, nodes[i].y) < 25){
                if(nodes[i].walkable && drawMode == "draw")
                    nodes[i].walkable = false
                else if(!nodes[i].walkable && drawMode == "erase")
                    nodes[i].walkable = true

                drawHexGrid();
            }
        }
    }
})
window.addEventListener('keyup', function(e){
    if(e.keyCode == 13){
        starRoute()
    }
})

function starRoute(){
    if(ss != undefined && ee != undefined){
        pathTimer = setInterval(()=>{
            getPath(ss, ee)
        }, 50)
    }
}

function getPath(start, end){
    nodes[start].visited = true;
    nodes[start].checked = true;
    var route = [];

    drawHexGrid();
    //We check the current node if the route end is found
    if(start == end){
        clearInterval(pathTimer);
        markParentAsRoute(nodes[start]);

    //if not found, we check the surrounding nodes
    } else {
        // mark values, mark checked and assign parent node
        for(var t = 0; t < nodes[start].nearest.length; t++) {
            if(nodes[start].nearest[t].walkable && !nodes[start].nearest[t].visited && !nodes[start].nearest[t].checked){
                var d1 = getDistance(nodes[start].nearest[t].x, nodes[start].nearest[t].y, nodes[ee].x, nodes[ee].y);
                var d2 = getDistance(nodes[start].nearest[t].x, nodes[start].nearest[t].y, nodes[ss].x, nodes[ss].y);
                var nodeName = nodes[start].nearest[t].name;
                nodes[nodeName].dist = d1+d2; // dist = d1+d2 <-- we sort by this value
                nodes[nodeName].parent = nodes[start];
                nodes[nodeName].checked = true;
                nodes[nodeName].color = "rgb(160,148,113)";
                checkedlist.push(nodes[nodeName]);
            }
        }

        checkedlist.sort((a,b) => a.dist-b.dist);
        nodeNumber = 0;
        
        checkNearestNode();

        function checkNearestNode(){
            if(checkedlist[nodeNumber] == undefined){
                clearInterval(pathTimer);
                console.log('couldn\'t find route')
                return;
            } else if(checkedlist[nodeNumber] != undefined){
                var node = checkedlist[nodeNumber];
                var isWall = node.walkable ? false : true;
                var isChecked = node.checked ? true : false;
                var isVisited = node.visited ? true : false;

                if(isWall){
                    nodeNumber++;
                    checkNearestNode();
                }
                else {
                    if(isChecked && !isVisited){
                        ss = checkedlist[nodeNumber].name;
                        // getPath(ss, end);
                    }
                    else if(isChecked && isVisited){
                        nodeNumber++;
                        checkNearestNode();
                    }
                }
            }
        }
    }

    function markParentAsRoute(tile){
        if(tile.parent != undefined){
            nodes[tile.name].route = true;
            nodes[tile.name].color = "lightgreen";
            markParentAsRoute(tile.parent);
        }
        else{
            nodes[tile.name].route = true;
            showNextParent(end)
            function showNextParent(num){
                if(nodes[num].parent != undefined){
                    route.push(num)
                    showNextParent(nodes[num].parent.name)
                } else {
                    route.push(num)
                    route.reverse();
                    nodes[end].color = "salmon"
                    drawRouteHex();
                    drawFinalRouteLine(nodes[end]);
                    ss = undefined;
                    ee = undefined;
                    return route;
                }
            }
        }
    }
    function drawFinalRouteLine(node){
        if(node != undefined){
            c.beginPath();
            c.moveTo(node.x, node.y);
            c.lineTo(node.parent.x, node.parent.y);
            c.strokeStyle = "purple";
            c.lineWidth = 4;
            c.stroke();
            c.strokeStyle = "gray";
            c.lineWidth = 2;
            c.stroke();
            drawFinalRouteLine(node.parent)
        }
    }
}
initPage();