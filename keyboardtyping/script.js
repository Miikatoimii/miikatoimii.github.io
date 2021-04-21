let startTime = 0,
    endTime = 0;
let hasFinishedTyping = false;
const keys = [
    "1234567890+",
    "qwertyuiopå",
    "asdfghjklöä'",
    "zxcvbnm,.-"
]

function createElement(elemtype, id, classname, text) {
    let element = document.createElement(elemtype)
    element.setAttribute('class', classname)
    element.setAttribute('id', id)
    element.innerText = text
    return element;
}


const keyBoard = document.getElementById('keyboard')

for(let i = 0; i<keys.length; i++){
    let r = createElement("div", "row-"+i, "row", "")
    r.style.marginLeft = (i*10)+"px"
    for(let c = 0; c < keys[i].length; c++){
        let k = createElement("div", "key-"+keys[i][c], "key", keys[i][c])
        r.appendChild( k )
    }
    keyBoard.appendChild( r )
}

let generated = "";

// https://www.phrases.org.uk/meanings/phrases-and-sayings-list.html
const phrases = [
    "A bird in the hand is worth two in the bush",
    "A bunch of fives",
    "A fool and his money are soon parted",
    "A little bird told me",
    "Bad money drives out good",
    "Beat the living daylights out of someone",
    "Beauty is only skin deep",
    "Chance would be a fine thing",
    "Devil take the hindmost",
    "Drummed out of the army",
    "Early bird catches the worm",
    "Elvis has left the building",
    "Eaten out of house and home",
    "Face that launched a thousand ships",
    "Faith will move mountains",
    "Forewarned is forearmed",
    "Full of piss and vinegar",
    "on"
]
let rndWords;
fetch('https://raw.githubusercontent.com/RazorSh4rk/random-word-api/master/words.json')
    .then(value => value.json())
    .then(data => {
        rndWords = data
        generateNewPhrase(0)
    })

function generateNewPhrase(type) {
    switch(type){
        case 0:
            let index = Math.floor(Math.random()*phrases.length)
            generated = phrases[index]
            document.getElementById('generated').innerText = generated;
            break;
        case 1:
        default:
            let temp = []
            for(let i = 0; i < 8; i++) {
                let index = Math.floor(Math.random()*rndWords.length)
                temp.push(rndWords[index])
            }
            generated = temp.join(" ")
            document.getElementById('generated').innerText = generated;
    }
}

let paragraph = "";
const wholeword = document.getElementById('textholder')
const res = document.getElementById('result')

window.addEventListener('keydown', e => {
    if(e.key === "Escape") {
        paragraph = ""
        wholeword.innerText = paragraph
        while(res.firstChild)
            res.removeChild(res.firstChild)

        generateNewPhrase(0)
        hasFinishedTyping = false
        return
    }

    if(e.key === "Backspace") {
        if(paragraph.length > 0) {
            paragraph = paragraph.slice(0, paragraph.length-1)
            wholeword.innerText = paragraph
            checkParaPhrase()
        }
        return
    }
    if(e.key === "Shift")
        return

    if(e.keyCode === 13 ) {
        addCharacterToWord("\n")
        return
    }

    addCharacterToWord(e.key)

    if(e.keyCode !== 32)
        document.getElementById("key-"+(e.key).toLowerCase()).style.backgroundColor = "lightblue"

})
window.addEventListener('keyup', e => {
    if(e.key === "Escape")
        return

    if(e.key === "Backspace") {
        return
    }
    if(e.key === "Shift")
        return

    if(e.keyCode === 13)
        return

    if(e.keyCode !== 32)
        document.getElementById("key-"+(e.key).toLowerCase()).style.backgroundColor = ""
})


function addCharacterToWord(char) {
    if(wholeword.innerText.length === 0)
        startTime = Date.now()

    paragraph += char
    wholeword.innerText = paragraph
    checkParaPhrase()
    
}

function checkParaPhrase() {
    if(paragraph === generated) {
        wholeword.style.color = "darkgreen"
        endTime = Date.now()
        
        let timetook = ((endTime -startTime) / 1000).toFixed(2)
        let wordcount = Math.round(wholeword.innerText.length / 5)
        if(!hasFinishedTyping) {
            hasFinishedTyping = true
            res.innerHTML = "It took "+timetook+" seconds<br>"
            res.innerHTML += "total of "+wordcount+" words <br>"
            let wpm = Math.round(60 / timetook * wordcount )
            res.innerHTML += "<b>Speed: "+ wpm +" WPM</b> <br><br><br>"
            res.innerHTML += "PRESS \"ESC\" to reset"
        }
    }
    else {
        wholeword.style.color = "darkblue"
    }
}