const painter = (ctx) => ({
  ctx,

  reset() {
    this.ctx.clearRect(this.x, this.y, this.width, this.height);
  },

  paint() {
    this.ctx.fillRect(this.x, this.y, this.width, this.height);
  },
});

export default painter;
