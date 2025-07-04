<template>
  <div class="animation-container">
    <canvas ref="canvasEl"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const canvasEl = ref(null);

onMounted(() => {
  const canvas = canvasEl.value;
  const ctx = canvas.getContext('2d');
  canvas.width = 500;
  canvas.height = 400;
  ctx.strokeStyle = '#9E988D';

  const accuracy = 5, gravity = 400, clothY = 25, clothX = 50, spacing = 8, friction = 0.99, bounce = 0.5;
  const mouse = { influence: 36, down: false, button: 1, x: 0, y: 0, px: 0, py: 0 };

  class Point {
    constructor(x, y) {
      this.x = x; this.y = y; this.px = x; this.py = y;
      this.vx = 0; this.vy = 0; this.pinX = null; this.pinY = null;
      this.constraints = [];
    }
    update(delta) {
      if (this.pinX && this.pinY) return this;
      if (mouse.down) {
        let dx = this.x - mouse.x;
        let dy = this.y - mouse.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (mouse.button === 1 && dist < mouse.influence) {
          this.px = this.x - (mouse.x - mouse.px);
          this.py = this.y - (mouse.y - mouse.py);
        }
      }
      this.addForce(0, gravity);
      let nx = this.x + (this.x - this.px) * friction + this.vx * delta;
      let ny = this.y + (this.y - this.py) * friction + this.vy * delta;
      this.px = this.x; this.py = this.y;
      this.x = nx; this.y = ny;
      this.vy = this.vx = 0;
      if (this.x >= canvas.width) {
        this.px = canvas.width + (canvas.width - this.px) * bounce;
        this.x = canvas.width;
      } else if (this.x <= 0) {
        this.px *= -1 * bounce; this.x = 0;
      }
      if (this.y >= canvas.height) {
        this.py = canvas.height + (canvas.height - this.py) * bounce;
        this.y = canvas.height;
      } else if (this.y <= 0) {
        this.py *= -1 * bounce; this.y = 0;
      }
      return this;
    }
    draw() {
      let i = this.constraints.length;
      while (i--) this.constraints[i].draw();
    }
    resolve() {
      if (this.pinX && this.pinY) {
        this.x = this.pinX; this.y = this.pinY;
        return;
      }
      this.constraints.forEach((constraint) => constraint.resolve());
    }
    attach(point) { this.constraints.push(new Constraint(this, point)); }
    free(constraint) { this.constraints.splice(this.constraints.indexOf(constraint), 1); }
    addForce(x, y) { this.vx += x; this.vy += y; }
    pin(pinx, piny) { this.pinX = pinx; this.pinY = piny; }
  }

  class Constraint {
    constructor(p1, p2) { this.p1 = p1; this.p2 = p2; this.length = spacing; }
    resolve() {
      let dx = this.p1.x - this.p2.x;
      let dy = this.p1.y - this.p2.y;
      let dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < this.length) return;
      let diff = (this.length - dist) / dist;
      let mul = diff * 0.5 * (1 - this.length / dist);
      let px = dx * mul;
      let py = dy * mul;
      !this.p1.pinX && (this.p1.x += px);
      !this.p1.pinY && (this.p1.y += py);
      !this.p2.pinX && (this.p2.x -= px);
      !this.p2.pinY && (this.p2.y -= py);
    }
    draw() { ctx.moveTo(this.p1.x, this.p1.y); ctx.lineTo(this.p2.x, this.p2.y); }
  }

  class Cloth {
    constructor() {
      this.points = [];
      let startX = canvas.width / 2 - clothX * spacing / 2;
      for (let y = 0; y <= clothY; y++) {
        for (let x = 0; x <= clothX; x++) {
          let point = new Point(startX + x * spacing, 20 + y * spacing);
          if (y === 0) point.pin(point.x, point.y);
          if (x !== 0) point.attach(this.points[this.points.length - 1]);
          if (y !== 0) point.attach(this.points[x + (y - 1) * (clothX + 1)]);
          this.points.push(point);
        }
      }
    }
    update(delta) {
      let i = accuracy;
      while (i--) this.points.forEach((point) => point.resolve());
      ctx.beginPath();
      this.points.forEach((point) => point.update(delta * delta).draw());
      ctx.stroke();
    }
  }

  const setMouse = (e) => {
    let rect = canvas.getBoundingClientRect();
    mouse.px = mouse.x; mouse.py = mouse.y;
    mouse.x = e.clientX - rect.left; mouse.y = e.clientY - rect.top;
  };

  const mouseDown = (e) => { mouse.button = e.which; mouse.down = true; setMouse(e); };
  const mouseUp = () => (mouse.down = false);
  const mouseMove = (e) => { if (mouse.down) setMouse(e); };

  // touch support for mobile
  const touchStart = (e) => {
    mouse.button = 1;
    mouse.down = true;
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    mouse.x = touch.clientX - rect.left;
    mouse.y = touch.clientY - rect.top;
    mouse.px = mouse.x;
    mouse.py = mouse.y;
  };
  const touchEnd = () => (mouse.down = false);
  const touchMove = (e) => {
    if (mouse.down && e.touches.length > 0) {
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      mouse.px = mouse.x;
      mouse.py = mouse.y;
      mouse.x = touch.clientX - rect.left;
      mouse.y = touch.clientY - rect.top;
    }
  };

  canvas.addEventListener('mousedown',  mouseDown);
  canvas.addEventListener('mouseup',    mouseUp);
  canvas.addEventListener('mousemove',  mouseMove);
  canvas.addEventListener('touchstart', touchStart);
  canvas.addEventListener('touchend',   touchEnd);
  canvas.addEventListener('touchmove',  touchMove);
  canvas.addEventListener('contextmenu', (e) => e.preventDefault());

  let cloth = new Cloth();
  let animationFrameId;

  function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    cloth.update(0.016);
    animationFrameId = requestAnimationFrame(update);
  }
  update();

  onUnmounted(() => {
    canvas.removeEventListener('mousedown', mouseDown);
    canvas.removeEventListener('mouseup', mouseUp);
    canvas.removeEventListener('mousemove', mouseMove);
    cancelAnimationFrame(animationFrameId);
  });
});
</script>

<style scoped>
.animation-container { display: flex; justify-content: center; align-items: center; }
canvas { background: transparent; cursor: grab; }
canvas:active { cursor: grabbing; }
</style>
