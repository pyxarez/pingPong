const collider = () => ({
  _sides: {
    top: 'top',
    left: 'left',
    bottom: 'bottom',
    right: 'right',
  },

  calcCollisionSide(x, y, model) {
    // TODO: находить ближайшую сторону, с которой происходит столкновение
    const fromRight = {
      toModelRight: (x + this.width)  - (model.x + model.width),
      toModelLeft: (x + this.width) - model.x,
    };

    const fromLeft = {
      toModelRight: x - (model.x + model.width),
      toModelLeft: x - model.x,
    };

    const map = {
      [this._sides.left]: x - (model.x + model.width),
      [this._sides.right]: (x + this.width) - model.x,
      [this._sides.bottom]: (y + this.height) - model.y,
      [this._sides.top]: y - (model.y + model.height),
    };

    let min = map[this._sides.right];
    let minKey = this._sides.right;

    for (let key in map) {
      if (map[key] < min) {
        min = map[key];
        minKey = key;
      }
    }

    return minKey;
  },

  collideModel(x, y, model) {
    if (
      (x <= model.x + model.width
      && x + this.width >= model.x
      && y <= model.y + model.height
      && y + this.height >= model.y)
      || (x <= model.x + model.width
      && x + this.width >= model.x
      && y >= model.y + model.height
      && y + this.height <= model.y
      )
    ) {
      return this.calcCollisionSide(x, y, model);
    };

    return false;
  },

  collideCanvas() {
    if (this.x <= 0 || this.x >= this.ctx.canvas.offsetWidth) {
      return 'x';
    }

    if (this.y <= 0 || this.y >= this.ctx.canvas.offsetHeight) {
      return 'y';
    }

    return false;
  },
});

export default collider;
