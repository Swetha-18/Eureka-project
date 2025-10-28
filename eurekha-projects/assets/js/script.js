
// Basic mailto form handler
function submitForm(e){
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  const note = document.getElementById('note');
  const subject = encodeURIComponent('Eurekha Projects enquiry from ' + name);
  const body = encodeURIComponent(message + '\n\nContact: ' + name + ' <' + email + '>');
  note.innerText = 'Opening your email client...';
  window.location.href = 'mailto:youremail@example.com?subject=' + subject + '&body=' + body;
  setTimeout(()=>{ note.innerText = 'If your email client did not open, copy-paste this message to your preferred email address.' }, 2200);
}

// --- Particle background (multicolor glow) ---
(() => {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let w = canvas.width = window.innerWidth;
  let h = canvas.height = window.innerHeight;
  const DPR = window.devicePixelRatio || 1;
  canvas.width = w * DPR;
  canvas.height = h * DPR;
  canvas.style.width = w + 'px';
  canvas.style.height = h + 'px';
  ctx.scale(DPR, DPR);

  const colors = [
    'rgba(102,252,241,0.95)', // teal
    'rgba(138,43,226,0.95)',  // purple-ish
    'rgba(100,149,237,0.95)'  // blue-ish
  ];

  function rand(min,max){ return Math.random()*(max-min)+min; }

  const particles = [];
  const PARTICLE_COUNT = Math.max(24, Math.floor((w*h)/80000));

  function Particle(){
    this.x = rand(0,w);
    this.y = rand(0,h);
    this.r = rand(1.6,3.6);
    this.vx = rand(-0.2,0.2);
    this.vy = rand(-0.2,0.2);
    this.color = colors[Math.floor(Math.random()*colors.length)];
    this.alpha = rand(0.4,0.9);
  }

  function init(){
    particles.length = 0;
    for(let i=0;i<PARTICLE_COUNT;i++) particles.push(new Particle());
  }

  function resize(){
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    canvas.width = w * DPR;
    canvas.height = h * DPR;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.scale(DPR, DPR);
    init();
  }

  function drawGlow(x,y,r,color,alpha){
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const grad = ctx.createRadialGradient(x,y,0,x,y,r*2);
    grad.addColorStop(0, color.replace('0.95', alpha.toString()));
    grad.addColorStop(0.6, color.replace('0.95', (alpha*0.35).toString()));
    grad.addColorStop(1, 'rgba(2,6,8,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2);
    ctx.fill();
    ctx.restore();
  }

  function connectParticles(){
    for(let i=0;i<particles.length;i++){
      for(let j=i+1;j<particles.length;j++){
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if(dist < 140){
          ctx.save();
          ctx.globalAlpha = 0.06 * (1 - dist/140);
          ctx.strokeStyle = a.color;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }
  }

  function animate(){
    ctx.clearRect(0,0,w,h);
    // subtle background radial
    const bgGrad = ctx.createLinearGradient(0,0,w,h);
    bgGrad.addColorStop(0, 'rgba(8,10,12,0.02)');
    bgGrad.addColorStop(1, 'rgba(0,0,0,0.02)');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0,0,w,h);

    // update & draw
    for(let p of particles){
      p.x += p.vx;
      p.y += p.vy;
      if(p.x < -20) p.x = w + 20;
      if(p.x > w + 20) p.x = -20;
      if(p.y < -20) p.y = h + 20;
      if(p.y > h + 20) p.y = -20;
      drawGlow(p.x, p.y, p.r*6, p.color, p.alpha);
    }

    connectParticles();
    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', () => {
    // tiny debounce
    clearTimeout(window._resizeTimer);
    window._resizeTimer = setTimeout(resize, 120);
  });

  init();
  animate();
})();
