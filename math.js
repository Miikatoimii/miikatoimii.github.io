
function getDistance(x1, y1, x2, y2){
    var xDistance = x2 - x1;
    var yDistance = y2 - y1;
    return Math.abs(Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2)));
}
function toRadians(angle){
    return angle * (Math.PI/180);
}
function toAngles(rad){
    return rad / (Math.PI/180);
}
