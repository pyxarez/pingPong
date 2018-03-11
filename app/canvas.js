const createCanvas = () => {
  const canvas = document.createElement('canvas');
  document.body.append(canvas);

  const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resizeCanvas, false);
  resizeCanvas();

  const ctx = canvas.getContext('2d');
  ctx.fillStyle = 'black';

  return {
    canvas,
    ctx,
  };
};

export default createCanvas;
