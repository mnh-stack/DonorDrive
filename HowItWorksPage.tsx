import React, { useEffect } from 'react';
import './HowItWorks.css';

const steps = [
  { icon: '📝', title: 'Sign Up Instantly', desc: 'Create your account in seconds and access your dashboard right away.' },
  { icon: '🚀', title: 'Launch Your Campaign', desc: 'Set up a fundraising campaign with guided steps and beautiful templates.' },
  { icon: '📣', title: 'Engage & Promote', desc: 'Share your campaign with built-in social tools and automated marketing.' },
  { icon: '📊', title: 'Track & Optimize', desc: 'Monitor real-time analytics, donor engagement, and optimize for success.' },
  { icon: '🎉', title: 'Celebrate Results', desc: 'See your impact grow and thank your supporters with a single click.' }
];

const HowItWorksPage: React.FC = () => {
  useEffect(() => {
    // Confetti/particle effect on open
    const canvas = document.createElement('canvas');
    canvas.className = 'hiw-confetti';
    document.body.appendChild(canvas);
    let ctx = canvas.getContext('2d');
    let particles: any[] = [];
    let running = true;
    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * -window.innerHeight,
        r: Math.random() * 8 + 4,
        d: Math.random() * 40 + 10,
        color: `hsl(${Math.random()*360},80%,60%)`,
        tilt: Math.random() * 10 - 5,
        tiltAngle: 0,
        tiltAngleInc: Math.random() * 0.1 + 0.05
      });
    }
    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, 2 * Math.PI);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.7;
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }
    function update() {
      for (let p of particles) {
        p.y += Math.cos(p.d) + 2 + p.r / 2;
        p.x += Math.sin(p.d) * 2;
        p.tiltAngle += p.tiltAngleInc;
        p.x += Math.sin(p.tiltAngle);
        if (p.y > window.innerHeight) {
          p.x = Math.random() * window.innerWidth;
          p.y = -10;
        }
      }
    }
    function animate() {
      if (!running) return;
      draw();
      update();
      requestAnimationFrame(animate);
    }
    animate();
    return () => {
      running = false;
      window.removeEventListener('resize', resize);
      document.body.removeChild(canvas);
    };
  }, []);

  return (
    <div className="hiw-page-bg">
      <a href="/" className="hiw-back-btn">← Back Home</a>
      <div className="hiw-page-content">
        <div className="hiw-logo-anim hiw-logo-glow">
          <img src="/assets/static/logo.png" alt="DonorDrive Logo" className="hiw-logo hiw-logo-spin" />
        </div>
        <h2 className="hiw-title">How It Works</h2>
        <div className="hiw-subtitle">A seamless journey from signup to celebration, powered by <span className="hiw-gradient-text">DonorDrive</span></div>
        <div className="hiw-steps">
          {steps.map((step, i) => (
            <div className="hiw-step hiw-fade-slide" style={{ animationDelay: `${i * 0.25 + 0.2}s` }} key={i}>
              <div className="hiw-step-num">{step.icon}</div>
              <div className="hiw-step-content">
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <a href="/" className="hiw-cta-btn">Get Started Now</a>
      </div>
      <div className="hiw-bg-anim"></div>
    </div>
  );
};

export default HowItWorksPage; 