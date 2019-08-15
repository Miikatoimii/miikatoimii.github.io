var letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
var psbox = document.getElementById("box");


function getPassword(){
    var resultPassword = "";
    var passLenght = document.getElementsByName("pslength")[0].value;
    for(var i = 0; i < passLenght; i++){
        var rndNum = Math.floor(Math.random()* letters.length);
        var thisLetter = letters.charAt(rndNum);
        resultPassword += thisLetter;
    }
    if(resultPassword.length > 0){
        psbox.style.display = "block";
    } else {
        psbox.style.display = "none";
    }
    document.getElementById("yourPassword").innerHTML = resultPassword;
}