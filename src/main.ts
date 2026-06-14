const canvas = document.querySelector("canvas")!
const ctx = canvas.getContext('2d')!
const size = 600;

const playBtn = document.getElementById("play-btn")! as HTMLButtonElement

playBtn.addEventListener("click", () => {
  velocity.x = 1
  score = 0
  gameLoop()
  playBtn.disabled = true
})
canvas.width = size
canvas.height = size
let score: number

const cellAmount = 10
const cellSize = size / cellAmount

let isFoodSpawned = false


const bodyColor = 'green'
const headColor = 'gray'
const foodColor = 'red'

let delay = 300

class Point {
  x: number
  y: number
  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }
}

let velocity = { x: 0, y: 0 }

const allIndices = Array.from({ length: cellAmount * cellAmount }, (_, i) => i);

let snake = [new Point(0, 0), new Point(1, 0), new Point(2, 0)]
let foodPos = new Point(0, 0)

window.addEventListener("keydown", e => {

  switch (e.key) {
    case 'ArrowLeft':
      if (velocity.x == 1) return;
      velocity = { x: -1, y: 0 }
      break;
    case 'ArrowRight':
      if (velocity.x == -1) return;
      velocity = { x: 1, y: 0 }
      break;
    case 'ArrowUp':
      if (velocity.y == 1) return;
      velocity = { x: 0, y: -1 }
      break;
    case 'ArrowDown':
      if (velocity.y == -1) return;
      velocity = {
        x: 0, y: 1
      }
      break;
  }
})

function drawSnake() {

  ctx.strokeStyle = 'black'
  ctx.lineWidth = 1
  snake.forEach((point, index) => {
    ctx.fillStyle = index == snake.length - 1 ? headColor : bodyColor
    drawShadow(ctx.fillStyle)
    ctx.fillRect(point.x * cellSize, point.y * cellSize, cellSize, cellSize)
    ctx.strokeRect(point.x * cellSize, point.y * cellSize, cellSize, cellSize)
  })
  ctx.restore()
}



drawSnake()

function gameLoop() {
  ctx.clearRect(0, 0, size, size)


  if (!isFoodSpawned) {
    const snakeIndices = snake.map(s => (s.y * cellAmount) + s.x);
    const freeIndices = allIndices.filter(id => !snakeIndices.includes(id));
    foodPos = getFoodPos(freeIndices)
    isFoodSpawned = true
  }


  drawFood()

  const head = { ...snake.at(-1)! };

  const newX = velocity.x + head.x
  const newY = velocity.y + head.y
  head.x = newX == cellAmount ? 0 : newX < 0 ? cellAmount - 1 : newX
  head.y = newY == cellAmount ? 0 : newY < 0 ? cellAmount - 1 : newY



  const isCollision = snake.some(segment =>
    segment.x === head.x && segment.y === head.y
  );

  if (isCollision) {
    velocity.x = 0
    velocity.y = 0
    return;
  }


  if (head.x == foodPos.x && head.y == foodPos.y) {
    isFoodSpawned = false
    score++
  }
  else snake.shift()



  snake.push(head)


  drawSnake()
  drawScore()
  setTimeout(() => gameLoop(), delay)

}

drawSnake()

function drawFood() {
  ctx.fillStyle = foodColor
  ctx.strokeStyle = 'darkred'
  ctx.fillRect(foodPos.x * cellSize, foodPos.y * cellSize, cellSize, cellSize)
  ctx.strokeRect(foodPos.x * cellSize, foodPos.y * cellSize, cellSize, cellSize)

  drawShadow('purple')
}

function getFoodPos(indices: number[]): Point {
  const randomIndex = Math.floor(Math.random() * indices.length);
  const randomId = indices[randomIndex];

  const x = randomId % cellAmount;
  const y = Math.floor(randomId / cellAmount)
  return new Point(x, y)

}



(window as any).api = {
  delay: delay,
  snake: snake,
  food: getFoodPos
}

function drawScore() {
  ctx.save(); // Save current state (no shadow)

  ctx.font = "48px sans-serif";
  ctx.textAlign = "center";


  drawShadow('white')

  ctx.fillStyle = "white";
  ctx.fillText(`Score: ${score}`, canvas.width / 2, cellSize * 1.3);

  ctx.restore(); // Reset to state before shadow was applied
}

function drawShadow(color: string) {
  ctx.shadowColor = color
  ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
  ctx.shadowBlur = 4;
}
