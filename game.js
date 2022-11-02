document.addEventListener('DOMContentLoaded', () => {
    const board = document.querySelector('.board');
    let blocks = Array.from(document.querySelectorAll('.board div'));
    const displayScore = document.getElementById('score');
    const pause = document.getElementById("pause-button");
    let score = 0;
    const width = 10;
    let nextRandom = 0

    // keys
    const leftKey = document.getElementById("left");
    const rightKey = document.getElementById("right");
    const downKey = document.getElementById("down");
    const rotateKey = document.getElementById("rotate");

  // Tetrominos colors
    const tColors = [
        'green',
        'blue',
        'yellow',
        'purple',
        'red'
    ]

 // Tetrominoes shapes
  const I = [
      [1,width+1,width*2+1,width*3+1],
      [width,width+1,width+2,width+3],
      [1,width+1,width*2+1,width*3+1],
      [width,width+1,width+2,width+3]
    ]

  const L = [
        [1, width+1, width*2+1, 2],
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2+1, width*2],
        [width, width*2, width*2+1, width*2+2]
    ]

    const O = [
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1]
    ]

    const T = [
        [1,width,width+1,width+2],
        [1,width+1,width+2,width*2+1],
        [width,width+1,width+2,width*2+1],
        [1,width,width+1,width*2+1]
    ]

    const Z = [
        [0,width,width+1,width*2+1],
        [width+1, width+2,width*2,width*2+1],
        [0,width,width+1,width*2+1],
        [width+1, width+2,width*2,width*2+1]
      ]

   const tShapes = [I, L, O, T, Z]


  // draw Tetromino
   function draw(){
    current.forEach((index) =>{
      blocks[currentPosition + index].style.background = tColors[randomT]

    })
  }

  // undraw Tetromino
  function undraw() {
    current.forEach((index) => {
      blocks[currentPosition + index].style.background = ''

    })
  }


  // move down
  function moveDown(){
    undraw()
    currentPosition += width
    draw()
    freeze()
  }

  // move right
  function moveRight() {
    undraw()
    const rightEdge = current.some(index => (currentPosition + index) % width === width -1)
    const edge = current.some(index => blocks[currentPosition + index].classList.contains('taken'))
    if(!rightEdge && !edge) {
      currentPosition +=1;
    }
    draw()
  }

  // move left 
  function moveLeft() {
    undraw()
    const leftEdge = current.some(index => (currentPosition + index) % width === 0)
    const edge = current.some(index => blocks[currentPosition + index].classList.contains('taken'))
    if(!leftEdge && !edge)  {
      currentPosition -=1;
    }
    draw()
  }

  // rotate function
  function rotate() {
    undraw()
    currentRotation ++
    if(currentRotation === current.length) { 
      currentRotation = 0
    }
    current = tShapes[randomT][currentRotation]
    checkRotatedPosition()
    draw()
  }


 // keyCodes
 function control(e) {
    if (e.keyCode === 40) {
      moveDown()
    }else if (e.keyCode === 37 ) {
      moveLeft()
    } else if (e.keyCode === 39) {
      moveRight()
    } else if(e.keyCode === 38) {
      rotate()
    }
  }
  window.addEventListener("keydown", control);

 // move keys manually
 leftKey.addEventListener("click", moveLeft);
 rightKey.addEventListener("click", moveRight);
 downKey.addEventListener("click", moveDown);
 rotateKey.addEventListener("click", rotate)


 // edge rotations checking and fixing
 function isAtRight() {
    return current.some(index=> (currentPosition + index + 1) % width === 0)  
  }
  
  function isAtLeft() {
    return current.some(index=> (currentPosition + index) % width === 0)
  }
  
  function checkRotatedPosition(P){
    P = P || currentPosition       
    if ((P+1) % width < 4) {          
      if (isAtRight()){           
        currentPosition += 1    
        checkRotatedPosition(P) 
        }
    }
    else if (P % width > 5) {
      if (isAtLeft()){
        currentPosition -= 1
      checkRotatedPosition(P)
      }
    }
  }


 // next Tetrominos
 const displayblocks = document.querySelectorAll('#mini-board div')
 const displayWidth = 4
 const displayIndex = 0

 // Tetromino shapes without rotation
 const upNextTetrominoes = [

    [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1],
    [1, displayWidth+1, displayWidth*2+1, 2], 
     [0, 1, displayWidth, displayWidth+1], 
    [1, displayWidth, displayWidth+1, displayWidth+2], 
    [0, displayWidth, displayWidth+1, displayWidth*2+1]
    
  ]

 // get next Tetromino
 function displayShape() {
    displayblocks.forEach(block => {
      block.style.background = ''
    })
    upNextTetrominoes[nextRandom].forEach( index => {
      displayblocks[displayIndex + index].style.background = tColors[nextRandom]
    })
  }
  displayShape()


 // set counter
 var counter = setInterval(moveDown, 1000)


 // get Tetromino
  function getTetromino() {
    randomT = nextRandom
    nextRandom = Math.floor(Math.random() * tShapes.length)
     currentRotation = 0
     current = tShapes[randomT][currentRotation]
     currentPosition = 4
     draw()
     displayShape()
     gameOver()
   getScore()
  }

 // freeze 
  function freeze() {
      if(current.some(index => blocks[currentPosition + index + width].classList.contains('taken'))) {
        current.forEach(index => blocks[currentPosition + index].classList.add('taken')) 
        getTetromino()
      }
 }


 // pause / play button
  function pauseGame(){
    if(counter){
        clearInterval(counter)
        counter = null;
        pause.innerHTML = "play"
    }
    else{
        draw()
        counter = setInterval(moveDown, 1000);
        pause.innerHTML = "pause"
    }
  }

  pause.addEventListener("click" , pauseGame)


 // add score
 function getScore() {
    for (let i = 0; i < 199; i +=width) {
      const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

      if(row.every(index => blocks[index].classList.contains('taken'))) {
        score +=10
        displayScore.innerHTML = score
        
        row.forEach(index => {
          blocks[index].classList.remove('taken')
          blocks[index].style.background = ''
        })
        const blocksRemoved = blocks.splice(i,width)
        blocks = blocksRemoved.concat(blocks)
        blocks.forEach(block => board.appendChild(block))
      }
    }
  }


 // game over and reload the page
  function gameOver() {
        if(current.some(index => blocks[currentPosition + index].classList.contains('taken'))) {
          document.getElementById("game-over").style.display = "block";
          setTimeout(function () {
              window.location.reload();
            }, 3000);
          clearInterval(counter)
    }
 }

 // start game screen
 function playGame(event) {
   if (event.keyCode === 13) {

     document.removeEventListener("keydown", playGame);
     document.getElementById("start-screen").style.display = "none";
     document.getElementById("game").style.display = "block";  

     getTetromino()

    }
  }
 document.addEventListener("keydown", playGame)
})