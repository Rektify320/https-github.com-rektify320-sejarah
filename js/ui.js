// ==========================================================================
// GENSHIN GADGET TOOLBAR & PAIMON MENU LOGIC
// ==========================================================================

function toggleVisionMode() {
  if (!world) return;
  world.visionModeActive = !world.visionModeActive;
  const vignette = document.getElementById('visionVignette');
  const btn = document.getElementById('btnVision');
  if (world.visionModeActive) {
    vignette.classList.add('active');
    btn.classList.add('active');
    sound.playAchievementFanfare();
    world.spawnFloatingText("👁️ Lensa Penglihatan Sejarah: AKTIF!", world.player.x, world.player.y - 35, "#e5c158");
  } else {
    vignette.classList.remove('active');
    btn.classList.remove('active');
    sound.playSelect();
  }
}

function triggerSonarCompass() {
  if (!world) return;
  world.triggerSonar();
}

function openPaimonMenu() {
  sound.playSelect();
  document.getElementById('paimonMenuModal').classList.add('open');
}

function closePaimonMenu() {
  sound.playSelect();
  document.getElementById('paimonMenuModal').classList.remove('open');
}

function openHistoricalBag() {
  sound.playSelect();
  renderBagItems();
  document.getElementById('bagModal').classList.add('open');
}

function closeHistoricalBag() {
  sound.playSelect();
  document.getElementById('bagModal').classList.remove('open');
}

function renderBagItems() {
  const container = document.getElementById('bagItemsContainer');
  if (!container) return;

  let html = '';
  HISTORICAL_DOCUMENTS_DATA.forEach(doc => {
    html += `
      <div class="bag-item-card" onclick="viewDocumentDetail('${doc.id}')">
        <div class="bag-item-stars">${doc.stars}</div>
        <div class="bag-item-icon">${doc.icon}</div>
        <div class="bag-item-name">${doc.title}</div>
        <div class="bag-item-era">${doc.era}</div>
      </div>
    `;
  });
  container.innerHTML = html;
}

function viewDocumentDetail(docId) {
  const doc = HISTORICAL_DOCUMENTS_DATA.find(d => d.id === docId);
  if (!doc) return;

  sound.playSelect();
  document.getElementById('docTitle').innerText = doc.title;
  document.getElementById('docQuote').innerText = doc.quote;
  document.getElementById('docText').innerText = doc.text;
  document.getElementById('docDetailModal').classList.add('open');
}

function closeDocumentDetail() {
  sound.playSelect();
  document.getElementById('docDetailModal').classList.remove('open');
}

// PHOTO MODE FUNCTIONS
function enterPhotoMode() {
  sound.playSelect();
  closePaimonMenu();
  document.getElementById('photoModeLayer').classList.add('active');
  document.getElementById('hudLayer').style.display = 'none';
}

function exitPhotoMode() {
  sound.playSelect();
  document.getElementById('photoModeLayer').classList.remove('active');
  document.getElementById('hudLayer').style.display = 'block';
}

function cyclePhotoFilter() {
  const filters = ['normal', 'vintage', 'sepia', 'noir', 'vibrant'];
  const labels = {
    'normal': 'FILTER: NORMAL ASLI',
    'vintage': 'FILTER: VINTAGE 1901',
    'sepia': 'FILTER: SEPIA KOLONIAL',
    'noir': 'FILTER: MONOKROM NOIR',
    'vibrant': 'FILTER: GENSHIN VIBRANT'
  };
  const curIdx = filters.indexOf(world.photoFilter);
  const nextIdx = (curIdx + 1) % filters.length;
  world.photoFilter = filters[nextIdx];
  document.getElementById('photoFilterLabel').innerText = labels[world.photoFilter];
  sound.playSelect();
}

function cyclePlayerPose() {
  const poses = ['normal', 'hormat', 'berpikir', 'tunjuk'];
  const curIdx = poses.indexOf(world.playerPose);
  world.playerPose = poses[(curIdx + 1) % poses.length];
  world.spawnFloatingText(`Pose: ${world.playerPose.toUpperCase()}`, world.player.x, world.player.y - 30);
  sound.playSelect();
}

function captureScreenshot() {
  sound.playAchievementFanfare();
  const canvas = document.getElementById('worldCanvas');
  const link = document.createElement('a');
  link.download = 'Kronika_Nusantara_Politik_Etis_1901.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
  world.spawnFloatingText("📸 Foto Berhasil Disimpan!", world.player.x, world.player.y - 40, "#2ecc71");
}

function cycleTimeOfDay() {
  const times = ['pagi', 'siang', 'senja', 'malam'];
  const curIdx = times.indexOf(world.timeOfDay);
  world.timeOfDay = times[(curIdx + 1) % times.length];
  sound.playSelect();
  world.spawnFloatingText(`Waktu Dunia: ${world.timeOfDay.toUpperCase()}`, world.player.x, world.player.y - 40, "#e5c158");
  closePaimonMenu();
}

// ==========================================================================
// INFOGRAPHIC TIMELINE MODAL & CHAPTER RECAP HANDLERS
// ==========================================================================

function renderInfographicModal() {
  const container = document.getElementById('infographicBodyContent');
  if (!container) return;

  const currentQuestIdx = questManager ? questManager.currentQuestIndex : 0;

  let html = `
    <div class="timeline-container">
  `;

  INFOGRAPHIC_TIMELINE_DATA.forEach((item, idx) => {
    const isCompleted = currentQuestIdx > idx;
    const isActive = currentQuestIdx === idx;
    const isLocked = currentQuestIdx < idx;

    let rowClass = item.side === 'left' ? 'timeline-row left-side' : 'timeline-row right-side';
    if (isCompleted) rowClass += ' completed';
    else if (isActive) rowClass += ' active';

    let badgeClass = isCompleted ? 'timeline-badge done' : (isActive ? 'timeline-badge current' : 'timeline-badge locked');
    let badgeText = isCompleted ? '✓ SELESAI' : (isActive ? '⚡ MISI AKTIF' : '🔒 BELUM TERBUKA');

    html += `
      <div class="${rowClass}">
        <div class="timeline-content-box" onclick="showChapterRecap(${item.id})">
          <span class="${badgeClass}">${badgeText}</span>
          <div class="timeline-box-title">${item.title}</div>
          <div class="timeline-box-desc">
            <p>${item.summary}</p>
            <ul>
              ${item.fullDetails.map(d => `<li>${d}</li>`).join('')}
            </ul>
          </div>
        </div>
        <div class="timeline-node-pin">${item.chapter}</div>
      </div>
    `;
  });

  html += `
    </div>
    <div style="margin-top: 30px; text-align: center; border-top: 1.5px solid rgba(100,73,40,0.3); padding-top: 15px; font-size: 13px; color: #644928;">
      <svg width="40" height="40" viewBox="0 0 100 100" fill="none" stroke="#7b241c" stroke-width="2.5" style="display: block; margin: 0 auto 6px auto;">
        <circle cx="50" cy="50" r="40"/>
        <polygon points="50,15 57,43 85,50 57,57 50,85 43,57 15,50 43,43" fill="#7b241c"/>
      </svg>
      <strong>✦ SUMBER SEJARAH: TRILOGI VAN DEVENTER & KEBIJAKAN POLITIK ETIS (1901–1908) ✦</strong>
      <div style="font-size: 11px; margin-top: 3px;">Klik setiap babak di atas untuk membaca ulang penjelasan mendalam dan mini-refleksi.</div>
    </div>
  `;

  container.innerHTML = html;
}

function openInfographicModal() {
  sound.playInteractBeep();
  renderInfographicModal();
  document.getElementById('infographicModal').classList.add('open');
}

function closeInfographicModal() {
  sound.playInteractBeep();
  document.getElementById('infographicModal').classList.remove('open');
}

function showChapterRecap(chapterId) {
  const data = INFOGRAPHIC_TIMELINE_DATA.find(d => d.id === chapterId);
  if (!data) return;

  sound.playQuestComplete();

  const modal = document.getElementById('chapterRecapModal');
  const badge = document.getElementById('recapBadge');
  const title = document.getElementById('recapTitle');
  const quote = document.getElementById('recapQuote');
  const desc = document.getElementById('recapDesc');
  const quizQ = document.getElementById('recapQuizQuestion');
  const quizOpts = document.getElementById('recapQuizOptions');
  const quizFeedback = document.getElementById('recapQuizFeedback');

  badge.innerText = `✦ BABAK ${data.chapter}: ${data.section} ✦`;
  title.innerText = data.title;
  quote.innerText = data.quote;

  let descHtml = `<p style="margin-bottom: 8px;">${data.summary}</p><ul style="padding-left: 20px; line-height: 1.6;">`;
  data.fullDetails.forEach(d => {
    descHtml += `<li style="margin-bottom: 6px;">${d}</li>`;
  });
  descHtml += `</ul>`;
  desc.innerHTML = descHtml;

  // Mini Quiz
  quizQ.innerText = data.quiz.question;
  quizFeedback.innerHTML = '';
  quizOpts.innerHTML = '';

  data.quiz.options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = 'recap-quiz-opt';
    btn.innerText = opt.text;
    btn.onclick = () => handleQuizOptionClick(btn, opt.correct, data.quiz.explanation, quizOpts, quizFeedback);
    quizOpts.appendChild(btn);
  });

  modal.classList.add('open');
}

function handleQuizOptionClick(selectedBtn, isCorrect, explanation, optionsContainer, feedbackEl) {
  const allBtns = optionsContainer.querySelectorAll('.recap-quiz-opt');
  allBtns.forEach(b => b.disabled = true);

  if (isCorrect) {
    selectedBtn.classList.add('correct');
    sound.playAchievementFanfare();
    feedbackEl.innerHTML = `<span style="color: #2ecc71;">✓ BENAR! ${explanation}</span>`;
  } else {
    selectedBtn.classList.add('wrong');
    sound.playInteractBeep();
    feedbackEl.innerHTML = `<span style="color: #e74c3c;">✗ Belum tepat. ${explanation}</span>`;
  }
}

function closeChapterRecapModal() {
  sound.playInteractBeep();
  document.getElementById('chapterRecapModal').classList.remove('open');
}

// ==========================================================================
// 1. MODUL UJIAN EVALUASI KEBANGKITAN NASIONAL (10 SOAL) & SERTIFIKAT DIGITAL
// ==========================================================================
let currentQuizIndex = 0;
let quizScore = 0;
let quizUserAnswers = [];

function openEvaluationQuizModal() {
  if (typeof sound !== 'undefined' && sound.playSelect) sound.playSelect();
  currentQuizIndex = 0;
  quizScore = 0;
  quizUserAnswers = [];
  document.getElementById('quizIntroSection').style.display = 'block';
  document.getElementById('quizQuestionSection').style.display = 'none';
  document.getElementById('quizResultSection').style.display = 'none';
  document.getElementById('evaluationQuizModal').classList.add('open');
}

function closeEvaluationQuizModal() {
  if (typeof sound !== 'undefined' && sound.playSelect) sound.playSelect();
  document.getElementById('evaluationQuizModal').classList.remove('open');
}

function startEvaluationQuiz() {
  const nameInput = document.getElementById('studentNameInput');
  const studentName = nameInput.value.trim();
  if (!studentName) {
    alert("Silakan masukkan nama lengkap siswa terlebih dahulu untuk penerbitan Sertifikat Kelulusan!");
    nameInput.focus();
    return;
  }
  if (typeof sound !== 'undefined' && sound.playAchievementFanfare) sound.playAchievementFanfare();
  document.getElementById('quizIntroSection').style.display = 'none';
  document.getElementById('quizQuestionSection').style.display = 'block';
  currentQuizIndex = 0;
  quizScore = 0;
  quizUserAnswers = [];
  renderQuizQuestion();
}

function renderQuizQuestion() {
  if (typeof EVALUATION_QUIZ_DATA === 'undefined') return;
  const q = EVALUATION_QUIZ_DATA[currentQuizIndex];
  if (!q) return;

  document.getElementById('quizProgressBadge').innerText = `SOAL ${currentQuizIndex + 1} / ${EVALUATION_QUIZ_DATA.length}`;
  document.getElementById('quizQuestionText').innerText = q.question;
  document.getElementById('quizFeedbackBox').innerHTML = '';

  const optionsContainer = document.getElementById('quizOptionsContainer');
  optionsContainer.innerHTML = '';

  q.options.forEach((optText, idx) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-option-btn';
    btn.innerHTML = `<span class="opt-letter">${String.fromCharCode(65 + idx)}</span> <span class="opt-text">${optText}</span>`;
    btn.onclick = () => selectQuizAnswer(idx, q.answer, q.explanation, btn, optionsContainer);
    optionsContainer.appendChild(btn);
  });
}

function selectQuizAnswer(selectedIndex, correctIndex, explanation, clickedBtn, container) {
  const allBtns = container.querySelectorAll('.quiz-option-btn');
  allBtns.forEach(b => b.disabled = true);

  const isCorrect = (selectedIndex === correctIndex);
  if (isCorrect) {
    quizScore += 10;
    clickedBtn.classList.add('correct');
    if (typeof sound !== 'undefined' && sound.playAchievementFanfare) sound.playAchievementFanfare();
    document.getElementById('quizFeedbackBox').innerHTML = `
      <div class="feedback-alert success">
        <strong>✓ JAWABAN BENAR (+10 Poin)</strong><br>${explanation}
      </div>
    `;
  } else {
    clickedBtn.classList.add('wrong');
    allBtns[correctIndex].classList.add('highlight-correct');
    if (typeof sound !== 'undefined' && sound.playInteractBeep) sound.playInteractBeep();
    document.getElementById('quizFeedbackBox').innerHTML = `
      <div class="feedback-alert error">
        <strong>✗ KURANG TEPAT</strong><br>${explanation}
      </div>
    `;
  }

  // Next Question or Finish Button
  const nextBtn = document.createElement('button');
  nextBtn.className = 'btn-recap-next';
  nextBtn.style.marginTop = '14px';
  nextBtn.innerText = (currentQuizIndex < EVALUATION_QUIZ_DATA.length - 1) ? 'Soal Berikutnya ➔' : 'Lihat Hasil & Sertifikat 🏆';
  nextBtn.onclick = () => {
    if (currentQuizIndex < EVALUATION_QUIZ_DATA.length - 1) {
      currentQuizIndex++;
      renderQuizQuestion();
    } else {
      showQuizResults();
    }
  };
  document.getElementById('quizFeedbackBox').appendChild(nextBtn);
}

function showQuizResults() {
  document.getElementById('quizQuestionSection').style.display = 'none';
  document.getElementById('quizResultSection').style.display = 'block';

  const studentName = document.getElementById('studentNameInput').value.trim() || "Siswa Sejarah Nusantara";
  const finalScore = quizScore;
  let grade = "C";
  let predicate = "Cukup Memahami";
  let stars = "★★★☆☆";

  if (finalScore >= 90) {
    grade = "A+ (Istimewa)";
    predicate = "Sangat Mahir & Menguasai Sejarah Politik Etis";
    stars = "★★★★★";
  } else if (finalScore >= 75) {
    grade = "A (Baik Sekali)";
    predicate = "Menguasai Konsep Politik Balas Budi";
    stars = "★★★★☆";
  } else if (finalScore >= 60) {
    grade = "B (Kompeten)";
    predicate = "Memahami Garis Besar Materi";
    stars = "★★★☆☆";
  }

  // Update Certificate UI
  document.getElementById('certStudentName').innerText = studentName;
  document.getElementById('certScore').innerText = `${finalScore} / 100`;
  document.getElementById('certGrade').innerText = grade;
  document.getElementById('certPredicate').innerText = predicate;
  document.getElementById('certStars').innerText = stars;
  document.getElementById('certDate').innerText = new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });

  if (typeof sound !== 'undefined' && sound.playVictoryTrumpet) {
    sound.playVictoryTrumpet();
  }
}

// CETAK / SIMPAN PDF SERTIFIKAT
function printCertificate() {
  window.print();
}

// ==========================================================================
// 2. CETAK / SIMPAN PDF RANGKUMAN MATERI LENGKAP
// ==========================================================================
function printSummaryDocument() {
  const content = document.getElementById('summaryModal').querySelector('.modal-body').innerHTML;
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Rangkuman Materi: Trilogi Politik Etis Van Deventer</title>
      <style>
        body { font-family: 'Times New Roman', serif; line-height: 1.6; padding: 40px; color: #111; }
        h1 { text-align: center; font-size: 22px; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
        h2 { font-size: 16px; margin-top: 20px; color: #2c3e50; border-bottom: 1px solid #ccc; padding-bottom: 4px; }
        p { margin: 8px 0; font-size: 13.5px; text-align: justify; }
        strong { color: #000; }
        .footer { margin-top: 40px; text-align: right; font-size: 12px; font-style: italic; }
      </style>
    </head>
    <body>
      <h1>RANGKUMAN MATERI SEJARAH: TRILOGI POLITIK ETIS (1901–1908)</h1>
      <p style="text-align:center; font-style:italic;">Kurikulum Sejarah Indonesia — Proyek Eksplorasi Pembelajaran 2D</p>
      ${content}
      <div class="footer">Dicetak secara otomatis melalui Game Sejarah Nusantara — ${new Date().toLocaleDateString('id-ID')}</div>
      <script>window.onload = function() { window.print(); }<\/script>
    </body>
    </html>
  `);
  printWindow.document.close();
}

// ==========================================================================
// 3. GENSHIN QUEST CLEAR BANNER POP-UP (EMAS BERKILAU)
// ==========================================================================
let questBannerTimeout = null;
function showQuestClearBanner(questTitle, expAmount) {
  const banner = document.getElementById('questClearBanner');
  if (!banner) return;

  document.getElementById('questClearTitle').innerText = questTitle;
  document.getElementById('questClearExp').innerText = `+${expAmount} EXP SEJARAH`;

  banner.classList.remove('active');
  void banner.offsetWidth; // Force CSS reflow
  banner.classList.add('active');

  if (questBannerTimeout) clearTimeout(questBannerTimeout);
  questBannerTimeout = setTimeout(() => {
    banner.classList.remove('active');
  }, 4200);
}

// ==========================================================================
// 4. MODAL PETI HARTA KARUN ARTEFAK DITEMUKAN
// ==========================================================================
function showChestFoundModal(chest) {
  document.getElementById('chestModalTitle').innerText = chest.title;
  document.getElementById('chestModalItem').innerText = chest.item;
  document.getElementById('chestModalDesc').innerText = chest.desc;
  document.getElementById('chestModalExp').innerText = `+${chest.exp} EXP`;
  document.getElementById('chestFoundModal').classList.add('open');
}

function closeChestFoundModal() {
  if (typeof sound !== 'undefined' && sound.playSelect) sound.playSelect();
  document.getElementById('chestFoundModal').classList.remove('open');
}

