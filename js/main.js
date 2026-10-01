// --- 8. INITIALIZATION & MAIN GAME LOOP ---
let charRenderer;
let questManager;
let achievementManager;
let dialogueManager;
let world;

function safeOn(id, event, handler) {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener(event, handler);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  charRenderer = new GenshinCharacterRenderer();
  questManager = new QuestManager();
  achievementManager = new AchievementManager();
  dialogueManager = new GenshinDialogueManager();
  world = new GameWorld();

  if (typeof HistoryQuestManager !== 'undefined') {
    historyQuestManager = new HistoryQuestManager();
  }

  safeOn('openPlayerProfileBtn', 'click', () => {
    if (historyQuestManager) historyQuestManager.promptPlayerName();
  });

  safeOn('mobileQuestBtn', 'click', () => {
    if (historyQuestManager) {
      const nearby = (typeof world !== 'undefined' && world) ? world.getClosestInteractiveNPC() : null;
      if (nearby) {
        historyQuestManager.startQuestForNpc(nearby);
      } else {
        historyQuestManager.startQuest();
      }
    }
  });

  // Top action bar buttons
  const audioBtn = document.getElementById('audioToggleBtn');
  const audioIcon = document.getElementById('audioIcon');
  const audioLabel = document.getElementById('audioLabel');
  if (audioBtn) {
    audioBtn.addEventListener('click', () => {
      const isMuted = sound.toggleMute();
      if (audioIcon) audioIcon.innerText = isMuted ? '🔇' : '🔊';
      if (audioLabel) audioLabel.innerText = isMuted ? 'Audio OFF' : 'Audio ON';
      audioBtn.classList.toggle('active', !isMuted);
    });
  }

  const voiceBtn = document.getElementById('voiceModeToggleBtn');
  const voiceIcon = document.getElementById('voiceModeIcon');
  const voiceLabel = document.getElementById('voiceModeLabel');
  if (voiceBtn) {
    voiceBtn.addEventListener('click', () => {
      sound.toggleVoiceMode();
      const isSpeech = sound.useSpeechSynthesis;
      if (voiceIcon) voiceIcon.innerText = isSpeech ? '🎙️' : '🎵';
      if (voiceLabel) voiceLabel.innerText = isSpeech ? 'Suara: Manusia (TTS)' : 'Suara: Blip Synth';
      voiceBtn.classList.toggle('active', isSpeech);
    });
  }

  safeOn('openSummaryBtn', 'click', () => {
    sound.playSelect();
    const m = document.getElementById('summaryModal');
    if (m) m.classList.add('open');
  });
  safeOn('closeSummaryModal', 'click', () => {
    sound.playSelect();
    const m = document.getElementById('summaryModal');
    if (m) m.classList.remove('open');
  });

  safeOn('openTokohBtn', 'click', () => {
    sound.playSelect();
    const m = document.getElementById('tokohModal');
    if (m) m.classList.add('open');
  });
  safeOn('switchCharBtn', 'click', () => {
    if (world) world.switchCharacter();
  });
  safeOn('closeTokohModal', 'click', () => {
    sound.playSelect();
    const m = document.getElementById('tokohModal');
    if (m) m.classList.remove('open');
  });

  safeOn('openAchieveBtn', 'click', () => {
    sound.playSelect();
    achievementManager.renderModalList();
    const m = document.getElementById('achieveModal');
    if (m) m.classList.add('open');
  });
  safeOn('closeAchieveModal', 'click', () => {
    sound.playSelect();
    const m = document.getElementById('achieveModal');
    if (m) m.classList.remove('open');
  });

  // Help & Controls Modal (supports both howToPlayModal and helpModal)
  const openHelp = () => {
    sound.playSelect();
    const m = document.getElementById('howToPlayModal') || document.getElementById('helpModal');
    if (m) m.classList.add('open');
  };
  const closeHelp = () => {
    sound.playSelect();
    const m = document.getElementById('howToPlayModal') || document.getElementById('helpModal');
    if (m) m.classList.remove('open');
  };
  safeOn('howToPlayBtn', 'click', openHelp);
  safeOn('closeHowToPlayModal', 'click', closeHelp);
  safeOn('closeHelpModal', 'click', closeHelp);

  // Gadget Bar Listeners
  safeOn('btnVision', 'click', () => toggleVisionMode());
  safeOn('btnSonar', 'click', () => triggerSonarCompass());
  safeOn('btnBag', 'click', () => openHistoricalBag());
  safeOn('btnPhoto', 'click', () => enterPhotoMode());

  // Paimon Avatar & Menu Listeners
  safeOn('openPaimonBtn', 'click', () => openPaimonMenu());
  safeOn('closePaimonMenu', 'click', () => closePaimonMenu());

  // Paimon Menu Tiles
  safeOn('tileTimeSkip', 'click', () => cycleTimeOfDay());
  safeOn('tileBag', 'click', () => { closePaimonMenu(); openHistoricalBag(); });
  safeOn('tileInfographic', 'click', () => { closePaimonMenu(); openInfographicModal(); });
  safeOn('tileSwitchChar', 'click', () => {
    closePaimonMenu();
    if (world) world.switchCharacter();
  });
  safeOn('tileTokoh', 'click', () => {
    closePaimonMenu();
    const m = document.getElementById('tokohModal');
    if (m) m.classList.add('open');
  });
  safeOn('tileAchieve', 'click', () => {
    closePaimonMenu();
    achievementManager.renderModalList();
    const m = document.getElementById('achieveModal');
    if (m) m.classList.add('open');
  });
  safeOn('tilePhoto', 'click', () => enterPhotoMode());
  safeOn('tileAudio', 'click', () => {
    closePaimonMenu();
    if (audioBtn) audioBtn.click();
  });
  safeOn('tileHelp', 'click', () => {
    closePaimonMenu();
    openHelp();
  });

  // Bag & Document Detail Listeners
  safeOn('closeBagModal', 'click', () => closeHistoricalBag());
  safeOn('closeDocDetail', 'click', () => closeDocumentDetail());
  safeOn('docCloseBtn', 'click', () => closeDocumentDetail());

  // Photo Mode Listeners
  safeOn('photoExitBtn', 'click', () => exitPhotoMode());
  safeOn('photoFilterBtn', 'click', () => cyclePhotoFilter());
  safeOn('photoPoseBtn', 'click', () => cyclePlayerPose());
  safeOn('photoShutterBtn', 'click', () => captureScreenshot());

  // Infographic, Chapter Recap & Quiz Listeners
  safeOn('openInfographicBtn', 'click', () => openInfographicModal());
  safeOn('closeInfographicModal', 'click', () => closeInfographicModal());
  safeOn('closeRecapModal', 'click', () => closeChapterRecapModal());
  safeOn('recapContinueBtn', 'click', () => closeChapterRecapModal());
  safeOn('recapViewInfographicBtn', 'click', () => {
    closeChapterRecapModal();
    openInfographicModal();
  });
  safeOn('openQuizBtn', 'click', () => {
    sound.playSelect();
    openEvaluationQuizModal();
  });

  // Start Animation Loop
  requestAnimationFrame(gameLoop);
});

function gameLoop() {
  if (world) {
    world.update();
    world.draw();
  }
  requestAnimationFrame(gameLoop);
}
