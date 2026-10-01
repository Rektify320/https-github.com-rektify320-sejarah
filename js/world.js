// --- 4. MAP ENGINE DENGAN PENINGGALAN PRASEJARAH & AREAL LUAS ---
const MAP_WIDTH = 3400; // Peta jauh lebih luas
const MAP_HEIGHT = 2200;

class GameWorld {
  constructor() {
    this.canvas = document.getElementById('worldCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.minimapCanvas = document.getElementById('minimapCanvas');
    this.mmCtx = this.minimapCanvas.getContext('2d');

    this.player = {
      x: 360,
      y: 400,
      baseSpeed: 4.8,
      speed: 4.8,
      isSprinting: false,
      dir: 'down',
      isMoving: false,
      stepFrame: 0,
      jumpY: 0,
      jumpVy: 0,
      isJumping: false,
      isLanding: false,
      landingTimer: 0,
      isDiving: false
    };

    // 2 Characters Selection: 'naruto' | 'mario'
    this.selectedCharacter = 'naruto';
    this.narutoSprite = (typeof narutoController !== 'undefined' && narutoController) ? narutoController : (typeof NarutoSpriteController !== 'undefined' ? new NarutoSpriteController() : null);
    this.marioSprite = (typeof marioController !== 'undefined' && marioController) ? marioController : (typeof MarioSpriteController !== 'undefined' ? new MarioSpriteController() : null);

    this.camera = { x: 0, y: 0 };
    this.keys = {};
    this.decorations = [];
    this.npcs = [];
    this.particles = [];
    this.smokeParticles = [];
    this.waterWheelAngle = 0;
    this.waterSprayParticles = [];
    this.goldenDustMotes = [];
    for (let i = 0; i < 60; i++) {
      this.goldenDustMotes.push({
        x: Math.random() * MAP_WIDTH,
        y: Math.random() * MAP_HEIGHT,
        size: 1.5 + Math.random() * 2.5,
        speedX: 0.2 + Math.random() * 0.4,
        speedY: -0.2 - Math.random() * 0.4,
        alpha: 0.3 + Math.random() * 0.5,
        pulseSpeed: 0.02 + Math.random() * 0.03,
        phase: Math.random() * Math.PI * 2
      });
    }

    
    // --- GENSHIN IMPACT LIVING WORLD SYSTEMS ---
    this.visionModeActive = false;
    this.sonarActive = false;
    this.stamina = 100;
    this.maxStamina = 100;
    this.playerGhosts = [];
    this.timeOfDay = 'siang'; // pagi, siang, senja, malam
    this.photoFilter = 'vintage'; // normal, vintage, sepia, noir, vibrant
    this.playerPose = 'normal';

    // Paimon-like Companion: Kala (Roh Waktu)
    this.kalaCompanion = {
      x: this.player.x - 30,
      y: this.player.y - 30,
      targetX: this.player.x - 30,
      targetY: this.player.y - 30,
      bobAngle: 0,
      sparkles: []
    };

    // Living Wildlife: Burung Eksotis Nusantara (9-Frame Sprite Animation)
    this.birds = [];
    for (let i = 0; i < 32; i++) {
      const isFlyingInitial = Math.random() < 0.45;
      const initAngle = Math.random() * Math.PI * 2;
      const initSpeed = 2.0 + Math.random() * 2.2;
      this.birds.push({
        x: 200 + Math.random() * (MAP_WIDTH - 400),
        y: 200 + Math.random() * (MAP_HEIGHT - 400),
        isFlying: isFlyingInitial,
        altitude: isFlyingInitial ? (35 + Math.random() * 85) : 0,
        targetAltitude: isFlyingInitial ? (40 + Math.random() * 80) : 0,
        vx: isFlyingInitial ? Math.cos(initAngle) * initSpeed : 0,
        vy: isFlyingInitial ? Math.sin(initAngle) * initSpeed : 0,
        pitch: 0,
        frameIndex: Math.random() * 9,
        wingSpeed: 0.22 + Math.random() * 0.08,
        scale: 0.95 + Math.random() * 0.25,
        peckTimer: Math.random() * 80,
        peckProgress: 0,
        glideTimer: 0,
        perchDuration: 120 + Math.random() * 240,
        flightDuration: 200 + Math.random() * 400
      });
    }

    // Kunang-Kunang (Fireflies)
    this.fireflies = [];
    for (let i = 0; i < 45; i++) {
      this.fireflies.push({
        x: 600 + Math.random() * 1000,
        y: 800 + Math.random() * 800,
        baseX: 600 + Math.random() * 1000,
        baseY: 800 + Math.random() * 800,
        phase: Math.random() * Math.PI * 2,
        size: 2.5 + Math.random() * 2
      });
    }

    // Wind Petals, Pine Needles & Drifting Forest Leaves
    this.windPetals = [];
    for (let i = 0; i < 48; i++) {
      const isPine = Math.random() > 0.45;
      this.windPetals.push({
        x: Math.random() * MAP_WIDTH,
        y: Math.random() * MAP_HEIGHT,
        speedX: 1.1 + Math.random() * 1.6,
        speedY: 0.5 + Math.random() * 0.9,
        size: isPine ? (6 + Math.random() * 5) : (3.5 + Math.random() * 4),
        isPine: isPine,
        color: isPine ? (Math.random() > 0.5 ? 'rgba(76, 209, 111, 0.75)' : 'rgba(30, 117, 112, 0.7)') : (Math.random() > 0.5 ? 'rgba(235, 180, 70, 0.72)' : 'rgba(120, 200, 100, 0.68)'),
        rot: Math.random() * Math.PI * 2,
        rotSpeed: 0.02 + Math.random() * 0.035,
        flutterPhase: Math.random() * Math.PI * 2
      });
    }

    // Floating Numbers & Text (+100 EXP Sejarah)
    this.floatingTexts = [];

    // Sonar waves
    this.sonarWaves = [];

    // Ambient Speech Bubbles for NPCs
    this.ambientBubble = {
      npcId: null,
      text: "",
      timer: 0
    };
    this.ambientBubbleInterval = 0;

    // 5 Hidden Historical Relic Chests
    this.chests = (typeof HISTORICAL_CHESTS_DATA !== 'undefined') ? JSON.parse(JSON.stringify(HISTORICAL_CHESTS_DATA)) : [];
    this.lastFootstepTime = 0;

    this.initMapEntities();
    this.bindEvents();
    this.resize();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.minimapCanvas.width = 150;
    this.minimapCanvas.height = 150;
  }

  initMapEntities() {
    this.npcs = [
      // Zona 0: Peninggalan Prasejarah Nusantara (Megalitikum)
      {
        id: "menhir_prasejarah",
        name: "Menhir & Dolmen Megalitikum",
        title: "✦ PERADABAN BATU BESAR LELUHUR ✦",
        role: "prehistoric_stone",
        x: 350,
        y: 820,
        interactRadius: 85,
        dialogueKey: "menhir_inspect"
      },
      {
        id: "punden_berundak",
        name: "Punden Berundak & Sarkofagus",
        title: "✦ AKAR AGRARIS & GOTONG ROYONG ✦",
        role: "punden",
        x: 350,
        y: 1350,
        interactRadius: 90,
        dialogueKey: "punden_inspect"
      },

      // Zona 1: Den Haag & Batavia 1899
      {
        id: "kala",
        name: "Kala (Roh Waktu)",
        title: "✦ PEMANDU SEJARAH ✦",
        role: "kala",
        x: 820,
        y: 360,
        interactRadius: 80,
        dialogueKey: "kala_start"
      },
      {
        id: "deventer",
        name: "Mr. C.Th. van Deventer",
        title: "✦ PENCETUS EEN EERESCHULD ✦",
        role: "deventer",
        x: 1040,
        y: 350,
        interactRadius: 85,
        dialogueKey: "deventer_start"
      },
      {
        id: "multatuli",
        name: "Eduard Douwes Dekker (Multatuli)",
        title: "✦ PENULIS MAX HAVELAAR 1860 ✦",
        role: "multatuli",
        x: 1240,
        y: 340,
        interactRadius: 85,
        dialogueKey: "multatuli_start"
      },
            {
        id: "brooshooft",
        name: "Pieter Brooshooft",
        title: "✦ WARTAWAN DE LOCOMOTIEF ✦",
        role: "brooshooft",
        x: 1420,
        y: 350,
        interactRadius: 85,
        dialogueKey: "brooshooft_start"
      },
      {
        id: "wilhelmina",
        name: "Ratu Wilhelmina (1901)",
        title: "✦ TROONREDE PIDATO TAKHTA ✦",
        role: "wilhelmina",
        x: 1140,
        y: 200,
        interactRadius: 85,
        dialogueKey: "wilhelmina_start"
      },

      // Zona 2: Pilar Irigasi & Sawah Sidoarjo
      {
        id: "farmer",
        name: "Pak Kromo (Petani Tradisional)",
        title: "✦ SUARA RAKYAT SAWAH ✦",
        role: "farmer",
        x: 1080,
        y: 1120,
        interactRadius: 85,
        dialogueKey: "farmer_start"
      },
      {
        id: "dam_gate",
        name: "Pintu Air Bendungan Kolonial",
        title: "✦ KONTROL DISKRIMINASI AIR ✦",
        role: "dam_gate",
        x: 880,
        y: 1040,
        interactRadius: 80,
        dialogueKey: "dam_inspect"
      },

      // Zona 3: Pilar Edukasi STOVIA & Emansipasi
      {
        id: "kartini",
        name: "Raden Ajeng Kartini",
        title: "✦ PELOPOR EMANSIPASI WANITA ✦",
        role: "kartini",
        x: 2350,
        y: 380,
        interactRadius: 85,
        dialogueKey: "kartini_start"
      },
      {
        id: "wahidin",
        name: "dr. Wahidin Soedirohoesodo",
        title: "✦ PELOPOR STUDIEFONDS STOVIA ✦",
        role: "wahidin",
        x: 2550,
        y: 360,
        interactRadius: 85,
        dialogueKey: "wahidin_start"
      },

      // Zona 4: Pilar Emigrasi & Kuli Deli
      {
        id: "kuli_deli",
        name: "Amat (Kuli Kontrak Deli)",
        title: "✦ KORBAN POENALE SANCTIE ✦",
        role: "kuli_deli",
        x: 2380,
        y: 1140,
        interactRadius: 85,
        dialogueKey: "kuli_deli_start"
      },
      {
        id: "migrant",
        name: "Koordinator Emigrasi Lampung",
        title: "✦ PELOPOR TRANSMIGRASI 1905 ✦",
        role: "migrant",
        x: 2580,
        y: 1120,
        interactRadius: 85,
        dialogueKey: "migrant_start"
      },

      // Zona 5: Puncak Budi Utomo & Akhir Politik Etis
      {
        id: "soetomo",
        name: "dr. Soetomo & Tokoh 1908",
        title: "✦ PENDIRI BUDI UTOMO 1908 ✦",
        role: "soetomo",
        x: 1750,
        y: 720,
        interactRadius: 95,
        dialogueKey: "soetomo_start"
      },
      {
        id: "kala_monument",
        name: "Tugu Akhir Politik Etis",
        title: "✦ SENJATA MAKAN TUAN & MERDEKA ✦",
        role: "monument",
        x: 1750,
        y: 980,
        interactRadius: 85,
        dialogueKey: "akhir_politik_etis_start"
      }
    ];

    // Zona terlarang untuk pepohonan (jalan setapak, plaza, sawah, candi, dan sekitar NPC)
    const blockedZones = [
      { x1: 50, y1: 550, x2: 670, y2: 1650 },   // Lembah Megalitikum
      { x1: 660, y1: 100, x2: 1540, y2: 710 },  // Plaza Den Haag & Court
      { x1: 660, y1: 800, x2: 1560, y2: 1500 }, // Persawahan Irigasi & Kanal Sidoarjo
      { x1: 1960, y1: 100, x2: 3060, y2: 740 }, // Kampus STOVIA
      { x1: 1960, y1: 800, x2: 3060, y2: 1500 },// Pelabuhan Deli Sumatra
      { x1: 1500, y1: 540, x2: 2000, y2: 1140 },// Central Plaza Budi Utomo & Tugu
      { x1: 560, y1: 340, x2: 2060, y2: 450 },  // Jalan Setapak Barat-Timur Utara
      { x1: 1460, y1: 1060, x2: 2060, y2: 1170 },// Jalan Setapak Barat-Timur Selatan
      { x1: 1690, y1: 390, x2: 1810, y2: 610 }  // Jalan Setapak Penghubung Utara-Selatan
    ];

    const isAreaBlocked = (x, y) => {
      if (x < 90 || x > MAP_WIDTH - 90 || y < 90 || y > MAP_HEIGHT - 90) return true;
      for (const bz of blockedZones) {
        if (x >= bz.x1 && x <= bz.x2 && y >= bz.y1 && y <= bz.y2) return true;
      }
      for (const n of this.npcs) {
        if (Math.hypot(x - n.x, y - n.y) < 140) return true;
      }
      return false;
    };

    // Algoritma Penempatan Terdistribusi Rapi (Poisson-Spacing Anti-Berdempetan)
    const minTreeSpacing = 95; // Jarak minimal antar-pohon agar renggang dan estetik
    let placeAttempts = 0;
    while (this.decorations.length < 175 && placeAttempts < 9000) {
      placeAttempts++;
      const x = 90 + Math.random() * (MAP_WIDTH - 180);
      const y = 90 + Math.random() * (MAP_HEIGHT - 180);

      if (isAreaBlocked(x, y)) continue;

      let tooClose = false;
      for (const dec of this.decorations) {
        if (Math.hypot(x - dec.x, y - dec.y) < minTreeSpacing) {
          tooClose = true;
          break;
        }
      }

      if (!tooClose) {
        const isTree = Math.random() > 0.18; // 82% pohon estetik, 18% batu lumut alam
        const sizeBase = isTree ? (36 + Math.random() * 22) : (18 + Math.random() * 16);
        this.decorations.push({
          x,
          y,
          type: isTree ? 'tree' : 'boulder',
          size: sizeBase,
          heightScale: 1.15 + Math.random() * 0.45,
          colorTheme: Math.floor(Math.random() * 3), // 0: Emerald Cypress, 1: Teal Fir, 2: Golden Autumn Pine
          swayPhase: Math.random() * Math.PI * 2,
          swaySpeed: 0.0018 + Math.random() * 0.0012,
          swayAmp: 0.035 + Math.random() * 0.025,
          leafRustleTimer: Math.random() * 100
        });
      }
    }

    // Urutkan dekorasi berdasarkan posisi Y (depth sorting) agar perspektif 2D alami
    this.decorations.sort((a, b) => a.y - b.y);

    for (let i = 0; i < 80; i++) {
      this.particles.push({
        x: Math.random() * MAP_WIDTH,
        y: Math.random() * MAP_HEIGHT,
        size: 2 + Math.random() * 3.5,
        vx: (Math.random() - 0.5) * 0.7,
        vy: -0.4 - Math.random() * 0.6,
        alpha: Math.random()
      });
    }
  }

  bindEvents() {
    window.addEventListener('resize', () => this.resize());

    window.addEventListener('keydown', (e) => {
      sound.init();
      this.keys[e.key] = true;
      if (e.key === 'Shift') {
        this.player.isSprinting = true;
      }
      if (e.key === 'e' || e.key === 'E') {
        this.triggerInteraction();
      }
      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault();
        this.triggerJump();
      }
      if (e.key === 'j' || e.key === 'J') {
        this.triggerPunch();
      }
      if (e.key === 'k' || e.key === 'K') {
        this.triggerKick();
      }
      if (e.key === 'l' || e.key === 'L') {
        this.triggerRasengan();
      }
      if (e.key === 'c' || e.key === 'C') {
        this.switchCharacter();
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.key] = false;
      if (e.key === 'Shift') {
        this.player.isSprinting = false;
      }
    });

    const dpadBtns = document.querySelectorAll('.dpad-btn');
    dpadBtns.forEach(btn => {
      const key = btn.getAttribute('data-key');
      const start = (e) => { e.preventDefault(); sound.init(); this.keys[key] = true; };
      const stop = (e) => { e.preventDefault(); this.keys[key] = false; };
      btn.addEventListener('touchstart', start, { passive: false });
      btn.addEventListener('touchend', stop, { passive: false });
      btn.addEventListener('mousedown', start);
      btn.addEventListener('mouseup', stop);
      btn.addEventListener('mouseleave', stop);
    });

    const mobileSprint = document.getElementById('mobileSprintBtn');
    if (mobileSprint) {
      mobileSprint.addEventListener('click', (e) => {
        e.preventDefault();
        sound.init();
        this.player.isSprinting = !this.player.isSprinting;
        mobileSprint.classList.toggle('active', this.player.isSprinting);
      });
    }

    const mobileJump = document.getElementById('mobileJumpBtn');
    if (mobileJump) {
      mobileJump.addEventListener('click', (e) => {
        e.preventDefault();
        sound.init();
        this.triggerJump();
      });
    }

    const mobilePunch = document.getElementById('mobilePunchBtn');
    if (mobilePunch) {
      mobilePunch.addEventListener('click', (e) => {
        e.preventDefault();
        sound.init();
        this.triggerPunch();
      });
    }

    const mobileAttack = document.getElementById('mobileAttackBtn');
    if (mobileAttack) {
      mobileAttack.addEventListener('click', (e) => {
        e.preventDefault();
        sound.init();
        this.triggerKick();
      });
    }

    const mobileSwitch = document.getElementById('mobileSwitchCharBtn');
    if (mobileSwitch) {
      mobileSwitch.addEventListener('click', (e) => {
        e.preventDefault();
        sound.init();
        this.switchCharacter();
      });
    }

    const mobAct = document.getElementById('mobileActionBtn');
    if (mobAct) {
      mobAct.addEventListener('click', () => {
        sound.init();
        this.triggerInteraction();
      });
    }

    const intPrompt = document.getElementById('interactionPrompt');
    if (intPrompt) {
      intPrompt.addEventListener('click', () => {
        sound.init();
        this.triggerInteraction();
      });
    }
  }

  triggerInteraction() {
    if (dialogueManager.isActive) return;

    // Cek apakah ada peti harta karun terdekat
    const nearbyChest = this.getClosestChest();
    if (nearbyChest && !nearbyChest.opened) {
      nearbyChest.opened = true;
      if (typeof sound !== 'undefined' && sound.playChestOpen) {
        sound.playChestOpen();
      }
      this.spawnFloatingText(`🎁 ${nearbyChest.title}! (+${nearbyChest.exp} EXP)`, nearbyChest.x, nearbyChest.y - 45, '#ffd700');
      if (typeof questManager !== 'undefined' && questManager) {
        // Spawn reward motes
        for (let i = 0; i < 16; i++) {
          this.goldenDustMotes.push({
            x: nearbyChest.x,
            y: nearbyChest.y,
            size: 2 + Math.random() * 3,
            speedX: (Math.random() - 0.5) * 3.5,
            speedY: -1.5 - Math.random() * 2.5,
            alpha: 1,
            pulseSpeed: 0.05,
            phase: Math.random() * Math.PI * 2
          });
        }
      }
      if (typeof showChestFoundModal === 'function') {
        showChestFoundModal(nearbyChest);
      }
      return;
    }

    const nearby = this.getClosestInteractiveNPC();
    if (nearby) {
      sound.playSelect();
      dialogueManager.startDialogue(nearby.dialogueKey, nearby);
    }
  }

  triggerJump() {
    if (dialogueManager.isActive) return;
    if (!this.player.isJumping) {
      this.player.isJumping = true;
      this.player.isLanding = false;
      this.player.landingTimer = 0;
      this.player.isDiving = false;
      // Mario with Cape has a soaring flight leap!
      this.player.jumpVy = this.selectedCharacter === 'mario' ? -10.5 : -9.5;
      if (typeof sound !== 'undefined' && sound.playSelect) {
        sound.playSelect();
      }
      for (let i = 0; i < 5; i++) {
        this.particles.push({
          x: this.player.x + (Math.random() - 0.5) * 14,
          y: this.player.y + 8,
          size: 2.5 + Math.random() * 2.5,
          vx: (Math.random() - 0.5) * 2,
          vy: -0.4 - Math.random() * 0.6,
          alpha: 0.8
        });
      }
    }
  }

  switchCharacter(charName) {
    if (charName) {
      this.selectedCharacter = charName;
    } else {
      this.selectedCharacter = this.selectedCharacter === 'naruto' ? 'mario' : 'naruto';
    }

    const charTitle = this.selectedCharacter === 'mario' ? '🍄 Super Mario' : '🍥 Naruto Uzumaki';
    this.spawnFloatingText(`✦ Karakter: ${charTitle}!`, this.player.x, this.player.y - 40, this.selectedCharacter === 'mario' ? '#ff4757' : '#ffa502');

    if (typeof sound !== 'undefined' && sound.playSelect) {
      sound.playSelect();
    }

    // Update switch button label / state if present
    const switchBtn = document.getElementById('switchCharBtn');
    if (switchBtn) {
      switchBtn.innerHTML = this.selectedCharacter === 'mario' ? '🍄 Mario (Ubah: Naruto)' : '🍥 Naruto (Ubah: Mario)';
    }
  }

  getActiveSprite() {
    return this.selectedCharacter === 'mario' ? this.marioSprite : this.narutoSprite;
  }

  triggerPunch() {
    if (dialogueManager.isActive) return;
    const sprite = this.getActiveSprite();
    if (sprite) {
      sprite.triggerPunch();
      const txt = this.selectedCharacter === 'mario' ? '👊 MARIO PUNCH!' : '👊 NARUTO PUNCH!';
      this.spawnFloatingText(txt, this.player.x, this.player.y - 35, this.selectedCharacter === 'mario' ? '#ff4757' : '#ffd32a');
    }
  }

  triggerKick() {
    if (dialogueManager.isActive) return;
    const sprite = this.getActiveSprite();
    if (sprite) {
      sprite.triggerKick();
      const txt = this.selectedCharacter === 'mario' ? '👟 SLIDE KICK!' : '👟 COMBO KICK!';
      this.spawnFloatingText(txt, this.player.x, this.player.y - 35, '#ff793f');
    }
  }

  triggerRasengan() {
    if (dialogueManager.isActive) return;
    const sprite = this.getActiveSprite();
    if (sprite) {
      sprite.triggerRasengan();
      if (this.selectedCharacter === 'mario') {
        this.spawnFloatingText("🔥 FIREBALL FINISHER!", this.player.x, this.player.y - 45, '#ff4757');
      } else {
        this.spawnFloatingText("🌀 RASENGAN!", this.player.x, this.player.y - 45, '#00d2d3');
      }
    }
  }

  getClosestChest() {
    if (!this.chests) return null;
    for (const c of this.chests) {
      const dist = Math.hypot(this.player.x - c.x, this.player.y - c.y);
      if (dist <= 65) return c;
    }
    return null;
  }

  getClosestInteractiveNPC() {
    for (const npc of this.npcs) {
      const dist = Math.hypot(this.player.x - npc.x, this.player.y - npc.y);
      if (dist <= npc.interactRadius) {
        return npc;
      }
    }
    return null;
  }

  update() {
    
    // 1. STAMINA SYSTEM (GENSHIN SPRINT)
    if (this.player.isMoving && this.player.isSprinting) {
      this.stamina = Math.max(0, this.stamina - 0.4);
      if (this.stamina <= 0) {
        this.player.isSprinting = false;
      }
      // Phantom dash ghost trail
      if (Math.random() > 0.3) {
        this.playerGhosts.push({
          x: this.player.x,
          y: this.player.y,
          dir: this.player.dir,
          alpha: 0.55
        });
      }
    } else {
      this.stamina = Math.min(this.maxStamina, this.stamina + 0.35);
    }

    // Fade out ghost trails
    for (let i = this.playerGhosts.length - 1; i >= 0; i--) {
      this.playerGhosts[i].alpha -= 0.045;
      if (this.playerGhosts[i].alpha <= 0) {
        this.playerGhosts.splice(i, 1);
      }
    }

    // 2. PAIMON-STYLE KALA COMPANION MOVEMENT & SPARKLES
    this.kalaCompanion.bobAngle += 0.06;
    const targetKalaX = this.player.x + (this.player.dir === 'left' ? 32 : -32);
    const targetKalaY = this.player.y - 36 + Math.sin(this.kalaCompanion.bobAngle) * 6;
    this.kalaCompanion.x += (targetKalaX - this.kalaCompanion.x) * 0.12;
    this.kalaCompanion.y += (targetKalaY - this.kalaCompanion.y) * 0.12;

    if (Math.random() > 0.4) {
      this.kalaCompanion.sparkles.push({
        x: this.kalaCompanion.x + (Math.random() - 0.5) * 10,
        y: this.kalaCompanion.y + (Math.random() - 0.5) * 10,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        alpha: 0.8,
        size: 1.5 + Math.random() * 2.5
      });
    }
    for (let i = this.kalaCompanion.sparkles.length - 1; i >= 0; i--) {
      const sp = this.kalaCompanion.sparkles[i];
      sp.x += sp.vx;
      sp.y += sp.vy;
      sp.alpha -= 0.035;
      if (sp.alpha <= 0) this.kalaCompanion.sparkles.splice(i, 1);
    }

    // 3. LIVING BIRDS BEHAVIOR (9-FRAME NATURAL FLIGHT CYCLE & FLOCKING)
    for (const b of this.birds) {
      if (!b.isFlying) {
        b.peckTimer++;
        b.altitude = Math.max(0, b.altitude * 0.8); // Rest on the ground

        // Pecking animation every few seconds
        if (b.peckTimer > 90 && b.peckTimer < 110) {
          b.peckProgress += 0.25;
        } else {
          b.peckProgress = 0;
          if (b.peckTimer > 130) b.peckTimer = Math.random() * 40;
        }

        b.perchDuration--;
        // Spontaneous takeoff or startled by Naruto approaching
        const distToPlayer = Math.hypot(this.player.x - b.x, this.player.y - b.y);
        const startledDist = this.player.isSprinting ? 165 : (this.player.isJumping ? 140 : 90);

        if (distToPlayer < startledDist || b.perchDuration <= 0) {
          b.isFlying = true;
          b.peckProgress = 0;
          const scareAngle = Math.atan2(b.y - this.player.y, b.x - this.player.x);
          const flightAngle = (distToPlayer < startledDist) ? scareAngle + (Math.random() - 0.5) * 0.6 : Math.random() * Math.PI * 2;
          const takeoffSpeed = (distToPlayer < startledDist) ? 3.8 + Math.random() * 2.0 : 2.2 + Math.random() * 1.5;
          b.vx = Math.cos(flightAngle) * takeoffSpeed;
          b.vy = Math.sin(flightAngle) * takeoffSpeed;
          b.targetAltitude = 45 + Math.random() * 95;
          b.flightDuration = 220 + Math.random() * 400;
          b.glideTimer = 0;
        }
      } else {
        // Flying Physics & Wing Flapping
        b.x += b.vx;
        b.y += b.vy;

        // Altitude smooth rise / descent
        b.altitude += (b.targetAltitude - b.altitude) * 0.04;

        // Dynamic banking / pitch angle based on velocity
        const targetPitch = Math.atan2(b.vy, Math.abs(b.vx)) * 0.45;
        b.pitch += (targetPitch - b.pitch) * 0.1;

        // Flapping vs Gliding cycle
        b.glideTimer++;
        const isGliding = (b.glideTimer % 120 > 75); // Glides gracefully every 2 seconds

        if (isGliding) {
          // Glide frame: Frame 3
          b.frameIndex = 3;
        } else {
          // Continuous 9-frame wing flapping
          b.frameIndex += b.wingSpeed;
          if (b.frameIndex >= 9) b.frameIndex = 0;
        }

        // Gentle sinusoidal flight wave
        b.vy += Math.sin(Date.now() * 0.003 + b.scale * 10) * 0.05;

        // Decrement flight duration to seek a new landing spot
        b.flightDuration--;
        if (b.flightDuration < 60) {
          b.targetAltitude = 0; // Descend to land
          b.vx *= 0.985;
          b.vy *= 0.985;
        }

        // Land when altitude touches 0 or re-loop when reaching map edge
        if (b.flightDuration <= 0 && b.altitude <= 2) {
          b.isFlying = false;
          b.altitude = 0;
          b.vx = 0;
          b.vy = 0;
          b.pitch = 0;
          b.perchDuration = 180 + Math.random() * 320;
          b.peckTimer = 0;
        }

        // Wrap around map borders smoothly
        if (b.x < -80) b.x = MAP_WIDTH + 60;
        else if (b.x > MAP_WIDTH + 80) b.x = -60;
        if (b.y < -80) b.y = MAP_HEIGHT + 60;
        else if (b.y > MAP_HEIGHT + 80) b.y = -60;
      }
    }

    // 4. FIREFLIES
    for (const f of this.fireflies) {
      f.phase += 0.03;
      f.x = f.baseX + Math.cos(f.phase) * 25;
      f.y = f.baseY + Math.sin(f.phase * 1.5) * 18;
    }

    // 5. WIND PETALS & FOREST LEAVES
    for (const p of this.windPetals) {
      p.flutterPhase += 0.04;
      p.x += p.speedX + Math.cos(p.flutterPhase) * 0.4;
      p.y += p.speedY + Math.sin(p.flutterPhase * 1.5) * 0.3;
      p.rot += p.rotSpeed || 0.02;
      if (p.x > MAP_WIDTH) p.x = 0;
      if (p.y > MAP_HEIGHT) p.y = 0;
    }

    // 6. SONAR PULSE WAVES
    for (let i = this.sonarWaves.length - 1; i >= 0; i--) {
      const sw = this.sonarWaves[i];
      sw.radius += 12;
      sw.alpha -= 0.015;
      if (sw.alpha <= 0) this.sonarWaves.splice(i, 1);
    }

    // 7. FLOATING EXP / REPUTATION TEXTS
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.y += ft.vy;
      ft.alpha -= 0.018;
      if (ft.alpha <= 0) this.floatingTexts.splice(i, 1);
    }

    // 8. AMBIENT NPC OVERHEAD CHATTER BUBBLE
    this.ambientBubbleInterval++;
    if (this.ambientBubbleInterval > 380 && !dialogueManager.isActive) {
      this.ambientBubbleInterval = 0;
      const chatterList = [
        { role: 'farmer', text: '🌾 "Giliran air sawah rakyat kok cuma tengah malam ya..."' },
        { role: 'brooshooft', text: '📰 "Edisi De Locomotief besok harus menggugah parlemen!"' },
        { role: 'kartini', text: '✉️ "Habis Gelap Terbitlah Terang... ilmu adalah kunci kemerdekaan."' },
        { role: 'deventer', text: '⚖️ "Belanda wajib melunasi Utang Kehormatan ratusan juta gulden!"' },
        { role: 'wahidin', text: '🩺 "Dana Studiefonds ini demi sekolah anak-anak pintar yang miskin."' },
        { role: 'kuli_deli', text: '⛓️ "Semoga kontrak kerja perkebunan tembakau ini lekas selesai..."' },
        { role: 'soetomo', text: '🏛️ "Boedi Oetomo 1908 adalah tonggak persatuan pemuda kita!"' }
      ];
      const pick = chatterList[Math.floor(Math.random() * chatterList.length)];
      const targetNPC = this.npcs.find(n => n.role === pick.role);
      if (targetNPC) {
        this.ambientBubble = {
          npcId: targetNPC.id,
          text: pick.text,
          timer: 240
        };
      }
    }
    if (this.ambientBubble.timer > 0) {
      this.ambientBubble.timer--;
    }

    // 9. UPDATE RPG COMPASS DISTANCE & TARGET
    this.updateRpgCompass();

    this.waterWheelAngle += 0.035;

    // 10. Water Wheel Mist & Spray Particles
    if (Math.random() > 0.3) {
      const sprayAngle = (Math.random() - 0.5) * 1.5;
      this.waterSprayParticles.push({
        x: 840 + (Math.random() - 0.5) * 24,
        y: 1100 + (Math.random() - 0.5) * 12,
        vx: Math.cos(sprayAngle) * (1.2 + Math.random() * 2),
        vy: -2 - Math.random() * 2.2,
        gravity: 0.16,
        radius: 2 + Math.random() * 2.5,
        alpha: 0.85
      });
    }
    for (let i = this.waterSprayParticles.length - 1; i >= 0; i--) {
      const wsp = this.waterSprayParticles[i];
      wsp.x += wsp.vx;
      wsp.y += wsp.vy;
      wsp.vy += wsp.gravity;
      wsp.alpha -= 0.028;
      if (wsp.alpha <= 0) {
        this.waterSprayParticles.splice(i, 1);
      }
    }

    // 11. Golden Exploration Dust Motes
    for (const mote of this.goldenDustMotes) {
      mote.phase += mote.pulseSpeed;
      mote.x += mote.speedX + Math.sin(mote.phase) * 0.35;
      mote.y += mote.speedY;
      if (mote.x > MAP_WIDTH) mote.x = 0;
      if (mote.y < 0) mote.y = MAP_HEIGHT;
    }

    // 12. Locomotive Smoke & Steam Particles
    if (Math.random() > 0.45) {
      this.smokeParticles.push({
        x: 2580 + (Math.random() - 0.5) * 8,
        y: 975,
        vx: (Math.random() - 0.5) * 0.6 - 0.9,
        vy: -1.4 - Math.random() * 0.9,
        radius: 7 + Math.random() * 7,
        alpha: 0.65
      });
    }

    for (let i = this.smokeParticles.length - 1; i >= 0; i--) {
      const sp = this.smokeParticles[i];
      sp.x += sp.vx;
      sp.y += sp.vy;
      sp.radius += 0.18;
      sp.alpha -= 0.009;
      if (sp.alpha <= 0) {
        this.smokeParticles.splice(i, 1);
      }
    }

    if (dialogueManager.isActive) return;

    let dx = 0;
    let dy = 0;

    if (this.keys['ArrowUp'] || this.keys['w'] || this.keys['W']) { dy -= 1; this.player.dir = 'up'; }
    if (this.keys['ArrowDown'] || this.keys['s'] || this.keys['S']) { dy += 1; this.player.dir = 'down'; }
    if (this.keys['ArrowLeft'] || this.keys['a'] || this.keys['A']) { dx -= 1; this.player.dir = 'left'; }
    if (this.keys['ArrowRight'] || this.keys['d'] || this.keys['D']) { dx += 1; this.player.dir = 'right'; }

    if (dx !== 0 && dy !== 0) {
      dx *= 0.7071;
      dy *= 0.7071;
    }

    this.player.isMoving = (dx !== 0 || dy !== 0);
    this.player.speed = this.player.isSprinting ? this.player.baseSpeed * 1.6 : this.player.baseSpeed;

    if (this.player.isMoving) {
      this.player.x += dx * this.player.speed;
      this.player.y += dy * this.player.speed;
      this.player.stepFrame += this.player.isSprinting ? 0.35 : 0.22;

      // Play subtle grass/dirt footstep sound periodically
      const now = Date.now();
      const stepInterval = this.player.isSprinting ? 220 : 340;
      if (now - this.lastFootstepTime > stepInterval && !this.player.isJumping) {
        this.lastFootstepTime = now;
        if (typeof sound !== 'undefined' && sound.playFootstep) {
          sound.playFootstep(this.player.isSprinting);
        }
      }

      this.player.x = Math.max(60, Math.min(MAP_WIDTH - 60, this.player.x));
      this.player.y = Math.max(60, Math.min(MAP_HEIGHT - 60, this.player.y));
    }

    // Jump Physics (Gravity & Ground Landing)
    if (this.player.isJumping) {
      this.player.jumpY += this.player.jumpVy;

      // Authentic Super Mario Cape Flight Physics
      if (this.selectedCharacter === 'mario') {
        // Fast vertical dive if pressing Down or S while in midair
        const isHoldingDown = this.keys && (this.keys['ArrowDown'] || this.keys['s'] || this.keys['S']);
        if (isHoldingDown && this.player.jumpVy > -2) {
          this.player.isDiving = true;
          this.player.jumpVy += 0.85;
        } else {
          this.player.isDiving = false;
          // Smooth soaring ascent and gentle parachute descent
          if (this.player.jumpVy > 0) {
            this.player.jumpVy += 0.30; // Gentle floating parachute glide
            if (this.player.jumpVy > 3.8) this.player.jumpVy = 3.8; // Soft terminal descent velocity
          } else {
            this.player.jumpVy += 0.46; // Soaring lift
          }
        }
      } else {
        this.player.jumpVy += 0.58; // Standard Naruto gravity
      }

      // Land on ground
      if (this.player.jumpY >= 0) {
        const wasDiving = this.player.isDiving;
        this.player.jumpY = 0;
        this.player.jumpVy = 0;
        this.player.isJumping = false;
        this.player.isDiving = false;
        this.player.isLanding = true;
        this.player.landingTimer = 12;

        // Landing dust puff or dive starburst
        const puffCount = wasDiving ? 12 : 5;
        for (let i = 0; i < puffCount; i++) {
          this.particles.push({
            x: this.player.x + (Math.random() - 0.5) * (wasDiving ? 32 : 18),
            y: this.player.y + 6,
            size: wasDiving ? 3 + Math.random() * 3 : 2 + Math.random() * 2,
            vx: (Math.random() - 0.5) * (wasDiving ? 3 : 1.6),
            vy: -0.3 - Math.random() * (wasDiving ? 1.2 : 0.5),
            alpha: 0.8,
            color: wasDiving ? '#fed330' : null
          });
        }
      }
    }

    // Landing recovery timer
    if (this.player.landingTimer > 0) {
      this.player.landingTimer--;
      if (this.player.landingTimer <= 0) {
        this.player.isLanding = false;
      }
    }

    // Update active sprite animator (Naruto or Mario)
    const activeSprite = this.getActiveSprite();
    if (activeSprite) {
      activeSprite.update(this.player);
    }

    this.camera.x += ((this.player.x - this.canvas.width / 2) - this.camera.x) * 0.1;
    this.camera.y += ((this.player.y - this.canvas.height / 2) - this.camera.y) * 0.1;

    for (const p of this.particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.y < 0) {
        p.y = MAP_HEIGHT;
        p.x = Math.random() * MAP_WIDTH;
      }
    }

    const nearby = this.getClosestInteractiveNPC();
    const promptEl = document.getElementById('interactionPrompt');
    const promptText = document.getElementById('interactionText');
    if (nearby) {
      promptText.innerHTML = `Bicara: <strong>${nearby.name}</strong> [E] | Quest [Q]`;
      promptEl.classList.add('show');
    } else {
      promptEl.classList.remove('show');
    }
  }

  draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.save();
    ctx.translate(-this.camera.x, -this.camera.y);

    this.drawTerrain(ctx);
    this.drawPrehistoricRelics(ctx);
    this.drawLandmarks(ctx);

    // Water spray droplets from rotating waterwheel
    ctx.fillStyle = 'rgba(235, 245, 255, 0.8)';
    for (const wsp of this.waterSprayParticles) {
      ctx.beginPath();
      ctx.arc(wsp.x, wsp.y, wsp.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    for (const sp of this.smokeParticles) {
      ctx.fillStyle = `rgba(220, 225, 235, ${sp.alpha})`;
      ctx.beginPath();
      ctx.arc(sp.x, sp.y, sp.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    for (const dec of this.decorations) {
      if (dec.type === 'tree') {
        this.drawTree(ctx, dec);
      } else {
        this.drawBoulder(ctx, dec);
      }
    }

    // DRAW 5 HISTORICAL RELIC CHESTS
    if (this.chests) {
      for (const ch of this.chests) {
        this.drawTreasureChest(ctx, ch);
      }
    }

    for (const npc of this.npcs) {
      this.drawNPC(ctx, npc);
    }

    // DRAW OVERHEAD INTERACTION PROMPT FOR CLOSEST NPC OR CHEST
    this.drawOverheadInteractionPrompt(ctx);

    
    // --- DRAW LIVING WILDLIFE & PARTICLES ---
    // 1. Wind petals & Falling Pine Needles
    for (const p of this.windPetals) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      if (p.isPine) {
        // Slender pine needle shape
        ctx.ellipse(0, 0, p.size, 1.4, 0, 0, Math.PI * 2);
      } else {
        // Broad tropical leaf
        ctx.ellipse(0, 0, p.size, p.size * 0.45, 0, 0, Math.PI * 2);
      }
      ctx.fill();
      ctx.restore();
    }

    // 2. Fireflies (Glowing at dusk/night)
    for (const f of this.fireflies) {
      const pulse = 0.5 + Math.sin(f.phase * 2) * 0.4;
      ctx.fillStyle = `rgba(255, 235, 120, ${pulse})`;
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = `rgba(255, 200, 50, ${pulse * 0.3})`;
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.size * 2.8, 0, Math.PI * 2);
      ctx.fill();
    }

    // 3. Living Birds (Tropical Parrots 9-Frame Sprite Animation & Dynamic Shadow)
    for (const b of this.birds) {
      if (typeof birdSpriteController !== 'undefined' && birdSpriteController) {
        birdSpriteController.drawBird(ctx, b);
      } else {
        // Fallback procedural
        ctx.fillStyle = '#0984e3';
        ctx.beginPath();
        ctx.ellipse(b.x, b.y - (b.altitude || 0), 6, 3.5, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 4. Sonar expanding waves
    for (const sw of this.sonarWaves) {
      ctx.strokeStyle = `rgba(229, 193, 88, ${sw.alpha})`;
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
      ctx.stroke();
    }

    // 5. Golden footprint trail if Historical Vision is active
    if (this.visionModeActive) {
      const currentQuest = questManager ? questManager.quests[questManager.currentQuestIndex] : null;
      let target = null;
      if (currentQuest && currentQuest.targetNPC) {
        target = this.npcs.find(n => n.role === currentQuest.targetNPC || n.id === currentQuest.targetNPC);
      }
      if (target) {
        const steps = 14;
        ctx.fillStyle = 'rgba(255, 215, 0, 0.7)';
        for (let s = 1; s <= steps; s++) {
          const t = s / steps;
          const fx = this.player.x + (target.x - this.player.x) * t;
          const fy = this.player.y + (target.y - this.player.y) * t + Math.sin(s * 1.2 + Date.now()*0.005) * 8;
          ctx.beginPath();
          ctx.ellipse(fx, fy, 4.5, 2.5, s % 2 === 0 ? 0.3 : -0.3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // 6. Player Ghost After-images (Phantom Dash)
    for (const gh of this.playerGhosts) {
      ctx.fillStyle = `rgba(9, 132, 227, ${gh.alpha * 0.4})`;
      ctx.beginPath();
      ctx.arc(gh.x, gh.y, 14, 0, Math.PI * 2);
      ctx.fill();
    }

    this.drawPlayer(ctx);

    ctx.fillStyle = 'rgba(255, 230, 150, 0.55)';
    for (const p of this.particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }

    // Ambient Golden Exploration Dust Motes
    for (const mote of this.goldenDustMotes) {
      const glow = (0.35 + Math.sin(mote.phase) * 0.3) * mote.alpha;
      ctx.fillStyle = `rgba(255, 220, 110, ${glow})`;
      ctx.beginPath();
      ctx.arc(mote.x, mote.y, mote.size, 0, Math.PI * 2);
      ctx.fill();
    }

    // 7. DRAW KALA FLOATING COMPANION (PAIMON-STYLE)
    // Kala sparkles trail
    for (const sp of this.kalaCompanion.sparkles) {
      ctx.fillStyle = `rgba(255, 234, 167, ${sp.alpha})`;
      ctx.beginPath();
      ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
      ctx.fill();
    }
    // Kala body
    ctx.save();
    ctx.translate(this.kalaCompanion.x, this.kalaCompanion.y);
    // Golden glow
    ctx.fillStyle = 'rgba(255, 225, 100, 0.45)';
    ctx.beginPath();
    ctx.arc(0, 0, 16, 0, Math.PI * 2);
    ctx.fill();
    // Body & Wings
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(0, 4, 8, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    // Little floating golden wings
    ctx.fillStyle = 'rgba(229, 193, 88, 0.85)';
    ctx.beginPath();
    ctx.ellipse(-10, 0, 6, 3, -0.4, 0, Math.PI * 2);
    ctx.ellipse(10, 0, 6, 3, 0.4, 0, Math.PI * 2);
    ctx.fill();
    // Head
    ctx.fillStyle = '#ffeaa7';
    ctx.beginPath();
    ctx.arc(0, -6, 9, 0, Math.PI * 2);
    ctx.fill();
    // Little golden halo
    ctx.strokeStyle = '#e5c158';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.ellipse(0, -18, 8, 3, 0, 0, Math.PI * 2);
    ctx.stroke();
    // Cute eyes
    ctx.fillStyle = '#2c3e50';
    ctx.beginPath();
    ctx.arc(-3, -6, 1.3, 0, Math.PI * 2);
    ctx.arc(3, -6, 1.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 8. GENSHIN CURVED STAMINA BAR
    if (this.stamina < this.maxStamina) {
      const sx = this.player.x + 22;
      const sy = this.player.y - 12;
      ctx.lineWidth = 4;
      // Background ring
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.beginPath();
      ctx.arc(sx, sy, 14, -Math.PI / 2, Math.PI / 2);
      ctx.stroke();
      // Active stamina arc
      const staminaPct = this.stamina / this.maxStamina;
      ctx.strokeStyle = staminaPct > 0.25 ? '#2ecc71' : '#e74c3c';
      ctx.beginPath();
      ctx.arc(sx, sy, 14, -Math.PI / 2, -Math.PI / 2 + Math.PI * staminaPct);
      ctx.stroke();
    }

    // 9. AMBIENT OVERHEAD NPC CHATTER BUBBLE
    if (this.ambientBubble.timer > 0 && this.ambientBubble.npcId) {
      const npc = this.npcs.find(n => n.id === this.ambientBubble.npcId);
      if (npc) {
        ctx.fillStyle = 'rgba(16, 22, 34, 0.95)';
        ctx.strokeStyle = '#e5c158';
        ctx.lineWidth = 1.5;
        const bText = this.ambientBubble.text;
        ctx.font = 'bold 11px Plus Jakarta Sans';
        const textWidth = ctx.measureText(bText).width;
        ctx.beginPath();
        ctx.roundRect(npc.x - textWidth/2 - 12, npc.y - 70, textWidth + 24, 24, 8);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText(bText, npc.x, npc.y - 54);
      }
    }

    // 10. FLOATING NUMBERS (+100 EXP SEJARAH)
    for (const ft of this.floatingTexts) {
      ctx.fillStyle = ft.color;
      ctx.font = 'bold 13px Plus Jakarta Sans';
      ctx.textAlign = 'center';
      ctx.fillText(ft.text, ft.x, ft.y);
    }

    ctx.restore();

    this.drawAtmosphericEffects(ctx);
    this.drawMinimap();
  }

  drawAtmosphericEffects(ctx) {
    const w = this.canvas.width;
    const h = this.canvas.height;

    // 1. Time-of-Day Ambient Color Grading
    if (this.timeOfDay === 'pagi') {
      const dawnGrad = ctx.createLinearGradient(0, 0, w, h);
      dawnGrad.addColorStop(0, 'rgba(255, 215, 150, 0.12)');
      dawnGrad.addColorStop(1, 'rgba(255, 185, 90, 0.06)');
      ctx.fillStyle = dawnGrad;
      ctx.fillRect(0, 0, w, h);
    } else if (this.timeOfDay === 'senja') {
      const sunsetGrad = ctx.createLinearGradient(0, 0, w, h);
      sunsetGrad.addColorStop(0, 'rgba(255, 110, 50, 0.18)');
      sunsetGrad.addColorStop(0.5, 'rgba(180, 50, 80, 0.12)');
      sunsetGrad.addColorStop(1, 'rgba(60, 20, 80, 0.22)');
      ctx.fillStyle = sunsetGrad;
      ctx.fillRect(0, 0, w, h);
    } else if (this.timeOfDay === 'malam') {
      ctx.fillStyle = 'rgba(10, 16, 32, 0.48)';
      ctx.fillRect(0, 0, w, h);

      // Star twinkles
      const now = Date.now() * 0.002;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      for (let s = 0; s < 36; s++) {
        const sx = ((s * 137.5) % w);
        const sy = ((s * 93.7) % (h * 0.7));
        const twinkle = 0.3 + Math.sin(now + s * 1.5) * 0.3;
        ctx.beginPath();
        ctx.arc(sx, sy, 1.1 * twinkle + 0.7, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 2. Cinematic God Rays / Sunbeams (Active in Pagi, Siang, Senja)
    if (this.timeOfDay !== 'malam') {
      ctx.save();
      const time = Date.now() * 0.0006;
      const numRays = 5;
      for (let r = 0; r < numRays; r++) {
        const offset = Math.sin(time + r * 1.4) * 40;
        const rayGrad = ctx.createLinearGradient(w * 0.15 + r * 170 + offset, 0, w * 0.38 + r * 220 + offset, h);
        const rayAlpha = this.timeOfDay === 'siang' ? 0.07 : (this.timeOfDay === 'senja' ? 0.09 : 0.06);
        const rayColor = this.timeOfDay === 'senja' ? '255, 175, 90' : '255, 245, 185';
        rayGrad.addColorStop(0, `rgba(${rayColor}, ${rayAlpha})`);
        rayGrad.addColorStop(0.5, `rgba(${rayColor}, ${rayAlpha * 0.5})`);
        rayGrad.addColorStop(1, `rgba(${rayColor}, 0)`);

        ctx.fillStyle = rayGrad;
        ctx.beginPath();
        ctx.moveTo(w * 0.05 + r * 170 + offset, 0);
        ctx.lineTo(w * 0.2 + r * 170 + offset, 0);
        ctx.lineTo(w * 0.48 + r * 220 + offset, h);
        ctx.lineTo(w * 0.33 + r * 220 + offset, h);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
    }

    // 3. Cinematic Luxury Radial Vignette
    const vignette = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.42, w / 2, h / 2, Math.max(w, h) * 0.75);
    vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
    vignette.addColorStop(1, 'rgba(4, 7, 13, 0.44)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, w, h);
  }

  drawTerrain(ctx) {
    // 1. Lush Green World Base
    ctx.fillStyle = '#172d1a';
    ctx.fillRect(0, 0, MAP_WIDTH, MAP_HEIGHT);

    // Subtle grass patch variety
    ctx.fillStyle = '#1c351f';
    for (let gx = 80; gx < MAP_WIDTH; gx += 260) {
      for (let gy = 80; gy < MAP_HEIGHT; gy += 240) {
        ctx.beginPath();
        ctx.arc(gx + (gy % 100), gy, 45, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Zona 0: Lembah Megalitikum Prasejarah (Ancient weathered andesite courtyard)
    ctx.fillStyle = '#263228';
    ctx.beginPath();
    ctx.roundRect(100, 600, 520, 1000, 28);
    ctx.fill();
    ctx.strokeStyle = '#3e4f40';
    ctx.lineWidth = 10;
    ctx.stroke();
    // Inner ancient rune perimeter
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.22)';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(120, 620, 480, 960);

    // Zona 1: Den Haag & Royal Court (Neoclassical Imperial Marble Plaza)
    ctx.fillStyle = '#34404e';
    ctx.beginPath();
    ctx.roundRect(700, 140, 800, 540, 24);
    ctx.fill();
    // Dual gold trim border
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.strokeStyle = '#526375';
    ctx.lineWidth = 10;
    ctx.stroke();
    // Polished checkerboard tile paving
    ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
    for (let tx = 720; tx < 1480; tx += 60) {
      for (let ty = 160; ty < 660; ty += 60) {
        if ((tx + ty) % 120 === 0) {
          ctx.fillRect(tx, ty, 58, 58);
        }
      }
    }

    // Zona 2: Persawahan Irigasi Sidoarjo (Emerald Paddy Terraces)
    ctx.fillStyle = '#1f5326';
    ctx.beginPath();
    ctx.roundRect(700, 840, 820, 620, 24);
    ctx.fill();
    ctx.strokeStyle = '#2d7a36';
    ctx.lineWidth = 10;
    ctx.stroke();
    // Sawah ridges (Galengan Sawah) & Water channels
    ctx.strokeStyle = '#1b401f';
    ctx.lineWidth = 5;
    for (let ry = 880; ry < 1420; ry += 75) {
      ctx.beginPath();
      ctx.moveTo(720, ry);
      ctx.bezierCurveTo(950, ry + 12, 1200, ry - 10, 1500, ry + 8);
      ctx.stroke();
    }

    // Sungai Kali Brantas & Kanal Irigasi Kolonial
    const time = Date.now() * 0.002;
    // River embankment stone borders
    ctx.strokeStyle = '#4a5568';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(600, 1076);
    ctx.bezierCurveTo(900, 1036 + Math.sin(time)*5, 1200, 1136 + Math.cos(time)*5, 1540, 1096);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(600, 1144);
    ctx.bezierCurveTo(900, 1104 + Math.sin(time)*5, 1200, 1204 + Math.cos(time)*5, 1540, 1164);
    ctx.stroke();

    // Flowing Water Body
    ctx.fillStyle = '#1a6fd4';
    ctx.beginPath();
    ctx.moveTo(600, 1080);
    ctx.bezierCurveTo(900, 1040 + Math.sin(time)*5, 1200, 1140 + Math.cos(time)*5, 1540, 1100);
    ctx.lineTo(1540, 1160);
    ctx.bezierCurveTo(1200, 1200 + Math.cos(time)*5, 900, 1100 + Math.sin(time)*5, 600, 1140);
    ctx.closePath();
    ctx.fill();

    // Animated water ripples & sunlight glints
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.lineWidth = 2;
    for (let wx = 660; wx < 1500; wx += 120) {
      const wy = 1110 + Math.sin(time * 2 + wx * 0.02) * 18;
      ctx.beginPath();
      ctx.moveTo(wx, wy);
      ctx.lineTo(wx + 35, wy);
      ctx.stroke();
    }

    // Zona 3: Kampus Kedokteran STOVIA (Colonial Courtyard)
    ctx.fillStyle = '#39332e';
    ctx.beginPath();
    ctx.roundRect(2000, 140, 1020, 560, 24);
    ctx.fill();
    ctx.strokeStyle = '#5a514b';
    ctx.lineWidth = 10;
    ctx.stroke();
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.3)';
    ctx.lineWidth = 2;
    ctx.strokeRect(2020, 160, 980, 520);

    // Zona 4: Pelabuhan & Emigrasi Deli Sumatra (Dark Timber Dock & Coastal Edge)
    ctx.fillStyle = '#2c3e50';
    ctx.beginPath();
    ctx.roundRect(2000, 840, 1020, 620, 24);
    ctx.fill();
    ctx.strokeStyle = '#3e5871';
    ctx.lineWidth = 10;
    ctx.stroke();
    // Dock timber plank texture
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.lineWidth = 2;
    for (let px = 2020; px < 3000; px += 28) {
      ctx.beginPath();
      ctx.moveTo(px, 860);
      ctx.lineTo(px, 1440);
      ctx.stroke();
    }

    // Zona 5: Central Plaza Budi Utomo & Tugu 1908
    ctx.fillStyle = '#5c391b';
    ctx.beginPath();
    ctx.roundRect(1540, 580, 420, 520, 24);
    ctx.fill();
    // 24K Royal Gold Trim Border
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 6;
    ctx.stroke();
    ctx.strokeStyle = 'rgba(255, 235, 150, 0.4)';
    ctx.lineWidth = 2;
    ctx.strokeRect(1555, 595, 390, 490);

    // Stone Paved Walkways connecting zones
    ctx.fillStyle = '#4a4d52';
    // Walkway Den Haag -> Central
    ctx.fillRect(600, 376, 940, 44);
    // Walkway Central -> STOVIA
    ctx.fillRect(1500, 376, 520, 44);
    // Walkway Central -> Deli
    ctx.fillRect(1500, 1096, 520, 44);
    // Walkway Central Plaza North-South
    ctx.fillRect(1728, 420, 44, 160);

    // Cobblestone paver lines & edges
    ctx.strokeStyle = '#61656b';
    ctx.lineWidth = 2;
    ctx.strokeRect(600, 376, 940, 44);
    ctx.strokeRect(1500, 376, 520, 44);
    ctx.strokeRect(1500, 1096, 520, 44);
    ctx.strokeRect(1728, 420, 44, 160);
  }

  // Peninggalan Prasejarah Megalitikum
  drawPrehistoricRelics(ctx) {
    const pulse = 0.65 + Math.sin(Date.now() * 0.003) * 0.35;

    // 1. MENHIR MEGALITIKUM (Batu Tegak Prasejarah)
    const mx = 350, my = 820;

    // Ancestral Spiritual Golden Glow Pool
    const runeGlow = ctx.createRadialGradient(mx, my - 25, 10, mx, my - 25, 95);
    runeGlow.addColorStop(0, `rgba(243, 156, 18, ${pulse * 0.35})`);
    runeGlow.addColorStop(1, 'rgba(243, 156, 18, 0)');
    ctx.fillStyle = runeGlow;
    ctx.beginPath();
    ctx.arc(mx, my - 25, 95, 0, Math.PI * 2);
    ctx.fill();

    // Andesite stone plinth platform
    ctx.fillStyle = '#3a4445';
    ctx.beginPath();
    ctx.ellipse(mx, my + 38, 54, 20, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#4f5d5e';
    ctx.beginPath();
    ctx.ellipse(mx, my + 34, 46, 16, 0, 0, Math.PI * 2);
    ctx.fill();

    // Towering Menhir Monolith (3D Faceted granite stone)
    // Left shadow facet
    ctx.fillStyle = '#516062';
    ctx.beginPath();
    ctx.moveTo(mx - 22, my + 32);
    ctx.lineTo(mx - 15, my - 65);
    ctx.lineTo(mx, my - 100);
    ctx.lineTo(mx, my + 34);
    ctx.closePath();
    ctx.fill();

    // Right highlight facet
    ctx.fillStyle = '#7a8d8f';
    ctx.beginPath();
    ctx.moveTo(mx, my - 100);
    ctx.lineTo(mx + 16, my - 65);
    ctx.lineTo(mx + 22, my + 32);
    ctx.lineTo(mx, my + 34);
    ctx.closePath();
    ctx.fill();

    // Weathered stone bevel outline
    ctx.strokeStyle = '#95a5a6';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(mx - 22, my + 32);
    ctx.lineTo(mx - 15, my - 65);
    ctx.lineTo(mx, my - 100);
    ctx.lineTo(mx + 16, my - 65);
    ctx.lineTo(mx + 22, my + 32);
    ctx.closePath();
    ctx.stroke();

    // Creeping ancient moss on stone base
    ctx.fillStyle = '#27ae60';
    ctx.beginPath();
    ctx.arc(mx - 16, my + 26, 7, 0, Math.PI * 2);
    ctx.arc(mx + 14, my + 28, 8, 0, Math.PI * 2);
    ctx.arc(mx - 6, my + 30, 9, 0, Math.PI * 2);
    ctx.fill();

    // Glowing Golden Petroglyph Runes on Menhir
    ctx.save();
    ctx.strokeStyle = `rgba(255, 215, 0, ${pulse})`;
    ctx.fillStyle = `rgba(255, 215, 0, ${pulse})`;
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    // Spiral Sun Rune
    ctx.beginPath();
    ctx.arc(mx, my - 55, 9, 0, Math.PI * 1.6);
    ctx.stroke();
    // Ancestor Spirit Rune
    ctx.beginPath();
    ctx.moveTo(mx, my - 38); ctx.lineTo(mx, my - 12);
    ctx.moveTo(mx - 7, my - 28); ctx.lineTo(mx + 7, my - 28);
    ctx.moveTo(mx - 6, my - 14); ctx.lineTo(mx + 6, my - 14);
    ctx.stroke();
    // Glowing eye dot
    ctx.beginPath();
    ctx.arc(mx, my - 55, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // DOLMEN BATU (Meja Persembahan Megalitikum)
    // 4 upright megalith pillars
    ctx.fillStyle = '#4b5758';
    ctx.fillRect(mx - 58, my + 14, 16, 28);
    ctx.fillRect(mx - 24, my + 18, 14, 24);
    ctx.fillRect(mx + 12, my + 18, 14, 24);
    ctx.fillRect(mx + 42, my + 14, 16, 28);

    // Thick horizontal altar capstone slab with 3D depth
    ctx.fillStyle = '#3a4445';
    ctx.beginPath();
    ctx.ellipse(mx, my + 20, 68, 16, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#6e7e80';
    ctx.beginPath();
    ctx.ellipse(mx, my + 15, 68, 15, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#8d9fa1';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Ritual Bronze Offering Bowl with Glowing Embers
    ctx.fillStyle = '#d4af37';
    ctx.beginPath();
    ctx.ellipse(mx, my + 12, 14, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = `rgba(231, 76, 60, ${pulse})`;
    ctx.beginPath();
    ctx.arc(mx, my + 10, 5, 0, Math.PI * 2);
    ctx.fill();

    // Gilded Signboard with Drop Shadow
    ctx.fillStyle = 'rgba(12, 18, 28, 0.85)';
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(mx - 120, my - 125, 240, 22, 6);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#f1c40f';
    ctx.font = 'bold 11px Cinzel';
    ctx.textAlign = 'center';
    ctx.fillText('✦ MENHIR & DOLMEN PRASEJARAH ✦', mx, my - 110);


    // 2. PUNDEN BERUNDAK & SARKOFAGUS BATU (x: 350, y: 1350)
    const px = 350, py = 1350;

    // Stepped Ceremonial Pyramid Terraces (4 Tiers)
    const tiers = [
      { w: 240, h: 22, y: 30, color: '#3d4849', border: '#4f5d5e' },
      { w: 190, h: 20, y: 10, color: '#4b5859', border: '#5c6b6c' },
      { w: 140, h: 18, y: -8, color: '#5a696a', border: '#6c7c7d' },
      { w: 90, h: 16, y: -24, color: '#68797a', border: '#7b8c8d' }
    ];
    for (const t of tiers) {
      ctx.fillStyle = t.color;
      ctx.beginPath();
      ctx.roundRect(px - t.w / 2, py + t.y, t.w, t.h, 4);
      ctx.fill();
      ctx.strokeStyle = t.border;
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Central Stone Staircase
    ctx.fillStyle = '#2f3839';
    ctx.fillRect(px - 14, py - 24, 28, 76);
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 1;
    for (let st = -24; st < 52; st += 12) {
      ctx.beginPath();
      ctx.moveTo(px - 14, py + st);
      ctx.lineTo(px + 14, py + st);
      ctx.stroke();
    }

    // Stone Sarcophagus on Summit Platform
    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.beginPath();
    ctx.ellipse(px, py - 40, 36, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    // Coffin Chest
    ctx.fillStyle = '#8395a7';
    ctx.beginPath();
    ctx.roundRect(px - 32, py - 58, 64, 22, 6);
    ctx.fill();
    ctx.strokeStyle = '#576574';
    ctx.lineWidth = 2;
    ctx.stroke();
    // Carved Lizard/Ancestor Totem Relief on Sarcophagus lid
    ctx.fillStyle = '#a4b0be';
    ctx.beginPath();
    ctx.roundRect(px - 35, py - 64, 70, 8, 4);
    ctx.fill();
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 1.2;
    ctx.stroke();
    // Glowing eye of the totem
    ctx.fillStyle = `rgba(241, 196, 15, ${pulse})`;
    ctx.beginPath();
    ctx.arc(px, py - 60, 2, 0, Math.PI * 2);
    ctx.fill();

    // Flanking Ceremonial Megalithic Torches
    [-55, 55].forEach(ox => {
      ctx.fillStyle = '#2c3e50';
      ctx.fillRect(px + ox - 3, py - 42, 6, 24);
      // Flame
      ctx.fillStyle = `rgba(230, 126, 34, ${pulse})`;
      ctx.beginPath();
      ctx.arc(px + ox, py - 46, 5 + Math.random() * 2, 0, Math.PI * 2);
      ctx.fill();
    });

    // Gilded Signboard
    ctx.fillStyle = 'rgba(12, 18, 28, 0.85)';
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(px - 130, py - 95, 260, 22, 6);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#f1c40f';
    ctx.font = 'bold 11px Cinzel';
    ctx.textAlign = 'center';
    ctx.fillText('✦ PUNDEN BERUNDAK & SARKOFAGUS ✦', px, py - 80);
  }

  drawRealisticWavingFlag(ctx, poleX, poleY, poleHeight = 130, flagWidth = 42, flagHeight = 28, fDir = 1) {
    const now = Date.now();

    // 1. Gilded Brass Flagpole with metallic gradient
    const poleGrad = ctx.createLinearGradient(poleX - 2, 0, poleX + 2, 0);
    poleGrad.addColorStop(0, '#f1c40f');
    poleGrad.addColorStop(0.35, '#ffeaa7');
    poleGrad.addColorStop(0.75, '#d4af37');
    poleGrad.addColorStop(1, '#99801a');
    ctx.fillStyle = poleGrad;
    ctx.fillRect(poleX - 2, poleY - poleHeight, 4, poleHeight);

    // Golden Finial Sphere on top
    ctx.fillStyle = '#f39c12';
    ctx.beginPath();
    ctx.arc(poleX, poleY - poleHeight, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(poleX - 1.2, poleY - poleHeight - 1.2, 1.6, 0, Math.PI * 2);
    ctx.fill();

    // Halyard Rigging Cord (White rope along the pole)
    ctx.strokeStyle = 'rgba(240, 240, 240, 0.65)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(poleX + (fDir > 0 ? -2 : 2), poleY - poleHeight + 4);
    ctx.lineTo(poleX + (fDir > 0 ? -2 : 2), poleY);
    ctx.stroke();

    // 2. Realistic Physics-Based Silk Waving Cloth
    // Sliced into 1.5px vertical strips for ultra-smooth fluid sine waves & natural folds
    const stepSize = 1.5;
    const stripeH = flagHeight / 3;
    const topY = poleY - poleHeight + 5;

    for (let d = 0; d < flagWidth; d += stepSize) {
      // Natural wind wave equations:
      // Distance factor (anchor is fixed at 0, wave billows outwards toward the fly end)
      const distFactor = Math.pow(d / flagWidth, 1.2);

      // Primary rolling wind wave + secondary rapid flutter
      const wave1 = Math.sin((d * 0.18) - (now * 0.0065)) * 4.6 * distFactor;
      const wave2 = Math.sin((d * 0.38) - (now * 0.012)) * 2.2 * distFactor;
      const wave3 = Math.cos((d * 0.09) - (now * 0.0035)) * 1.5 * distFactor;

      // Edge flutter at fly end
      const tipFactor = Math.max(0, (d - flagWidth * 0.65) / (flagWidth * 0.35));
      const tipFlutter = Math.sin((d * 0.85) - (now * 0.024)) * 3.2 * tipFactor;

      const yOffset = wave1 + wave2 + wave3 + tipFlutter;

      // Wave slope for dynamic lighting & crease shadows
      const nextWave = Math.sin(((d + 2) * 0.18) - (now * 0.0065)) * 4.6 * distFactor;
      const slope = nextWave - wave1;

      const sliceX = poleX + (d * fDir);
      const sliceW = stepSize * fDir;
      const currentY = topY + yOffset;

      // Dutch Tricolor Bands
      // 1. Red Stripe (Vermilion Red)
      ctx.fillStyle = '#b32428';
      ctx.fillRect(sliceX, currentY, sliceW, stripeH);

      // 2. White Stripe (Silk Silver White)
      ctx.fillStyle = '#f8f9fa';
      ctx.fillRect(sliceX, currentY + stripeH, sliceW, stripeH);

      // 3. Cobalt Blue Stripe (Deep Dutch Navy)
      ctx.fillStyle = '#1e3799';
      ctx.fillRect(sliceX, currentY + (stripeH * 2), sliceW, stripeH);

      // Dynamic Shading: Sunlight highlights on wave crests, dark silk shadows in troughs
      if (slope > 0.04) {
        // Wave Crest Highlight
        const alpha = Math.min(0.35, slope * 0.22);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fillRect(sliceX, currentY, sliceW, flagHeight);
      } else if (slope < -0.04) {
        // Wave Trough Crease Shadow
        const alpha = Math.min(0.42, -slope * 0.26);
        ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
        ctx.fillRect(sliceX, currentY, sliceW, flagHeight);
      }
    }

    // Brass Grommets / Rings connecting cloth to pole
    ctx.fillStyle = '#e5c158';
    ctx.beginPath();
    ctx.arc(poleX + (fDir > 0 ? 1 : -1), topY + 2, 2, 0, Math.PI * 2);
    ctx.arc(poleX + (fDir > 0 ? 1 : -1), topY + flagHeight - 2, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  drawLandmarks(ctx) {
    // 1. NEOCLASSICAL PALACE & PARLEMEN DEN HAAG (Pencetus Politik Etis 1899)
    const kx = 1140, ky = 240;

    // Shadow on marble court
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.ellipse(kx, ky + 25, 175, 45, 0, 0, Math.PI * 2);
    ctx.fill();

    // Palace Building Base Plinth (Stepped Foundation)
    ctx.fillStyle = '#d5dbdb';
    ctx.fillRect(kx - 165, ky - 10, 330, 32);
    ctx.fillStyle = '#bdc3c7';
    ctx.fillRect(kx - 155, ky + 8, 310, 14);

    // Main Portico Wall (Neoclassical White Ashlar Marble)
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(kx - 150, ky - 75, 300, 70);

    // Arched Double Palace Doors (Mahogany & Gold)
    ctx.fillStyle = '#4a2311';
    ctx.beginPath();
    ctx.roundRect(kx - 24, ky - 55, 48, 55, [16, 16, 0, 0]);
    ctx.fill();
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 2;
    ctx.stroke();
    // Brass door handles
    ctx.fillStyle = '#d4af37';
    ctx.beginPath();
    ctx.arc(kx - 6, ky - 25, 3, 0, Math.PI * 2);
    ctx.arc(kx + 6, ky - 25, 3, 0, Math.PI * 2);
    ctx.fill();

    // Royal Red Velvet Carpet Runner with Gold Tassels leading to Wilhelmina
    const carpetGrad = ctx.createLinearGradient(kx, ky - 70, kx, ky + 45);
    carpetGrad.addColorStop(0, '#800020');
    carpetGrad.addColorStop(0.6, '#b71540');
    carpetGrad.addColorStop(1, '#9b111e');
    ctx.fillStyle = carpetGrad;
    ctx.fillRect(kx - 20, ky - 48, 40, 92);
    // Gold braided borders
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(kx - 20, ky - 48); ctx.lineTo(kx - 20, ky + 44);
    ctx.moveTo(kx + 20, ky - 48); ctx.lineTo(kx + 20, ky + 44);
    ctx.stroke();

    // Queen Wilhelmina's Gilded Royal Throne (at kx, ky - 52)
    ctx.fillStyle = '#d4af37';
    ctx.fillRect(kx - 14, ky - 58, 28, 22);
    ctx.fillStyle = '#c0392b';
    ctx.fillRect(kx - 10, ky - 56, 20, 18);
    // Throne Crown Crest
    ctx.fillStyle = '#f1c40f';
    ctx.beginPath();
    ctx.moveTo(kx, ky - 66);
    ctx.lineTo(kx - 8, ky - 58);
    ctx.lineTo(kx + 8, ky - 58);
    ctx.closePath();
    ctx.fill();

    // 6 Monumental Fluted Ionic Marble Columns
    const colX = [-135, -85, -38, 38, 85, 135];
    for (const cx of colX) {
      // Column Base
      ctx.fillStyle = '#95a5a6';
      ctx.fillRect(kx + cx - 9, ky - 10, 18, 6);
      // Shaft with fluting
      const colGrad = ctx.createLinearGradient(kx + cx - 7, 0, kx + cx + 7, 0);
      colGrad.addColorStop(0, '#bdc3c7');
      colGrad.addColorStop(0.5, '#ffffff');
      colGrad.addColorStop(1, '#7f8c8d');
      ctx.fillStyle = colGrad;
      ctx.fillRect(kx + cx - 7, ky - 72, 14, 62);
      // Gilded Ionic Capital
      ctx.fillStyle = '#d4af37';
      ctx.fillRect(kx + cx - 10, ky - 77, 20, 6);
      ctx.beginPath();
      ctx.arc(kx + cx - 8, ky - 74, 3.5, 0, Math.PI * 2);
      ctx.arc(kx + cx + 8, ky - 74, 3.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Classical Entablature & Frieze
    ctx.fillStyle = '#ecf0f1';
    ctx.fillRect(kx - 160, ky - 86, 320, 11);
    ctx.fillStyle = '#d4af37';
    ctx.fillRect(kx - 158, ky - 80, 316, 3);

    // Grand Triangular Pediment with 24K Gold Trim
    ctx.fillStyle = '#f5f6fa';
    ctx.beginPath();
    ctx.moveTo(kx, ky - 138);
    ctx.lineTo(kx - 165, ky - 86);
    ctx.lineTo(kx + 165, ky - 86);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Royal Dutch Coat of Arms (Koninkrijk der Nederlanden) inside pediment
    ctx.fillStyle = '#0984e3';
    ctx.beginPath();
    ctx.roundRect(kx - 18, ky - 118, 36, 24, [4, 4, 12, 12]);
    ctx.fill();
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 2;
    ctx.stroke();
    // Rampant Gold Lion & Crown
    ctx.fillStyle = '#f1c40f';
    ctx.beginPath();
    ctx.arc(kx, ky - 110, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(kx, ky - 124);
    ctx.lineTo(kx - 6, ky - 118);
    ctx.lineTo(kx + 6, ky - 118);
    ctx.closePath();
    ctx.fill();

    // Flanking Realistic Waving Dutch Tricolor silk flags
    [-172, 172].forEach((fx, idx) => {
      this.drawRealisticWavingFlag(ctx, kx + fx, ky - 5, 130, 44, 28, idx === 0 ? -1 : 1);
    });

    // Gilded Historical Nameplate Sign
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(kx - 135, ky - 36, 270, 22, 6);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#f1c40f';
    ctx.font = 'bold 11px Cinzel';
    ctx.textAlign = 'center';
    ctx.fillText('✦ EEN EERESCHULD 1899 - DEN HAAG ✦', kx, ky - 21);


    // 2. BENDUNGAN KALI BRANTAS & PINTU AIR IRIGASI
    const dx = 880, dy = 1030;

    // Masonry Gravity Dam Wall (Cut Andesite Stone)
    const damGrad = ctx.createLinearGradient(dx - 80, 0, dx + 80, 0);
    damGrad.addColorStop(0, '#576574');
    damGrad.addColorStop(0.5, '#8395a7');
    damGrad.addColorStop(1, '#47535e');
    ctx.fillStyle = damGrad;
    ctx.fillRect(dx - 75, dy - 45, 150, 95);
    ctx.strokeStyle = '#2c3e50';
    ctx.lineWidth = 3;
    ctx.strokeRect(dx - 75, dy - 45, 150, 95);

    // Stone block mortar lines
    ctx.strokeStyle = '#34495e';
    ctx.lineWidth = 1.2;
    for (let by = dy - 45; by < dy + 45; by += 16) {
      ctx.beginPath();
      ctx.moveTo(dx - 75, by); ctx.lineTo(dx + 75, by);
      ctx.stroke();
    }

    // Heavy Iron Sluice Gate Tower
    ctx.fillStyle = '#2d3436';
    ctx.fillRect(dx - 30, dy - 65, 60, 26);
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(dx - 30, dy - 65, 60, 26);

    // Iron Hoisting Gear Wheels & Chains
    ctx.fillStyle = '#636e72';
    ctx.beginPath();
    ctx.arc(dx - 14, dy - 52, 7, 0, Math.PI * 2);
    ctx.arc(dx + 14, dy - 52, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Cascading Foaming Water Torrent through Sluice Gate
    const wTorrent = ctx.createLinearGradient(0, dy - 15, 0, dy + 55);
    wTorrent.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
    wTorrent.addColorStop(0.5, 'rgba(174, 214, 241, 0.9)');
    wTorrent.addColorStop(1, 'rgba(52, 152, 219, 0.85)');
    ctx.fillStyle = wTorrent;
    ctx.fillRect(dx - 22, dy - 15, 44, 70);

    // Churning White Foam Rapids at base
    ctx.fillStyle = '#ffffff';
    for (let f = -20; f < 22; f += 8) {
      ctx.beginPath();
      ctx.arc(dx + f, dy + 52 + Math.sin(Date.now() * 0.01 + f) * 4, 6, 0, Math.PI * 2);
      ctx.fill();
    }

    // Realistic Rotating Brass-Reinforced Teak Waterwheel (wx: 840, wy: 1100)
    const wx = dx - 40, wy = dy + 70;
    ctx.save();
    ctx.translate(wx, wy);
    ctx.rotate(this.waterWheelAngle);

    // Outer Timber Wheel Rim
    ctx.strokeStyle = '#4a2e18';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(0, 0, 32, 0, Math.PI * 2);
    ctx.stroke();

    // Brass Reinforcing Ring
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, 29, 0, Math.PI * 2);
    ctx.stroke();

    // 12 Spokes with Bucket Scoops
    for (let sp = 0; sp < 12; sp++) {
      const a = (sp * Math.PI) / 6;
      ctx.strokeStyle = '#5d4037';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(a) * 32, Math.sin(a) * 32);
      ctx.stroke();

      // Scoop paddle bucket
      ctx.fillStyle = '#8d6e63';
      ctx.fillRect(Math.cos(a) * 28 - 3, Math.sin(a) * 28 - 3, 6, 6);
    }

    // Heavy Polished Brass Center Hub
    ctx.fillStyle = '#d4af37';
    ctx.beginPath();
    ctx.arc(0, 0, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#2c3e50';
    ctx.beginPath();
    ctx.arc(0, 0, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Gilded Dam Signboard
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(dx - 130, dy - 88, 260, 22, 6);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#f1c40f';
    ctx.font = 'bold 11px Cinzel';
    ctx.textAlign = 'center';
    ctx.fillText('✦ BENDUNGAN BRANTAS & IRIGASI ETIS ✦', dx, dy - 73);


    // 3. KAMPUS KEDOKTERAN STOVIA BATAVIA 1902
    const sx = 2500, sy = 240;

    // Building Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.ellipse(sx, sy + 36, 195, 40, 0, 0, Math.PI * 2);
    ctx.fill();

    // Terracotta Mansard Roof
    ctx.fillStyle = '#b33927';
    ctx.beginPath();
    ctx.moveTo(sx, sy - 132);
    ctx.lineTo(sx - 195, sy - 65);
    ctx.lineTo(sx + 195, sy - 65);
    ctx.closePath();
    ctx.fill();
    // Decorative Roof Ridge Cresting
    ctx.strokeStyle = '#2c3e50';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Stately Central Dutch Colonial Flagpole on STOVIA Roof Ridge
    this.drawRealisticWavingFlag(ctx, sx, sy - 132, 48, 38, 24, 1);

    // Neoclassical Facade Body (White Ashlar Plaster)
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(sx - 185, sy - 65, 370, 95);
    ctx.strokeStyle = '#ced6e0';
    ctx.lineWidth = 2;
    ctx.strokeRect(sx - 185, sy - 65, 370, 95);

    // Rusticated Stone Base Foundation
    ctx.fillStyle = '#747d8c';
    ctx.fillRect(sx - 190, sy + 18, 380, 16);

    // Central Colonnaded Portico
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(sx - 70, sy - 65, 140, 85);
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 2;
    ctx.strokeRect(sx - 70, sy - 65, 140, 85);

    // Central Triangular Pediment with Rod of Asclepius (Symbol of Medicine)
    ctx.fillStyle = '#ecf0f1';
    ctx.beginPath();
    ctx.moveTo(sx, sy - 105);
    ctx.lineTo(sx - 75, sy - 65);
    ctx.lineTo(sx + 75, sy - 65);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Medical Caduceus / Rod of Asclepius & Clock inside pediment
    ctx.fillStyle = '#d4af37';
    ctx.beginPath();
    ctx.arc(sx, sy - 82, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#1e272e';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(sx, sy - 82); ctx.lineTo(sx, sy - 87);
    ctx.moveTo(sx, sy - 82); ctx.lineTo(sx + 4, sy - 82);
    ctx.stroke();

    // 8 Grand Colonial Louvered Windows (Krepyak Jendela Hijau Kolonial)
    const winX = [-160, -125, -92, -36, 36, 92, 125, 160];
    for (const wx of winX) {
      if (Math.abs(wx) < 40) {
        // Arched Double Main Entrance
        ctx.fillStyle = '#4a2711';
        ctx.beginPath();
        ctx.roundRect(sx + wx - 14, sy - 28, 28, 46, [14, 14, 0, 0]);
        ctx.fill();
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      } else {
        // Colonial Louvered Windows with green shutters
        ctx.fillStyle = '#1e3799';
        ctx.beginPath();
        ctx.roundRect(sx + wx - 10, sy - 42, 20, 36, [10, 10, 0, 0]);
        ctx.fill();
        // Green krepyak louvers
        ctx.fillStyle = '#1b5e20';
        ctx.fillRect(sx + wx - 13, sy - 42, 5, 36);
        ctx.fillRect(sx + wx + 8, sy - 42, 5, 36);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.strokeRect(sx + wx - 10, sy - 42, 20, 36);
      }
    }

    // Colonial Wrought-Iron Street Gas Lanterns with Glowing Light Cones
    [-175, 175].forEach(lx => {
      // Cast-iron pole
      ctx.fillStyle = '#2c3e50';
      ctx.fillRect(sx + lx - 2, sy - 30, 4, 50);
      ctx.fillRect(sx + lx - 6, sy - 35, 12, 6);
      // Glowing Amber Lantern Glass
      ctx.fillStyle = '#f39c12';
      ctx.beginPath();
      ctx.arc(sx + lx, sy - 38, 6, 0, Math.PI * 2);
      ctx.fill();
      // Soft Radial Light Halo
      const lanternGlow = ctx.createRadialGradient(sx + lx, sy - 38, 2, sx + lx, sy - 38, 38);
      lanternGlow.addColorStop(0, 'rgba(255, 200, 80, 0.45)');
      lanternGlow.addColorStop(1, 'rgba(255, 200, 80, 0)');
      ctx.fillStyle = lanternGlow;
      ctx.beginPath();
      ctx.arc(sx + lx, sy - 38, 38, 0, Math.PI * 2);
      ctx.fill();
    });

    // Grand Gilded STOVIA Nameplate Sign
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(sx - 150, sy - 8, 300, 22, 6);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#f1c40f';
    ctx.font = 'bold 11px Cinzel';
    ctx.textAlign = 'center';
    ctx.fillText('✦ KAMPUS KEDOKTERAN STOVIA 1902 ✦', sx, sy + 7);


    // 4. STASIUN KERETA & PELABUHAN DELI SUMATRA 1886
    const tx = 2600, ty = 1000;

    // Distant Ocean Horizon & Colonial Steamship Silhouette (Stoomboot)
    ctx.fillStyle = '#1e3799';
    ctx.fillRect(tx - 240, ty - 140, 480, 50);
    // Ocean horizon wave line
    ctx.strokeStyle = '#4a69bd';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(tx - 240, ty - 90); ctx.lineTo(tx + 240, ty - 90);
    ctx.stroke();

    // Distant Colonial Steamship on Horizon (tx + 110, ty - 110)
    ctx.fillStyle = '#2c3e50';
    // Hull
    ctx.beginPath();
    ctx.moveTo(tx + 60, ty - 100);
    ctx.lineTo(tx + 160, ty - 100);
    ctx.lineTo(tx + 145, ty - 92);
    ctx.lineTo(tx + 75, ty - 92);
    ctx.closePath();
    ctx.fill();
    // Funnel / Smokestack
    ctx.fillStyle = '#c0392b';
    ctx.fillRect(tx + 105, ty - 114, 10, 14);
    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(tx + 105, ty - 118, 10, 4);
    // Twin Masts
    ctx.strokeStyle = '#34495e';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(tx + 85, ty - 122); ctx.lineTo(tx + 85, ty - 100);
    ctx.moveTo(tx + 130, ty - 122); ctx.lineTo(tx + 130, ty - 100);
    ctx.stroke();

    // Heavy Timber Wharf Decking
    ctx.fillStyle = '#3e2723';
    ctx.fillRect(tx - 220, ty - 85, 440, 155);
    ctx.strokeStyle = '#271510';
    ctx.lineWidth = 1.5;
    for (let wy = ty - 85; wy < ty + 70; wy += 18) {
      ctx.beginPath();
      ctx.moveTo(tx - 220, wy); ctx.lineTo(tx + 220, wy);
      ctx.stroke();
    }

    // Heavy Iron Railway Tracks & Wooden Ties
    const railY1 = ty + 38, railY2 = ty + 56;
    // Wooden cross-ties
    ctx.fillStyle = '#2e1c12';
    for (let rx = tx - 210; rx < tx + 210; rx += 14) {
      ctx.fillRect(rx, railY1 - 5, 7, 28);
    }
    // Polished steel rails with shine
    ctx.strokeStyle = '#95a5a6';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(tx - 220, railY1); ctx.lineTo(tx + 220, railY1);
    ctx.moveTo(tx - 220, railY2); ctx.lineTo(tx + 220, railY2);
    ctx.stroke();
    ctx.strokeStyle = '#ecf0f1';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(tx - 220, railY1 - 1); ctx.lineTo(tx + 220, railY1 - 1);
    ctx.moveTo(tx - 220, railY2 - 1); ctx.lineTo(tx + 220, railY2 - 1);
    ctx.stroke();

    // Colonial Steam Locomotive Engine (Deli Spoorweg Maatschappij)
    const lx = tx - 70, ly = ty + 30;
    // Driver Cabin
    ctx.fillStyle = '#2d3436';
    ctx.fillRect(lx - 45, ly - 42, 40, 42);
    ctx.fillStyle = '#0984e3';
    ctx.fillRect(lx - 38, ly - 34, 12, 12);
    // Cylindrical Black Steel Boiler
    const boilGrad = ctx.createLinearGradient(0, ly - 36, 0, ly);
    boilGrad.addColorStop(0, '#636e72');
    boilGrad.addColorStop(0.5, '#2d3436');
    boilGrad.addColorStop(1, '#1e272e');
    ctx.fillStyle = boilGrad;
    ctx.fillRect(lx - 5, ly - 34, 75, 34);

    // Polished Brass Boiler Rings
    ctx.fillStyle = '#d4af37';
    ctx.fillRect(lx + 10, ly - 35, 4, 35);
    ctx.fillRect(lx + 32, ly - 35, 4, 35);
    ctx.fillRect(lx + 54, ly - 35, 4, 35);

    // Brass Steam Dome & Bell
    ctx.beginPath();
    ctx.ellipse(lx + 20, ly - 36, 6, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Smokestack (Spawning steam)
    ctx.fillStyle = '#1e272e';
    ctx.fillRect(lx + 56, ly - 48, 12, 16);
    ctx.fillStyle = '#d4af37';
    ctx.fillRect(lx + 54, ly - 50, 16, 4);

    // Front Cowcatcher Grill
    ctx.fillStyle = '#d63031';
    ctx.beginPath();
    ctx.moveTo(lx + 70, ly);
    ctx.lineTo(lx + 86, ly);
    ctx.lineTo(lx + 70, ly - 16);
    ctx.closePath();
    ctx.fill();

    // Heavy Iron Drive Wheels with Connecting Rods
    for (let wx = lx - 30; wx <= lx + 50; wx += 26) {
      ctx.fillStyle = '#1e272e';
      ctx.beginPath();
      ctx.arc(wx, ly + 8, 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    // Drive Rod
    ctx.strokeStyle = '#bdc3c7';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(lx - 30, ly + 8); ctx.lineTo(lx + 50, ly + 8);
    ctx.stroke();

    // Stacked Cargo Crates with Stenciled Branding ("TABAK DELI")
    ctx.fillStyle = '#8d6e63';
    ctx.fillRect(tx + 60, ty - 40, 42, 34);
    ctx.fillRect(tx + 106, ty - 32, 36, 26);
    ctx.fillRect(tx + 75, ty - 68, 35, 30);
    ctx.strokeStyle = '#5d4037';
    ctx.lineWidth = 2;
    ctx.strokeRect(tx + 60, ty - 40, 42, 34);
    ctx.strokeRect(tx + 106, ty - 32, 36, 26);
    ctx.strokeRect(tx + 75, ty - 68, 35, 30);
    // Stenciled text on crate
    ctx.fillStyle = '#3e2723';
    ctx.font = 'bold 7px sans-serif';
    ctx.fillText('DELI TABAK', tx + 81, ty - 22);
    ctx.fillText('1886', tx + 92, ty - 52);

    // Jute Burlap Coffee / Spices Sacks
    ctx.fillStyle = '#d7ccc8';
    ctx.beginPath();
    ctx.ellipse(tx + 155, ty - 18, 14, 9, 0.2, 0, Math.PI * 2);
    ctx.ellipse(tx + 172, ty - 16, 12, 8, -0.2, 0, Math.PI * 2);
    ctx.ellipse(tx + 162, ty - 28, 11, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    // Gilded Station & Port Sign
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(tx - 145, ty - 80, 290, 22, 6);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#f1c40f';
    ctx.font = 'bold 11px Cinzel';
    ctx.textAlign = 'center';
    ctx.fillText('✦ STASIUN SPOORWEG & KULI DELI 1886 ✦', tx, ty - 65);


    // 5. AULA BUDI UTOMO (Javanese Grand Pendopo Joglo Architecture)
    const bx = 1750, by = 640;

    // Pavilion Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.ellipse(bx, by + 30, 160, 42, 0, 0, Math.PI * 2);
    ctx.fill();

    // Traditional Terracotta Floor with Batik Rosette Mandala
    ctx.fillStyle = '#8d4925';
    ctx.beginPath();
    ctx.roundRect(bx - 130, by - 40, 260, 75, 8);
    ctx.fill();
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Central Batik Mandala Rosette on floor
    ctx.save();
    ctx.translate(bx, by);
    ctx.fillStyle = 'rgba(212, 175, 55, 0.28)';
    ctx.beginPath();
    ctx.arc(0, 0, 32, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 1.5;
    for (let r = 0; r < 8; r++) {
      ctx.rotate(Math.PI / 4);
      ctx.strokeRect(-10, -10, 20, 20);
    }
    ctx.restore();

    // 4 Tiang Soko Guru (Carved Teak Columns with Gilded Umpak Plinths)
    const pillarX = [-95, -40, 40, 95];
    for (const px of pillarX) {
      // Carved stone umpak plinth
      ctx.fillStyle = '#d4af37';
      ctx.fillRect(bx + px - 7, by + 18, 14, 8);
      // Teak wooden pillar
      ctx.fillStyle = '#4e2810';
      ctx.fillRect(bx + px - 5, by - 55, 10, 75);
      // Gold capital trim
      ctx.fillStyle = '#f1c40f';
      ctx.fillRect(bx + px - 7, by - 58, 14, 4);
    }

    // Exposed Wooden Ceiling Beams (Tumpang Sari)
    ctx.strokeStyle = '#6d3c1b';
    ctx.lineWidth = 3;
    ctx.strokeRect(bx - 105, by - 58, 210, 8);

    // Multi-Tiered Joglo Roof with Gilded Lisplang Carvings
    // Lower Roof Tier
    ctx.fillStyle = '#c0392b';
    ctx.beginPath();
    ctx.moveTo(bx, by - 100);
    ctx.lineTo(bx - 145, by - 55);
    ctx.lineTo(bx + 145, by - 55);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Upper Steep Peak (Brunjung Joglo)
    ctx.fillStyle = '#962d22';
    ctx.beginPath();
    ctx.moveTo(bx, by - 128);
    ctx.lineTo(bx - 70, by - 95);
    ctx.lineTo(bx + 70, by - 95);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#f1c40f';
    ctx.lineWidth = 3;
    ctx.stroke();

    // 24K Gold Apex Finial (Mustaka Joglo)
    ctx.fillStyle = '#d4af37';
    ctx.beginPath();
    ctx.arc(bx, by - 132, 6, 0, Math.PI * 2);
    ctx.fill();

    // Gilded Javanese Gong on Carved Stand inside Pendopo
    ctx.fillStyle = '#4a2511';
    ctx.fillRect(bx - 20, by - 24, 4, 30);
    ctx.fillRect(bx + 16, by - 24, 4, 30);
    ctx.fillRect(bx - 22, by - 24, 44, 4);
    ctx.fillStyle = '#d4af37';
    ctx.beginPath();
    ctx.arc(bx, by - 8, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#b78c1b';
    ctx.beginPath();
    ctx.arc(bx, by - 8, 4, 0, Math.PI * 2);
    ctx.fill();

    // Gilded Signboard for Aula Budi Utomo
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(bx - 140, by - 18, 280, 22, 6);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#f1c40f';
    ctx.font = 'bold 11px Cinzel';
    ctx.textAlign = 'center';
    ctx.fillText('✦ AULA KELAHIRAN BUDI UTOMO 1908 ✦', bx, by - 3);


    // 6. TUGU 1908 KEBANGKITAN NASIONAL (Grand Radiant Obelisk)
    const mx2 = 1750, my2 = 980;
    const pulseTugu = 0.65 + Math.sin(Date.now() * 0.004) * 0.35;

    // Radiant Sunburst Aura (Animated Rotating Sun Rays)
    ctx.save();
    ctx.translate(mx2, my2 - 40);
    ctx.rotate(Date.now() * 0.0008);
    const sunburstGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, 85);
    sunburstGrad.addColorStop(0, `rgba(255, 215, 0, ${pulseTugu * 0.45})`);
    sunburstGrad.addColorStop(0.7, `rgba(243, 156, 18, ${pulseTugu * 0.2})`);
    sunburstGrad.addColorStop(1, 'rgba(255, 215, 0, 0)');
    ctx.fillStyle = sunburstGrad;
    ctx.beginPath();
    ctx.arc(0, 0, 85, 0, Math.PI * 2);
    ctx.fill();

    // 8 Golden Sun Rays
    ctx.strokeStyle = `rgba(255, 225, 120, ${pulseTugu * 0.5})`;
    ctx.lineWidth = 2.5;
    for (let r = 0; r < 8; r++) {
      ctx.rotate(Math.PI / 4);
      ctx.beginPath();
      ctx.moveTo(0, -25);
      ctx.lineTo(0, -65);
      ctx.stroke();
    }
    ctx.restore();

    // Stepped Andesite & Marble Pedestal (3 Tiers)
    ctx.fillStyle = '#2d3436';
    ctx.beginPath();
    ctx.roundRect(mx2 - 38, my2 + 8, 76, 14, 4);
    ctx.fill();
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#3d4849';
    ctx.beginPath();
    ctx.roundRect(mx2 - 28, my2 - 4, 56, 14, 4);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#4f5d5e';
    ctx.beginPath();
    ctx.roundRect(mx2 - 20, my2 - 16, 40, 14, 4);
    ctx.fill();
    ctx.stroke();

    // Towering Gilded Obelisk Shaft
    // Left facet (Dark gold/bronze)
    ctx.fillStyle = '#b78c1b';
    ctx.beginPath();
    ctx.moveTo(mx2 - 14, my2 - 16);
    ctx.lineTo(mx2 - 7, my2 - 76);
    ctx.lineTo(mx2, my2 - 95);
    ctx.lineTo(mx2, my2 - 16);
    ctx.closePath();
    ctx.fill();

    // Right facet (Bright 24K gold)
    ctx.fillStyle = '#f1c40f';
    ctx.beginPath();
    ctx.moveTo(mx2, my2 - 16);
    ctx.lineTo(mx2, my2 - 95);
    ctx.lineTo(mx2 + 7, my2 - 76);
    ctx.lineTo(mx2 + 14, my2 - 16);
    ctx.closePath();
    ctx.fill();

    // Obelisk gold trim lines
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(mx2, my2 - 16);
    ctx.lineTo(mx2, my2 - 95);
    ctx.stroke();

    // Golden Eternal Flame / Surya Majapahit Apex
    ctx.fillStyle = `rgba(255, 235, 59, ${pulseTugu})`;
    ctx.beginPath();
    ctx.arc(mx2, my2 - 98, 7, 0, Math.PI * 2);
    ctx.fill();

    // Engraved Golden Plaque on Pedestal
    ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(mx2 - 130, my2 + 26, 260, 22, 6);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#f1c40f';
    ctx.font = 'bold 10px Cinzel';
    ctx.textAlign = 'center';
    ctx.fillText('✦ 20 MEI 1908 - HARI KEBANGKITAN NASIONAL ✦', mx2, my2 + 41);
  }

  // POHON ESTETIK RUNCING (TIERED POINTED CYPRESS / PINE / CONIFER) DENGAN ANIMASI ANGIN LEMBUT
  drawTree(ctx, dec) {
    const x = dec.x !== undefined ? dec.x : dec;
    const y = dec.y !== undefined ? dec.y : arguments[2];
    const size = dec.size !== undefined ? dec.size : arguments[3];
    const hScale = dec.heightScale || 1.35;
    const theme = dec.colorTheme || 0;

    // Animasi ayunan ditiup angin sejuk (Wind Sway Dynamics)
    const now = Date.now();
    const swayPhase = dec.swayPhase || 0;
    const swaySpeed = dec.swaySpeed || 0.002;
    const swayAmp = dec.swayAmp || 0.038;
    const windAngle = Math.sin(now * swaySpeed + swayPhase) * swayAmp;

    // Palette warna pohon berdasarkan tema (Emerald Cypress, Teal Mountain Fir, Golden Autumn Pine)
    let palette;
    if (theme === 1) {
      // Teal Mountain Fir (Nuansa Pegunungan Berkabut)
      palette = {
        trunk: '#3d2e24',
        trunkLight: '#594436',
        dark: '#0c3836',
        mid: '#14524f',
        light: '#1e7570',
        rim: '#38ada9'
      };
    } else if (theme === 2) {
      // Golden Autumn Pine (Aura Cahaya Sore/Tropis Keemasan)
      palette = {
        trunk: '#453023',
        trunkLight: '#614633',
        dark: '#2c4014',
        mid: '#44631e',
        light: '#658f2d',
        rim: '#a4d444'
      };
    } else {
      // Emerald Cypress (Khas Rimba Tropis Nusantara & Genshin)
      palette = {
        trunk: '#423126',
        trunkLight: '#5e4839',
        dark: '#0e3a1a',
        mid: '#195729',
        light: '#27803d',
        rim: '#4cd16f'
      };
    }

    ctx.save();

    // 1. Bayangan Lembut di Tanah (Soft Perspective Ground Shadow)
    const shadowW = size * 1.05;
    const shadowH = size * 0.38;
    ctx.fillStyle = 'rgba(10, 16, 12, 0.28)';
    ctx.beginPath();
    ctx.ellipse(x + 4, y + 6, shadowW, shadowH, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2. Batang Pohon Ramping Bertekstur (Slender Textured Trunk)
    const trunkW = size * 0.22;
    const trunkH = size * 0.75 * hScale;
    const trunkX = x - trunkW / 2;
    const trunkY = y - trunkH * 0.45;

    // Sisi gelap batang
    ctx.fillStyle = palette.trunk;
    ctx.beginPath();
    ctx.roundRect(trunkX, trunkY, trunkW, trunkH * 0.6, [2, 2, 4, 4]);
    ctx.fill();

    // Sisi kilau cahaya matahari di tepi kiri batang
    ctx.fillStyle = palette.trunkLight;
    ctx.fillRect(trunkX, trunkY, trunkW * 0.38, trunkH * 0.58);

    // Akar pohon di tanah
    ctx.fillStyle = palette.trunk;
    ctx.beginPath();
    ctx.moveTo(trunkX - 3, y + 4);
    ctx.lineTo(trunkX + trunkW + 3, y + 4);
    ctx.lineTo(trunkX + trunkW / 2, y - 8);
    ctx.closePath();
    ctx.fill();

    // 3. Tajuk Runcing Bertingkat 4 Susun (Tiered Pointed Canopy)
    // Titik poros ayunan tepat di pangkal batang pohon
    ctx.translate(x, y - trunkH * 0.2);
    ctx.rotate(windAngle);

    const tiers = 4;
    const totalTreeHeight = size * 1.85 * hScale;
    const tierHeight = totalTreeHeight / tiers;

    for (let t = tiers - 1; t >= 0; t--) {
      // Kelenturan bertambah dari bawah ke puncak
      const flexRatio = (tiers - t) / tiers;
      const tierSway = Math.sin(now * (swaySpeed * 1.4) + swayPhase + t * 0.7) * (swayAmp * 0.6 * flexRatio);

      ctx.save();
      ctx.rotate(tierSway);

      const ty = -t * (tierHeight * 0.72);
      const bottomW = (size * (0.95 - t * 0.16)) * (1.1 - t * 0.05);
      const topW = (size * (0.6 - t * 0.14));
      const tHeight = tierHeight * 1.12;

      // Bayangan bawah tiap tingkatan daun
      ctx.fillStyle = 'rgba(6, 20, 10, 0.25)';
      ctx.beginPath();
      ctx.ellipse(0, ty + 2, bottomW * 0.95, 5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Sisi gelap tajuk (Sisi kanan bayangan)
      ctx.fillStyle = palette.dark;
      ctx.beginPath();
      ctx.moveTo(0, ty - tHeight); // Puncak runcing
      ctx.lineTo(bottomW * 0.5, ty);
      // Ujung daun meliuk bergerigi (Stylized jagged pine rim)
      ctx.quadraticCurveTo(bottomW * 0.25, ty + 4, 0, ty + 2);
      ctx.closePath();
      ctx.fill();

      // Sisi tengah tajuk
      ctx.fillStyle = palette.mid;
      ctx.beginPath();
      ctx.moveTo(0, ty - tHeight);
      ctx.lineTo(-bottomW * 0.5, ty);
      ctx.quadraticCurveTo(-bottomW * 0.25, ty + 4, 0, ty + 2);
      ctx.closePath();
      ctx.fill();

      // Sorot cahaya keemasan/zamrud di sisi kiri (Sunlit Emerald Highlight)
      ctx.fillStyle = palette.light;
      ctx.beginPath();
      ctx.moveTo(0, ty - tHeight);
      ctx.lineTo(-bottomW * 0.48, ty);
      ctx.lineTo(-bottomW * 0.18, ty);
      ctx.closePath();
      ctx.fill();

      // Ujung runcing tajuk paling atas dengan aksen kilau daun muda
      if (t === tiers - 1) {
        ctx.fillStyle = palette.rim;
        ctx.beginPath();
        ctx.moveTo(0, ty - tHeight - 4);
        ctx.lineTo(-bottomW * 0.18, ty - tHeight * 0.4);
        ctx.lineTo(bottomW * 0.14, ty - tHeight * 0.4);
        ctx.closePath();
        ctx.fill();
      }

      ctx.restore();
    }

    ctx.restore();
  }

  // BATU LUMUT ALAM BERDIMENSI DENGAN TEKSTUR ANDESIT
  drawBoulder(ctx, dec) {
    const x = dec.x !== undefined ? dec.x : dec;
    const y = dec.y !== undefined ? dec.y : arguments[2];
    const size = dec.size !== undefined ? dec.size : arguments[3];

    ctx.save();
    // Bayangan tanah
    ctx.fillStyle = 'rgba(0, 0, 0, 0.24)';
    ctx.beginPath();
    ctx.ellipse(x + 2, y + size * 0.25, size * 1.05, size * 0.45, 0, 0, Math.PI * 2);
    ctx.fill();

    // Tubuh batu andesit
    ctx.fillStyle = '#4a5568';
    ctx.beginPath();
    ctx.ellipse(x, y, size, size * 0.68, -0.05, 0, Math.PI * 2);
    ctx.fill();

    // Sisi gelap batu
    ctx.fillStyle = '#2d3748';
    ctx.beginPath();
    ctx.ellipse(x + size * 0.25, y + size * 0.12, size * 0.65, size * 0.48, 0.1, 0, Math.PI * 2);
    ctx.fill();

    // Lapisan lumut hijau estetik di atas batu
    ctx.fillStyle = '#2e7d32';
    ctx.beginPath();
    ctx.ellipse(x - size * 0.2, y - size * 0.22, size * 0.55, size * 0.28, -0.15, 0, Math.PI * 2);
    ctx.fill();

    // Kilau lumut cerah
    ctx.fillStyle = '#4caf50';
    ctx.beginPath();
    ctx.ellipse(x - size * 0.22, y - size * 0.26, size * 0.35, size * 0.16, -0.15, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  drawNPC(ctx, npc) {
    const x = npc.x;
    const y = npc.y;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.ellipse(x, y + 18, 18, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    const bob = Math.sin(Date.now() * 0.005 + x) * 2;

    if (npc.role === 'kala') {
      ctx.fillStyle = 'rgba(255, 220, 100, 0.4)';
      ctx.beginPath();
      ctx.arc(x, y - 14 + bob, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(x, y - 14 + bob, 12, 0, Math.PI * 2);
      ctx.fill();
    } else if (npc.role === 'deventer') {
      ctx.fillStyle = '#2c3e50';
      ctx.fillRect(x - 12, y - 16 + bob, 24, 26);
      ctx.fillStyle = '#ffdfba';
      ctx.beginPath();
      ctx.arc(x, y - 24 + bob, 10, 0, Math.PI * 2);
      ctx.fill();
    } else if (npc.role === 'brooshooft') {
      ctx.fillStyle = '#1c2833';
      ctx.fillRect(x - 12, y - 16 + bob, 24, 26);
      ctx.fillStyle = '#ffdfba';
      ctx.beginPath();
      ctx.arc(x, y - 24 + bob, 10, 0, Math.PI * 2);
      ctx.fill();
      // Desk with newspapers
      ctx.fillStyle = '#644928';
      ctx.fillRect(x + 14, y - 10, 20, 16);
      ctx.fillStyle = '#fff';
      ctx.fillRect(x + 16, y - 14, 16, 5);
    } else if (npc.role === 'multatuli') {
      ctx.fillStyle = '#34495e';
      ctx.fillRect(x - 12, y - 16 + bob, 24, 26);
      ctx.fillStyle = '#ffd1a4';
      ctx.beginPath();
      ctx.arc(x, y - 24 + bob, 10, 0, Math.PI * 2);
      ctx.fill();
    } else if (npc.role === 'wilhelmina') {
      ctx.fillStyle = '#0984e3';
      ctx.fillRect(x - 12, y - 16 + bob, 24, 26);
      ctx.fillStyle = '#ffdfba';
      ctx.beginPath();
      ctx.arc(x, y - 24 + bob, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#f1c40f';
      ctx.fillRect(x - 6, y - 36 + bob, 12, 4);
    } else if (npc.role === 'farmer') {
      ctx.fillStyle = '#4a3f35';
      ctx.fillRect(x - 12, y - 16 + bob, 24, 26);
      ctx.fillStyle = '#d4ac0d';
      ctx.beginPath();
      ctx.moveTo(x, y - 36 + bob);
      ctx.lineTo(x - 16, y - 22 + bob);
      ctx.lineTo(x + 16, y - 22 + bob);
      ctx.closePath();
      ctx.fill();
    } else if (npc.role === 'kartini') {
      ctx.fillStyle = '#f8c291';
      ctx.fillRect(x - 12, y - 16 + bob, 24, 26);
      ctx.fillStyle = '#d49b6a';
      ctx.beginPath();
      ctx.arc(x, y - 24 + bob, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#221b15';
      ctx.beginPath();
      ctx.arc(x, y - 28 + bob, 10, Math.PI, Math.PI * 2);
      ctx.fill();
    } else if (npc.role === 'wahidin') {
      ctx.fillStyle = '#2c3e50';
      ctx.fillRect(x - 12, y - 16 + bob, 24, 26);
      ctx.fillStyle = '#ba8254';
      ctx.beginPath();
      ctx.arc(x, y - 24 + bob, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#3d2516';
      ctx.beginPath();
      ctx.arc(x, y - 28 + bob, 11, Math.PI, Math.PI * 2);
      ctx.fill();
    } else if (npc.role === 'kuli_deli') {
      ctx.fillStyle = '#5d4037';
      ctx.fillRect(x - 12, y - 16 + bob, 24, 26);
      ctx.fillStyle = '#8d5524';
      ctx.beginPath();
      ctx.arc(x, y - 24 + bob, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#c62828';
      ctx.fillRect(x - 10, y - 32 + bob, 20, 5);
    } else if (npc.role === 'migrant') {
      ctx.fillStyle = '#795548';
      ctx.fillRect(x - 12, y - 16 + bob, 24, 26);
      ctx.fillStyle = '#b88258';
      ctx.beginPath();
      ctx.arc(x, y - 24 + bob, 10, 0, Math.PI * 2);
      ctx.fill();
    } else if (npc.role === 'soetomo') {
      ctx.fillStyle = '#2f3542';
      ctx.fillRect(x - 12, y - 16 + bob, 24, 26);
      ctx.fillStyle = '#c6895c';
      ctx.beginPath();
      ctx.arc(x, y - 24 + bob, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#3d2314';
      ctx.beginPath();
      ctx.arc(x, y - 28 + bob, 11, Math.PI, Math.PI * 2);
      ctx.fill();
    } else if (npc.role === 'prehistoric_stone' || npc.role === 'punden') {
      ctx.fillStyle = '#e5c158';
      ctx.fillRect(x - 16, y - 12, 32, 22);
      ctx.fillStyle = '#222';
      ctx.fillRect(x - 12, y - 8, 24, 14);
    } else {
      ctx.fillStyle = '#e5c158';
      ctx.fillRect(x - 14, y - 12, 28, 20);
      ctx.fillStyle = '#333';
      ctx.fillRect(x - 10, y - 8, 20, 12);
    }

    const dist = Math.hypot(this.player.x - x, this.player.y - y);
    if (dist <= npc.interactRadius) {
      const pulse = Math.sin(Date.now() * 0.008) * 4;
      ctx.fillStyle = '#e5c158';
      ctx.beginPath();
      ctx.arc(x, y - 48 + pulse, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#111';
      ctx.font = 'bold 13px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('!', x, y - 44 + pulse);
    }

    ctx.fillStyle = 'rgba(15, 20, 30, 0.85)';
    ctx.beginPath();
    ctx.roundRect(x - 65, y + 24, 130, 18, 6);
    ctx.fill();
    ctx.strokeStyle = 'rgba(229, 193, 88, 0.45)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = '#f1ebd8';
    ctx.font = 'bold 10px Plus Jakarta Sans';
    ctx.textAlign = 'center';
    ctx.fillText(npc.name, x, y + 36);
  }

  // PETI HARTA KARUN ARTEFAK SEJARAH (GILDED HISTORICAL RELIC CHEST)
  drawTreasureChest(ctx, chest) {
    const x = chest.x;
    const y = chest.y;
    const isOpened = chest.opened;
    const now = Date.now();

    ctx.save();

    // 1. Bayangan tanah
    ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
    ctx.beginPath();
    ctx.ellipse(x, y + 10, 18, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2. Kilau partikel emas jika peti belum dibuka
    if (!isOpened) {
      const pulse = 0.5 + Math.sin(now * 0.005 + x) * 0.5;
      ctx.fillStyle = `rgba(255, 215, 0, ${pulse * 0.35})`;
      ctx.beginPath();
      ctx.arc(x, y - 2, 22, 0, Math.PI * 2);
      ctx.fill();

      // Sparkle stars
      const sx1 = x + Math.cos(now * 0.003) * 16;
      const sy1 = y - 10 + Math.sin(now * 0.004) * 8;
      ctx.fillStyle = 'rgba(255, 240, 150, 0.8)';
      ctx.beginPath();
      ctx.arc(sx1, sy1, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }

    // 3. Kotak Peti Kayu Mahoni
    const cw = 26;
    const ch = 18;
    ctx.fillStyle = isOpened ? '#4a3525' : '#6b4724';
    ctx.beginPath();
    ctx.roundRect(x - cw / 2, y - ch / 2, cw, ch, [2, 2, 4, 4]);
    ctx.fill();

    // 4. Lis Emas & Kunci Peti
    ctx.strokeStyle = isOpened ? '#95a5a6' : '#f1c40f';
    ctx.lineWidth = 2;
    ctx.strokeRect(x - cw / 2 + 1, y - ch / 2 + 1, cw - 2, ch - 2);

    // Garis tengah tutup
    ctx.beginPath();
    ctx.moveTo(x - cw / 2, y - 1);
    ctx.lineTo(x + cw / 2, y - 1);
    ctx.stroke();

    // Gembok / Engsel emas
    ctx.fillStyle = isOpened ? '#bdc3c7' : '#ffd700';
    ctx.beginPath();
    ctx.arc(x, y - 1, 3.2, 0, Math.PI * 2);
    ctx.fill();

    // 5. Label Nama Peti
    ctx.fillStyle = isOpened ? 'rgba(30, 41, 59, 0.75)' : 'rgba(20, 26, 40, 0.9)';
    ctx.beginPath();
    ctx.roundRect(x - 55, y + 16, 110, 16, 5);
    ctx.fill();
    ctx.strokeStyle = isOpened ? 'rgba(255, 255, 255, 0.2)' : 'rgba(212, 175, 55, 0.6)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = isOpened ? '#94a3b8' : '#ffeaa7';
    ctx.font = 'bold 9px Plus Jakarta Sans';
    ctx.textAlign = 'center';
    ctx.fillText(isOpened ? '✓ ' + chest.title : '🎁 ' + chest.title, x, y + 27);

    ctx.restore();
  }

  // BALON INTERAKSI MELAYANG ELEGAN DI ATAS KEPALA NPC / PETI [E]
  drawOverheadInteractionPrompt(ctx) {
    const nearbyNpc = this.getClosestInteractiveNPC();
    const nearbyChest = this.getClosestChest();
    const target = nearbyChest && !nearbyChest.opened ? nearbyChest : nearbyNpc;

    if (!target || (dialogueManager && dialogueManager.isActive)) return;

    const x = target.x;
    const y = target.y - (target.interactRadius ? 52 : 36);
    const bob = Math.sin(Date.now() * 0.007) * 4;

    ctx.save();
    ctx.translate(x, y + bob);

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.roundRect(-42, -14, 84, 26, 13);
    ctx.fill();

    // Frosted Obsidian Pill
    ctx.fillStyle = 'rgba(14, 20, 32, 0.95)';
    ctx.strokeStyle = '#e5c158';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.roundRect(-42, -15, 84, 26, 13);
    ctx.fill();
    ctx.stroke();

    // Segitiga penunjuk balon ke arah bawah
    ctx.fillStyle = 'rgba(14, 20, 32, 0.95)';
    ctx.beginPath();
    ctx.moveTo(-5, 11);
    ctx.lineTo(5, 11);
    ctx.lineTo(0, 17);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#e5c158';
    ctx.lineWidth = 1.4;
    ctx.stroke();

    // Tombol [E] Badge Emas
    ctx.fillStyle = 'linear-gradient(135deg, #f5d77f, #d4af37)';
    ctx.fillStyle = '#f39c12';
    ctx.beginPath();
    ctx.arc(-26, -2, 8.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#111';
    ctx.font = '900 10.5px Plus Jakarta Sans';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('E', -26, -1.5);

    // Teks Aksi (Bicara / Buka Peti)
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px Plus Jakarta Sans';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(target.interactRadius ? 'Bicara' : 'Buka', -12, -2);

    ctx.restore();
  }

  drawPlayer(ctx) {
    const x = this.player.x;
    const y = this.player.y;
    const jumpY = this.player.jumpY || 0;

    // Dust particles when sprinting on ground
    if (this.player.isMoving && this.player.isSprinting && !this.player.isJumping && Math.random() > 0.4) {
      ctx.fillStyle = 'rgba(215, 190, 140, 0.5)';
      ctx.beginPath();
      ctx.arc(x - (this.player.dir === 'right' ? 16 : -16), y + 12, 3 + Math.random()*3, 0, Math.PI*2);
      ctx.fill();
    }

    // Attempt high-definition sprite rendering based on selected character
    let spriteRendered = false;
    const activeSprite = this.getActiveSprite();
    if (activeSprite) {
      spriteRendered = activeSprite.draw(ctx, x, y, jumpY);
    }

    // Fallback procedural rendering if sprite sheet is loading
    if (!spriteRendered) {
      const walkBob = this.player.isMoving ? Math.sin(this.player.stepFrame) * 3.5 : 0;
      const legSwing = this.player.isMoving ? Math.sin(this.player.stepFrame) * (this.player.isSprinting ? 7 : 5) : 0;

      // Ground shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.beginPath();
      ctx.ellipse(x, y + 16, 14, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      if (this.selectedCharacter === 'mario') {
        // Super Mario Procedural Fallback
        // Blue Overalls Legs & Brown Shoes
        ctx.fillStyle = '#9b59b6';
        ctx.fillRect(x - 7 + legSwing, y + 4 + jumpY, 5, 12);
        ctx.fillRect(x + 2 - legSwing, y + 4 + jumpY, 5, 12);

        // Red Shirt & Blue Overalls Body
        ctx.fillStyle = '#e74c3c';
        ctx.beginPath();
        ctx.roundRect(x - 10, y - 14 + walkBob + jumpY, 20, 20, 4);
        ctx.fill();

        ctx.fillStyle = '#2980b9'; // Blue overalls
        ctx.fillRect(x - 7, y - 8 + walkBob + jumpY, 14, 14);

        // Face & Nose
        ctx.fillStyle = '#ffe0bd';
        ctx.beginPath();
        ctx.arc(x, y - 20 + walkBob + jumpY, 10, 0, Math.PI * 2);
        ctx.fill();

        // Mario Mustache
        ctx.fillStyle = '#2c3e50';
        ctx.beginPath();
        ctx.ellipse(x + (this.player.dir === 'left' ? -2 : 2), y - 18 + walkBob + jumpY, 6, 2.5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Mario Red Cap
        ctx.fillStyle = '#c0392b';
        ctx.beginPath();
        ctx.arc(x, y - 24 + walkBob + jumpY, 11, Math.PI, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(x - (this.player.dir === 'left' ? 12 : 2), y - 24 + walkBob + jumpY, 14, 4);
      } else {
        // Naruto Orange Jumpsuit Procedural Fallback
        ctx.fillStyle = '#2f3542';
        ctx.fillRect(x - 7 + legSwing, y + 4 + jumpY, 5, 12);
        ctx.fillRect(x + 2 - legSwing, y + 4 + jumpY, 5, 12);

        ctx.fillStyle = this.player.isSprinting ? '#f39c12' : '#e67e22';
        ctx.beginPath();
        ctx.roundRect(x - 10, y - 14 + walkBob + jumpY, 20, 20, 4);
        ctx.fill();

        ctx.fillStyle = '#2c3e50';
        ctx.fillRect(x - 8, y - 14 + walkBob + jumpY, 16, 4);

        ctx.fillStyle = '#ffe0bd';
        ctx.beginPath();
        ctx.arc(x, y - 22 + walkBob + jumpY, 10, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#f1c40f';
        ctx.beginPath();
        ctx.arc(x, y - 26 + walkBob + jumpY, 11, Math.PI, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#2c3e50';
        ctx.fillRect(x - 8, y - 28 + walkBob + jumpY, 16, 5);
        ctx.fillStyle = '#bdc3c7';
        ctx.fillRect(x - 4, y - 28 + walkBob + jumpY, 8, 4);

        ctx.fillStyle = '#1e272e';
        let eyeOffsetX = 0;
        if (this.player.dir === 'left') eyeOffsetX = -3;
        if (this.player.dir === 'right') eyeOffsetX = 3;
        ctx.beginPath();
        ctx.arc(x - 3 + eyeOffsetX, y - 22 + walkBob + jumpY, 1.8, 0, Math.PI * 2);
        ctx.arc(x + 3 + eyeOffsetX, y - 22 + walkBob + jumpY, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  
  updateRpgCompass() {
    const compassTargetName = document.getElementById('compassTargetName');
    const compassTargetDist = document.getElementById('compassTargetDist');
    const compassDegree = document.getElementById('compassDegree');
    if (!compassTargetName || !compassTargetDist) return;

    const currentQuest = questManager ? questManager.quests[questManager.currentQuestIndex] : null;
    let target = null;
    if (currentQuest && currentQuest.targetNPC) {
      target = this.npcs.find(n => n.role === currentQuest.targetNPC || n.id === currentQuest.targetNPC);
    }
    if (!target) target = this.npcs[0];

    if (target) {
      const dist = Math.round(Math.hypot(this.player.x - target.x, this.player.y - target.y) / 16);
      compassTargetName.innerText = target.name;
      compassTargetDist.innerText = `${dist}m`;

      const angle = Math.atan2(target.y - this.player.y, target.x - this.player.x);
      let deg = Math.round(angle * (180 / Math.PI));
      if (deg < 0) deg += 360;
      compassDegree.innerText = `${String(deg).padStart(3, '0')}°`;
    }
  }

  triggerSonar() {
    sound.playSelect();
    this.sonarWaves.push({
      x: this.player.x,
      y: this.player.y,
      radius: 20,
      alpha: 0.95
    });

    // Find closest relic
    let closestRelic = null;
    let minDist = Infinity;
    this.npcs.forEach(n => {
      if (n.role === 'prehistoric_stone' || n.role === 'punden') {
        const d = Math.hypot(this.player.x - n.x, this.player.y - n.y);
        if (d < minDist) {
          minDist = d;
          closestRelic = n;
        }
      }
    });

    if (closestRelic) {
      const meters = Math.round(minDist / 16);
      this.spawnFloatingText(`🧭 Terdeteksi: ${closestRelic.name} (${meters}m)`, this.player.x, this.player.y - 45, '#e5c158');
    }
  }

  spawnFloatingText(text, x, y, color = '#e5c158') {
    this.floatingTexts.push({
      text: text,
      x: x,
      y: y,
      vy: -1.2,
      alpha: 1,
      color: color
    });
  }

  drawMinimap() {
    const mm = this.mmCtx;
    const w = this.minimapCanvas.width;
    const h = this.minimapCanvas.height;
    mm.clearRect(0, 0, w, h);

    const scaleX = w / MAP_WIDTH;
    const scaleY = h / MAP_HEIGHT;

    mm.fillStyle = '#141e16';
    mm.fillRect(0, 0, w, h);

    // Megalitikum
    mm.fillStyle = '#2f3b2f';
    mm.fillRect(100 * scaleX, 600 * scaleY, 520 * scaleX, 1000 * scaleY);

    // Zona 1, 2, 3, 4
    mm.fillStyle = '#3c4856';
    mm.fillRect(700 * scaleX, 140 * scaleY, 800 * scaleX, 540 * scaleY);
    mm.fillStyle = '#2d6833';
    mm.fillRect(700 * scaleX, 840 * scaleY, 820 * scaleX, 620 * scaleY);
    mm.fillStyle = '#413c38';
    mm.fillRect(2000 * scaleX, 140 * scaleY, 1020 * scaleX, 560 * scaleY);
    mm.fillStyle = '#34495e';
    mm.fillRect(2000 * scaleX, 840 * scaleY, 1020 * scaleX, 620 * scaleY);
    mm.fillStyle = '#e5c158';
    mm.fillRect(1540 * scaleX, 580 * scaleY, 420 * scaleX, 520 * scaleY);

    for (const npc of this.npcs) {
      mm.fillStyle = '#e5c158';
      mm.beginPath();
      mm.arc(npc.x * scaleX, npc.y * scaleY, 3.5, 0, Math.PI * 2);
      mm.fill();
    }

    mm.fillStyle = '#ff4757';
    mm.beginPath();
    mm.arc(this.player.x * scaleX, this.player.y * scaleY, 4.5, 0, Math.PI * 2);
    mm.fill();
    mm.strokeStyle = '#ffffff';
    mm.lineWidth = 1.5;
    mm.stroke();
  }
}