class Snake {
  constructor() {
    this.body = [{ x: 10, y: 10 }];
    this.direction = "right";
  }

  move() {
    const head = this.body[0];
    let newHead;

    switch (this.direction) {
      case "up":
        newHead = { x: head.x, y: head.y - 1 };
        break;
      case "down":
        newHead = { x: head.x, y: head.y + 1 };
        break;
      case "left":
        newHead = { x: head.x - 1, y: head.y };
        break;
      case "right":
        newHead = { x: head.x + 1, y: head.y };
        break;
      default:
        break;
    }

    this.body.unshift(newHead);
  }

  changeDirection(newDirection) {
    const opposites = { up: "down", down: "up", left: "right", right: "left" };
    if (newDirection !== opposites[this.direction]) {
      this.direction = newDirection;
    }
  }
}

class Food {
  constructor() {
    this.position = { x: 15, y: 15 };
  }

  respawn() {
    this.position = {
      x: Math.floor(Math.random() * 20),
      y: Math.floor(Math.random() * 20),
    };
  }
}

class Game {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.context = this.canvas.getContext("2d");
    this.snake = new Snake();
    this.food = new Food();
    this.score = 0;

    document.addEventListener("keydown", this.handleKeyPress.bind(this));
  }

  handleKeyPress(event) {
    const keyMap = {
      ArrowUp: "up",
      ArrowDown: "down",
      ArrowLeft: "left",
      ArrowRight: "right",
    };
    const newDirection = keyMap[event.key];

    if (newDirection) {
      this.snake.changeDirection(newDirection);
    }
  }

  update() {
    this.snake.move();

    // Check for collisions with food
    if (
      this.snake.body[0].x === this.food.position.x &&
      this.snake.body[0].y === this.food.position.y
    ) {
      this.score++;
      this.food.respawn();
    } else {
      this.snake.body.pop();
    }

    // Check for collisions with walls or itself
    const head = this.snake.body[0];
    if (
      head.x < 0 ||
      head.x >= 20 ||
      head.y < 0 ||
      head.y >= 20 ||
      this.snake.body
        .slice(1)
        .some((segment) => segment.x === head.x && segment.y === head.y)
    ) {
      alert("Game over! Your score: " + this.score);
      this.resetGame();
    }
  }

  draw() {
    // Clear the canvas
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw snake
    this.context.fillStyle = "green";
    this.snake.body.forEach((segment) => {
      this.context.fillRect(segment.x * 20, segment.y * 20, 20, 20);
    });

    // Draw food
    this.context.fillStyle = "red";
    this.context.fillRect(
      this.food.position.x * 20,
      this.food.position.y * 20,
      20,
      20
    );
  }

  resetGame() {
    this.snake = new Snake();
    this.food = new Food();
    this.score = 0;
  }

  run() {
    setInterval(() => {
      this.update();
      this.draw();
    }, 200);
  }
}

const game = new Game("snakeCanvas");
game.run();
