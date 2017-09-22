import './index.css';

const createPainter = (ctx) => ({
  prevPosition: { x: null, y: null },
  context: ctx,
  clearPrevPosition() {
    this.context.clearRect(
      this.prevPosition.x,
      this.prevPosition.y,
      this.width,
      this.height
    );
  },
  paint(x, y) {
    this.clearPrevPosition()
    const { newX, newY } = this.getNewPosition(x, y);

    this.context.fillRect(newX, newY, this.width, this.height);

    this.prevPosition = { x: newX, y: newY };
  },
  init() {
    const { x, y } = this.getInitialPosition();

    this.context.fillRect(x, y, this.width, this.height);

    this.prevPosition = { x, y };
  }
});

const createCart = (ctx) => {
  const proto = {
    x: 0,
    y: 300,
    width: 20,
    height: 90,
    getInitialPosition() {
      return { x: this.x, y: this.y };
    },
    getNewPosition(x, y) {
      const newYPosition =  y - this.height / 2;

      return { newX: this.x, newY: newYPosition };
    },
  };

  return Object.create(Object.assign(proto, createPainter(ctx)));
}

const createBall = (ctx) => {
  const proto = {
    x: 500,
    y: 400,
    vx: 5,
    vy: 2,
    width: 9,
    height: 9,
    getInitialPosition() {
      return { x: this.x, y: this.y };
    },
    crossesX() { return this.x <= 0 || this.x >= this.context.canvas.offsetWidth },
    crossesY() { return this.y <= 0 || this.y >= this.context.canvas.offsetHeight },
    getNewPosition() {
      if (this.crossesY()) {
        this.vy = -this.vy;
      }

      if (this.crossesX()) {
        this.vx = -this.vx;
      }

      this.x = this.x + this.vx;
      this.y = this.y + this.vy;

      let newX = this.x;
      let newY = this.y;

      return { newX, newY };
    },
  };

  return Object.create(Object.assign(proto, createPainter(ctx)));
}

const loopCreator = (ball) => {
  return function loop() {
    ball.paint();

    window.requestAnimationFrame(loop);
  };
}


const createCanvas = () => {
  const canvas = document.createElement('canvas');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  document.body.append(canvas);

  const ctx = canvas.getContext('2d');
  ctx.fillStyle = 'black';

  return {
    canvas,
    ctx,
  };
}

const initializeApp = () => {
  const { canvas, ctx } = createCanvas();
  const playerCart = createCart(ctx);
  playerCart.init();

  const ball = createBall(ctx);
  ball.init()

  window.addEventListener('mousemove', (event) => {
    playerCart.paint(event.x, event.y);
  });

  const loop = loopCreator(ball);
  loop();
}

initializeApp();
