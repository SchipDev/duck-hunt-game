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
let bark = document.querySelector('#bark')
let looseMusic = document.querySelector('#looseMusic')

// ========= Graphical References
let spriteSheet = new Image()
spriteSheet.src = 'Images/duckhunt_various_sheet.png'

// ========= Screen References and scoring/difficulty
let difficulty = 1         // Difficult initialized to 1, allowing one duck on screen at the beginning
let ducksOnScreen = []     // Contains references for all ducks on screen
let score = 0              // Players current score/ how many ducks they have killed
let hasLost = false        // Reference bolean for determining when a player has lost
let numLives = 3           // Allowed lives/ ducks not killed before escaping
let numEsc = 0             // Reference boolean to determine if both ducks have escaped
let numDead = 0            // Reference variable to determine how many onscreen ducks are dead
let dogAnimStartFrame = 0  // Reference to allow the game to know when to start the dog animation
let frames = 0             // Reference variable to determine the current number of passed frames
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
    if (ducksOnScreen.length == 0 || numEsc == 2 || numEsc + numDead == 2) {
        numEsc = 0
        numDead = 0
        ducksOnScreen.push(new Duck())
        ducksOnScreen.push(new Duck())
    }
}

/**************************************************/


/* 
 * Plays the dog animation based on the frame passed to the function
 * Generates ducks when animation is complete
*/
function playDogAnimation(currentFrame) {
    if (dogAnimStartFrame != 0) {
        if (currentFrame - dogAnimStartFrame == 0) {
            context.drawImage(spriteSheet, 252, 60, 50, 24, 450, 329, 110, 95)
        }
        else if (currentFrame - dogAnimStartFrame == 3) {
            context.drawImage(spriteSheet, 252, 60, 50, 50, 450, 316, 150, 150)
        }
        else if (currentFrame - dogAnimStartFrame == 6) {
            context.clearRect(450, 316, 200, 200)
            context.drawImage(spriteSheet, 320, 60, 55, 50, 440, 300, 150, 150)
            bark.play()
        }
        else if (currentFrame - dogAnimStartFrame == 14) {
            context.clearRect(440, 300, 150, 150)
            dogAnimStartFrame = 0
            generateDucks()
        }
    }
}







/************GamePlay Loop****************/


function startGame() {
    generateDucks()
    ducksOnScreen.forEach(function (elem) {
        elem.draw()
    })
    mainMusic.play()
    let loop = window.setInterval(() => {
        frames++
        ducksOnScreen.forEach(function (elem) {
            if (!elem.isDead) {
                elem.clear()
                elem.move()
                elem.draw()
                if (elem.numBounces >= elem.allowedBounces && !elem.hasEscaped) {
                    numEsc++
                    elem.escape()
                    lives.innerHTML = numLives
                }
            }
        })
        ducksOnScreen = ducksOnScreen.filter(duck => !duck.isDead)
        if (numLives <= 0) { hasLost = true }
        if (hasLost) {
            window.clearInterval(loop)
            context.clearRect(0, 0, canvas.width, canvas.height)
            mainMusic.pause()
            ds1.pause()
            looseMusic.play()
            context.fillRect(canvas.width/4, canvas.height/4, canvas.width/2, canvas.height/2)
            context.fillStyle = 'white'
            context.font = "60px Verdana";
            context.fillText("Game Over!", canvas.width/3, canvas.height/2, 500)
            context.font = "30px Verdana";
            context.fillText("Too many ducks escaped", canvas.width/3, canvas.height/2 + 50, 500)
        }
        if (dogAnimStartFrame === 0 && numDead == 2) {
            dogAnimStartFrame = frames
        }
        playDogAnimation(frames)
        if (numEsc == 2 || numEsc + numDead == 2) {
            generateDucks()
        }
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







