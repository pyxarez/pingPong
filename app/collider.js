const collider = () => ({
  _sides: {
    top: 'top',
    left: 'left',
    bottom: 'bottom',
    right: 'right',
  },

  calcCollisionSide(x, y, model) {
    // NOTE: that does not work. we should't calculate distances
    // depending on model center... 
    const sides = {
      right: [x + this.width, y + this.height / 2],
      left: [x, y + this.height / 2],
      top: [x + this.width / 2, y],
      bottom: [x + this.width / 2, y + this.height],
    };

    const modelCenter = [
      model.x + model.width / 2,
      model.y + model.height / 2,
    ];

    const minDistances = Object.keys(sides)
      .reduce((min, sideName) => {
        const side = sides[sideName];

        const distance = Math.sqrt(
          (Math.abs(modelCenter[0] - side[0]) ** 2)
          + (Math.abs(modelCenter[1] - side[1]) ** 2)
        );

        if (!min.distance || distance > min.distance) {
          min.distance = distance;
          min.side = sideName;
        }

        return min;
      }, {});

    return this._sides[minDistances.side];
  },

  collideModel(x, y, model) {
    /*
     if bottom or top side of model collide another model
     */
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
    if (this.x <= 0 || this.x >= this.ctx.canvas.offsetWidth / 3) {
      return 'x';
    }

    if (this.y <= 0 || this.y >= this.ctx.canvas.offsetHeight) {
      return 'y';
    }

    return false;
  },
});

export default collider;
