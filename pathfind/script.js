const width = 800;
const height = 600;
const tile = 40;
let nodes = {};
let pathType  = 0;

let ss = undefined;
let ee = undefined;
var nodeNumber = 0;
var checkedlist = [];
var radius = 46;

function initPage(){
    canvas.width = width;
    canvas.height = height;
    nodeNumber = 0;
    checkedlist = [];
    createGrid();
    drawWalls()
    drawGrid();
}   

function createGrid(){
    var horizontalCount = width/tile;
    var verticalCount = height/tile;
    var tileNumber = 0;
    for(var i = 0; i < horizontalCount; i++){
        for(var b = 0; b < verticalCount; b++){
            nodes[tileNumber] = new Node(tileNumber, i*tile, b*tile, false, true)
            tileNumber++
        }
    }
    for(var i in nodes){
        nodes[i].markNearest();
    }
}

function drawGrid(){
    c.clearRect(0,0,canvas.width, canvas.height);
    for(var i in nodes){
        c.beginPath();
        var color = "";

        if(nodes[i].walkable){
            color = "lightgreen";
            if(nodes[i].checked && !nodes[i].visited) color = "lightblue";
            if(nodes[i].checked && nodes[i].visited) color = "green";
        } else {
            color = "rgb(33,33,33)";
        }
            
        c.fillStyle = color;
        c.rect(nodes[i].x, nodes[i].y, tile, tile);
        c.fill();
        c.lineWidth = 1;
        c.strokeStyle = "black";
        c.stroke();
        c.fillStyle = "white";
        c.fillText(i, nodes[i].x+3, nodes[i].y+10);
        if(nodes[i].walkable){
            c.fillStyle = "lightgrey";
            c.fillText(Math.floor(nodes[i].dist), nodes[i].x+3, nodes[i].y+36);
        }
    }
}

var walls = {}

function drawWalls(){
    for(var i in nodes){
        if(walls[i] != undefined){
            nodes[i].walkable = false
        }
    }
}

function Node(name, x, y, visited, walkable){
    this.name = name;
    this.x = x;
    this.y = y;
    this.visited = visited;
    this.checked = false;
    this.walkable = walkable;
    this.route = false;
    this.parent = undefined;
    this.nearest = [];
    this.dist = 0;
    this.markNearest = function(){
        for(var i in nodes){
            if(getDistance(this.x, this.y, nodes[i].x, nodes[i].y) < radius){
                if(this.name != i){
                    this.nearest.push(nodes[i])
                }
                    
            }
        }
    }
}
var pathTimer = undefined

canvas.addEventListener('click', function(e){
    var mouseX = e.clientX-canvas.offsetLeft;
    var mouseY = e.clientY-canvas.offsetTop;
    for(var i in nodes){
        if(mouseX >= nodes[i].x && mouseX < nodes[i].x+tile && mouseY >= nodes[i].y && mouseY < nodes[i].y+tile){
            if(pathType == 1){
                if(nodes[i].walkable){
                    nodes[i].walkable = false
                    walls[nodes[i].name] = true
                } else {
                    nodes[i].walkable = true
                    delete walls[nodes[i].name]
                }
                drawGrid()
            } else if(pathType == 0){
                if(ss == undefined && ee == undefined){
                    initPage();
                    ss = nodes[i].name;
                } else {
                    ee = nodes[i].name;
                    // getPath(ss, ee);
                    pathTimer = setInterval(()=>{
                        getPath(ss, ee);
                    }, 10)
                }
            }
        }
    }
})

initPage();

function getDistance(x1, y1, x2, y2){
    var xDistance = x2 - x1;
    var yDistance = y2 - y1;
    return Math.abs(Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2)));
}

function getPath(start, end){
    nodes[start].visited = true;
    nodes[start].checked = true;
    var route = [];

    //We check the current node if the route end is found
    if(start == end){
        clearInterval(pathTimer);
        drawGrid();
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
                checkedlist.push(nodes[nodeName]);
            }
        }

        //sort the checked nodes by the lowest value
        // nodes[start].nearest.sort((a, b) => a.dist - b.dist);
        checkedlist.sort((a,b) => a.dist-b.dist);
        nodeNumber = 0;
        drawGrid();
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
            c.beginPath()
            c.moveTo(tile.x+20, tile.y+20);
            c.lineTo(tile.parent.x+20, tile.parent.y+20);
            c.strokeStyle = "purple";
            c.lineWidth = 3
            c.stroke()
            nodes[tile.name].route = true;
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
                    
                    console.log('route found:', route.length,route)
                    ss = undefined;
                    ee = undefined;
                    return route;
                }
            }
        }
    }
}

function setClickType(value){
    pathType = value;
}