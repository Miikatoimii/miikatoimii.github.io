var charAttack = 1; var attackHTML = document.getElementById("htmlattack");
var charDefence = 1; var defenceHTML = document.getElementById("htmldefence");
var charHealth = 10; var healthHTML = document.getElementById("htmlhealth");
var maxHealth = 10; var maxhealthHTML = document.getElementById("htmlmaxhealth");
var step = 0;       var stepHTML = document.getElementById("stepCount");
var confidence = 10; var confidenceHTML = document.getElementById("htmlconfidence");
var charCoins = 0; var coinsHTML = document.getElementById("htmlcoins");
var charLevel = Math.floor((charAttack+charDefence+charHealth)/3); var levelHTML = document.getElementById("htmlLEVEL");


var gametextHTML = document.getElementById("gameTxt");
var questionBox = document.getElementById("actionArea");
var question = document.getElementById("actionquestion");

var charHasShield = false;
var charHasSword = false;
var charHasHelm = false;

var opponentHP = 20;
var opponentATT = 5;
var opponentDEF = 0;
var oppLvlHTML = document.getElementById("oppLvl");
oppLvlHTML.style.display = "none";
var answer = 0;
function yes(){
    answer = 1;
}
function no(){
    answer = 2;
}

function statsUp(a){
    charAttack += a;
    charDefence += a;
    maxHealth += a;
}

function heal(){
    charHealth = maxHealth;
}

function showStats(){
    attackHTML.innerHTML = charAttack;
    defenceHTML.innerHTML = charDefence;
    healthHTML.innerHTML = charHealth;
    maxhealthHTML.innerHTML = "/"+maxHealth;
    confidenceHTML.innerHTML = confidence;
    coinsHTML.innerHTML = charCoins;
    charLevel = Math.floor((charAttack+charDefence+charHealth)/3);
    levelHTML.innerHTML = charLevel;
}

function game(){
    document.getElementById("gametitle").innerHTML = "Your adventure begins...";
    document.getElementById("start").style.display = "none";
    gametextHTML.innerHTML = "You start walking and scouting the area.";
    stepHTML.innerHTML = "Step: "+step;
    document.getElementById("gameTxtArea").style.display = "block";
    showStats();
    var mainTimer = setInterval(takeStep, 3200);
    
    function takeStep(){
        step++;
        stepHTML.innerHTML = "Step: "+step;
        var action = Math.ceil(Math.random()*confidence);
        switch(action){
            case 2:
            case 7:
            case 12:
            case 17:
            case 22:
            case 27:
            case 32:
            case 37:
                clearInterval(mainTimer);
                gametextHTML.innerHTML = "You see something on the ground. You take closer look...";
                setTimeout(lookAtItem, 6000);
                function lookAtItem(){
                    var item = Math.ceil(Math.random()*7);
                    if(item > 4){
                        gametextHTML.innerHTML = "Nothing useful.";
                    } else if(item == 4){
                        if(confidence < 300){
                            confidence += 5;
                            gametextHTML.innerHTML = "You found a piece of a map. You gain confidence to travel further.";
                        } else {
                            gametextHTML.innerHTML = "You found a piece of map, but you have no use for it any longer."
                        }
                    } else if(item == 4 || item == 3){
                        var potions = Math.ceil(Math.random()*10);
                        var greaterPOTS = Math.ceil(Math.random()*3);
                        if(potions == 10){
                            if(greaterPOTS == 1){
                                gametextHTML.innerHTML = "You found a casket and inside was greater attack potion! You attack is improved by 5";
                                charAttack+=5;
                            } else if(greaterPOTS == 2) {
                                gametextHTML.innerHTML = "You found a casket and inside was greater defence potion! You defence is improved by 5";
                                charDefence+=5;
                            } else {
                                gametextHTML.innerHTML = "You found a casket and inside was greater health boost potion! You maxium health is improved by 5";
                                maxHealth+=5;
                            }
                        } else if (potions == 9) {
                            if(greaterPOTS == 3){
                                gametextHTML.innerHTML = "You found a greater improvement pot. Your stats were improved by 3.";
                                statsUp(3);
                            } else {
                                gametextHTML.innerHTML = "The casket was empty.";
                            }
                        } else {
                            gametextHTML.innerHTML = "You found a small improvement potion. Your stats were slightly improved.";
                            statsUp(1);
                        }

                        
                    } else {
                        gametextHTML.innerHTML = "It's a health potion! Your health is fully restored.";
                        heal();
                    }
                    mainTimer = setInterval(takeStep, 4200);
                    showStats();
                }
                break;
            case 15:
            case 30:
            case 50:
            case 70:
                gametextHTML.innerHTML = "You see a stranger ahead. You feel cautious.";
                clearInterval(mainTimer);
                setTimeout(figure, 6000);
                function figure(){
                    var figureClosing = Math.ceil(Math.random()*5);
                    if(figureClosing < 5){
                        gametextHTML.innerHTML = "The stranger seems to move away from you. You calm down.";
                        mainTimer = setInterval(takeStep, 4200);
                    } else {
                        if(action == 50 || action == 30){
                            opponentHP = 50;
                            opponentATT = 15;
                            opponentDEF = 15;
                        }
                        else if(action == 70){
                            opponentHP = 200;
                            opponentATT = 50;
                            opponentDEF = 50;
                        } else {
                            opponentHP = 20;
                            opponentATT = 5;
                            opponentDEF = 0;
                        }
                        var opponentLvl = Math.floor((opponentHP+opponentDEF+opponentATT)/3);
                        oppLvlHTML.style.display = "block";
                        oppLvlHTML.innerHTML = "Enemy level: "+opponentLvl;
                        gametextHTML.innerHTML = "The stranger runs aggressively towards you!";
                        // here option do you wanna fight or retreat
                        questionBox.style.display = "block";
                        question.innerHTML = "&#9876; <br>Will you fight?";
                        var checkAnswer = setInterval(check, 1000);
                        var answerCounter = 10;
                        function check(){
                            answerCounter--;
                            question.innerHTML = "&#9876; <br>Will you fight? "+answerCounter+" seconds left";
                            if(answerCounter < 0){
                                clearInterval(checkAnswer);
                                gametextHTML.innerHTML = "The stranger runs past you towards something else.";
                                mainTimer = setInterval(takeStep, 4200);
                                questionBox.style.display = "none";
                                oppLvlHTML.style.display = "none";
                            }
                            if(answer == 1){
                                clearInterval(checkAnswer);
                                var fight = setInterval(fighting, 1000);
                                gametextHTML.innerHTML = "You choose to fight.";
                                questionBox.style.display = "none";
                                answer = 0;
                            }
                            else if(answer == 2){
                                clearInterval(checkAnswer);
                                gametextHTML.innerHTML = "You choose to retreat.";
                                mainTimer = setInterval(takeStep, 4200);
                                questionBox.style.display = "none";
                                oppLvlHTML.style.display = "none";
                                answer = 0;
                            }
                            function fighting(){
                                questionBox.style.display = "none";
                                var randmFIGHT = Math.ceil(Math.random()*3);
                                if(randmFIGHT < 3){
                                    opponentHP-=(charAttack-opponentDEF);
                                    gametextHTML.innerHTML = "You succesfully hit "+(charAttack-opponentDEF)+" on your opponent!";
                                    if(opponentHP < 5){
                                        oppLvlHTML.style.display = "none";
                                        var dropItem = Math.ceil(Math.random()*8);
                                        if(dropItem > 4){
                                            if(dropItem == 5){
                                                if(!charHasHelm){
                                                    gametextHTML.innerHTML = "Your opponent retreats but drops a helmet in hurry. You picked it up. Your defence is improved by 6.";
                                                    charDefence+=6;
                                                    charHasHelm = true;
                                                    if(charHasHelm){
                                                        document.getElementById("thehelmet").style.display = "inline-block";
                                                    }
                                                }
                                            } else if(dropItem == 6){
                                                if(!charHasShield){
                                                    gametextHTML.innerHTML = "Your opponent retreats but drops a shield in hurry. You picked it up. Your defence is improved by 10.";
                                                    charDefence+=10;
                                                    charHasShield = true;
                                                    if(charHasShield){
                                                        document.getElementById("theshield").style.display = "inline-block";
                                                    }
                                                }
                                            } else if(dropItem == 7) {
                                                if(!charHasSword){
                                                    gametextHTML.innerHTML = "Your opponent retreats but drops a sword in hurry. You picked it up. Your attack is improved by 10.";
                                                    charAttack+=10;
                                                    charHasSword = true;
                                                    if(charHasSword){
                                                        document.getElementById("thesword").style.display = "inline-block";
                                                    }
                                                }

                                            } else if (dropItem == 8){
                                                var rndAmOfCoins = Math.ceil(Math.random()*opponentLvl)+16;
                                                charCoins += rndAmOfCoins;
                                                coinsHTML.innerHTML = charCoins;
                                                gametextHTML.innerHTML = "Your opponent retreats but in hurry he drops "+rndAmOfCoins+" coins on the ground. You picked them up.";

                                            } 
                                        } else {
                                            gametextHTML.innerHTML = "Your opponent retreats!";
                                        }
                                        showStats();
                                        clearInterval(fight);
                                        mainTimer = setInterval(takeStep, 4200);
                                    }
                                } else {
                                    if(charDefence >= opponentATT){
                                        gametextHTML.innerHTML = "Your defence helps you to block your opponents attack.";
                                    } else {
                                        charHealth -= (opponentATT-charDefence);
                                        gametextHTML.innerHTML = "The stranger manages to hit "+(opponentATT-charDefence)+" on you!";
                                        showStats();
                                    if(charHealth < 1){
                                        gametextHTML.innerHTML = "Oh my gosh, you're dead! <br> <p class='death'> &#9760; </p>";
                                        clearInterval(fight);

                                        showStats();
                                        var finalScore = step+(charAttack*2)+(charDefence*2)+(maxHealth*2)+(confidence*2);
                                        if(charHasShield){
                                            finalScore += 20;
                                        }
                                        if(charHasSword){
                                            finalScore += 20;
                                        }
                                        document.getElementById("gametitle").innerHTML = "GAME OVER >Your final score is: "+finalScore;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                
                break;
            default:
                gametextHTML.innerHTML = "You start walking and scouting the area."

        }
        
    }
}