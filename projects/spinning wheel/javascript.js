var headerTitle = "360&deg; fortunes";
var luckyText = "your number:";

var theTitle = document.getElementById("title");
var spinningWheel = document.getElementById("wheel");
var lucky = document.getElementById("luckyTxt");

// lucky.innerHTML = luckyText ;
theTitle.innerHTML = headerTitle;
var ready = true;

var cashHtml = document.getElementById("cashamount");
var cash = 20;
cashHtml.innerHTML = cash;
var betAmount = 0;

var winTxt = document.getElementById("winningTxt");
var highscore = document.getElementById("highestscore");
var highscorePTS = 0;


document.addEventListener('keydown', function(event) {
    if (event.code == 'ArrowDown') {
        betDown();
    }
    if (event.code == 'ArrowUp') {
        betUp();
    }
});

function betUp(){
    if(betAmount < cash && ready==true){
        betAmount += 1;
        document.getElementById("betamount").innerHTML = betAmount;
    }
}
function betDown(){
    if(betAmount > 0 && ready==true){
        betAmount -= 1;
        document.getElementById("betamount").innerHTML = betAmount;
    }
}
var difficulty = 4;
var dif = document.getElementById("diff");
var dif2 = document.getElementById("difff");
var dif3 = document.getElementById("diffff");
function easy(){
    difficulty = 0;
    dif.innerHTML = "180&deg; or more";
    dif2.innerHTML = "Get 180&deg; or more.";
    dif3.innerHTML = "Winning prize: 2 * BET AMOUNT";
}
function medium(){
    difficulty = 1;
    dif.innerHTML = "> 270&deg; or more";
    dif2.innerHTML = "Get 270&deg; or more.";
    dif3.innerHTML = "Winning prize: 4 * BET AMOUNT";
}
function hard(){
    difficulty = 2;
    dif.innerHTML = "Lucky 10";
    dif2.innerHTML = "If your number is as close as 10 from the random number, you win.";
    dif3.innerHTML = "Winning prize: 30 * BET AMOUNT";
}
function extra(){
    difficulty = 3;
    dif.innerHTML = "Total lucky";
    dif2.innerHTML = "Totally random number match.";
    dif3.innerHTML = "Winning prize: 300 * BET AMOUNT";
}

function rotate(){
$("#pricetag").fadeOut(1);
$("#winningTxt").fadeOut(1);
theTitle.innerHTML = headerTitle;
var rotateAmount = 0;
var setRotateAmount = Math.floor(Math.random() * (360*7));
var rotateMultiplier = 0; 
    if(ready && betAmount <= cash && difficulty < 4){
        cash -= betAmount;
        cashHtml.innerHTML = cash;
        ready = false;
        var spinnerTimer = setInterval(spin, 10);
        function spin(){
            if(rotateAmount < setRotateAmount){
                if(rotateAmount < setRotateAmount*0.5) {
                    if(setRotateAmount < 3){
                        setRotateAmount = 3;
                    }
                    rotateMultiplier++;
                    rotateAmount = rotateAmount+(rotateMultiplier*0.05);
                } else if(rotateAmount < setRotateAmount*0.95){
                    rotateMultiplier--;
                    rotateAmount = rotateAmount+(rotateMultiplier*0.05);
                } else {
                    rotateAmount+=0.5;
                }
                spinningWheel.style.transform = "rotate("+ rotateAmount +"deg)";
            } else {
                clearInterval(spinnerTimer);
                ready = true;
                $("#pricetag").fadeIn(1500);
                document.getElementById("luckyTitle").innerHTML = luckyText;
                finalAmount = Math.abs((Math.trunc(setRotateAmount/360)*360)-setRotateAmount);
                lucky.innerHTML = finalAmount ;
                var randomWin = Math.floor(Math.random() * 360);
                if(difficulty == 0){
                    $("#winningTxt").fadeIn(1500);
                    if(finalAmount >= 180){
                        winTxt.style.color = "green";
                        winTxt.innerHTML = "You win "+2*betAmount+"!";
                        cash += (2*betAmount);
                        cashHtml.innerHTML = cash;
                    } else {
                        winTxt.style.color = "red";
                        winTxt.innerHTML = "You lose.";
                    }
                } else if (difficulty == 1){
                    $("#winningTxt").fadeIn(1500);
                    if(finalAmount >= 270){
                        winTxt.style.color = "green";
                        winTxt.innerHTML = "You win "+4*betAmount+"!";
                        cash += (4*betAmount);
                        cashHtml.innerHTML = cash;
                    } else {
                        winTxt.style.color = "red";
                        winTxt.innerHTML = "You lose.";
                    }
                } else if (difficulty == 2){
                    $("#winningTxt").fadeIn(1500);
                    if(finalAmount >= randomWin-10 && finalAmount <= randomWin+10){
                        winTxt.style.color = "green";
                        winTxt.innerHTML = "You win "+30*betAmount+"! The random number is "+randomWin;
                        cash += (30*betAmount);
                        cashHtml.innerHTML = cash;
                    } else {
                        if(finalAmount >= randomWin-20 && finalAmount <= randomWin+20){
                            winTxt.style.color = "red";
                            winTxt.innerHTML = "Close, but not close enough. The random number is "+randomWin;
                        } else {
                            winTxt.style.color = "red";
                            winTxt.innerHTML = "You lose. The random number is "+randomWin;
                        }
                    }
                } else if (difficulty == 3){
                    $("#winningTxt").fadeIn(1500);
                    var randomWin = Math.floor(Math.random() * 360);
                    if(finalAmount == randomWin){
                        winTxt.style.color = "green";
                        winTxt.innerHTML = "You win "+300*betAmount+"!";
                        cash += (10*betAmount);
                        cashHtml.innerHTML = cash;
                    } else {
                        winTxt.style.color = "red";
                        winTxt.innerHTML = "You lose. The random number is "+randomWin;
                    }
                }
                if(cash > highscorePTS){
                    highscorePTS = cash;
                    highscore.innerHTML = highscorePTS;
                }
            }
        } 
    }
}