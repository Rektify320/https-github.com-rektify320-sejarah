// ==========================================================================
// HISTORY QUEST & PLAYER DATABASE SYSTEM — POLITIK ETIS / BALAS BUDI
// ==========================================================================

class HistoryQuestManager {
  constructor() {
    this.categories = ['BACKGROUND', 'TOKOH', 'TRILOGI', 'PELAKSANAAN', 'DAMPAK', 'NASIONALISME'];
    this.quests = [];
    this.categoryMap = {
      BACKGROUND: [],
      TOKOH: [],
      TRILOGI: [],
      PELAKSANAAN: [],
      DAMPAK: [],
      NASIONALISME: []
    };

    this.recentlyAnsweredIds = [];
    this.activeQuest = null;
    this.activeShuffledOptions = null;
    this.isAnswerLocked = false;
    this.isOpen = false;

    // Sesi Ekspedisi 15 Pertanyaan Acak Awal Masuk Game
    this.entrySessionActive = false;
    this.entrySessionIndex = 0;
    this.entrySessionQuestions = [];
    this.entrySessionStats = { correct: 0, wrong: 0, pointsEarned: 0 };
    this.startExpeditionOnNameSave = false;

    // Player State
    this.player = {
      name: '',
      hp: 100,
      maxHp: 100,
      points: 0,
      completedQuests: [],
      history: []
    };

    // DOM Elements
    this.modal = document.getElementById('historyQuestModal');
    this.categoryBadge = document.getElementById('hqCategoryBadge');
    this.titleEl = document.getElementById('hqTitle');
    this.storyEl = document.getElementById('hqStory');
    this.questionEl = document.getElementById('hqQuestion');
    this.optionsContainer = document.getElementById('hqOptionsContainer');
    this.feedbackContainer = document.getElementById('hqFeedbackContainer');
    this.hpBar = document.getElementById('hqHpBar');
    this.hpText = document.getElementById('hqHpText');
    this.pointsText = document.getElementById('hqPointsText');
    this.playerNameText = document.getElementById('hqPlayerName');

    this.initPlayer();
    this.loadQuestPool().then(() => {
      // Saat player masuk game: langsung trigger ekspedisi 15 soal acak
      this.checkAndTriggerEntryExpedition();
    });
    this.bindEvents();
  }

  // 1. Inisialisasi Player & Sinkronisasi Database
  initPlayer() {
    const savedLocal = localStorage.getItem('sejarah_player_data');
    if (savedLocal) {
      try {
        const parsed = JSON.parse(savedLocal);
        this.player.name = parsed.name || '';
        this.player.points = Number(parsed.points) || 0;
        this.player.hp = (parsed.hp !== undefined) ? Number(parsed.hp) : 100;
        this.player.completedQuests = parsed.completedQuests || [];
        this.player.history = parsed.history || [];
      } catch (e) {
        console.error('Failed to parse local player data:', e);
      }
    }

    if (this.player.hp <= 0) this.player.hp = 100;
    this.updateHUD();

    if (this.player.name) {
      this.fetchPlayerFromDatabase(this.player.name);
    }
  }

  checkAndTriggerEntryExpedition() {
    // Jika belum ada nama, minta nama terlebih dahulu baru mulai ekspedisi
    if (!this.player.name) {
      setTimeout(() => {
        this.promptPlayerName(true);
      }, 500);
    } else {
      // Langsung jalankan tantangan 15 pertanyaan acak saat player masuk
      setTimeout(() => {
        this.startInitialRandomExpedition();
      }, 700);
    }
  }

  promptPlayerName(startExpeditionAfter = false) {
    this.startExpeditionOnNameSave = startExpeditionAfter;
    const nameModal = document.getElementById('playerNameModal');
    const input = document.getElementById('playerNameInputModal');
    if (nameModal) {
      if (input && this.player.name) input.value = this.player.name;
      nameModal.classList.add('open');
      if (input) input.focus();
    } else {
      const entered = prompt("Selamat datang di Game Edukasi Sejarah!\nMasukkan Nama Kamu (Peneliti Sejarah):", this.player.name || "Siswa Sejarah");
      if (entered && entered.trim()) {
        this.setPlayerName(entered.trim());
      }
    }
  }

  setPlayerName(name) {
    if (!name || !name.trim()) return;
    this.player.name = name.trim();
    this.savePlayerToDatabase();
    this.updateHUD();

    const nameModal = document.getElementById('playerNameModal');
    if (nameModal) nameModal.classList.remove('open');

    if (typeof world !== 'undefined' && world && world.player) {
      world.spawnFloatingText(`Selamat Datang, ${this.player.name}!`, world.player.x, world.player.y - 40, '#ffd700');
    }
    if (typeof sound !== 'undefined' && sound.playSelect) sound.playSelect();

    // Jalankan tantangan 15 soal jika dipanggil dari awal
    if (this.startExpeditionOnNameSave || !this.entrySessionActive) {
      this.startExpeditionOnNameSave = false;
      setTimeout(() => {
        this.startInitialRandomExpedition();
      }, 400);
    }
  }

  async fetchPlayerFromDatabase(name) {
    try {
      const res = await fetch(`/api/player?name=${encodeURIComponent(name)}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.success && data.player) {
          this.player.points = Math.max(this.player.points, Number(data.player.points) || 0);
          if (data.player.hp !== undefined && data.player.hp > 0) {
            this.player.hp = Math.min(100, Math.max(20, Number(data.player.hp)));
          }
          if (Array.isArray(data.player.completedQuests)) {
            const set = new Set([...this.player.completedQuests, ...data.player.completedQuests]);
            this.player.completedQuests = Array.from(set);
          }
          this.updateHUD();
          this.saveLocal();
        }
      }
    } catch (err) {
      // offline fallback
    }
  }

  saveLocal() {
    localStorage.setItem('sejarah_player_data', JSON.stringify({
      name: this.player.name,
      points: this.player.points,
      hp: this.player.hp,
      completedQuests: this.player.completedQuests,
      history: this.player.history,
      lastUpdated: new Date().toISOString()
    }));
  }

  async savePlayerToDatabase() {
    this.saveLocal();
    if (!this.player.name) return;

    try {
      await fetch('/api/player/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: this.player.name,
          points: this.player.points,
          hp: this.player.hp,
          completedQuests: this.player.completedQuests,
          history: this.player.history
        })
      });
    } catch (err) {
      // offline fallback
    }
  }

  updateHUD() {
    const hudName = document.getElementById('hudPlayerName');
    const hudPoints = document.getElementById('hudPlayerPoints');
    const hudHpBar = document.getElementById('hudHpBar');
    const hudHpText = document.getElementById('hudHpText');

    if (hudName) hudName.innerText = this.player.name || 'Belum Ada Nama';
    if (hudPoints) hudPoints.innerText = this.player.points;

    const hpPercent = Math.max(0, Math.min(100, (this.player.hp / this.player.maxHp) * 100));
    if (hudHpBar) {
      hudHpBar.style.width = `${hpPercent}%`;
      hudHpBar.style.backgroundColor = hpPercent > 50 ? '#2ecc71' : (hpPercent > 25 ? '#f39c12' : '#e74c3c');
    }
    if (hudHpText) hudHpText.innerText = `${this.player.hp}/${this.player.maxHp}`;

    if (this.hpBar) {
      this.hpBar.style.width = `${hpPercent}%`;
      this.hpBar.style.backgroundColor = hpPercent > 50 ? '#2ecc71' : (hpPercent > 25 ? '#f39c12' : '#e74c3c');
    }
    if (this.hpText) this.hpText.innerText = `${this.player.hp}/${this.player.maxHp}`;
    if (this.pointsText) this.pointsText.innerText = this.player.points;
    if (this.playerNameText) this.playerNameText.innerText = this.player.name || 'Pengelana';
  }

  // 2. Load Question Pool
  async loadQuestPool() {
    let allLoaded = [];
    try {
      const res = await fetch('quests/history/all_quests.json');
      if (res.ok) {
        const list = await res.json();
        if (Array.isArray(list) && list.length > 0) allLoaded = list;
      }
    } catch (e) {}

    if (allLoaded.length === 0) {
      const files = [
        'quests/history/politik_etis.json',
        'quests/history/tokoh.json',
        'quests/history/trilogi.json',
        'quests/history/pelaksanaan.json',
        'quests/history/dampak.json',
        'quests/history/nasionalisme.json'
      ];
      for (const f of files) {
        try {
          const res = await fetch(f);
          if (res.ok) {
            const list = await res.json();
            if (Array.isArray(list)) allLoaded.push(...list);
          }
        } catch (e) {}
      }
    }

    if (allLoaded.length === 0 && typeof EMBEDDED_HISTORY_QUESTS !== 'undefined') {
      allLoaded = EMBEDDED_HISTORY_QUESTS;
    }

    this.quests = allLoaded;
    this.organizeCategories();
  }

  organizeCategories() {
    this.categories.forEach(cat => this.categoryMap[cat] = []);
    this.quests.forEach(q => {
      const cat = (q.category || 'BACKGROUND').toUpperCase();
      if (!this.categoryMap[cat]) this.categoryMap[cat] = [];
      this.categoryMap[cat].push(q);
    });
  }

  // 3. GENERASI 15 SOAL RANDOM CAMPUR & ACAK UNTUK TIAP PLAYER
  generateRandomExpedition(count = 15) {
    if (!this.quests || this.quests.length === 0) {
      this.quests = (typeof EMBEDDED_HISTORY_QUESTS !== 'undefined') ? EMBEDDED_HISTORY_QUESTS : [];
      this.organizeCategories();
    }

    const categories = ['BACKGROUND', 'TOKOH', 'TRILOGI', 'PELAKSANAAN', 'DAMPAK', 'NASIONALISME'];
    let selected = [];

    // Ambil 2 soal acak dari setiap kategori (total 12 soal) untuk memastikan cakupan materi merata
    categories.forEach(cat => {
      const catList = this.categoryMap[cat] || [];
      if (catList.length > 0) {
        const shuffledCat = [...catList].sort(() => Math.random() - 0.5);
        selected.push(...shuffledCat.slice(0, 2));
      }
    });

    // Penuhi sisa soal lagi secara acak dari semua soal yang belum terpilih
    const selectedIds = new Set(selected.map(q => q.id));
    const remaining = this.quests.filter(q => !selectedIds.has(q.id)).sort(() => Math.random() - 0.5);
    while (selected.length < count && remaining.length > 0) {
      selected.push(remaining.pop());
    }

    // Acak penuh urutan 15 soal tersebut (Fisher-Yates) agar setiap pemain mendapatkan urutan yang berbeda
    for (let i = selected.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [selected[i], selected[j]] = [selected[j], selected[i]];
    }

    return selected.slice(0, count);
  }

  startInitialRandomExpedition() {
    if (!this.player.name) {
      this.promptPlayerName(true);
      return;
    }

    if (this.player.hp <= 0) this.player.hp = 100;

    const list = this.generateRandomExpedition(15);
    if (!list || list.length === 0) return;

    this.entrySessionActive = true;
    this.entrySessionIndex = 0;
    this.entrySessionQuestions = list;
    this.entrySessionStats = { correct: 0, wrong: 0, pointsEarned: 0 };

    this.startQuest(this.entrySessionQuestions[0]);
  }

  nextExpeditionQuestion() {
    this.entrySessionIndex++;
    if (this.entrySessionIndex < this.entrySessionQuestions.length) {
      this.startQuest(this.entrySessionQuestions[this.entrySessionIndex]);
    } else {
      this.finishExpedition();
    }
  }

  finishExpedition() {
    this.entrySessionActive = false;
    this.savePlayerToDatabase();
    this.updateHUD();

    if (typeof sound !== 'undefined' && sound.playAchievementFanfare) {
      sound.playAchievementFanfare();
    }

    // Tampilkan layar rangkuman hasil ekspedisi 15 soal acak
    if (this.titleEl) this.titleEl.innerText = "🎉 Ekspedisi Awal Sejarah Selesai!";
    if (this.categoryBadge) {
      this.categoryBadge.innerText = "HASIL UJIAN SEJARAH 15 SOAL";
      this.categoryBadge.style.color = "#ffd700";
      this.categoryBadge.style.borderColor = "#ffd700";
    }
    if (this.storyEl) this.storyEl.innerText = "Kamu telah menuntaskan seluruh 15 butir pertanyaan acak mengenai Politik Etis / Balas Budi & Akar Kebangkitan Nasional!";
    if (this.questionEl) this.questionEl.innerHTML = "";
    if (this.optionsContainer) this.optionsContainer.innerHTML = "";

    if (this.feedbackContainer) {
      this.feedbackContainer.style.display = 'block';
      this.feedbackContainer.innerHTML = `
        <div class="hq-feedback-card success" style="text-align: center; padding: 22px 16px;">
          <div style="font-size: 38px; margin-bottom: 8px;">🏆📜</div>
          <h3 style="color: #f1c40f; margin-bottom: 8px; font-family: 'Cinzel', serif;">Hasil Prestasi: ${this.player.name}</h3>
          <div style="display: flex; justify-content: center; gap: 14px; margin: 16px 0; flex-wrap: wrap;">
            <div style="background: rgba(0,0,0,0.35); padding: 10px 16px; border-radius: 12px; border: 1px solid #2ecc71;">
              <div style="font-size: 11px; color: #a4b0be;">BENAR</div>
              <div style="font-size: 20px; font-weight: 800; color: #2ecc71;">${this.entrySessionStats.correct} / 15</div>
            </div>
            <div style="background: rgba(0,0,0,0.35); padding: 10px 16px; border-radius: 12px; border: 1px solid #f1c40f;">
              <div style="font-size: 11px; color: #a4b0be;">POIN DIRAIH</div>
              <div style="font-size: 20px; font-weight: 800; color: #f1c40f;">+${this.entrySessionStats.pointsEarned}</div>
            </div>
            <div style="background: rgba(0,0,0,0.35); padding: 10px 16px; border-radius: 12px; border: 1px solid #3498db;">
              <div style="font-size: 11px; color: #a4b0be;">SISA HP</div>
              <div style="font-size: 20px; font-weight: 800; color: #3498db;">${this.player.hp} / 100</div>
            </div>
          </div>
          <p style="font-size: 13px; color: #2ecc71; margin-bottom: 16px;">
            ✓ Seluruh poin telah berhasil disimpan ke database server!
          </p>
          <button class="btn-hq-continue" onclick="historyQuestManager.enterWorldGameplay()" style="padding: 12px 28px; font-size: 14.5px;">
            Masuk & Jelajahi Dunia Sejarah 2D ➔
          </button>
        </div>
      `;
    }
  }

  enterWorldGameplay() {
    this.finishQuest(true);
    if (typeof world !== 'undefined' && world && world.player) {
      world.spawnFloatingText(`Selamat Menjelajah Dunia Sejarah, ${this.player.name}!`, world.player.x, world.player.y - 45, '#ffd700');
    }
  }

  // 4. Single Random Quest (untuk NPC / [Q])
  getRandomQuest(preferredCategory = null, preferredDifficulty = null) {
    if (!this.quests || this.quests.length === 0) return null;

    let pool = [];
    if (preferredCategory && this.categoryMap[preferredCategory] && this.categoryMap[preferredCategory].length > 0) {
      pool = [...this.categoryMap[preferredCategory]];
    } else {
      pool = [...this.quests];
    }

    if (preferredDifficulty) {
      const diffPool = pool.filter(q => q.difficulty === preferredDifficulty);
      if (diffPool.length > 0) pool = diffPool;
    }

    let available = pool.filter(q => !this.recentlyAnsweredIds.includes(q.id));
    if (available.length === 0) {
      this.recentlyAnsweredIds = [];
      available = pool;
    }

    const randomIndex = Math.floor(Math.random() * available.length);
    return available[randomIndex];
  }

  // Pengacakan Pilihan Jawaban dengan pelacakan indeks jawaban benar
  shuffleOptions(quest) {
    const rawOptions = quest.options;
    const originalCorrectIndex = Number(quest.correct_answer) || 0;
    const originalCorrectText = rawOptions[originalCorrectIndex];

    const indexedOptions = rawOptions.map((text, idx) => ({
      text: text,
      isCorrect: (idx === originalCorrectIndex)
    }));

    for (let i = indexedOptions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indexedOptions[i], indexedOptions[j]] = [indexedOptions[j], indexedOptions[i]];
    }

    const newCorrectIndex = indexedOptions.findIndex(item => item.isCorrect);

    return {
      shuffledOptions: indexedOptions.map(item => item.text),
      correctIndex: newCorrectIndex,
      correctText: originalCorrectText
    };
  }

  // 5. Start Quest UI
  startQuest(quest = null, sourceNpc = null) {
    if (!this.player.name) {
      this.promptPlayerName(false);
      return;
    }

    if (this.player.hp <= 0) {
      this.player.hp = 100;
      this.savePlayerToDatabase();
      this.updateHUD();
    }

    if (!quest) {
      quest = this.getRandomQuest();
    }

    if (!quest) {
      alert("Database quest sedang dimuat. Silakan coba sesaat lagi.");
      return;
    }

    this.activeQuest = quest;
    this.activeShuffledOptions = this.shuffleOptions(quest);
    this.isAnswerLocked = false;
    this.isOpen = true;

    if (typeof sound !== 'undefined' && sound.playSelect) sound.playSelect();

    this.renderQuestModal();
    if (this.modal) this.modal.classList.add('open');
  }

  startQuestForNpc(npc) {
    if (!npc) {
      this.startQuest();
      return;
    }

    let category = 'BACKGROUND';
    const role = (npc.role || '').toLowerCase();
    const id = (npc.id || '').toLowerCase();

    if (id.includes('deventer') || id.includes('multatuli')) {
      category = Math.random() > 0.5 ? 'BACKGROUND' : 'TOKOH';
    } else if (id.includes('brooshooft') || id.includes('wilhelmina')) {
      category = 'TOKOH';
    } else if (id.includes('farmer') || id.includes('irigasi')) {
      category = Math.random() > 0.5 ? 'TRILOGI' : 'PELAKSANAAN';
    } else if (id.includes('kartini') || id.includes('wahidin')) {
      category = Math.random() > 0.5 ? 'TRILOGI' : 'DAMPAK';
    } else if (id.includes('kuli') || id.includes('amat')) {
      category = Math.random() > 0.5 ? 'TRILOGI' : 'PELAKSANAAN';
    } else if (id.includes('soetomo') || id.includes('stovia')) {
      category = Math.random() > 0.5 ? 'DAMPAK' : 'NASIONALISME';
    } else {
      category = this.categories[Math.floor(Math.random() * this.categories.length)];
    }

    const quest = this.getRandomQuest(category);
    this.startQuest(quest, npc);
  }

  renderQuestModal() {
    const q = this.activeQuest;
    if (!q) return;

    const diffColors = {
      EASY: '#2ecc71',
      MEDIUM: '#f39c12',
      HARD: '#e74c3c'
    };
    const diffBadgeColor = diffColors[q.difficulty] || '#e5c158';

    if (this.categoryBadge) {
      if (this.entrySessionActive) {
        const curNum = this.entrySessionIndex + 1;
        const totalNum = this.entrySessionQuestions.length;
        this.categoryBadge.innerHTML = `<span style="color: #ffd700;">🎯 EKSPEDISI SEJARAH: SOAL ${curNum} / ${totalNum}</span> • ${q.category} • ${q.difficulty} (+${q.reward} Poin)`;
        this.categoryBadge.style.borderColor = '#ffd700';
        this.categoryBadge.style.color = '#ffd700';
      } else {
        this.categoryBadge.innerText = `${q.category} • ${q.difficulty} (+${q.reward} Poin)`;
        this.categoryBadge.style.borderColor = diffBadgeColor;
        this.categoryBadge.style.color = diffBadgeColor;
      }
    }

    if (this.titleEl) this.titleEl.innerText = q.title;
    if (this.storyEl) this.storyEl.innerText = q.story || "Pelajari peristiwa sejarah berikut dengan seksama:";
    if (this.questionEl) this.questionEl.innerText = q.question;

    if (this.optionsContainer) {
      this.optionsContainer.innerHTML = '';
      const letters = ['A', 'B', 'C', 'D'];
      this.activeShuffledOptions.shuffledOptions.forEach((optText, index) => {
        const btn = document.createElement('button');
        btn.className = 'history-quest-option-btn';
        btn.innerHTML = `<span class="opt-key-badge">${letters[index]}</span> <span class="opt-desc-text">${optText}</span>`;
        btn.onclick = () => this.handleAnswer(index, btn);
        this.optionsContainer.appendChild(btn);
      });
    }

    if (this.feedbackContainer) {
      this.feedbackContainer.style.display = 'none';
      this.feedbackContainer.innerHTML = '';
    }

    this.updateHUD();
  }

  // 6. Handle Jawaban Player
  handleAnswer(selectedIndex, clickedBtn) {
    if (this.isAnswerLocked || !this.activeQuest) return;
    this.isAnswerLocked = true;

    const allBtns = this.optionsContainer.querySelectorAll('.history-quest-option-btn');
    allBtns.forEach(b => b.disabled = true);

    const isCorrect = (selectedIndex === this.activeShuffledOptions.correctIndex);
    const correctLetter = String.fromCharCode(65 + this.activeShuffledOptions.correctIndex);
    const correctText = this.activeShuffledOptions.correctText;

    let continueBtnHtml = '';
    if (this.entrySessionActive) {
      const nextNum = this.entrySessionIndex + 2;
      const totalNum = this.entrySessionQuestions.length;
      if (this.entrySessionIndex < totalNum - 1) {
        continueBtnHtml = `<button class="btn-hq-continue" onclick="historyQuestManager.nextExpeditionQuestion()">Soal Berikutnya (${nextNum}/${totalNum}) ➔</button>`;
      } else {
        continueBtnHtml = `<button class="btn-hq-continue" onclick="historyQuestManager.finishExpedition()">Lihat Hasil Akhir Ekspedisi 🏆</button>`;
      }
    } else {
      continueBtnHtml = `<button class="btn-hq-continue" onclick="historyQuestManager.finishQuest(true)">Lanjut Eksplorasi ➔</button>`;
    }

    if (isCorrect) {
      const reward = Number(this.activeQuest.reward) || 10;
      this.player.points += reward;
      if (!this.player.completedQuests.includes(this.activeQuest.id)) {
        this.player.completedQuests.push(this.activeQuest.id);
      }

      if (this.entrySessionActive) {
        this.entrySessionStats.correct++;
        this.entrySessionStats.pointsEarned += reward;
      }

      clickedBtn.classList.add('correct');
      if (typeof sound !== 'undefined' && sound.playAchievementFanfare) {
        sound.playAchievementFanfare();
      }

      if (typeof world !== 'undefined' && world && world.player) {
        world.spawnFloatingText(`+${reward} POIN SEJARAH!`, world.player.x, world.player.y - 40, '#2ecc71');
      }

      this.feedbackContainer.innerHTML = `
        <div class="hq-feedback-card success">
          <div class="hq-feedback-title">✓ JAWABAN BENAR!</div>
          <div class="hq-feedback-reward">+${reward} POINT</div>
          <div class="hq-feedback-explanation">
            <strong>Penjelasan Sejarah:</strong><br>
            "${this.activeQuest.explanation}"
          </div>
          ${continueBtnHtml}
        </div>
      `;
    } else {
      const damage = Number(this.activeQuest.damage) || 10;
      this.player.hp = Math.max(0, this.player.hp - damage);

      if (this.entrySessionActive) {
        this.entrySessionStats.wrong++;
      }

      clickedBtn.classList.add('wrong');
      if (allBtns[this.activeShuffledOptions.correctIndex]) {
        allBtns[this.activeShuffledOptions.correctIndex].classList.add('correct-highlight');
      }

      if (typeof sound !== 'undefined' && sound.playInteractBeep) {
        sound.playInteractBeep();
      }

      if (typeof world !== 'undefined' && world && world.player) {
        world.spawnFloatingText(`-${damage} HP!`, world.player.x, world.player.y - 40, '#e74c3c');
      }

      let gameOverHtml = '';
      if (this.player.hp <= 0) {
        gameOverHtml = `
          <div class="hq-gameover-notice">
            ⚠️ <strong>HP HABIS!</strong> Kamu kelelahan dalam ekspedisi sejarah.<br>
            Poinmu tetap tersimpan aman di database. HP dipulihkan kembali ke 100 agar kamu dapat terus belajar!
          </div>
        `;
        this.player.hp = 100;
      }

      this.feedbackContainer.innerHTML = `
        <div class="hq-feedback-card error">
          <div class="hq-feedback-title">✕ JAWABAN SALAH!</div>
          <div class="hq-feedback-penalty">-${damage} HP</div>
          <div class="hq-correct-answer-reveal">
            Jawaban yang benar: <strong>${correctLetter}. ${correctText}</strong>
          </div>
          <div class="hq-feedback-explanation">
            <strong>Penjelasan Sejarah:</strong><br>
            "${this.activeQuest.explanation}"
          </div>
          ${gameOverHtml}
          ${continueBtnHtml}
        </div>
      `;
    }

    if (!this.recentlyAnsweredIds.includes(this.activeQuest.id)) {
      this.recentlyAnsweredIds.push(this.activeQuest.id);
      if (this.recentlyAnsweredIds.length > 8) this.recentlyAnsweredIds.shift();
    }

    this.feedbackContainer.style.display = 'block';
    this.updateHUD();
    this.savePlayerToDatabase();
  }

  finishQuest(isSuccess) {
    if (this.modal) this.modal.classList.remove('open');
    this.isOpen = false;
    this.activeQuest = null;
    this.activeShuffledOptions = null;
    this.isAnswerLocked = false;
    if (typeof sound !== 'undefined' && sound.playSelect) sound.playSelect();
  }

  // 7. Leaderboard Modal
  async showLeaderboard() {
    const modal = document.getElementById('leaderboardModal');
    const listEl = document.getElementById('leaderboardList');
    if (!modal || !listEl) return;

    listEl.innerHTML = `<div style="text-align: center; padding: 20px; color: #a4b0be;">Memuat data peringkat dari database...</div>`;
    modal.classList.add('open');

    try {
      const res = await fetch('/api/leaderboard');
      if (res.ok) {
        const data = await res.json();
        const players = (data && data.leaderboard) ? data.leaderboard : [];
        if (players.length === 0) {
          listEl.innerHTML = `<div style="text-align: center; padding: 20px;">Belum ada data pemain lain di database. Jadilah yang pertama!</div>`;
          return;
        }

        let html = '<div class="leaderboard-table">';
        players.forEach((p, idx) => {
          const rankMedal = idx === 0 ? '🥇' : (idx === 1 ? '🥈' : (idx === 2 ? '🥉' : `#${idx + 1}`));
          const isCurrent = (p.name.toLowerCase() === (this.player.name || '').toLowerCase());
          html += `
            <div class="leaderboard-row ${isCurrent ? 'current-player' : ''}">
              <div class="lb-rank">${rankMedal}</div>
              <div class="lb-name"><strong>${p.name}</strong> ${isCurrent ? '<span class="lb-you-badge">(Kamu)</span>' : ''}</div>
              <div class="lb-points">⭐ ${p.points || 0} Poin</div>
            </div>
          `;
        });
        html += '</div>';
        listEl.innerHTML = html;
      } else {
        listEl.innerHTML = `<div style="text-align: center; padding: 20px;">Gagal terhubung ke database. Poin kamu tersimpan di perangkat lokal: ${this.player.points} Poin.</div>`;
      }
    } catch (e) {
      listEl.innerHTML = `<div style="text-align: center; padding: 20px;">Mode offline. Poin kamu tersimpan di penyimpanan lokal: ${this.player.points} Poin.</div>`;
    }
  }

  bindEvents() {
    const closeBtn = document.getElementById('closeHistoryQuestModal');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        if (this.entrySessionActive) {
          if (confirm('Keluar dari ekspedisi 15 soal sejarah? Poin yang sudah kamu raih tetap tersimpan di database.')) {
            this.entrySessionActive = false;
            this.finishQuest(false);
          }
        } else {
          this.finishQuest(false);
        }
      });
    }

    const saveNameBtn = document.getElementById('savePlayerNameBtn');
    if (saveNameBtn) {
      saveNameBtn.addEventListener('click', () => {
        const input = document.getElementById('playerNameInputModal');
        if (input && input.value.trim()) {
          this.setPlayerName(input.value.trim());
        }
      });
    }

    const openQuestBtn = document.getElementById('btnOpenHistoryQuest');
    if (openQuestBtn) {
      openQuestBtn.addEventListener('click', () => {
        // Tanyakan apakah ingin mulai tantangan 15 soal baru atau 1 soal acak
        const nearby = (typeof world !== 'undefined' && world) ? world.getClosestInteractiveNPC() : null;
        if (nearby) {
          this.startQuestForNpc(nearby);
        } else {
          this.startInitialRandomExpedition();
        }
      });
    }

    const openLbBtn = document.getElementById('btnOpenLeaderboard');
    if (openLbBtn) {
      openLbBtn.addEventListener('click', () => {
        this.showLeaderboard();
      });
    }

    const closeLbBtn = document.getElementById('closeLeaderboardModal');
    if (closeLbBtn) {
      closeLbBtn.addEventListener('click', () => {
        const modal = document.getElementById('leaderboardModal');
        if (modal) modal.classList.remove('open');
      });
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'q' || e.key === 'Q') {
        if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
        if (this.isOpen) return;
        const nearby = (typeof world !== 'undefined' && world) ? world.getClosestInteractiveNPC() : null;
        if (nearby) {
          this.startQuestForNpc(nearby);
        } else {
          this.startInitialRandomExpedition();
        }
      }

      if (e.key === 'Escape' && this.isOpen) {
        if (this.entrySessionActive) {
          if (confirm('Keluar dari ekspedisi 15 soal sejarah? Poin yang telah diraih tetap tersimpan.')) {
            this.entrySessionActive = false;
            this.finishQuest(false);
          }
        } else {
          this.finishQuest(false);
        }
      }
    });
  }
}

// 36 Pertanyaan Lengkap Tersemat Langsung untuk Keandalan 100%
const EMBEDDED_HISTORY_QUESTS = [
  {
    "id": "PE_BG001",
    "category": "BACKGROUND",
    "difficulty": "EASY",
    "title": "Jejak Balas Budi & Utang Kehormatan",
    "story": "Pada akhir abad ke-19, suara keras mulai menggema di kalangan politisi dan intelektual Belanda mengecam penderitaan rakyat jajahan akibat sistem Tanam Paksa (Cultuurstelsel).",
    "question": "Apa salah satu latar belakang utama dicetuskannya kebijakan Politik Etis oleh pemerintah kolonial Belanda?",
    "options": [
      "Kritik keras terhadap eksploitasi kolonial dan keprihatinan atas penderitaan rakyat pribumi",
      "Keinginan Belanda untuk segera memberikan kemerdekaan penuh bagi Indonesia",
      "Tuntutan negara-negara Eropa agar Belanda menyerahkan seluruh tanah Hindia ke Inggris",
      "Kekalahan telak tentara Belanda dalam perang melawan pasukan Jepang"
    ],
    "correct_answer": 0,
    "reward": 10,
    "damage": 10,
    "explanation": "Politik Etis (Politik Balas Budi) lahir dari gelombang kritik moral terhadap penindasan Tanam Paksa dan kemerosotan kesejahteraan rakyat pribumi di Hindia Belanda."
  },
  {
    "id": "PE_BG002",
    "category": "BACKGROUND",
    "difficulty": "MEDIUM",
    "title": "Gugatan Lewat De Gids",
    "story": "Sebuah artikel hukum dan ekonomi terbit pada majalah terkemuka Belanda 'De Gids' tahun 1899, menghitung bahwa Belanda telah menikmati jutaan gulden surplus kekayaan dari Hindia Belanda.",
    "question": "Apa judul artikel terkenal karangan Mr. C.Th. van Deventer tahun 1899 yang menjadi tonggak lahirnya Politik Etis?",
    "options": [
      "Een Eereschuld (Utang Kehormatan)",
      "Max Havelaar (Lelang Kopi Dagang Belanda)",
      "Als Ik Eens Nederlander Was (Andai Aku Seorang Belanda)",
      "Suikerkontrakten en Arbeid (Kontrak Gula dan Tenaga Kerja)"
    ],
    "correct_answer": 0,
    "reward": 20,
    "damage": 15,
    "explanation": "Artikel 'Een Eereschuld' (Utang Kehormatan) karya C.Th. van Deventer menegaskan bahwa negeri Belanda berutang budi moral kepada rakyat Nusantara dan wajib mengembalikannya lewat kesejahteraan."
  },
  {
    "id": "PE_BG003",
    "category": "BACKGROUND",
    "difficulty": "HARD",
    "title": "Kekhawatiran Kolonial",
    "story": "Selain alasan moral dan etika kemanusiaan, para pejabat Den Haag juga memperhitungkan stabilitas ekonomi jangka panjang di tanah jajahan.",
    "question": "Mengapa pemerintah kolonial Belanda secara pragmatis merasa perlu menerapkan kebijakan balas budi pada awal abad ke-20?",
    "options": [
      "Kondisi kemiskinan ekstrem rakyat dikhawatirkan memicu pemberontakan massal dan menurunkan daya beli pasar",
      "Belanda ingin memindahkan seluruh ibu kota kerajaannya dari Amsterdam ke Batavia",
      "Pemerintah kolonial ingin mengganti seluruh komoditas perkebunan menjadi industri teknologi berat",
      "Adanya desakan dari Perserikatan Bangsa-Bangsa (PBB) yang saat itu baru didirikan"
    ],
    "correct_answer": 0,
    "reward": 30,
    "damage": 20,
    "explanation": "Selain faktor etis, Belanda cemas kemiskinan dan kelaparan hebat di Jawa akan meruntuhkan ketertiban kolonial serta melemahkan daya beli komoditas dagang Belanda."
  },
  {
    "id": "PE_BG004",
    "category": "BACKGROUND",
    "difficulty": "EASY",
    "title": "Bencana Kelaparan di Pulau Jawa",
    "story": "Pada dekade 1880–1890an terjadi bencana kelaparan dan wabah penyakit hebat di Grobogan dan Demak yang menyentak kesadaran publik humanis Belanda.",
    "question": "Kondisi memilukan apa di tanah Jawa yang memicu desakan keras diterapkannya Politik Balas Budi?",
    "options": [
      "Bencana kelaparan parah dan kemiskinan akut di Grobogan serta daerah pedalaman Jawa",
      "Terjadinya tsunami besar yang menenggelamkan seluruh pantai utara Jawa",
      "Serangan bajak laut dari benua Afrika ke pelabuhan Sunda Kelapa",
      "Kegagalan total panen gandum di seluruh daratan Eropa"
    ],
    "correct_answer": 0,
    "reward": 10,
    "damage": 10,
    "explanation": "Tragedi kelaparan dan kemiskinan akut di Demak dan Grobogan membuktikan bahwa eksploitasi Tanam Paksa telah memorak-porandakan kehidupan petani Nusantara."
  },
  {
    "id": "PE_BG005",
    "category": "BACKGROUND",
    "difficulty": "MEDIUM",
    "title": "Batig Slot & Surplus Finansial",
    "story": "Dalam perdebatannya, Van Deventer membuktikan bahwa anggaran belanja negeri Belanda bertahun-tahun ditopang oleh surplus keuntungan finansial dari tanah jajahan.",
    "question": "Istilah Belanda untuk surplus keuntungan kas kolonial yang dibawa ke negeri Belanda adalah...",
    "options": [
      "Batig Slot",
      "Cultuurstelsel",
      "Verplichte Leverantie",
      "Poenale Sanctie"
    ],
    "correct_answer": 0,
    "reward": 20,
    "damage": 15,
    "explanation": "Batig Slot adalah istilah untuk keuntungan bersih kas perbendaharaan Hindia Belanda yang ditransfer langsung ke kas negeri Belanda."
  },
  {
    "id": "PE_BG006",
    "category": "BACKGROUND",
    "difficulty": "HARD",
    "title": "Tahun Dimulainya Politik Etis",
    "story": "Ratu Wilhelmina membacakan pidato resmi kerajaan di Den Haag yang menandai dimulainya era baru Politik Balas Budi secara resmi.",
    "question": "Tahun berapakah Politik Etis secara resmi diberlakukan oleh pemerintah Kerajaan Belanda?",
    "options": [
      "1901",
      "1890",
      "1928",
      "1808"
    ],
    "correct_answer": 0,
    "reward": 30,
    "damage": 20,
    "explanation": "Politik Etis secara resmi dicanangkan pada September 1901 melalui Pidato Takhta (Troonrede) Ratu Wilhelmina."
  },
  {
    "id": "PE_TK001",
    "category": "TOKOH",
    "difficulty": "EASY",
    "title": "Sosok Pencetus Trias Van Deventer",
    "story": "Seorang ahli hukum Belanda merumuskan trilogi pemikiran untuk membalas budi rakyat Indonesia melalui perbaikan saluran air, pendidikan, dan pemindahan warga.",
    "question": "Siapakah tokoh yang merumuskan konsep trilogi Politik Etis (Irigasi, Edukasi, Emigrasi)?",
    "options": [
      "Conrad Theodor van Deventer",
      "Johannes van den Bosch",
      "Herman Willem Daendels",
      "Cornelis de Houtman"
    ],
    "correct_answer": 0,
    "reward": 10,
    "damage": 10,
    "explanation": "Mr. C.Th. van Deventer adalah perumus konsep Trias Van Deventer yang terdiri dari Irigasi, Edukasi, dan Emigrasi/Transmigrasi."
  },
  {
    "id": "PE_TK002",
    "category": "TOKOH",
    "difficulty": "MEDIUM",
    "title": "Pena Tajam Sang Mantan Asisten Residen",
    "story": "Seorang mantan asisten residen Lebak Banten menulis sebuah novel satire legendaris dengan nama pena Multatuli yang mengguncang nurani masyarakat Eropa.",
    "question": "Siapakah nama asli dari Multatuli, penulis roman sejarah Max Havelaar?",
    "options": [
      "Eduard Douwes Dekker",
      "Ernest Douwes Dekker (Danudirja Setiabudi)",
      "Pieter Brooshooft",
      "Baron van Hoëvell"
    ],
    "correct_answer": 0,
    "reward": 20,
    "damage": 15,
    "explanation": "Eduard Douwes Dekker memakai nama samaran Multatuli (artinya 'aku telah banyak menderita') saat menulis novel Max Havelaar tahun 1860."
  },
  {
    "id": "PE_TK003",
    "category": "TOKOH",
    "difficulty": "MEDIUM",
    "title": "Suara Redaksi De Locomotief",
    "story": "Di Semarang terbit koran terkemuka yang redakturnya aktif melakukan investigasi langsung ke desa-desa miskin di pedalaman Jawa.",
    "question": "Siapakah wartawan sekaligus pemimpin redaksi koran De Locomotief yang gigih mengampanyekan Politik Etis?",
    "options": [
      "Pieter Brooshooft",
      "L. van Limburg Stirum",
      "Snouck Hurgronje",
      "J.P. Coen"
    ],
    "correct_answer": 0,
    "reward": 20,
    "damage": 15,
    "explanation": "Pieter Brooshooft adalah wartawan pejuang etis dari koran De Locomotief yang mengumpulkan bukti-bukti kemiskinan rakyat untuk diserahkan ke pemerintah Belanda."
  },
  {
    "id": "PE_TK004",
    "category": "TOKOH",
    "difficulty": "HARD",
    "title": "Pidato Takhta Sang Ratu (1901)",
    "story": "Pada bulan September 1901 di Den Haag, sang ratu muda Belanda menyampaikan pidato resmi di hadapan parlemen (Staten-Generaal) mengenai kewajiban moral atas Hindia.",
    "question": "Siapakah Ratu Belanda yang secara resmi mengumumkan pelaksanaan Politik Etis dalam Troonrede (Pidato Takhta) tahun 1901?",
    "options": [
      "Ratu Wilhelmina",
      "Ratu Juliana",
      "Ratu Beatrix",
      "Ratu Emma"
    ],
    "correct_answer": 0,
    "reward": 30,
    "damage": 20,
    "explanation": "Ratu Wilhelmina dalam Pidato Takhta September 1901 menyatakan bahwa Kerajaan Belanda memiliki panggilan moral dan utang budi (een eereschuld) kepada penduduk Hindia Belanda."
  },
  {
    "id": "PE_TK005",
    "category": "TOKOH",
    "difficulty": "EASY",
    "title": "Karakter Petani Saijah dan Adinda",
    "story": "Dalam novel Max Havelaar, dikisahkan penderitaan sepasang kekasih di Lebak yang kerbaunya dirampas paksa oleh penguasa korup.",
    "question": "Siapakah nama tokoh sepasang pemuda-pemudi desa dalam novel Max Havelaar yang menjadi simbol penderitaan rakyat Banten?",
    "options": [
      "Saijah dan Adinda",
      "Roro Mendut dan Pronocitro",
      "Sangkuriang dan Dayang Sumbi",
      "Galih dan Ratna"
    ],
    "correct_answer": 0,
    "reward": 10,
    "damage": 10,
    "explanation": "Kisah tragis Saijah dan Adinda dalam novel Max Havelaar membuka mata publik dunia tentang pemerasan brutal yang dialami rakyat kecil."
  },
  {
    "id": "PE_TK006",
    "category": "TOKOH",
    "difficulty": "HARD",
    "title": "Pahlawan Moral di Parlemen Belanda",
    "story": "Jauh sebelum Van Deventer, seorang pendeta dan anggota parlemen Belanda pada tahun 1848 telah berani menyuarakan penderitaan bangsa Indonesia di mimbar Tweede Kamer.",
    "question": "Siapakah tokoh pendeta dan politisi Belanda abad ke-19 yang memelopori perlawanan terhadap Tanam Paksa di parlemen Belanda?",
    "options": [
      "Baron van Hoëvell (W.R. van Hoëvell)",
      "Frans van de Putte",
      "Dirk van Hogendorp",
      "Alexander Willem Frederik Idenburg"
    ],
    "correct_answer": 0,
    "reward": 30,
    "damage": 20,
    "explanation": "Baron van Hoëvell adalah pendeta dan anggota parlemen Belanda yang dengan lantang membela hak-hak rakyat jajahan sejak tahun 1848."
  },
  {
    "id": "PE_TR001",
    "category": "TRILOGI",
    "difficulty": "EASY",
    "title": "Tiga Pilar Politik Etis",
    "story": "Untuk mewujudkan perbaikan kesejahteraan di tanah jajahan, dirumuskan tiga program utama yang dikenal sebagai Trilogi Van Deventer.",
    "question": "Program apa sajakah yang menyusun Trilogi Van Deventer?",
    "options": [
      "Irigasi, Edukasi, dan Transmigrasi (Emigrasi)",
      "Monopoli, Devide et Impera, dan Kerja Rodi",
      "Industrialisasi, Militerisasi, dan Kolonisasi",
      "Demokrasi, Kapitalisme, dan Feodalisme"
    ],
    "correct_answer": 0,
    "reward": 10,
    "damage": 10,
    "explanation": "Trilogi Van Deventer terdiri dari 3 program: Irigasi (pengairan), Edukasi (pendidikan), dan Emigrasi/Transmigrasi (perpindahan penduduk)."
  },
  {
    "id": "PE_TR002",
    "category": "TRILOGI",
    "difficulty": "MEDIUM",
    "title": "Pilar Irigasi & Air Kehidupan",
    "story": "Pemerintah membangun jaringan waduk, bendungan, dan saluran air seperti di Kali Brantas Jawa Timur untuk mendukung sektor pertanian.",
    "question": "Apa tujuan utama yang dicanangkan dari program Irigasi dalam konsep Politik Etis?",
    "options": [
      "Memperbaiki dan menjamin pasokan air bagi lahan pertanian serta sawah rakyat guna mencegah kelaparan",
      "Mengeringkan seluruh sungai di Jawa agar dapat dibangun rel kereta api",
      "Menyediakan air bersih hanya untuk kapal-kapal perang Eropa di pelabuhan",
      "Membangun kolam renang mewah khusus bagi para pejabat gubernemen Belanda"
    ],
    "correct_answer": 0,
    "reward": 20,
    "damage": 15,
    "explanation": "Program irigasi ditujukan untuk mengairi persawahan dan perkebunan guna meningkatkan hasil panen dan mencegah bencana kelaparan di Jawa."
  },
  {
    "id": "PE_TR003",
    "category": "TRILOGI",
    "difficulty": "MEDIUM",
    "title": "Cahaya Pendidikan (Edukasi)",
    "story": "Program kedua mencakup pendirian berbagai jenjang sekolah, mulai dari Sekolah Desa (Volksschool) hingga perguruan kedokteran untuk anak bumiputra.",
    "question": "Lembaga pendidikan kedokteran bumiputra di Batavia yang didirikan pada era ini dan melahirkan para tokoh pergerakan bernama...",
    "options": [
      "STOVIA (School tot Opleiding van Inlandsche Artsen)",
      "THS (Technische Hoogeschool Bandoeng)",
      "OSVIA (Opleiding School Voor Inlandsche Ambtenaren)",
      "Kweekschool voor Onderwijzers"
    ],
    "correct_answer": 0,
    "reward": 20,
    "damage": 15,
    "explanation": "STOVIA adalah sekolah dokter Jawa di Batavia yang menjadi kawah candradimuka intelektual bagi dr. Soetomo, dr. Cipto Mangunkusumo, dan para pendiri Budi Utomo."
  },
  {
    "id": "PE_TR004",
    "category": "TRILOGI",
    "difficulty": "HARD",
    "title": "Pilar Emigrasi & Keseimbangan Demografi",
    "story": "Pulau Jawa pada akhir abad ke-19 mengalami ledakan jumlah penduduk yang sangat padat sehingga lahan garapan petani semakin menyempit.",
    "question": "Mengapa program Emigrasi / Transmigrasi dipandang penting dalam rencana Trilogi Van Deventer?",
    "options": [
      "Untuk meratakan persebaran penduduk dari Pulau Jawa yang padat ke pulau lain yang masih luas dan subur",
      "Untuk mengasingkan seluruh penduduk pribumi ke benua Australia",
      "Untuk mengosongkan pulau Jawa agar bisa dibeli seluruhnya oleh pedagang VOC",
      "Untuk menghapus batas antarpulau di seluruh wilayah Pasifik"
    ],
    "correct_answer": 0,
    "reward": 30,
    "damage": 20,
    "explanation": "Emigrasi (kelak menjadi cikal bakal transmigrasi nasional) dirancang untuk memindahkan warga Jawa ke Lampung dan Sumatra guna mengatasi krisis kepadatan tanah."
  },
  {
    "id": "PE_TR005",
    "category": "TRILOGI",
    "difficulty": "EASY",
    "title": "Sekolah Desa (Volksschool)",
    "story": "Di tingkat pedesaan, pemerintah kolonial membuka sekolah dasar 3 tahun dengan bahasa pengantar bahasa daerah.",
    "question": "Sekolah dasar tingkat desa pada masa kolonial yang mengajarkan baca, tulis, dan hitung dasar dikenal dengan sebutan...",
    "options": [
      "Volksschool (Sekolah Rakyat / Desa)",
      "HBS (Hogere Burgerschool)",
      "ELS (Europeesche Lagere School)",
      "MULO (Meer Uitgebreid Lager Onderwijs)"
    ],
    "correct_answer": 0,
    "reward": 10,
    "damage": 10,
    "explanation": "Volksschool (Sekolah Desa) adalah jenjang pendidikan 3 tahun paling dasar yang disediakan untuk anak-anak pedesaan bumiputra."
  },
  {
    "id": "PE_TR006",
    "category": "TRILOGI",
    "difficulty": "HARD",
    "title": "Destinasi Perdana Kolonisasi 1905",
    "story": "Pelaksanaan program perpindahan penduduk pertama yang disponsori pemerintah Hindia Belanda diberangkatkan pada tahun 1905 dari Kedu Jawa Tengah.",
    "question": "Wilayah manakah di luar Pulau Jawa yang menjadi lokasi tujuan rombongan emigrasi perdana pada tahun 1905?",
    "options": [
      "Gedong Tataan di Karesidenan Lampung",
      "Banjarmasin di Kalimantan Selatan",
      "Makassar di Sulawesi Selatan",
      "Merauke di Papua"
    ],
    "correct_answer": 0,
    "reward": 30,
    "damage": 20,
    "explanation": "Pada November 1905, sebanyak 155 kepala keluarga dari Kedu Jawa Tengah dipindahkan ke Gedong Tataan, Lampung (tonggak sejarah transmigrasi pertama)."
  },
  {
    "id": "PE_PL001",
    "category": "PELAKSANAAN",
    "difficulty": "EASY",
    "title": "Dilema Realitas Lapangan",
    "story": "Meskipun di atas kertas bertujuan mulia menyejahterakan rakyat, pelaksanaan Politik Etis di lapangan banyak mengalami penyimpangan oleh pejabat kolonial.",
    "question": "Bagaimana penyimpangan yang terjadi pada pelaksanaan program Irigasi di lapangan?",
    "options": [
      "Saluran air irigasi diutamakan mengaliri perkebunan milik pengusaha Belanda, sementara sawah rakyat hanya mendapat sisa aliran air",
      "Air irigasi sama sekali tidak dialirkan ke lahan mana pun dan sengaja dibuang ke laut",
      "Petani pribumi dilarang meminum air bersih dari sumur desa",
      "Pemerintah kolonial membagi air secara gratis dan adil tanpa memungut pajak apa pun"
    ],
    "correct_answer": 0,
    "reward": 10,
    "damage": 10,
    "explanation": "Dalam praktiknya terjadi diskriminasi air: perkebunan tebu dan tembakau milik swasta Belanda mendapat jatah air utama di siang hari, sedangkan sawah rakyat Pak Kromo sering kekurangan air."
  },
  {
    "id": "PE_PL002",
    "category": "PELAKSANAAN",
    "difficulty": "MEDIUM",
    "title": "Penyimpangan Sektor Edukasi",
    "story": "Sekolah-sekolah memang didirikan oleh pemerintah Hindia Belanda, namun tujuan di balik pembukaan sekolah tersebut ternyata sangat berorientasi pada kepentingan birokrasi kolonial.",
    "question": "Apa bentuk penyimpangan utama dalam pelaksanaan program Edukasi?",
    "options": [
      "Pendidikan diarahkan untuk mencetak tenaga kerja rendahan (ambtenaar) yang terampil namun dapat digaji sangat murah oleh pemerintah kolonial",
      "Hanya anak-anak petani miskin yang diperbolehkan belajar di sekolah tinggi Belanda",
      "Pemerintah Belanda memaksa seluruh siswa belajar militer dan perang ke Eropa",
      "Seluruh lulusan sekolah langsung diangkat menjadi Gubernur Jenderal Hindia Belanda"
    ],
    "correct_answer": 0,
    "reward": 20,
    "damage": 15,
    "explanation": "Sekolah kolonial didirikan utamanya untuk memenuhi kebutuhan juru tulis, mandor, dan pegawai administrasi perkebunan yang terdidik tetapi dengan standar upah murah meriah."
  },
  {
    "id": "PE_PL003",
    "category": "PELAKSANAAN",
    "difficulty": "HARD",
    "title": "Sisi Gelap Transmigrasi & Kuli Deli",
    "story": "Ribuan warga dari desa-desa di Pulau Jawa diberangkatkan ke perkebunan tembakau Deli di Sumatra Timur. Di sana mereka diikat oleh aturan kerja paksa yang sangat menekan.",
    "question": "Peraturan kejam apakah yang digunakan mandor perkebunan untuk menghukum kuli kontrak yang mencoba kabur dari perkebunan Deli?",
    "options": [
      "Poenale Sanctie (Sanksi Pidana Kuli)",
      "Cultuur Procenten (Persentase Hasil Tanam)",
      "Hongitochten (Pelayaran Ekspedisi Hongi)",
      "Agrarische Wet (Undang-Undang Agraria)"
    ],
    "correct_answer": 0,
    "reward": 30,
    "damage": 20,
    "explanation": "Poenale Sanctie adalah sanksi hukum pidana berupa cambukan dan kerja paksa yang diterapkan pemilik perkebunan terhadap kuli kontrak yang melanggar ikatan kerja atau melarikan diri."
  },
  {
    "id": "PE_PL004",
    "category": "PELAKSANAAN",
    "difficulty": "EASY",
    "title": "Diskriminasi Bangku Pendidikan",
    "story": "Pemerintah kolonial menerapkan sistem segregasi atau pemisahan sekolah antara golongan Eropa, bangsawan pribumi, dan rakyat jelata.",
    "question": "Sekolah elit berbahasa Belanda yang hanya diperuntukkan bagi anak keturunan Eropa dan bangsawan tinggi pribumi adalah...",
    "options": [
      "ELS (Europeesche Lagere School)",
      "Sekolah Desa 3 Tahun",
      "Sekolah Ongko Loro",
      "Pesantren Rakyat"
    ],
    "correct_answer": 0,
    "reward": 10,
    "damage": 10,
    "explanation": "ELS (Europeesche Lagere School) adalah sekolah dasar mewah berbahasa pengantar Belanda yang sangat tertutup bagi rakyat biasa."
  },
  {
    "id": "PE_PL005",
    "category": "PELAKSANAAN",
    "difficulty": "MEDIUM",
    "title": "Pajak Kepala dan Kerja Wajib",
    "story": "Meskipun Politik Etis berjalan, beban kewajiban finansial dan kerja wajib rakyat pedesaan tetap sangat berat.",
    "question": "Beban kerja tanpa upah yang tetap dibebankan kepada petani untuk membangun jalan dan infrastruktur kolonial disebut...",
    "options": [
      "Kerja Rodi / Heerendiensten",
      "Siskamling",
      "Gotong Royong Desa",
      "Wajib Militer Sukarela"
    ],
    "correct_answer": 0,
    "reward": 20,
    "damage": 15,
    "explanation": "Praktek Heerendiensten (kerja wajib tanpa bayaran) masih terus diberlakukan oleh pejabat kolonial sehingga menimbulkan kekecewaan luas."
  },
  {
    "id": "PE_PL006",
    "category": "PELAKSANAAN",
    "difficulty": "HARD",
    "title": "Kritik Kaum Sosialis Belanda",
    "story": "Di Belanda sendiri, kelompok sosialis dan etisi garis keras mengkritik bahwa Politik Etis telah dibajak oleh kaum kapitalis perkebunan swasta.",
    "question": "Mengapa kaum etisi radikal di parlemen Den Haag mengkritik implementasi Politik Etis?",
    "options": [
      "Karena dana kesejahteraan justru banyak mengalir untuk menyubsidi fasilitas perusahaan perkebunan swasta Belanda",
      "Karena anggaran Politik Etis seluruhnya disumbangkan ke negara lain di Amerika Latin",
      "Karena Belanda tidak lagi membeli hasil panen kopi dari Hindia",
      "Karena rakyat Jawa menolak bersekolah secara serentak"
    ],
    "correct_answer": 0,
    "reward": 30,
    "damage": 20,
    "explanation": "Banyak anggaran irigasi dan infrastruktur jalan raya yang dialokasikan ternyata lebih banyak menguntungkan korporasi swasta Belanda (kapitalisme kolonial) daripada rakyat biasa."
  },
  {
    "id": "PE_DP001",
    "category": "DAMPAK",
    "difficulty": "EASY",
    "title": "Terbitnya Fajar Pemikiran Baru",
    "story": "Meskipun Belanda bermaksud mencetak tenaga pegawai murah, terbukanya akses pendidikan modern membawa berkah tak terduga bagi kemajuan pola pikir pemuda pribumi.",
    "question": "Apa dampak positif paling signifikan dari program pendidikan Politik Etis bagi bangsa Indonesia?",
    "options": [
      "Munculnya golongan terpelajar / cendekiawan yang memiliki wawasan luas dan kesadaran kritis",
      "Seluruh rakyat Indonesia secara otomatis memperoleh kewarganegaraan negeri Belanda",
      "Pemerintah kolonial menyerahkan seluruh kekuasaan politik kepada para bupati secara sukarela",
      "Berhentinya seluruh aktivitas perdagangan antarpulau di kawasan kepulauan Nusantara"
    ],
    "correct_answer": 0,
    "reward": 10,
    "damage": 10,
    "explanation": "Dampak terbesar dari Politik Etis adalah terlahirkannya generasi terpelajar bumiputra yang kelak memimpin organisasi pergerakan kemerdekaan."
  },
  {
    "id": "PE_DP002",
    "category": "DAMPAK",
    "difficulty": "MEDIUM",
    "title": "Perkembangan di Empat Bidang",
    "story": "Politik Etis memberikan pengaruh nyata yang mencakup bidang ekonomi, sosial, pendidikan, dan politik di Hindia Belanda.",
    "question": "Di bidang ekonomi dan pertanian, bagaimana dampak pembangunan saluran irigasi Politik Etis bagi masyarakat lokal?",
    "options": [
      "Memperkenalkan teknik pengairan modern dan membuka lahan persawahan baru meski distribusi air masih sering timpang",
      "Menghancurkan seluruh sistem sawah terasering tradisional Nusantara",
      "Menyebabkan kekeringan total di seluruh pelosok Pulau Jawa selama 50 tahun",
      "Mengharuskan rakyat hanya memakan gandum impor dari Eropa"
    ],
    "correct_answer": 0,
    "reward": 20,
    "damage": 15,
    "explanation": "Di bidang ekonomi, sistem irigasi memperkenalkan teknologi pengairan modern yang membantu perluasan sawah rakyat dan mencegah gagal panen, kendati perkebunan Belanda tetap diprioritaskan."
  },
  {
    "id": "PE_DP003",
    "category": "DAMPAK",
    "difficulty": "HARD",
    "title": "Suara Emansipasi Perempuan Bumiputra",
    "story": "Di Jepara dan Rembang, seorang putri bupati berkorespondensi dengan sahabat-sahabatnya di Eropa, menyuarakan jeritan wanita yang terbelenggu adat feodal.",
    "question": "Tokoh pahlawan wanita yang memanfaatkan era keterbukaan Politik Etis untuk memperjuangkan pendidikan bagi kaum perempuan adalah...",
    "options": [
      "Raden Ajeng Kartini",
      "Cut Nyak Dien",
      "Martha Christina Tiahahu",
      "Laksamana Malahayati"
    ],
    "correct_answer": 0,
    "reward": 30,
    "damage": 20,
    "explanation": "R.A. Kartini memperjuangkan emansipasi dan sekolah bagi kaum perempuan bumiputra melalui gagasan modernnya yang dihimpun dalam 'Habis Gelap Terbitlah Terang'."
  },
  {
    "id": "PE_DP004",
    "category": "DAMPAK",
    "difficulty": "EASY",
    "title": "Munculnya Pers Bumiputra",
    "story": "Golongan terpelajar tidak hanya bekerja sebagai birokrat, tetapi juga mulai menerbitkan surat kabar sendiri untuk menyuarakan aspirasi rakyat.",
    "question": "Tokoh wartawan perintis yang dijuluki Bapak Pers Nasional dan mendirikan surat kabar Medan Prijaji (1907) adalah...",
    "options": [
      "Tirto Adhi Soerjo (Raden Mas Djokomono)",
      "Mohammad Yamin",
      "Sayuti Melik",
      "Chairil Anwar"
    ],
    "correct_answer": 0,
    "reward": 10,
    "damage": 10,
    "explanation": "R.M. Tirto Adhi Soerjo adalah pelopor jurnalisme pribumi pertama melalui koran 'Medan Prijaji' yang diterbitkan dan dikelola sepenuhnya oleh orang bumiputra."
  },
  {
    "id": "PE_DP005",
    "category": "DAMPAK",
    "difficulty": "MEDIUM",
    "title": "Mobilitas Sosial Kaum Terpelajar",
    "story": "Sebelum era Politik Etis, kedudukan sosial seseorang mutlak ditentukan oleh keturunan darah biru (bangsawan feodal).",
    "question": "Bagaimanakah Politik Etis mengubah struktur penentuan status sosial dalam masyarakat Indonesia?",
    "options": [
      "Status sosial mulai ditentukan oleh tingkat pendidikan, keahlian profesi, dan ijazah, bukan semata-mata garis darah bangsawan",
      "Seluruh rakyat diwajibkan menjadi anggota kerajaan Belanda",
      "Gelar kebangsawanan dihapuskan oleh hukum internasional",
      "Masyarakat dilarang memiliki harta kekayaan pribadi"
    ],
    "correct_answer": 0,
    "reward": 20,
    "damage": 15,
    "explanation": "Pendidikan melahirkan mobilitas sosial baru: anak rakyat biasa yang berhasil lulus sekolah kedokteran atau keguruan dihargai tinggi di tengah masyarakat modern."
  },
  {
    "id": "PE_DP006",
    "category": "DAMPAK",
    "difficulty": "HARD",
    "title": "Integrasi Antaretnis Melalui Transmigrasi",
    "story": "Perpindahan penduduk dari Jawa ke wilayah Sumatra melahirkan perjumpaan kebudayaan baru antardaerah Nusantara.",
    "question": "Apa dampak sosiologis jangka panjang dari program pemindahan penduduk era Politik Etis?",
    "options": [
      "Terjalinnya interaksi dan integrasi kebudayaan antaretnis yang memperkuat rasa senasib sepenanggungan sebagai satu bangsa",
      "Terputusnya hubungan komunikasi total antara pulau Jawa dan Sumatra",
      "Punahnya bahasa Melayu di kepulauan Nusantara",
      "Terbentuknya perbatasan negara merdeka baru di Pulau Sumatra"
    ],
    "correct_answer": 0,
    "reward": 30,
    "damage": 20,
    "explanation": "Transmigrasi mempertemukan berbagai suku dari Jawa, Sunda, dan Melayu di perantauan, mengikis sekat kedaerahan dan mempercepat rasa persatuan nasional."
  },
  {
    "id": "PE_NS001",
    "category": "NASIONALISME",
    "difficulty": "EASY",
    "title": "Fajar Kebangkitan Nasional 1908",
    "story": "Pada tanggal 20 Mei 1908 di sebuah ruang kelas gedung STOVIA Batavia, para pemuda pelajar kedokteran berkumpul mendirikan sebuah perhimpunan bersejarah.",
    "question": "Organisasi pergerakan modern pertama di Indonesia yang didirikan pada tanggal 20 Mei 1908 dan menjadi tonggak Kebangkitan Nasional adalah...",
    "options": [
      "Budi Utomo",
      "Sarekat Dagang Islam",
      "Indische Partij",
      "Perhimpunan Indonesia"
    ],
    "correct_answer": 0,
    "reward": 10,
    "damage": 10,
    "explanation": "Budi Utomo didirikan oleh dr. Soetomo dan para mahasiswa STOVIA atas gagasan dr. Wahidin Soedirohoesodo pada 20 Mei 1908 (diperingati sebagai Hari Kebangkitan Nasional)."
  },
  {
    "id": "PE_NS002",
    "category": "NASIONALISME",
    "difficulty": "MEDIUM",
    "title": "Senjata Makan Tuan bagi Penjajah",
    "story": "Pemerintah kolonial Belanda tidak menduga bahwa kebijakan pendidikan yang mereka rancang justru menjadi bumerang besar yang menggoyahkan fondasi kekuasaan kolonial.",
    "question": "Mengapa Politik Etis kerap dijuluki sebagai 'Senjata Makan Tuan' bagi pemerintah kolonial Belanda?",
    "options": [
      "Pendidikan yang dibuka justru melahirkan kaum intelektual terpelajar yang menyadari penindasan dan memimpin gerakan kemerdekaan",
      "Para tentara KNIL membelot dan menggunakan senjata Belanda untuk menyerang benteng mereka sendiri",
      "Bendungan air yang dibangun jebol dan menenggelamkan kantor pusat VOC",
      "Pabrik senjata di Batavia mengalami ledakan yang melenyapkan seluruh amunisi Belanda"
    ],
    "correct_answer": 0,
    "reward": 20,
    "damage": 15,
    "explanation": "Disebut senjata makan tuan karena niat Belanda mencetak pegawai rendahan justru melahirkan pemikir-pemikir kritis yang menyatukan bangsa melawan penjajahan."
  },
  {
    "id": "PE_NS003",
    "category": "NASIONALISME",
    "difficulty": "HARD",
    "title": "Transformasi Bentuk Perjuangan",
    "story": "Sebelum abad ke-20, perlawanan rakyat Indonesia terhadap penjajah umumnya bersifat kedaerahan, dipimpin bangsawan atau tokoh agama karismatik, dan mudah dipatahkan.",
    "question": "Bagaimanakah perbedaan mendasar sifat perjuangan bangsa Indonesia SETELAH lahirnya kaum terpelajar era Politik Etis dibandingkan masa sebelumnya?",
    "options": [
      "Perjuangan beralih menggunakan organisasi modern, berwawasan nasional, menggunakan diplomasi pemikiran, dan tidak lagi bergantung pada satu sosok pemimpin",
      "Perjuangan hanya dilakukan melalui perang gerilya di hutan tanpa melibatkan masyarakat kota",
      "Rakyat Indonesia meminta bantuan militer dari negara-negara penjajah lainnya",
      "Perjuangan membatasi diri hanya untuk membela daerah asal masing-masing suku"
    ],
    "correct_answer": 0,
    "reward": 30,
    "damage": 20,
    "explanation": "Setelah era Politik Etis, perjuangan bangsa Indonesia bertransformasi dari perlawanan fisik kedaerahan menjadi gerakan terorganisasi secara modern, berideologi nasional, dan mencakup seluruh persatuan Nusantara."
  },
  {
    "id": "PE_NS004",
    "category": "NASIONALISME",
    "difficulty": "EASY",
    "title": "Tokoh Penggagas Studiefonds (Dana Pendidikan)",
    "story": "Seorang dokter priyayi senior berkeliling Pulau Jawa menggalang dana beasiswa bagi pemuda bumiputra cerdas yang terhambat biaya pendidikan.",
    "question": "Siapakah dokter priyayi penggagas dana pendidikan (studiefonds) yang menginspirasi pendirian Budi Utomo?",
    "options": [
      "dr. Wahidin Soedirohoesodo",
      "dr. Tjipto Mangoenkoesoemo",
      "Ki Hajar Dewantara",
      "H.O.S. Tjokroaminoto"
    ],
    "correct_answer": 0,
    "reward": 10,
    "damage": 10,
    "explanation": "dr. Wahidin Soedirohoesodo memprakarsai kampanye pengumpulan dana pendidikan dan memotivasi para pelajar STOVIA di Batavia untuk bersatu."
  },
  {
    "id": "PE_NS005",
    "category": "NASIONALISME",
    "difficulty": "MEDIUM",
    "title": "Tiga Serangkai & Indische Partij",
    "story": "Pada tahun 1912 berdiri organisasi politik pertama di Indonesia yang secara terang-terangan menuntut kemerdekaan dari penjajahan Belanda.",
    "question": "Organisasi politik pertama yang dipimpin oleh 'Tiga Serangkai' (Douwes Dekker, Suwardi Suryaningrat, Tjipto Mangoenkoesoemo) adalah...",
    "options": [
      "Indische Partij",
      "Sarekat Islam",
      "Partai Nasional Indonesia",
      "Gerakan Indonesia Muda"
    ],
    "correct_answer": 0,
    "reward": 20,
    "damage": 15,
    "explanation": "Indische Partij (1912) adalah organisasi politik murni pertama di Hindia Belanda yang mengusung slogan 'Indie voor Indiers' (Hindia untuk orang Hindia)."
  },
  {
    "id": "PE_NS006",
    "category": "NASIONALISME",
    "difficulty": "HARD",
    "title": "Pamflet Satire Suwardi Suryaningrat",
    "story": "Pada tahun 1913, Belanda berencana merayakan 100 tahun kemerdekaannya dari Prancis dengan menarik uang sumbangan dari rakyat jajahan.",
    "question": "Apa judul pamflet protes menggemparkan yang ditulis Suwardi Suryaningrat (Ki Hajar Dewantara) untuk mengecam rencana perayaan Belanda tersebut?",
    "options": [
      "Als Ik Eens Nederlander Was (Andai Aku Seorang Belanda)",
      "Habis Gelap Terbitlah Terang",
      "Max Havelaar",
      "Een Eereschuld"
    ],
    "correct_answer": 0,
    "reward": 30,
    "damage": 20,
    "explanation": "Pamflet 'Als Ik Eens Nederlander Was' (1913) secara pedas mengecam ironi Belanda yang ingin merayakan kemerdekaan di atas tanah bangsa yang sedang dijajahnya."
  }
];

let historyQuestManager = null;
