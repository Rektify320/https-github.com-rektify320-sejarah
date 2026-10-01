// --- 3. DYNAMIC SVG & CANVAS CHARACTER PORTRAITS ---
class GenshinCharacterRenderer {
  constructor() {
    this.blinkTimer = 0;
    this.isBlinking = false;
    this.breathTimer = 0;
    this.mouthOpen = 0;
  }

  update(isSpeaking) {
    this.breathTimer += 0.04;
    this.blinkTimer++;
    if (this.blinkTimer > 180 + Math.random() * 80) {
      this.isBlinking = true;
      if (this.blinkTimer > 195 + Math.random() * 80) {
        this.isBlinking = false;
        this.blinkTimer = 0;
      }
    }

    if (isSpeaking) {
      this.mouthOpen = Math.abs(Math.sin(Date.now() * 0.02));
    } else {
      this.mouthOpen = 0;
    }
  }

  draw(canvas, characterKey) {
    const ctx = canvas.getContext('2d');
    const w = canvas.width = 320;
    const h = canvas.height = 440;
    ctx.clearRect(0, 0, w, h);

    const breathY = Math.sin(this.breathTimer) * 4;

    ctx.save();
    ctx.translate(w / 2, h - 20 + breathY);

    if (characterKey === 'brooshooft') {
      this.drawPieterBrooshooft(ctx);
    } else if (characterKey === 'kala') {
      this.drawKala(ctx);
    } else if (characterKey === 'deventer') {
      this.drawVanDeventer(ctx);
    } else if (characterKey === 'multatuli') {
      this.drawMultatuli(ctx);
    } else if (characterKey === 'wilhelmina') {
      this.drawWilhelmina(ctx);
    } else if (characterKey === 'farmer') {
      this.drawFarmer(ctx);
    } else if (characterKey === 'kartini') {
      this.drawKartini(ctx);
    } else if (characterKey === 'wahidin') {
      this.drawWahidin(ctx);
    } else if (characterKey === 'kuli_deli') {
      this.drawKuliDeli(ctx);
    } else if (characterKey === 'migrant') {
      this.drawMigrant(ctx);
    } else if (characterKey === 'soetomo') {
      this.drawSoetomo(ctx);
    } else {
      this.drawKala(ctx);
    }

    ctx.restore();
  }

  drawKala(ctx) {
    const glow = ctx.createRadialGradient(0, -200, 10, 0, -200, 140);
    glow.addColorStop(0, 'rgba(255, 230, 128, 0.5)');
    glow.addColorStop(1, 'rgba(255, 200, 50, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(0, -200, 140, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(0, -110, 45, 70, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#e5c158';
    ctx.beginPath();
    ctx.ellipse(0, -110, 30, 14, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffe0bd';
    ctx.beginPath();
    ctx.arc(-50, -110, 12, 0, Math.PI*2);
    ctx.arc(50, -110, 12, 0, Math.PI*2);
    ctx.fill();

    ctx.fillStyle = '#ffe4c4';
    ctx.beginPath();
    ctx.arc(0, -200, 52, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#f0f4fc';
    ctx.beginPath();
    ctx.arc(0, -210, 56, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(-52, -230, 24, 0, Math.PI * 2);
    ctx.arc(52, -230, 24, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#e5c158';
    ctx.beginPath();
    ctx.moveTo(-20, -245);
    ctx.lineTo(0, -270);
    ctx.lineTo(20, -245);
    ctx.closePath();
    ctx.fill();

    if (this.isBlinking) {
      ctx.strokeStyle = '#4a3828';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(-20, -195, 10, 0.2, Math.PI - 0.2);
      ctx.arc(20, -195, 10, 0.2, Math.PI - 0.2);
      ctx.stroke();
    } else {
      ctx.fillStyle = '#6c5ce7';
      ctx.beginPath();
      ctx.ellipse(-20, -195, 9, 14, 0, 0, Math.PI * 2);
      ctx.ellipse(20, -195, 9, 14, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(-22, -200, 4, 0, Math.PI * 2);
      ctx.arc(18, -200, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = 'rgba(255, 120, 140, 0.4)';
    ctx.beginPath();
    ctx.ellipse(-30, -182, 9, 5, 0, 0, Math.PI * 2);
    ctx.ellipse(30, -182, 9, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#d63031';
    ctx.beginPath();
    ctx.ellipse(0, -175, 5, 2 + this.mouthOpen * 7, 0, 0, Math.PI * 2);
    ctx.fill();
  }


  drawPieterBrooshooft(ctx) {
    // Suit of colonial editor
    ctx.fillStyle = '#1c2833';
    ctx.fillRect(-65, -220, 130, 240);

    // Light beige vest
    ctx.fillStyle = '#f5eef8';
    ctx.beginPath();
    ctx.moveTo(-24, -220); ctx.lineTo(24, -220);
    ctx.lineTo(14, -130); ctx.lineTo(-14, -130);
    ctx.closePath();
    ctx.fill();

    // Journalist badge
    ctx.fillStyle = '#e5c158';
    ctx.fillRect(-48, -175, 22, 28);
    ctx.fillStyle = '#111';
    ctx.fillRect(-45, -170, 16, 4);

    // Green tie
    ctx.fillStyle = '#117a65';
    ctx.beginPath();
    ctx.moveTo(-12, -210); ctx.lineTo(12, -210);
    ctx.lineTo(0, -180);
    ctx.closePath();
    ctx.fill();

    // Head
    ctx.fillStyle = '#ffdfba';
    ctx.beginPath();
    ctx.ellipse(0, -260, 42, 50, 0, 0, Math.PI * 2);
    ctx.fill();

    // Dark hair
    ctx.fillStyle = '#34495e';
    ctx.beginPath();
    ctx.arc(0, -276, 45, Math.PI, Math.PI * 2);
    ctx.fill();

    // Mustache
    ctx.fillStyle = '#2c3e50';
    ctx.beginPath();
    ctx.ellipse(-10, -238, 14, 5, 0.2, 0, Math.PI * 2);
    ctx.ellipse(10, -238, 14, 5, -0.2, 0, Math.PI * 2);
    ctx.fill();

    // Spectacles
    ctx.strokeStyle = '#f39c12';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.arc(-15, -256, 10, 0, Math.PI * 2);
    ctx.arc(15, -256, 10, 0, Math.PI * 2);
    ctx.moveTo(-5, -256); ctx.lineTo(5, -256);
    ctx.stroke();

    // Eyes
    if (this.isBlinking) {
      ctx.strokeStyle = '#2c3e50';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(-22, -256); ctx.lineTo(-8, -256);
      ctx.moveTo(8, -256); ctx.lineTo(22, -256);
      ctx.stroke();
    } else {
      ctx.fillStyle = '#1a5276';
      ctx.beginPath();
      ctx.arc(-15, -256, 4, 0, Math.PI * 2);
      ctx.arc(15, -256, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    // Mouth
    ctx.fillStyle = '#922b21';
    ctx.beginPath();
    ctx.ellipse(0, -225, 4.5, 2 + this.mouthOpen * 6, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  drawVanDeventer(ctx) {
    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(-65, -220, 130, 240);

    ctx.fillStyle = '#ecf0f1';
    ctx.beginPath();
    ctx.moveTo(-20, -220); ctx.lineTo(20, -220);
    ctx.lineTo(10, -150); ctx.lineTo(-10, -150);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#c0392b';
    ctx.beginPath();
    ctx.moveTo(-16, -210); ctx.lineTo(16, -210);
    ctx.lineTo(0, -200);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#ffdfba';
    ctx.beginPath();
    ctx.ellipse(0, -260, 44, 52, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#7f8c8d';
    ctx.beginPath();
    ctx.arc(0, -275, 46, Math.PI, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#555';
    ctx.beginPath();
    ctx.ellipse(0, -238, 22, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#e5c158';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(-16, -255, 11, 0, Math.PI * 2);
    ctx.arc(16, -255, 11, 0, Math.PI * 2);
    ctx.moveTo(-5, -255); ctx.lineTo(5, -255);
    ctx.stroke();

    if (this.isBlinking) {
      ctx.strokeStyle = '#222';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-22, -255); ctx.lineTo(-10, -255);
      ctx.moveTo(10, -255); ctx.lineTo(22, -255);
      ctx.stroke();
    } else {
      ctx.fillStyle = '#2980b9';
      ctx.beginPath();
      ctx.arc(-16, -255, 4.5, 0, Math.PI * 2);
      ctx.arc(16, -255, 4.5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = '#5c2d1b';
    ctx.beginPath();
    ctx.ellipse(0, -225, 7, 2 + this.mouthOpen * 6, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  drawMultatuli(ctx) {
    ctx.fillStyle = '#34495e';
    ctx.fillRect(-65, -220, 130, 240);
    ctx.fillStyle = '#795548';
    ctx.fillRect(-30, -220, 60, 120);

    ctx.fillStyle = '#ffd1a4';
    ctx.beginPath();
    ctx.ellipse(0, -260, 44, 52, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#4a3c31';
    ctx.beginPath();
    ctx.arc(0, -270, 48, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(-48, -260, 12, 30);
    ctx.fillRect(36, -260, 12, 30);

    if (this.isBlinking) {
      ctx.strokeStyle = '#111';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-22, -255); ctx.lineTo(-8, -255);
      ctx.moveTo(8, -255); ctx.lineTo(22, -255);
      ctx.stroke();
    } else {
      ctx.fillStyle = '#2c3e50';
      ctx.beginPath();
      ctx.arc(-15, -255, 5, 0, Math.PI * 2);
      ctx.arc(15, -255, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(-16, -257, 2, 0, Math.PI * 2);
      ctx.arc(14, -257, 2, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = '#5c2d1b';
    ctx.beginPath();
    ctx.ellipse(0, -225, 8, 2 + this.mouthOpen * 6, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  drawWilhelmina(ctx) {
    ctx.fillStyle = '#0984e3';
    ctx.fillRect(-65, -220, 130, 240);
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.ellipse(0, -210, 40, 24, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffdfba';
    ctx.beginPath();
    ctx.ellipse(0, -260, 42, 50, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#f1c40f';
    ctx.beginPath();
    ctx.arc(0, -270, 46, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#e5c158';
    ctx.beginPath();
    ctx.moveTo(-25, -300); ctx.lineTo(-12, -315);
    ctx.lineTo(0, -325); ctx.lineTo(12, -315); ctx.lineTo(25, -300);
    ctx.closePath();
    ctx.fill();

    if (this.isBlinking) {
      ctx.strokeStyle = '#222';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-18, -255); ctx.lineTo(-6, -255);
      ctx.moveTo(6, -255); ctx.lineTo(18, -255);
      ctx.stroke();
    } else {
      ctx.fillStyle = '#3498db';
      ctx.beginPath();
      ctx.arc(-14, -255, 5, 0, Math.PI * 2);
      ctx.arc(14, -255, 5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = '#e84118';
    ctx.beginPath();
    ctx.ellipse(0, -228, 6, 2 + this.mouthOpen * 5, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  drawFarmer(ctx) {
    ctx.fillStyle = '#3e342a';
    ctx.fillRect(-60, -220, 120, 240);
    ctx.strokeStyle = '#5a4d3f';
    ctx.lineWidth = 3;
    for (let lx = -50; lx < 50; lx += 12) {
      ctx.beginPath();
      ctx.moveTo(lx, -220); ctx.lineTo(lx, 0);
      ctx.stroke();
    }

    ctx.fillStyle = '#aa7242';
    ctx.beginPath();
    ctx.ellipse(0, -255, 44, 50, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#d4ac0d';
    ctx.beginPath();
    ctx.moveTo(0, -330);
    ctx.lineTo(-75, -270);
    ctx.lineTo(75, -270);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#9a7d0a';
    ctx.lineWidth = 2;
    ctx.stroke();

    if (this.isBlinking) {
      ctx.strokeStyle = '#222';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-22, -250); ctx.lineTo(-6, -250);
      ctx.moveTo(6, -250); ctx.lineTo(22, -250);
      ctx.stroke();
    } else {
      ctx.fillStyle = '#1e272e';
      ctx.beginPath();
      ctx.arc(-14, -250, 5, 0, Math.PI * 2);
      ctx.arc(14, -250, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(-15, -252, 2, 0, Math.PI * 2);
      ctx.arc(13, -252, 2, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = '#4a2311';
    ctx.beginPath();
    ctx.ellipse(0, -225, 8, 2 + this.mouthOpen * 6, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  drawKartini(ctx) {
    ctx.fillStyle = '#f8c291';
    ctx.fillRect(-60, -220, 120, 240);
    ctx.fillStyle = '#8b0000';
    ctx.beginPath();
    ctx.moveTo(-40, -220); ctx.lineTo(-10, -220);
    ctx.lineTo(-20, 0); ctx.lineTo(-50, 0);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#d49b6a';
    ctx.beginPath();
    ctx.ellipse(0, -258, 42, 50, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#221b15';
    ctx.beginPath();
    ctx.arc(0, -275, 46, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(0, -295, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(-16, -285, 5, 0, Math.PI * 2);
    ctx.arc(16, -285, 5, 0, Math.PI * 2);
    ctx.fill();

    if (this.isBlinking) {
      ctx.strokeStyle = '#222';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-18, -254); ctx.lineTo(-5, -254);
      ctx.moveTo(5, -254); ctx.lineTo(18, -254);
      ctx.stroke();
    } else {
      ctx.fillStyle = '#1e272e';
      ctx.beginPath();
      ctx.ellipse(-14, -254, 6, 8, 0, 0, Math.PI * 2);
      ctx.ellipse(14, -254, 6, 8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(-15, -256, 2.5, 0, Math.PI * 2);
      ctx.arc(13, -256, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = '#c0392b';
    ctx.beginPath();
    ctx.ellipse(0, -228, 6, 2 + this.mouthOpen * 5, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  drawWahidin(ctx) {
    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(-60, -220, 120, 240);
    ctx.fillStyle = '#fff';
    ctx.fillRect(-12, -220, 24, 60);

    ctx.fillStyle = '#ba8254';
    ctx.beginPath();
    ctx.ellipse(0, -258, 44, 52, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#3d2516';
    ctx.beginPath();
    ctx.arc(0, -280, 46, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(38, -260, 14, 18, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#555';
    ctx.beginPath();
    ctx.ellipse(0, -238, 20, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    if (this.isBlinking) {
      ctx.strokeStyle = '#222';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-20, -254); ctx.lineTo(-6, -254);
      ctx.moveTo(6, -254); ctx.lineTo(20, -254);
      ctx.stroke();
    } else {
      ctx.fillStyle = '#1e272e';
      ctx.beginPath();
      ctx.arc(-14, -254, 5, 0, Math.PI * 2);
      ctx.arc(14, -254, 5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = '#4e2815';
    ctx.beginPath();
    ctx.ellipse(0, -226, 7, 2 + this.mouthOpen * 5, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  drawKuliDeli(ctx) {
    ctx.fillStyle = '#5d4037';
    ctx.fillRect(-55, -220, 110, 240);
    ctx.fillStyle = '#8d6e63';
    ctx.fillRect(-20, -180, 25, 25);

    ctx.fillStyle = '#8d5524';
    ctx.beginPath();
    ctx.ellipse(0, -255, 42, 48, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#c62828';
    ctx.fillRect(-44, -280, 88, 12);

    if (this.isBlinking) {
      ctx.strokeStyle = '#111';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-20, -252); ctx.lineTo(-6, -252);
      ctx.moveTo(6, -252); ctx.lineTo(20, -252);
      ctx.stroke();
    } else {
      ctx.fillStyle = '#212121';
      ctx.beginPath();
      ctx.arc(-13, -252, 5, 0, Math.PI * 2);
      ctx.arc(13, -252, 5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = '#3e2723';
    ctx.beginPath();
    ctx.ellipse(0, -226, 7, 2 + this.mouthOpen * 5, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  drawMigrant(ctx) {
    ctx.fillStyle = '#795548';
    ctx.fillRect(-60, -220, 120, 240);
    ctx.fillStyle = '#d7ccc8';
    ctx.fillRect(-15, -220, 30, 80);

    ctx.fillStyle = '#b88258';
    ctx.beginPath();
    ctx.ellipse(0, -255, 42, 50, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#3e2723';
    ctx.beginPath();
    ctx.ellipse(0, -285, 48, 18, -0.1, 0, Math.PI * 2);
    ctx.fill();

    if (this.isBlinking) {
      ctx.strokeStyle = '#222';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-20, -250); ctx.lineTo(-6, -250);
      ctx.moveTo(6, -250); ctx.lineTo(20, -250);
      ctx.stroke();
    } else {
      ctx.fillStyle = '#2c3e50';
      ctx.beginPath();
      ctx.arc(-14, -250, 5, 0, Math.PI * 2);
      ctx.arc(14, -250, 5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = '#4e342e';
    ctx.beginPath();
    ctx.ellipse(0, -226, 7, 2 + this.mouthOpen * 5, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  drawSoetomo(ctx) {
    ctx.fillStyle = '#2f3542';
    ctx.fillRect(-62, -220, 124, 240);
    ctx.fillStyle = '#f1f2f6';
    ctx.fillRect(-16, -220, 32, 60);

    ctx.fillStyle = '#c6895c';
    ctx.beginPath();
    ctx.ellipse(0, -258, 44, 52, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#3d2314';
    ctx.beginPath();
    ctx.arc(0, -280, 46, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(38, -260, 14, 18, 0, 0, Math.PI * 2);
    ctx.fill();

    if (this.isBlinking) {
      ctx.strokeStyle = '#111';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-22, -254); ctx.lineTo(-6, -254);
      ctx.moveTo(6, -254); ctx.lineTo(22, -254);
      ctx.stroke();
    } else {
      ctx.fillStyle = '#1e272e';
      ctx.beginPath();
      ctx.ellipse(-15, -254, 7, 9, 0, 0, Math.PI * 2);
      ctx.ellipse(15, -254, 7, 9, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(-16, -256, 2.5, 0, Math.PI * 2);
      ctx.arc(14, -256, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = '#4a2511';
    ctx.beginPath();
    ctx.ellipse(0, -228, 8, 2.5 + this.mouthOpen * 6, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

const genshinRenderer = new GenshinCharacterRenderer();