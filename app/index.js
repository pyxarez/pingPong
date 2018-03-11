import './index.css';

import createCanvas from './canvas';
import figure from './figure';
import painter from './painter';
import collider from './collider';

const ball = ({ x, y, ctx }) => Object.assign(
    {
      vx: -2, // 8
      vy: 1, // 5

      collideModels(models) {
        for (let model of models) {
          const nextX = this.x + this.vx;
          const nextY = this.y + this.vy;

          return this.collideModel(nextX, nextY, model);
        }
      },

      calcNewPosition(models) {
        const doesCollideModels = this.collideModels(models);

        if (
          doesCollideModels === this._sides.bottom
          || doesCollideModels === this._sides.top
        ) {
          this.vy = -this.vy;
        } else if (
          doesCollideModels === this._sides.left
          || doesCollideModels === this._sides.right
        ) {
          this.vx = -this.vx;
        } else {
          const doesCrossCanvas = this.collideCanvas();

          if (doesCrossCanvas == 'x') {
            this.vx = -this.vx;
          } else if (doesCrossCanvas == 'y') {
            this.vy = -this.vy;
          }
        }

        this.x += this.vx;
        this.y += this.vy;
      },

      update(models) {
        this.reset();
        this.calcNewPosition(models);
        this.paint();
      },
    },
    collider(),
    figure({ x, y, width: 10, height: 10 }),
    painter(ctx),
  );

const player = ({ ctx }) => {
  const me = Object.assign(
    {
      repaint(y) {
        this.reset();

        this.y = y - this.height / 2;

        this.paint();
      },
      update() {
        this.paint();
      },
    },
    figure({ x: 0, y: 300, width: 20, height: 90 }),
    painter(ctx),
  );

  window.addEventListener('mousemove', (event) => {
    me.repaint(event.y);
  });

  return me;
};

const loop = models => () => {
  models.forEach(model => model.update(models.filter(m => m != model)));

  window.requestAnimationFrame(loop(models));
};

const initializeApp = () => {
  const { canvas, ctx } = createCanvas();

  const models = [];
  models.push(
    ball({
      x: Math.floor(canvas.height / 2),
      y: Math.floor(canvas.width / 2),
      ctx,
    }),
    player({ ctx }),
  );

  window.requestAnimationFrame(loop(models));
}

initializeApp();
