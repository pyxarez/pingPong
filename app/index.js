import './index.css';

const createFigure = (x = 0, y = 0, width = 10, height = 10) => ({
  x,
  y,
  width,
  height,
  getRightX() { return this.x + this.width; },
  getCenterY() { return this.y + this.height / 2; },
});

const createPainter = (ctx) => ({
  context: ctx,
  clearPrevPosition() {
    this.context.clearRect(
      this.x,
      this.y,
      this.width,
      this.height,
    );
  },
  paint(...args) {
    this.clearPrevPosition()

    const { newX, newY } = this.getNewPosition(...args);

    this.context.fillRect(newX, newY, this.width, this.height);

    this.x = newX;
    this.y = newY;
  },
  init() {
    this.context.fillRect(this.x, this.y, this.width, this.height);
  }
});

const createCart = (ctx) => {
  const proto = {
    getNewPosition(x, y) {
      const newY = y - this.height / 2;

      return { newX: this.x, newY };
    },
  };

  return Object.create(Object.assign(
    proto,
    createPainter(ctx),
    createFigure(0, 300, 20, 90),
  ));
}

const createBall = (ctx) => {
  const proto = {
    vx: 8,
    vy: 5,
    // Handle only cross by x axis
    crossesModels(models) {
      let isCrosses = false;
      const leftXPosition = this.x;
      const rightXPosition = this.getRightX();
      const ballCenter = this.getCenterY();

      models.forEach(model => {
        const rightModelXPosition = model.getRightX();
        const leftModelXPosition = model.x;
        const topModelYPosition = model.y;
        const bottomModelYPosition = model.y + model.height;

        if (
          ((
            leftXPosition >= leftModelXPosition
            && leftXPosition <= rightModelXPosition
          ) ||
          (
            rightXPosition >= leftModelXPosition
            && rightXPosition <= rightModelXPosition
          ))
            &&
            (
              ballCenter <= bottomModelYPosition
              && ballCenter >= topModelYPosition
            )
        ) {
          isCrosses = true;
          return;
        }
      });

      return isCrosses;
    },
    crossesCanvas() {
        if (this.x <= 0 || this.x >= this.context.canvas.offsetWidth) {
          return 'x';
        }

        if (this.y <= 0 || this.y >= this.context.canvas.offsetHeight) {
          return 'y';
        }

        return false;
    },
    getNewPosition(models) {
      const isCrossesCanvas = this.crossesCanvas();
      const isCrossesModels = this.crossesModels(models)

      if (isCrossesCanvas === 'x') {
        this.vx = -this.vx;
      }

      if (isCrossesCanvas === 'y') {
        this.vy = -this.vy;
      }

      if (isCrossesModels) {
        this.vx = -this.vx;
      }

      const newX = this.x + this.vx;
      const newY = this.y + this.vy;

      return { newX, newY };
    },
  };

  return Object.create(Object.assign(
    proto,
    createPainter(ctx),
    createFigure(
      Math.round(document.body.offsetWidth / 2),
      Math.round(document.body.offsetHeight / 2),
      9,
      9,
    ),
  ));
};

const loopCreator = (ball, ...models) => {
  return function loop() {
    ball.paint(models);

    window.requestAnimationFrame(loop);
  };
};


const createCanvas = () => {
  const canvas = document.createElement('canvas');

  canvas.width = document.body.offsetWidth;
  canvas.height = document.body.offsetHeight;

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

  const loop = loopCreator(ball, playerCart);
  loop();
}

initializeApp();
