/************Global Variables****************/
let canvas = document.querySelector('.canvas');
let context = canvas.getContext("2d");
let scale = 10;
const rows = canvas.height / scale;
const columns = canvas.width / scale;
let directions = ['n', 's', 'e', 'w']
let scoreBoard = document.querySelector('#scoreboard')
let lives = document.querySelector('#lives')
let ias = document.querySelector('#ias')

// ========= Audio References
let mainMusic = document.getElementById("music-main")
mainMusic.loop = true
mainMusic.volume = 0.4
let ds1 = document.querySelector('#duck-sound1')
ds1.loop = true
let shot = document.querySelector('#shot')
let bark = document.querySelector('#bark')
let bark2 = document.querySelector('#bark2')
let looseMusic = document.querySelector('#looseMusic')
let killMusic = document.querySelector('#killMusic')
let hit = document.querySelector('#hit')

// ========= Graphical References
let spriteSheet = new Image()
spriteSheet.src = 'Images/duckhunt_various_sheet.png'
let flippedDuck = new Image()
flippedDuck.src = 'Images/flipped-duck.png'
let flippedDuckSprites = new Image()
flippedDuckSprites.src = 'Images/Flipped-duck-sprites.png'

// ========= Screen References and scoring/difficulty
let difficulty = 1             // Difficult initialized to 1, allowing one duck on screen at the beginning
let ducksOnScreen = []         // Contains references for all ducks on screen
let score = 0                  // Players current score/ how many ducks they have killed
let hasLost = false            // Reference bolean for determining when a player has lost
let numLives = 3               // Allowed lives/ ducks not killed before escaping
let numEsc = 0                 // Reference boolean to determine if both ducks have escaped
let numDead = 0                // Reference variable to determine how many onscreen ducks are dead
let dogAnimStartFrame = 0      // Reference to allow the game to know when to start the dog animation
let frames = 0                 // Reference variable to determine the current number of passed frames
let deadDucks = []             // Reference for all dead ducks in existence
let startAnimFinished = false  // Reference to tell the game loop when to start
let killMusicStart = 0         // Tells functions when the kill music has started
let difficultyScale = 2        // Difficulty scaling controls how fast ducks ove
let isOnStartScreen = false    // Allows input on the startScreen
let killBonusText = ['ITS A SLAUGHTER', 'KILLTACULAR', 'KILLAPALUZA', 'KILLMAGEDON', 'RAMPAGE']
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

function playStartAnimation(currFrame) {
    // Frame 1 context.drawImage(spriteSheet, 0, 0, 60, 50, 300, 300, 110, 95)
    // Frame 2 context.drawImage(spriteSheet, 60, 0, 60, 50, 300, 300, 110, 95)
    // Frame 3 context.drawImage(spriteSheet, 120, 0, 60, 50, 300, 300, 110, 95)
    // frame 4 context.drawImage(spriteSheet, 180, 0, 60, 50, 300, 300, 110, 95)
    // frame 5 context.drawImage(spriteSheet, 240, 0, 60, 50, 300, 300, 110, 95)
    if (currFrame === 0) {
        context.clearRect(0, 0, canvas.width, canvas.height)
        context.drawImage(spriteSheet, 0, 0, 60, 50, 20, 380, 110, 95)
    }
    else if (currFrame === 3) {
        context.clearRect(0, 0, canvas.width, canvas.height)
        context.drawImage(spriteSheet, 60, 0, 60, 50, 60, 379, 110, 95)
    }
    else if (currFrame == 6) {
        context.clearRect(0, 0, canvas.width, canvas.height)
        context.drawImage(spriteSheet, 120, 0, 60, 50, 100, 377, 110, 95)
    }
    else if (currFrame === 9) {
        context.clearRect(0, 0, canvas.width, canvas.height)
        context.drawImage(spriteSheet, 180, 0, 60, 50, 140, 375, 110, 95)
    }
    else if (currFrame == 12) {
        context.clearRect(0, 0, canvas.width, canvas.height)
        context.drawImage(spriteSheet, 240, 0, 60, 50, 180, 373, 110, 95)
    }
    else if (currFrame === 15) {
        context.clearRect(0, 0, canvas.width, canvas.height)
        context.drawImage(spriteSheet, 0, 0, 60, 50, 220, 370, 110, 95)
    }
    else if (currFrame === 18) {
        context.clearRect(0, 0, canvas.width, canvas.height)
        context.drawImage(spriteSheet, 60, 0, 60, 50, 260, 369, 110, 95)
    }
    else if (currFrame === 21) {
        context.clearRect(0, 0, canvas.width, canvas.height)
        context.drawImage(spriteSheet, 120, 0, 60, 50, 300, 369, 110, 95)
        bark2.play()
    }

    // Jump Animation frames
    else if (currFrame === 24) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(spriteSheet, 0, 50, 60, 60, 330, 369, 110, 95)
    }
    else if (currFrame === 27) {
        context.clearRect(0, 0, canvas.width, canvas.height)
        context.drawImage(spriteSheet, 60, 50, 60, 60, 340, 350, 110, 95)
    }
    else if (currFrame === 29) {
        context.clearRect(0, 0, canvas.width, canvas.height)
        context.drawImage(spriteSheet, 60, 50, 60, 60, 345, 345, 110, 95)
    }
    else if (currFrame === 31) {
        context.clearRect(0, 0, canvas.width, canvas.height)
        context.drawImage(spriteSheet, 120, 50, 60, 60, 350, 339, 110, 95)
    }
    else if (currFrame === 33) {
        context.clearRect(0, 0, canvas.width, canvas.height)
        context.drawImage(spriteSheet, 120, 50, 60, 60, 355, 345, 105, 90)
    }
    else if (currFrame === 36) {
        context.clearRect(0, 0, canvas.width, canvas.height)
        context.drawImage(spriteSheet, 120, 50, 60, 60, 357, 352, 103, 88)
    }
    else if (currFrame >= 37) {
        context.clearRect(0, 0, canvas.width, canvas.height)
        startAnimFinished = true
    }
}

function checkKillStreak(currFrame) {
    if (score % 12 == 0 && score != 0) {
        if (killMusicStart == 0) {
            killMusicStart = currFrame
            mainMusic.pause()
            hit.play()
            killMusic.play()
            // let rand = Math.floor(Math.random() * killBonusText.length)
            // ias.innderHTML = killBonusText[rand]
            ias.style.visibility = 'visible'
        }
    }
    else if ((currFrame - killMusicStart) == 130) {
        killMusic.volume = 0.7
    }
    else if ((currFrame - killMusicStart) == 140) {
        killMusic.volume = 0.5
    }
    else if ((currFrame - killMusicStart) == 150) {
        killMusic.volume = 0.3
    }
    else if ((currFrame - killMusicStart) == 160) {
        killMusic.pause()
        mainMusic.volume = 0.2
        mainMusic.play()
        ias.style.visibility = 'hidden'
        killMusic.volume = 1.0
    }
    else if ((currFrame - killMusicStart) == 170) {
        mainMusic.volume = 0.4
        killMusicStart = 0
    }
}

function loadStartScreen() {
    context.fillRect(canvas.width / 4, canvas.height / 4, canvas.width / 2, canvas.height / 2)
    context.fillStyle = 'white'
    context.font = "50px Verdana";
    context.fillText("Select Difficulty", canvas.width / 3 - 20, canvas.height / 2, 500)
    context.font = "30px Verdana";
    context.fillText("Number keys 2-5", canvas.width / 3 - 20, canvas.height / 2 + 50, 500)
}







/************GamePlay Loop****************/


function startGame() {
    generateDucks()
    ducksOnScreen.forEach(function (elem) {
        elem.draw()
    })
    mainMusic.play()
    let loop = window.setInterval(() => {
        if (!startAnimFinished) playStartAnimation(frames)
        frames++
        if (startAnimFinished) {
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
                context.fillStyle = 'black'
                context.fillRect(canvas.width / 4, canvas.height / 4, canvas.width / 2, canvas.height / 2)
                context.fillStyle = 'white'
                context.font = "60px Verdana";
                context.fillText("Game Over!", canvas.width / 3 - 20, canvas.height / 2, 500)
                context.font = "30px Verdana";
                context.fillText("Too many ducks escaped", canvas.width / 3 - 20, canvas.height / 2 + 50, 500)
                document.querySelector('#start').innerHTML = 'Press Space To Retry'
            }
            if (dogAnimStartFrame === 0 && numDead == 2) {
                dogAnimStartFrame = frames
            }
            playDogAnimation(frames)
            checkKillStreak(frames)
            if (numEsc == 2 || numEsc + numDead == 2) {
                generateDucks()
            }
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
            loadStartScreen()
            isOnStartScreen = true
            document.querySelector('#start').innerHTML = ''
        }
        if (hasLost) {
            location.reload()
        }
    }
    else if (e.keyCode == 50 || e.keyCode == 51 || e.keyCode == 52 || e.keyCode == 53) {
        if (isOnStartScreen) {
            difficultyScale = e.keyCode - 48
            context.clearRect(0, 0, canvas.width, canvas.height)
            isOnStartScreen = false
            isStarted = true
            startGame()
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







