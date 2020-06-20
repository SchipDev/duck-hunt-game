let startBtn = document.querySelector('#start-btn')
let gameMus = document.querySelector('#music-m')
gameMus.loop = true
let rect = startBtn.getBoundingClientRect()
window.addEventListener('click', function(evt) {
    let mouseX = evt.clientX
    let mouseY = evt.clientY
    console.log(mouseX, mouseY, rect)
    if ((mouseX > rect.left) && (mouseX < rect.right) && (mouseY > rect.bottom) && (mouseY < rect.top)) {
        gameMus.play()
    }
})