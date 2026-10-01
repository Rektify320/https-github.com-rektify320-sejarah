// --- 7. QUEST & ACHIEVEMENT MANAGERS ---

class QuestManager {
  constructor() {
    this.currentQuestIndex = 0;
    this.quests = QUESTS_DATA;
    this.titleEl = document.getElementById('questTitle');
    this.descEl = document.getElementById('questDesc');
    this.stepEl = document.getElementById('questStep');
    this.render();
  }

  render() {
    const q = this.quests[this.currentQuestIndex];
    if (!q) return;
    this.titleEl.innerText = q.title;
    this.descEl.innerText = q.desc;
    this.stepEl.innerText = `✦ Misi: ${q.id} / ${this.quests.length - 1}`;
  }

  completeQuest(questId) {
    if (questId && questId <= this.currentQuestIndex) {
      // Already completed this quest
      return;
    }
    const completedQuest = this.quests[this.currentQuestIndex];
    sound.playQuestComplete();

    // Trigger Genshin Quest Clear Banner pop-up
    if (typeof showQuestClearBanner === 'function' && completedQuest) {
      showQuestClearBanner(completedQuest.title, 100);
    }

    if (questId && questId <= this.quests.length) {
      this.currentQuestIndex = questId;
    } else if (this.currentQuestIndex < this.quests.length - 1) {
      this.currentQuestIndex++;
    }
    this.render();
  }
}

class AchievementManager {
  constructor() {
    this.achievements = ACHIEVEMENTS_DATA;
    this.banner = document.getElementById('achievement-banner');
    this.bannerTitle = document.getElementById('achieveBannerTitle');
    this.bannerDesc = document.getElementById('achieveBannerDesc');
    this.badgeCount = document.getElementById('achieveCountBadge');
    this.hideTimer = null;

    this.load();
    this.updateBadge();
  }

  load() {
    const saved = localStorage.getItem('kronika_politik_etis_v4_achievements');
    if (saved) {
      try {
        const ids = JSON.parse(saved);
        this.achievements.forEach(a => {
          if (ids.includes(a.id)) a.unlocked = true;
        });
      } catch(e) {}
    }
  }

  save() {
    const unlockedIds = this.achievements.filter(a => a.unlocked).map(a => a.id);
    localStorage.setItem('kronika_politik_etis_v4_achievements', JSON.stringify(unlockedIds));
  }

  unlock(id) {
    const item = this.achievements.find(a => a.id === id);
    if (!item || item.unlocked) return;

    item.unlocked = true;
    this.save();
    this.updateBadge();

    sound.playAchievementFanfare();
    this.showBanner(item.title, item.desc);
  }

  showBanner(title, desc) {
    this.bannerTitle.innerText = title;
    this.bannerDesc.innerText = desc;
    this.banner.classList.add('show');

    if (this.hideTimer) clearTimeout(this.hideTimer);
    this.hideTimer = setTimeout(() => {
      this.banner.classList.remove('show');
    }, 4500);
  }

  updateBadge() {
    const count = this.achievements.filter(a => a.unlocked).length;
    this.badgeCount.innerText = `${count}/${this.achievements.length}`;
  }

  renderModalList() {
    const listEl = document.getElementById('achieveModalList');
    listEl.innerHTML = "";
    this.achievements.forEach(a => {
      const itemDiv = document.createElement('div');
      itemDiv.className = `achieve-item ${a.unlocked ? 'unlocked' : 'locked'}`;
      itemDiv.innerHTML = `
        <div class="achieve-badge">${a.icon}</div>
        <div class="achieve-text">
          <h4>${a.title}</h4>
          <p>${a.desc}</p>
        </div>
        <div class="achieve-status ${a.unlocked ? 'done' : 'wait'}">
          ${a.unlocked ? '✓ Terbuka' : '🔒 Terkunci'}
        </div>
      `;
      listEl.appendChild(itemDiv);
    });
  }
}
