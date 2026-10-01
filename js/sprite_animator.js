// ==========================================================================
// NARUTO UZUMAKI SPRITE ANIMATION CONTROLLER (2D HISTORICAL EXPLORATION)
// Handles Chroma-Key Background Removal, Frame Sequencing & Combat/Movement
// ==========================================================================

class NarutoSpriteController {
  constructor() {
    this.image = null;
    this.cleanCanvas = null;
    this.cleanCtx = null;
    this.isLoaded = false;
    this.loadFailed = false;

    // Animation frames database based on the 909x652 Naruto UN4 Sprite Sheet
    this.frames = {
      // Row 1: Idle Breathing Stance (4 frames)
      idle: [
        { x: 6, y: 3, w: 38, h: 60, anchorX: 19, anchorY: 58 },
        { x: 58, y: 3, w: 38, h: 60, anchorX: 19, anchorY: 58 },
        { x: 110, y: 3, w: 34, h: 60, anchorX: 17, anchorY: 58 },
        { x: 162, y: 3, w: 38, h: 60, anchorX: 19, anchorY: 58 }
      ],

      // Row 2: Ninja Run & Walk (6 frames)
      walk: [
        { x: 0, y: 78, w: 48, h: 50, anchorX: 24, anchorY: 48 },
        { x: 60, y: 80, w: 60, h: 48, anchorX: 30, anchorY: 46 },
        { x: 130, y: 80, w: 54, h: 48, anchorX: 27, anchorY: 46 },
        { x: 195, y: 80, w: 45, h: 48, anchorX: 22, anchorY: 46 },
        { x: 260, y: 72, w: 54, h: 54, anchorX: 27, anchorY: 52 },
        { x: 320, y: 72, w: 55, h: 56, anchorX: 27, anchorY: 54 }
      ],
      run: [
        { x: 0, y: 78, w: 48, h: 50, anchorX: 24, anchorY: 48 },
        { x: 60, y: 80, w: 60, h: 48, anchorX: 30, anchorY: 46 },
        { x: 130, y: 80, w: 54, h: 48, anchorX: 27, anchorY: 46 },
        { x: 195, y: 80, w: 45, h: 48, anchorX: 22, anchorY: 46 },
        { x: 260, y: 72, w: 54, h: 54, anchorX: 27, anchorY: 52 },
        { x: 320, y: 72, w: 55, h: 56, anchorX: 27, anchorY: 54 }
      ],

      // Row 3: Aerial & Jump (Crouch, Ascend, Somersault, Fall, Land)
      jump_crouch: [
        { x: 3, y: 144, w: 41, h: 48, anchorX: 20, anchorY: 46 }
      ],
      jump_up: [
        { x: 109, y: 136, w: 43, h: 64, anchorX: 21, anchorY: 62 }
      ],
      jump_peak: [
        { x: 165, y: 136, w: 51, h: 64, anchorX: 25, anchorY: 62 }
      ],
      jump_fall: [
        { x: 285, y: 144, w: 45, h: 56, anchorX: 22, anchorY: 54 }
      ],
      jump_land: [
        { x: 355, y: 144, w: 45, h: 56, anchorX: 22, anchorY: 54 }
      ],

      // Row 5: Punch Combos (Jab, Straight, Heavy Windup, Rush)
      punch_combo_1: [
        { x: 10, y: 296, w: 45, h: 64, anchorX: 20, anchorY: 62 },
        { x: 65, y: 296, w: 39, h: 64, anchorX: 18, anchorY: 62 }
      ],
      punch_combo_2: [
        { x: 125, y: 296, w: 75, h: 64, anchorX: 30, anchorY: 62 },
        { x: 205, y: 296, w: 43, h: 60, anchorX: 20, anchorY: 58 }
      ],
      punch_combo_3: [
        { x: 285, y: 296, w: 55, h: 64, anchorX: 26, anchorY: 62 },
        { x: 350, y: 296, w: 70, h: 56, anchorX: 32, anchorY: 54 }
      ],

      // Row 6: Kick Combos (Low Kick, Mid Kick, Spin Kick, Sweep Kick)
      kick_combo_1: [
        { x: 12, y: 376, w: 43, h: 58, anchorX: 20, anchorY: 56 },
        { x: 70, y: 376, w: 58, h: 63, anchorX: 26, anchorY: 61 }
      ],
      kick_combo_2: [
        { x: 140, y: 384, w: 58, h: 56, anchorX: 26, anchorY: 54 },
        { x: 215, y: 388, w: 49, h: 51, anchorX: 23, anchorY: 49 }
      ],
      kick_combo_3: [
        { x: 425, y: 376, w: 55, h: 55, anchorX: 25, anchorY: 53 }
      ],

      // Row 7: Rasengan Jutsu Special
      rasengan_charge: [
        { x: 10, y: 472, w: 70, h: 56, anchorX: 32, anchorY: 54 },
        { x: 100, y: 472, w: 60, h: 56, anchorX: 28, anchorY: 54 }
      ],
      rasengan_dash: [
        { x: 370, y: 464, w: 50, h: 68, anchorX: 24, anchorY: 66 },
        { x: 450, y: 464, w: 55, h: 52, anchorX: 25, anchorY: 50 }
      ]
    };

    // State Tracking
    this.currentAnim = 'idle';
    this.frameIndex = 0;
    this.frameTimer = 0;
    this.facing = 'right'; // 'right' | 'left'
    this.isAttacking = false;
    this.attackType = null; // 'punch' | 'kick' | 'rasengan'
    this.attackStep = 1;
    this.comboResetTimer = 0;

    // Hit effects & Chakra particles
    this.hitEffects = [];
    this.chakraParticles = [];

    // Scale multiplier for 2D world
    this.renderScale = 1.32;

    this.init();
  }

  init() {
    if (typeof window === 'undefined' || !window.document) return;

    this.image = new Image();
    this.image.onload = () => {
      try {
        this.processChromaKey();
        this.isLoaded = true;
        console.log('✓ Naruto Sprite Sheet Loaded & Chroma-Key Processed Successfully!');
      } catch (err) {
        console.error('Error processing sprite sheet:', err);
        this.loadFailed = true;
      }
    };
    this.image.onerror = (e) => {
      console.warn('Failed to load Naruto spritesheet at assets/naruto_spritesheet.png. Fallback procedural rendering will be used.');
      this.loadFailed = true;
    };
    this.image.src = 'assets/naruto_spritesheet.png';
  }

  processChromaKey() {
    this.cleanCanvas = document.createElement('canvas');
    this.cleanCanvas.width = this.image.width;
    this.cleanCanvas.height = this.image.height;
    this.cleanCtx = this.cleanCanvas.getContext('2d');

    this.cleanCtx.drawImage(this.image, 0, 0);

    const imgData = this.cleanCtx.getImageData(0, 0, this.cleanCanvas.width, this.cleanCanvas.height);
    const d = imgData.data;

    // Green Chroma-Key: RGB around (0, 105, 0)
    for (let i = 0; i < d.length; i += 4) {
      const r = d[i];
      const g = d[i + 1];
      const b = d[i + 2];

      // Detect green background shades
      if (r < 45 && g > 75 && b < 45) {
        d[i + 3] = 0; // Transparent
      } else if (r < 60 && g > 95 && b < 60) {
        d[i + 3] = 0;
      }
    }

    this.cleanCtx.putImageData(imgData, 0, 0);
  }

  // Trigger Combat Actions
  triggerPunch() {
    if (this.isAttacking && this.attackType !== 'punch') return;
    if (this.isAttacking && this.attackType === 'punch') {
      // Advance combo
      this.attackStep = (this.attackStep % 3) + 1;
    } else {
      this.attackStep = 1;
    }

    this.isAttacking = true;
    this.attackType = 'punch';
    this.currentAnim = `punch_combo_${this.attackStep}`;
    this.frameIndex = 0;
    this.frameTimer = 0;
    this.comboResetTimer = 35;

    // Play punch whoosh sound
    if (typeof sound !== 'undefined' && sound.playSelect) {
      sound.playSelect();
    }
  }

  triggerKick() {
    if (this.isAttacking && this.attackType !== 'kick') return;
    if (this.isAttacking && this.attackType === 'kick') {
      this.attackStep = (this.attackStep % 3) + 1;
    } else {
      this.attackStep = 1;
    }

    this.isAttacking = true;
    this.attackType = 'kick';
    this.currentAnim = `kick_combo_${this.attackStep}`;
    this.frameIndex = 0;
    this.frameTimer = 0;
    this.comboResetTimer = 35;

    if (typeof sound !== 'undefined' && sound.playSelect) {
      sound.playSelect();
    }
  }

  triggerRasengan() {
    if (this.isAttacking) return;
    this.isAttacking = true;
    this.attackType = 'rasengan';
    this.attackStep = 1;
    this.currentAnim = 'rasengan_charge';
    this.frameIndex = 0;
    this.frameTimer = 0;
    this.comboResetTimer = 55;

    if (typeof sound !== 'undefined' && sound.playQuizCorrect) {
      sound.playQuizCorrect();
    }
  }

  update(playerState) {
    // 1. Combo reset countdown
    if (this.comboResetTimer > 0) {
      this.comboResetTimer--;
      if (this.comboResetTimer <= 0) {
        this.isAttacking = false;
        this.attackType = null;
        this.attackStep = 1;
      }
    }

    // 2. Set Facing Direction
    if (playerState.dir === 'left') this.facing = 'left';
    else if (playerState.dir === 'right') this.facing = 'right';

    // 3. Determine Animation State when not attacking
    if (!this.isAttacking) {
      if (playerState.isJumping) {
        if (playerState.jumpVy < -3) {
          this.currentAnim = 'jump_up';
        } else if (playerState.jumpVy >= -3 && playerState.jumpVy <= 3) {
          this.currentAnim = 'jump_peak';
        } else {
          this.currentAnim = 'jump_fall';
        }
      } else if (playerState.isLanding) {
        this.currentAnim = 'jump_land';
      } else if (playerState.isMoving) {
        this.currentAnim = playerState.isSprinting ? 'run' : 'walk';
      } else {
        this.currentAnim = 'idle';
      }
    }

    // 4. Update Frame Sequencer
    const animList = this.frames[this.currentAnim] || this.frames.idle;
    const speedTable = {
      idle: 9,
      walk: 6,
      run: 4,
      jump_up: 6,
      jump_peak: 6,
      jump_fall: 6,
      jump_land: 5,
      punch_combo_1: 4,
      punch_combo_2: 4,
      punch_combo_3: 5,
      kick_combo_1: 4,
      kick_combo_2: 4,
      kick_combo_3: 5,
      rasengan_charge: 6,
      rasengan_dash: 5
    };
    const speed = speedTable[this.currentAnim] || 6;

    this.frameTimer++;
    if (this.frameTimer >= speed) {
      this.frameTimer = 0;
      this.frameIndex++;
      if (this.frameIndex >= animList.length) {
        if (this.isAttacking) {
          if (this.attackType === 'rasengan' && this.currentAnim === 'rasengan_charge') {
            // Transition from charge to dash attack
            this.currentAnim = 'rasengan_dash';
            this.frameIndex = 0;
          } else {
            // End of attack animation
            this.isAttacking = false;
            this.attackType = null;
            this.frameIndex = 0;
            this.currentAnim = 'idle';
          }
        } else {
          // Loop normal movement/idle animations
          this.frameIndex = 0;
        }
      }
    }

    // 5. Update Chakra Particles for Rasengan
    if (this.isAttacking && this.attackType === 'rasengan') {
      for (let p = 0; p < 3; p++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = 12 + Math.random() * 18;
        this.chakraParticles.push({
          x: (this.facing === 'right' ? 24 : -24) + Math.cos(angle) * dist,
          y: -28 + Math.sin(angle) * dist,
          targetX: (this.facing === 'right' ? 24 : -24),
          targetY: -28,
          radius: 1.5 + Math.random() * 2.5,
          alpha: 0.9,
          color: Math.random() > 0.3 ? '#00d2d3' : '#54a0ff'
        });
      }
    }

    for (let i = this.chakraParticles.length - 1; i >= 0; i--) {
      const cp = this.chakraParticles[i];
      cp.x += (cp.targetX - cp.x) * 0.18;
      cp.y += (cp.targetY - cp.y) * 0.18;
      cp.alpha -= 0.055;
      if (cp.alpha <= 0) {
        this.chakraParticles.splice(i, 1);
      }
    }
  }

  draw(ctx, x, y, jumpY = 0) {
    // 1. DYNAMIC REALISTIC GROUND SHADOW
    // Ground shadow stays firmly at ground level (x, y) and scales with jump height
    const jumpProgress = Math.max(0, Math.min(1, Math.abs(jumpY) / 100));
    const shadowWidth = Math.max(8, 20 * (1 - jumpProgress * 0.45));
    const shadowAlpha = Math.max(0.12, 0.35 * (1 - jumpProgress * 0.6));

    ctx.fillStyle = `rgba(0, 0, 0, ${shadowAlpha})`;
    ctx.beginPath();
    ctx.ellipse(x, y + 6, shadowWidth, shadowWidth * 0.35, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2. FALLBACK PROCEDURAL RENDERING IF SPRITE NOT LOADED
    if (!this.isLoaded || !this.cleanCanvas) {
      return false; // Tells caller to render procedural fallback
    }

    // 3. RENDER ACTIVE NARUTO SPRITE FRAME
    const animList = this.frames[this.currentAnim] || this.frames.idle;
    const safeIdx = Math.min(this.frameIndex, animList.length - 1);
    const frame = animList[safeIdx];
    if (!frame) return false;

    ctx.save();
    // Translate to player position including jump altitude
    ctx.translate(x, y + jumpY);

    // Horizontal orientation flip
    if (this.facing === 'left') {
      ctx.scale(-1, 1);
    }

    // Draw sprite centered on anchor foot
    const drawW = frame.w * this.renderScale;
    const drawH = frame.h * this.renderScale;
    const drawX = -frame.anchorX * this.renderScale;
    const drawY = -frame.anchorY * this.renderScale;

    ctx.imageSmoothingEnabled = false; // Preserve crisp pixel-art styling
    ctx.drawImage(
      this.cleanCanvas,
      frame.x, frame.y, frame.w, frame.h,
      drawX, drawY, drawW, drawH
    );

    // 4. RENDER RASENGAN CHAKRA SPHERE & PARTICLES
    if (this.isAttacking && this.attackType === 'rasengan') {
      const rx = 24 * this.renderScale;
      const ry = -28 * this.renderScale;
      const pulse = 0.8 + Math.sin(Date.now() * 0.03) * 0.2;

      // Outer Glowing Blue Chakra Halo
      const rasGlow = ctx.createRadialGradient(rx, ry, 2, rx, ry, 26 * pulse);
      rasGlow.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      rasGlow.addColorStop(0.3, 'rgba(0, 210, 211, 0.85)');
      rasGlow.addColorStop(0.7, 'rgba(84, 160, 255, 0.5)');
      rasGlow.addColorStop(1, 'rgba(10, 61, 98, 0)');
      ctx.fillStyle = rasGlow;
      ctx.beginPath();
      ctx.arc(rx, ry, 26 * pulse, 0, Math.PI * 2);
      ctx.fill();

      // Swirling internal vortex rings
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(rx, ry, 10 * pulse, 0, Math.PI * 1.5);
      ctx.stroke();

      ctx.strokeStyle = '#00d2d3';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(rx, ry, 14 * pulse, Math.PI * 0.5, Math.PI * 2);
      ctx.stroke();

      // Chakra spark motes
      for (const cp of this.chakraParticles) {
        ctx.fillStyle = cp.color;
        ctx.beginPath();
        ctx.arc(cp.x * this.renderScale, cp.y * this.renderScale, cp.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 5. PUNCH / KICK IMPACT FLASH EFFECT
    if (this.isAttacking && (this.attackType === 'punch' || this.attackType === 'kick') && this.frameIndex === 1) {
      const hx = 22 * this.renderScale;
      const hy = -26 * this.renderScale;
      ctx.strokeStyle = 'rgba(255, 235, 120, 0.85)';
      ctx.lineWidth = 2.5;
      for (let s = 0; s < 4; s++) {
        const a = (s * Math.PI) / 2 + Date.now() * 0.01;
        ctx.beginPath();
        ctx.moveTo(hx + Math.cos(a) * 4, hy + Math.sin(a) * 4);
        ctx.lineTo(hx + Math.cos(a) * 16, hy + Math.sin(a) * 16);
        ctx.stroke();
      }
    }

    ctx.restore();
    return true; // Successfully rendered Naruto sprite
  }
}

// ==========================================================================
// SUPER MARIO SPRITE ANIMATION CONTROLLER (RETRO ARCADE 2D)
// Chroma-Key Background Removal, Walk, Run, Jump, Punch Combos & Fireball
// ==========================================================================

class MarioSpriteController {
  constructor() {
    this.image = null;
    this.cleanCanvas = null;
    this.cleanCtx = null;
    this.isLoaded = false;
    this.loadFailed = false;

    // Sprite frames mapped from the 794x890 Mario sprite sheet
    // Row 1 (y: 20-130): Classic Small Mario Walk/Jump
    // Row 2 (y: 135-265): Super Mario Walk/Punch (Punch Pose at x: 345, y: 150)
    // Row 3 (y: 280-410): Running / Turning Sprites
    // Row 4 (y: 430-560): Fire Mario / White Overalls Action
    // Row 5 & 6: Cape / Flying Mario
    // Sprite frames mapped with exact pixel boundaries from 794x890 Mario sprite sheet
    // Row 2 (y: 140-262): Classic Super Mario Walk, Idle & Jump
    // Row 3 (y: 285-410): Running Mario
    // Row 4 (y: 430-555): Fire Mario Power Strike
    this.frames = {
      // Idle pose: Super Mario front-facing stance (Row 2 Col 4: x: 370, y: 153)
      idle: [
        { x: 370, y: 153, w: 61, h: 107, anchorX: 30, anchorY: 105 },
        { x: 370, y: 154, w: 61, h: 106, anchorX: 30, anchorY: 104 }
      ],

      // Walk cycle: 4 crisp walking frames from Row 2
      walk: [
        { x: 34, y: 143, w: 61, h: 117, anchorX: 30, anchorY: 115 },
        { x: 146, y: 151, w: 61, h: 109, anchorX: 30, anchorY: 107 },
        { x: 258, y: 155, w: 57, h: 105, anchorX: 28, anchorY: 103 },
        { x: 593, y: 159, w: 61, h: 101, anchorX: 30, anchorY: 99 }
      ],

      // Sprint/Run cycle: Row 3 fast-running animation
      run: [
        { x: 15, y: 290, w: 76, h: 118, anchorX: 38, anchorY: 114 },
        { x: 124, y: 290, w: 83, h: 118, anchorX: 41, anchorY: 114 },
        { x: 258, y: 300, w: 74, h: 108, anchorX: 37, anchorY: 104 },
        { x: 360, y: 300, w: 74, h: 108, anchorX: 37, anchorY: 104 },
        { x: 472, y: 300, w: 74, h: 108, anchorX: 37, anchorY: 104 },
        { x: 594, y: 300, w: 71, h: 108, anchorX: 35, anchorY: 104 }
      ],

      // Jump Ascend: Cape Mario Flying Upward Diagonally with Yellow Cape Aloft (Row 6 Col 3 & Col 2)
      jump_up: [
        { x: 243, y: 737, w: 90, h: 119, anchorX: 45, anchorY: 115 },
        { x: 128, y: 759, w: 101, h: 98, anchorX: 50, anchorY: 95 }
      ],
      // Jump Peak: Cape Mario Gliding & Soaring Horizontally across the sky (Row 6 Col 2 & Col 1)
      jump_peak: [
        { x: 128, y: 759, w: 101, h: 98, anchorX: 50, anchorY: 95 },
        { x: 16, y: 752, w: 100, h: 104, anchorX: 50, anchorY: 100 }
      ],
      // Jump Fall: Cape Mario Floating Down to Ground with Cape Spread Wide like Parachute (Row 6 Col 7 & Col 1)
      jump_fall: [
        { x: 679, y: 752, w: 98, h: 104, anchorX: 49, anchorY: 102 },
        { x: 16, y: 752, w: 100, h: 104, anchorX: 50, anchorY: 100 }
      ],
      // Jump Dive: Cape Mario Diving Vertically Straight Down with Tall Cape (Row 6 Col 4)
      jump_dive: [
        { x: 377, y: 704, w: 61, h: 156, anchorX: 30, anchorY: 154 }
      ],
      // Jump Land: Cape Mario Touching Down on Ground with Cape Settling (Row 6 Col 5 & Col 6)
      jump_land: [
        { x: 482, y: 752, w: 64, h: 104, anchorX: 32, anchorY: 102 },
        { x: 570, y: 755, w: 92, h: 101, anchorX: 46, anchorY: 100 }
      ],

      // Punch Combo 1: Jab Strike (Row 2 Col 3: x: 258, y: 155)
      punch_combo_1: [
        { x: 258, y: 155, w: 57, h: 105, anchorX: 28, anchorY: 103 },
        { x: 34, y: 143, w: 61, h: 117, anchorX: 30, anchorY: 115 }
      ],

      // Punch Combo 2: Forward Power Punch (Row 3 Col 4: x: 360, y: 300)
      punch_combo_2: [
        { x: 360, y: 300, w: 74, h: 108, anchorX: 37, anchorY: 104 },
        { x: 34, y: 143, w: 61, h: 117, anchorX: 30, anchorY: 115 }
      ],

      // Punch Combo 3: Fire Mario Finisher Strike (Row 4 Col 4: x: 370, y: 440)
      punch_combo_3: [
        { x: 258, y: 440, w: 58, h: 105, anchorX: 29, anchorY: 103 },
        { x: 370, y: 435, w: 62, h: 112, anchorX: 31, anchorY: 110 }
      ],

      // Kick Combo: Slide Kick (Row 2 Col 5: x: 482, y: 203)
      kick_combo_1: [
        { x: 482, y: 203, w: 60, h: 57, anchorX: 30, anchorY: 55 },
        { x: 15, y: 290, w: 76, h: 118, anchorX: 38, anchorY: 114 }
      ],
      kick_combo_2: [
        { x: 124, y: 290, w: 83, h: 118, anchorX: 41, anchorY: 114 }
      ],
      kick_combo_3: [
        { x: 594, y: 300, w: 71, h: 108, anchorX: 35, anchorY: 104 }
      ],

      // Special Move: Fireball Surge (Row 4 Fire Mario)
      rasengan_charge: [
        { x: 258, y: 440, w: 58, h: 105, anchorX: 29, anchorY: 103 },
        { x: 370, y: 435, w: 62, h: 112, anchorX: 31, anchorY: 110 }
      ],
      rasengan_dash: [
        { x: 15, y: 290, w: 76, h: 118, anchorX: 38, anchorY: 114 },
        { x: 124, y: 290, w: 83, h: 118, anchorX: 41, anchorY: 114 }
      ]
    };

    // State Tracking
    this.currentAnim = 'idle';
    this.frameIndex = 0;
    this.frameTimer = 0;
    this.facing = 'right';
    this.isAttacking = false;
    this.attackType = null;
    this.attackStep = 1;
    this.comboResetTimer = 0;
    this.fireballParticles = [];

    // Scale multiplier for natural 2D world proportions
    this.renderScale = 0.58;

    this.init();
  }

  init() {
    if (typeof window === 'undefined' || !window.document) return;

    this.image = new Image();
    this.image.onload = () => {
      try {
        this.processChromaKey();
        this.isLoaded = true;
        console.log('✓ Mario Sprite Sheet Loaded & Chroma-Key Processed Successfully!');
      } catch (err) {
        console.error('Error processing Mario sprite sheet:', err);
        this.loadFailed = true;
      }
    };
    this.image.onerror = () => {
      console.warn('Failed to load Mario spritesheet at assets/mario_spritesheet.jpg. Procedural fallback will be used.');
      this.loadFailed = true;
    };
    this.image.src = 'assets/mario_spritesheet.jpg';
  }

  processChromaKey() {
    this.cleanCanvas = document.createElement('canvas');
    this.cleanCanvas.width = this.image.width;
    this.cleanCanvas.height = this.image.height;
    this.cleanCtx = this.cleanCanvas.getContext('2d');

    this.cleanCtx.drawImage(this.image, 0, 0);

    const imgData = this.cleanCtx.getImageData(0, 0, this.cleanCanvas.width, this.cleanCanvas.height);
    const d = imgData.data;

    // Advanced Crisp Chroma-Key Removal for Mario Sprite Sheet:
    // 1. Removes off-white / light-gray crosshatch canvas background (r>190, g>190, b>190)
    // 2. Removes faint pink / pastel controller watermark (r>190, g>170, b>170)
    // 3. Removes faint JPEG noise artifacts around sprite boundaries
    for (let i = 0; i < d.length; i += 4) {
      const r = d[i];
      const g = d[i + 1];
      const b = d[i + 2];

      // A. Pure and off-white / light gray canvas background
      if (r >= 195 && g >= 195 && b >= 195) {
        d[i + 3] = 0; // 100% transparent
      }
      // B. Light textured gray grid lines
      else if (r >= 180 && g >= 180 && b >= 180 && Math.abs(r - g) <= 12 && Math.abs(g - b) <= 12) {
        d[i + 3] = 0;
      }
      // C. Faint pink watermark gamepad in center
      else if (r >= 195 && g >= 170 && b >= 175 && (r - g) >= 8 && (r - g) <= 45) {
        d[i + 3] = 0;
      }
      // D. Pastel letters ("KraftyPixels")
      else if (r >= 175 && g >= 170 && b >= 170 && Math.abs(r - g) <= 20 && Math.abs(g - b) <= 20) {
        d[i + 3] = 0;
      }
    }

    this.cleanCtx.putImageData(imgData, 0, 0);
  }

  triggerPunch() {
    if (this.isAttacking && this.attackType !== 'punch') return;
    if (this.isAttacking && this.attackType === 'punch') {
      this.attackStep = (this.attackStep % 3) + 1;
    } else {
      this.attackStep = 1;
    }

    this.isAttacking = true;
    this.attackType = 'punch';
    this.currentAnim = `punch_combo_${this.attackStep}`;
    this.frameIndex = 0;
    this.frameTimer = 0;
    this.comboResetTimer = 35;

    if (typeof sound !== 'undefined' && sound.playSelect) {
      sound.playSelect();
    }
  }

  triggerKick() {
    if (this.isAttacking && this.attackType !== 'kick') return;
    if (this.isAttacking && this.attackType === 'kick') {
      this.attackStep = (this.attackStep % 3) + 1;
    } else {
      this.attackStep = 1;
    }

    this.isAttacking = true;
    this.attackType = 'kick';
    this.currentAnim = `kick_combo_${this.attackStep}`;
    this.frameIndex = 0;
    this.frameTimer = 0;
    this.comboResetTimer = 35;

    if (typeof sound !== 'undefined' && sound.playSelect) {
      sound.playSelect();
    }
  }

  triggerRasengan() {
    // Mario Fireball / Power Star Finisher
    if (this.isAttacking) return;
    this.isAttacking = true;
    this.attackType = 'rasengan';
    this.attackStep = 1;
    this.currentAnim = 'rasengan_charge';
    this.frameIndex = 0;
    this.frameTimer = 0;
    this.comboResetTimer = 55;

    if (typeof sound !== 'undefined' && sound.playQuizCorrect) {
      sound.playQuizCorrect();
    }
  }

  update(playerState) {
    if (this.comboResetTimer > 0) {
      this.comboResetTimer--;
      if (this.comboResetTimer <= 0) {
        this.isAttacking = false;
        this.attackType = null;
        this.attackStep = 1;
      }
    }

    if (playerState.dir === 'left') this.facing = 'left';
    else if (playerState.dir === 'right') this.facing = 'right';

    if (!this.isAttacking) {
      if (playerState.isJumping) {
        if (playerState.isDiving) {
          this.currentAnim = 'jump_dive';
        } else if (playerState.jumpVy < -2.5) {
          this.currentAnim = 'jump_up';
        } else if (playerState.jumpVy >= -2.5 && playerState.jumpVy <= 2.5) {
          this.currentAnim = 'jump_peak';
        } else {
          this.currentAnim = 'jump_fall';
        }
      } else if (playerState.isLanding) {
        this.currentAnim = 'jump_land';
      } else if (playerState.isMoving) {
        this.currentAnim = playerState.isSprinting ? 'run' : 'walk';
      } else {
        this.currentAnim = 'idle';
      }
    }

    const animList = this.frames[this.currentAnim] || this.frames.idle;
    const speedTable = {
      idle: 12,
      walk: 6,
      run: 4,
      jump_up: 7,
      jump_peak: 7,
      jump_fall: 7,
      jump_dive: 4,
      jump_land: 5,
      punch_combo_1: 4,
      punch_combo_2: 4,
      punch_combo_3: 5,
      kick_combo_1: 4,
      kick_combo_2: 4,
      kick_combo_3: 5,
      rasengan_charge: 6,
      rasengan_dash: 5
    };
    const speed = speedTable[this.currentAnim] || 6;

    this.frameTimer++;
    if (this.frameTimer >= speed) {
      this.frameTimer = 0;
      this.frameIndex++;
      if (this.frameIndex >= animList.length) {
        if (this.isAttacking) {
          if (this.attackType === 'rasengan' && this.currentAnim === 'rasengan_charge') {
            this.currentAnim = 'rasengan_dash';
            this.frameIndex = 0;
          } else {
            this.isAttacking = false;
            this.attackType = null;
            this.frameIndex = 0;
            this.currentAnim = 'idle';
          }
        } else {
          this.frameIndex = 0;
        }
      }
    }

    // Fireball sparks
    if (this.isAttacking && this.attackType === 'rasengan') {
      for (let p = 0; p < 3; p++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = 10 + Math.random() * 16;
        this.fireballParticles.push({
          x: (this.facing === 'right' ? 22 : -22) + Math.cos(angle) * dist,
          y: -22 + Math.sin(angle) * dist,
          targetX: (this.facing === 'right' ? 22 : -22),
          targetY: -22,
          radius: 1.5 + Math.random() * 2.5,
          alpha: 0.9,
          color: Math.random() > 0.4 ? '#ff4757' : '#ffa502'
        });
      }
    }

    for (let i = this.fireballParticles.length - 1; i >= 0; i--) {
      const fp = this.fireballParticles[i];
      fp.x += (fp.targetX - fp.x) * 0.2;
      fp.y += (fp.targetY - fp.y) * 0.2;
      fp.alpha -= 0.055;
      if (fp.alpha <= 0) this.fireballParticles.splice(i, 1);
    }
  }

  draw(ctx, x, y, jumpY = 0) {
    const jumpProgress = Math.max(0, Math.min(1, Math.abs(jumpY) / 100));
    const shadowWidth = Math.max(8, 20 * (1 - jumpProgress * 0.45));
    const shadowAlpha = Math.max(0.12, 0.35 * (1 - jumpProgress * 0.6));

    // Realistic Ground Shadow
    ctx.fillStyle = `rgba(0, 0, 0, ${shadowAlpha})`;
    ctx.beginPath();
    ctx.ellipse(x, y + 6, shadowWidth, shadowWidth * 0.35, 0, 0, Math.PI * 2);
    ctx.fill();

    if (!this.isLoaded || !this.cleanCanvas) {
      return false; // Fallback
    }

    const animList = this.frames[this.currentAnim] || this.frames.idle;
    const safeIdx = Math.min(this.frameIndex, animList.length - 1);
    const frame = animList[safeIdx];
    if (!frame) return false;

    ctx.save();
    ctx.translate(x, y + jumpY);

    if (this.facing === 'left') {
      ctx.scale(-1, 1);
    }

    const drawW = frame.w * this.renderScale;
    const drawH = frame.h * this.renderScale;
    const drawX = -frame.anchorX * this.renderScale;
    const drawY = -frame.anchorY * this.renderScale;

    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(
      this.cleanCanvas,
      frame.x, frame.y, frame.w, frame.h,
      drawX, drawY, drawW, drawH
    );

    // Dynamic Cape Flight Aerodynamic Wind Streaks & Golden Sparkles
    if (this.currentAnim === 'jump_up' || this.currentAnim === 'jump_peak' || this.currentAnim === 'jump_fall') {
      const wx = -14 * this.renderScale;
      const wy = -34 * this.renderScale;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.lineWidth = 1.5;
      for (let w = 0; w < 2; w++) {
        const lineY = wy + (w * 14 - 7) * this.renderScale;
        const lineLen = (14 + (w * 8)) * this.renderScale;
        ctx.beginPath();
        ctx.moveTo(wx, lineY);
        ctx.lineTo(wx - lineLen, lineY);
        ctx.stroke();
      }

      // Golden Cape Sparkles
      ctx.fillStyle = '#fed330';
      const sparkX = wx - 10 * this.renderScale + (Math.sin(Date.now() * 0.02) * 5);
      const sparkY = wy + 4 * this.renderScale + (Math.cos(Date.now() * 0.02) * 5);
      ctx.beginPath();
      ctx.arc(sparkX, sparkY, 1.8 * this.renderScale, 0, Math.PI * 2);
      ctx.fill();
    }

    // Fireball effect for Mario special
    if (this.isAttacking && this.attackType === 'rasengan') {
      const rx = 22 * this.renderScale;
      const ry = -22 * this.renderScale;
      const pulse = 0.8 + Math.sin(Date.now() * 0.03) * 0.2;

      const fireGlow = ctx.createRadialGradient(rx, ry, 2, rx, ry, 24 * pulse);
      fireGlow.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      fireGlow.addColorStop(0.3, 'rgba(255, 107, 107, 0.9)');
      fireGlow.addColorStop(0.7, 'rgba(255, 159, 26, 0.6)');
      fireGlow.addColorStop(1, 'rgba(255, 63, 52, 0)');
      ctx.fillStyle = fireGlow;
      ctx.beginPath();
      ctx.arc(rx, ry, 24 * pulse, 0, Math.PI * 2);
      ctx.fill();

      for (const fp of this.fireballParticles) {
        ctx.fillStyle = fp.color;
        ctx.beginPath();
        ctx.arc(fp.x * this.renderScale, fp.y * this.renderScale, fp.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Impact flash for punch/kick
    if (this.isAttacking && (this.attackType === 'punch' || this.attackType === 'kick') && this.frameIndex === 1) {
      const hx = 22 * this.renderScale;
      const hy = -26 * this.renderScale;
      ctx.strokeStyle = 'rgba(255, 235, 120, 0.85)';
      ctx.lineWidth = 2.5;
      for (let s = 0; s < 4; s++) {
        const a = (s * Math.PI) / 2 + Date.now() * 0.01;
        ctx.beginPath();
        ctx.moveTo(hx + Math.cos(a) * 4, hy + Math.sin(a) * 4);
        ctx.lineTo(hx + Math.cos(a) * 16, hy + Math.sin(a) * 16);
        ctx.stroke();
      }
    }

    ctx.restore();
    return true;
  }
}

// ==========================================================================
// TROPICAL PARROT / BIRD SPRITE ANIMATION CONTROLLER (9-FRAME FLIGHT CYCLE)
// Auto Flood-Fill Background Removal, Smooth Wing-Beats & Ground Shadow
// ==========================================================================

class BirdSpriteController {
  constructor() {
    this.image = null;
    this.cleanCanvas = null;
    this.cleanCtx = null;
    this.isLoaded = false;
    this.loadFailed = false;

    // 9 Frames from the 260x280 bird sprite sheet (arranged in 3x3 grid)
    // Anchored at bird body center for zero-jitter rotation & scale
    this.frames = [
      { sx: 15, sy: 52, sw: 61, sh: 54, anchorX: 35, anchorY: 48 }, // 0: Upstroke high
      { sx: 90, sy: 52, sw: 62, sh: 56, anchorX: 36, anchorY: 50 }, // 1: Wings full up
      { sx: 167, sy: 56, sw: 65, sh: 47, anchorX: 36, anchorY: 41 }, // 2: Wings arched up
      { sx: 11, sy: 145, sw: 70, sh: 22, anchorX: 35, anchorY: 17 }, // 3: Horizontal glide
      { sx: 86, sy: 141, sw: 70, sh: 35, anchorX: 36, anchorY: 16 }, // 4: Downstroke start
      { sx: 165, sy: 138, sw: 68, sh: 41, anchorX: 36, anchorY: 16 }, // 5: Downstroke mid
      { sx: 14, sy: 218, sw: 63, sh: 35, anchorX: 36, anchorY: 16 }, // 6: Downstroke low
      { sx: 91, sy: 218, sw: 61, sh: 31, anchorX: 36, anchorY: 25 }, // 7: Deep cup wing
      { sx: 168, sy: 214, sw: 62, sh: 38, anchorX: 36, anchorY: 32 }  // 8: Recovery sweep
    ];

    this.renderScale = 0.52; // Scale nicely for 2D world exploration
    this.init();
  }

  init() {
    if (typeof window === 'undefined' || !window.document) return;

    this.image = new Image();
    this.image.onload = () => {
      try {
        this.processCleanBackground();
        this.isLoaded = true;
        console.log('✓ Bird Sprite Sheet Loaded & Flood-Fill Processed Successfully!');
      } catch (err) {
        console.error('Error processing bird sprite sheet:', err);
        this.loadFailed = true;
      }
    };
    this.image.onerror = () => {
      console.warn('Failed to load bird spritesheet at assets/bird_spritesheet.png. Procedural wildlife fallback will be used.');
      this.loadFailed = true;
    };
    this.image.src = 'assets/bird_spritesheet.png';
  }

  processCleanBackground() {
    this.cleanCanvas = document.createElement('canvas');
    this.cleanCanvas.width = this.image.width;
    this.cleanCanvas.height = this.image.height;
    this.cleanCtx = this.cleanCanvas.getContext('2d');
    this.cleanCtx.drawImage(this.image, 0, 0);

    const imgData = this.cleanCtx.getImageData(0, 0, this.cleanCanvas.width, this.cleanCanvas.height);
    const d = imgData.data;
    const w = this.cleanCanvas.width;
    const h = this.cleanCanvas.height;

    // Flood fill from all 4 borders to remove white background, yellow arrows, and header/footer text
    const isBg = new Uint8Array(w * h);
    const visited = new Uint8Array(w * h);
    const queue = [];

    // Seed borders
    for (let x = 0; x < w; x++) {
      queue.push(x);
      queue.push((h - 1) * w + x);
      visited[x] = 1;
      visited[(h - 1) * w + x] = 1;
    }
    for (let y = 1; y < h - 1; y++) {
      queue.push(y * w);
      queue.push(y * w + (w - 1));
      visited[y * w] = 1;
      visited[y * w + (w - 1)] = 1;
    }

    while (queue.length > 0) {
      const curr = queue.pop();
      const cx = curr % w;
      const cy = Math.floor(curr / w);
      isBg[curr] = 1;

      const neighbors = [];
      if (cx > 0) neighbors.push(curr - 1);
      if (cx < w - 1) neighbors.push(curr + 1);
      if (cy > 0) neighbors.push(curr - w);
      if (cy < h - 1) neighbors.push(curr + w);

      for (const n of neighbors) {
        if (!visited[n]) {
          visited[n] = 1;
          const nidx = n * 4;
          const nr = d[nidx];
          const ng = d[nidx + 1];
          const nb = d[nidx + 2];
          const ny = Math.floor(n / w);

          const isPureWhite = (nr >= 246 && ng >= 246 && nb >= 246);
          const isHeaderFooter = (ny < 44 || ny > 258);
          const isBeigeArrow = (nr > 200 && ng > 180 && nb > 100 && Math.abs(nr - ng) < 45);

          if (isPureWhite || isHeaderFooter || isBeigeArrow) {
            queue.push(n);
          }
        }
      }
    }

    // Set transparent alpha for background
    for (let i = 0; i < w * h; i++) {
      if (isBg[i]) {
        d[i * 4 + 3] = 0;
      }
    }

    this.cleanCtx.putImageData(imgData, 0, 0);
  }

  drawBird(ctx, bird) {
    if (!ctx) return;

    const x = bird.x;
    const y = bird.y;
    const altitude = bird.altitude || 0;
    const isFlying = bird.isFlying;
    const facingLeft = (bird.vx < 0);
    const rotation = isFlying ? (bird.pitch || 0) : (bird.peckProgress ? Math.sin(bird.peckProgress) * 0.35 : 0);

    // 1. DYNAMIC GROUND SHADOW
    // Shrinks and fades as bird gains altitude
    const shadowAlpha = Math.max(0.08, 0.45 - (altitude / 160));
    const shadowScale = Math.max(0.3, 1 - (altitude / 200));
    ctx.save();
    ctx.fillStyle = `rgba(18, 24, 18, ${shadowAlpha})`;
    ctx.beginPath();
    ctx.ellipse(x, y + 4, 10 * shadowScale, 4.5 * shadowScale, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 2. FALLBACK PROCEDURAL IF SPRITE NOT READY
    if (!this.isLoaded || !this.cleanCanvas) {
      ctx.save();
      ctx.translate(x, y - altitude);
      if (facingLeft) ctx.scale(-1, 1);
      ctx.rotate(rotation);

      // Tropical Blue / Gold Parrot procedural fallback
      ctx.fillStyle = '#0984e3'; // Blue wing
      ctx.beginPath();
      ctx.ellipse(0, 0, 9, 5, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#fdcb6e'; // Golden belly
      ctx.beginPath();
      ctx.ellipse(2, 2, 6, 3, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#2d3436'; // Beak
      ctx.beginPath();
      ctx.moveTo(8, -1);
      ctx.lineTo(13, 1);
      ctx.lineTo(8, 3);
      ctx.fill();

      ctx.restore();
      return;
    }

    // 3. SPRITE DRAWING
    ctx.save();
    ctx.translate(x, y - altitude);
    if (facingLeft) {
      ctx.scale(-1, 1);
    }
    ctx.rotate(rotation);

    // Frame selection
    // Default perched frame: Frame 3 (wings tucked/gliding resting posture)
    let frameIdx = 3;
    if (isFlying) {
      frameIdx = Math.floor(bird.frameIndex || 0) % this.frames.length;
    } else if (bird.peckProgress) {
      frameIdx = 3; // resting frame with rotation
    }

    const frame = this.frames[frameIdx] || this.frames[3];
    const scale = this.renderScale * (bird.scale || 1.0);

    ctx.drawImage(
      this.cleanCanvas,
      frame.sx, frame.sy, frame.sw, frame.sh,
      -frame.anchorX * scale,
      -frame.anchorY * scale,
      frame.sw * scale,
      frame.sh * scale
    );

    ctx.restore();
  }
}

// Global instances initialized for easy integration
let narutoController = null;
let marioController = null;
let birdSpriteController = null;

if (typeof window !== 'undefined') {
  narutoController = new NarutoSpriteController();
  marioController = new MarioSpriteController();
  birdSpriteController = new BirdSpriteController();
}


