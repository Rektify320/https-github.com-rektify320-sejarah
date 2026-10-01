// --- 6. GENSHIN DIALOGUE MANAGER DENGAN SUARA BERBEDA-BEDA ---
class GenshinDialogueManager {
  constructor() {
    this.layer = document.getElementById('dialogue-layer');
    this.contentEl = document.getElementById('dialogueContent');
    this.nameEl = document.getElementById('dialogueName');
    this.roleEl = document.getElementById('dialogueRole');
    this.choicesEl = document.getElementById('dialogueChoices');
    this.speakerCanvas = document.getElementById('speakerAvatarCanvas');
    this.autoBtn = document.getElementById('autoDialogueBtn');
    this.skipBtn = document.getElementById('skipDialogueBtn');

    this.isActive = false;
    this.currentScript = null;
    this.stepIndex = 0;
    this.typewriterTimer = null;
    this.isTyping = false;
    this.fullText = "";
    this.displayedText = "";
    this.charIndex = 0;
    this.isAuto = false;
    this.autoAdvanceTimer = null;

    this.bindEvents();
    this.startRenderLoop();
  }

  bindEvents() {
    document.querySelector('.dialogue-box').addEventListener('click', (e) => {
      if (e.target.closest('.choice-btn') || e.target.closest('.mini-btn')) return;
      this.handleUserAdvance();
    });

    window.addEventListener('keydown', (e) => {
      if (!this.isActive) return;
      
      // GENSHIN GADGET HOTKEYS
      if (e.key === 'v' || e.key === 'V') { toggleVisionMode(); }
      if (e.key === 'k' || e.key === 'K') { enterPhotoMode(); }
      if (e.key === 'b' || e.key === 'B') { openHistoricalBag(); }
      if (e.key === 't' || e.key === 'T') { triggerSonarCompass(); }
      if (e.key === 'Escape') {
        if (document.getElementById('photoModeLayer').classList.contains('active')) {
          exitPhotoMode();
        } else {
          openPaimonMenu();
        }
      }

      if (e.key === ' ' || e.key === 'Enter') {
        this.handleUserAdvance();
      }
    });

    this.autoBtn.addEventListener('click', () => {
      this.isAuto = !this.isAuto;
      this.autoBtn.innerText = this.isAuto ? "▶ Auto: ON" : "▶ Auto: OFF";
      this.autoBtn.style.background = this.isAuto ? "rgba(229, 193, 88, 0.4)" : "";
      if (this.isAuto && !this.isTyping) {
        this.scheduleAutoAdvance();
      }
    });

    this.skipBtn.addEventListener('click', () => {
      this.skipDialogue();
    });
  }

  startRenderLoop() {
    const loop = () => {
      if (this.isActive && this.currentScript) {
        const step = this.currentScript[this.stepIndex];
        if (step) {
          genshinRenderer.update(this.isTyping);
          genshinRenderer.draw(this.speakerCanvas, step.characterKey);
        }
      }
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  startDialogue(scriptKey, npcContext) {
    const script = DIALOGUE_SCRIPTS[scriptKey];
    if (!script || script.length === 0) return;

    this.isActive = true;
    this.currentScript = script;
    this.stepIndex = 0;
    this.npcContext = npcContext || null;

    document.getElementById('game-container').classList.add('cinematic-active');
    this.layer.classList.add('active');

    this.showStep();
  }

  showStep() {
    if (!this.currentScript || this.stepIndex >= this.currentScript.length) {
      this.endDialogue();
      return;
    }

    const step = this.currentScript[this.stepIndex];
    if (step.onEnter) {
      step.onEnter();
    }
    this.nameEl.innerText = step.speaker;
    this.roleEl.innerText = step.role || "✦ SEJARAH ✦";

    this.fullText = step.text;
    this.displayedText = "";
    this.charIndex = 0;
    this.isTyping = true;
    this.choicesEl.innerHTML = "";

    if (this.typewriterTimer) clearInterval(this.typewriterTimer);
    if (this.autoAdvanceTimer) clearTimeout(this.autoAdvanceTimer);

    // Mainkan suara narasi manusia asli yang disesuaikan per karakter!
    sound.speakCharacterLine(this.fullText, step.characterKey);

    this.typewriterTimer = setInterval(() => {
      if (this.charIndex < this.fullText.length) {
        this.displayedText += this.fullText[this.charIndex];
        this.contentEl.innerHTML = this.displayedText + '<span class="dialogue-cursor"></span>';
        if (this.charIndex % 2 === 0) {
          // Mainkan suara blip instrumen unik per karakter!
          sound.playTypewriterBlipFor(step.characterKey);
        }
        this.charIndex++;
      } else {
        this.finishTyping();
      }
    }, 24);
  }

  finishTyping() {
    clearInterval(this.typewriterTimer);
    this.isTyping = false;
    this.contentEl.innerHTML = this.fullText;

    const step = this.currentScript[this.stepIndex];
    if (step.choices && step.choices.length > 0) {
      this.renderChoices(step.choices);
    } else if (this.isAuto) {
      this.scheduleAutoAdvance();
    }
  }

  renderChoices(choices) {
    this.choicesEl.innerHTML = "";

    // Tambahkan opsi History Quest jika sedang berbicara dengan tokoh/NPC
    const effectiveChoices = [...choices];
    if (this.npcContext && !effectiveChoices.some(c => c.triggerQuest)) {
      effectiveChoices.push({
        text: "📜 Ambil History Quest Tokoh Ini! [Q]",
        triggerQuest: true
      });
    }

    effectiveChoices.forEach(c => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      if (c.triggerQuest) {
        btn.style.borderColor = '#d4af37';
        btn.style.background = 'rgba(212, 175, 55, 0.15)';
      }
      btn.innerHTML = `<span class="choice-diamond" ${c.triggerQuest ? 'style="background: #d4af37;"' : ''}></span> <span>${c.text}</span>`;
      btn.addEventListener('mouseenter', () => sound.playChoiceHover());
      btn.addEventListener('click', () => {
        sound.playSelect();
        sound.stopSpeaking();
        const step = this.currentScript[this.stepIndex];
        if (step && step.onEnd) {
          step.onEnd();
        }
        if (c.triggerQuest) {
          this.endDialogue();
          if (typeof historyQuestManager !== 'undefined' && historyQuestManager) {
            historyQuestManager.startQuestForNpc(this.npcContext);
          }
          return;
        }
        if (c.action && typeof c.action === 'function') {
          c.action();
        }
        if (c.nextKey) {
          this.currentScript = DIALOGUE_SCRIPTS[c.nextKey];
          this.stepIndex = 0;
          this.showStep();
        } else {
          this.nextStep();
        }
      });
      this.choicesEl.appendChild(btn);
    });
  }

  scheduleAutoAdvance() {
    if (this.autoAdvanceTimer) clearTimeout(this.autoAdvanceTimer);
    this.autoAdvanceTimer = setTimeout(() => {
      if (this.isActive && !this.isTyping) {
        this.handleUserAdvance();
      }
    }, 2400);
  }

  handleUserAdvance() {
    if (this.isTyping) {
      this.finishTyping();
    } else {
      const step = this.currentScript[this.stepIndex];
      if (step.choices && step.choices.length > 0) return;
      this.nextStep();
    }
  }

  nextStep() {
    sound.stopSpeaking();
    const step = this.currentScript[this.stepIndex];
    if (step && step.onEnd) {
      step.onEnd();
    }

    this.stepIndex++;
    if (this.stepIndex < this.currentScript.length) {
      this.showStep();
    } else {
      this.endDialogue();
    }
  }

  skipDialogue() {
    sound.stopSpeaking();
    const step = this.currentScript[this.stepIndex];
    if (step && step.onEnd) {
      step.onEnd();
    }
    this.endDialogue();
  }

  endDialogue() {
    this.isActive = false;
    sound.stopSpeaking();
    clearInterval(this.typewriterTimer);
    if (this.autoAdvanceTimer) clearTimeout(this.autoAdvanceTimer);

    document.getElementById('game-container').classList.remove('cinematic-active');
    this.layer.classList.remove('active');
  }
}