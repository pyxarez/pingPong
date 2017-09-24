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
  paint(...args) {
    this.clearPrevPosition()
    const { newX, newY } = this.getNewPosition(...args);

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
      this.y = y - this.height / 2;

      return { newX: this.x, newY: this.y };
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
    getInitialPosition() {
      return {
        x: this.context.canvas.offsetWidth / 2,
        y: this.context.canvas.offsetHeight / 2,
      };
    },
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

      this.x = this.x + this.vx;
      this.y = this.y + this.vy;

      let newX = this.x;
      let newY = this.y;

      return { newX, newY };
    },
  };

  return Object.create(Object.assign(
    proto,
    createPainter(ctx),
    createFigure(500, 400, 9, 9)),
  );
}

const loopCreator = (ball, ...models) => {
  return function loop() {
    ball.paint(models);

    window.requestAnimationFrame(loop);
  };
}


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
