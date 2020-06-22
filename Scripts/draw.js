/************Global Variables****************/
let canvas = document.querySelector('.canvas');
let context = canvas.getContext("2d");
let scale = 10;
const rows = canvas.height / scale;
const columns = canvas.width / scale;
let directions = ['n', 's', 'e', 'w']
let scoreBoard = document.querySelector('#scoreboard')
let lives = document.querySelector('#lives')

// ========= Audio References
let mainMusic = document.getElementById("music-main")
mainMusic.loop = true
mainMusic.volume = 0.2
let ds1 = document.querySelector('#duck-sound1')
ds1.loop = true
let shot = document.querySelector('#shot')

// ========= Graphical References
let spriteSheet = new Image()
spriteSheet.src = 'Images/duckhunt_various_sheet.png'

// ========= Screen References and scoring/difficulty
let difficulty = 1     // Difficult initialized to 1, allowing one duck on screen at the beginning
let ducksOnScreen = []
let score = 0
let hasLost = false
let numLives = 3
/**************************************************/




/************Calculation Functions****************/

/*
 * Returns a vector containing the mouses current position realitive to the canvas
 * Param: evt - mouse position event
*/
function getMousePos(evt) {
    var rect = canvas.getBoundingClientRect();
    return [evt.clientX - rect.left, evt.clientY - rect.top]
}

/*
 * Gets the current mouse position on the canvas and returns a vector containing the mouse position
 * realitive to the grid. 
*/
function convertMousePos(event) {
    let mp = getMousePos(event)
    let convX = Math.floor(mp[0] / scale)
    let convY = Math.floor(mp[1] / scale)
    return [convX, convY]
}

/* 
 * Returns true if the mouse position is within the ducks collider region
*/
function checkHit(duck, event) {
    let mousePos = convertMousePos(event)
    let colX = duck.colliderX()
    let colY = duck.colliderY()
    return ((mousePos[0] >= colX[0]) && (mousePos[0] <= colX[1]) && (mousePos[1] >= colY[0]) && (mousePos[1] <= colY[1]))
}

/* 
 * If there are no ducks on screen, pushes 2 new ducks into the ducksOnScreen array
*/
function generateDucks() {
    if (ducksOnScreen.length == 0) {
        ducksOnScreen.push(new Duck())
        ducksOnScreen.push(new Duck())
    }
}

/**************************************************/




/************GamePlay Loop****************/


function startGame() {
    generateDucks()
    ducksOnScreen.forEach(function (elem) {
        elem.draw()
    })
    mainMusic.play()
    window.setInterval(() => {
        ducksOnScreen.forEach(function (elem) {
            if (!elem.isDead) {
                elem.clear()
                elem.move()
                elem.draw()
                if (elem.numBounces >= elem.allowedBounces && !elem.hasEscaped) {
                    elem.escape()
                    lives.innerHTML = numLives
                }
            }
        })
        ducksOnScreen = ducksOnScreen.filter(duck => !duck.isDead)
        ducksOnScreen = ducksOnScreen.filter(duck => !duck.hasEscaped)
        if (numLives <= 0) {hasLost = true}
        if (hasLost) {location.reload()}
        generateDucks()
    }, 50);
}
/**************************************************/




/************Event Listeners****************/

/*
 * Listens for spacebar input, then starts the game loop when detected
*/
let isStarted = false;
window.addEventListener('keydown', function (e) {
    if (e.keyCode == 32) {
        if (!isStarted) {
            isStarted = true
            startGame()
            document.querySelector('#start').innerHTML = ''
        }
    }
})

/*
 * Listens for a click input, Checks the ducks on screen for a hit when detected
*/
canvas.addEventListener('click', function (event) {
    shot.play()
    ducksOnScreen.forEach(function (elem) {
        if (checkHit(elem, event)) {
            elem.damage(1)
        }
        scoreBoard.innerHTML = score
    })
})
/**************************************************/







