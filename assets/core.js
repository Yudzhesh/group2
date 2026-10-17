const LessonEngine = {
  state: { currentTab: 0, taskIndex: 0, score: 0, completed: 0, totalTasks: 0, answered: false, selected: null, isTeacher: false },
  
  init(data) {
    this.data = data;
    if (window.location.search.includes('mode=teacher')) {
      this.state.isTeacher = true;
      document.body.classList.add('teacher-mode');
    }
    
    // Считаем общее количество заданий во всех вкладках
    this.state.totalTasks = data.tabs.reduce((sum, tab) => sum + (tab.tasks ? tab.tasks.length : 0), 0);
    
    this.renderStats();
    this.renderTab(0);
  },
  
  renderStats() {
    const el = document.getElementById('stats');
    if (el) {
      el.innerHTML = `
        <div class="stat-item">✅ Верно: ${this.state.score}</div>
        <div class="stat-item">📝 Выполнено: ${this.state.completed} / ${this.state.totalTasks}</div>
      `;
    }
  },
  
  renderTab(index) {
    this.state.currentTab = index;
    this.state.taskIndex = 0;
    
    // Обновляем активную кнопку вкладки
    const tabsNav = document.getElementById('tabs-nav');
    if (tabsNav) {
      const buttons = tabsNav.querySelectorAll('.tab-btn');
      buttons.forEach((btn, i) => btn.classList.toggle('active', i === index));
    }
    
    this.renderContent();
  },
  
  renderContent() {
    const tab = this.data.tabs[this.state.currentTab];
    const container = document.getElementById('main-content');
    if (!container) return;
    
    let html = `<div class="lesson-header"><div class="lesson-subject">${this.data.subject || 'Урок'}</div><h1 class="lesson-title">${tab.title}</h1></div>`;
    
    if (tab.theory) {
      html += `<div class="theory"><div class="block-label">Теория</div><p>${tab.theory}</p></div>`;
    }
    if (tab.example) {
      html += `<div class="example"><div class="block-label">Пример</div><p>${tab.example}</p></div>`;
    }
    if (tab.teacherNote) {
      html += `<div class="teacher-note"><strong>Методическая пометка:</strong><br>${tab.teacherNote}</div>`;
    }
    
    html += `<div id="task-container"></div>`;
    container.innerHTML = html;
    this.renderTask();
  },
  
  renderTask() {
    const tab = this.data.tabs[this.state.currentTab];
    const container = document.getElementById('task-container');
    if (!tab.tasks || !tab.tasks[this.state.taskIndex]) {
      // Если задания кончились
      if (this.state.currentTab < this.data.tabs.length - 1) {
        container.innerHTML = `<div class="example" style="text-align:center; padding: 30px;"><p>Тема пройдена! Вы можете перейти к следующей вкладке.</p><button class="btn btn-primary" onclick="LessonEngine.renderTab(${this.state.currentTab + 1})">Следующая тема &rarr;</button></div>`;
      } else {
        container.innerHTML = `<div class="results-card"><h2 class="results-title">Урок завершен!</h2><div class="results-score">Правильных ответов: <strong>${this.state.score}</strong> из <strong>${this.state.totalTasks}</strong></div><p style="margin-bottom: 20px;">Не забудьте выполнить самостоятельную работу и загрузить фото на Взнание!</p><button class="btn btn-primary" onclick="window.location.reload()">Пройти заново</button></div>`;
      }
      return;
    }

    const task = tab.tasks[this.state.taskIndex];
    this.state.answered = false;
    this.state.selected = null;

    let html = `<div class="task-block"><div class="task-question">${task.level ? `<span class="badge badge-${task.level.toLowerCase()}">Уровень ${task.level}</span>` : ''} ${task.q}</div>`;
    
    if (task.type === 'choice') {
      html += `<div class="options-list">`;
      task.options.forEach(opt => {
        html += `<button class="option-btn" onclick="LessonEngine.select(this, '${opt.replace(/'/g, "\\'")}')">${opt}</button>`;
      });
      html += `</div>`;
    } else if (task.type === 'input') {
      html += `<input type="text" class="input-answer" id="input-answer" placeholder="Введите ответ...">`;
    } else if (task.type === 'open') {
      html += `<textarea class="open-answer" id="open-answer" placeholder="Напишите ответ..."></textarea>`;
    }

    html += `<div class="actions" id="task-actions">`;
    html += `<button class="btn btn-primary" id="btn-check" onclick="LessonEngine.check()">Проверить</button>`;
    if (task.hint) html += `<button class="btn btn-secondary" onclick="LessonEngine.hint('${task.hint}')">Подсказка</button>`;
    html += `</div>`;
    
    html += `<div class="feedback" id="feedback"></div>`;
    
    if (task.solution) {
      html += `<div class="teacher-answer"><strong>Ответ:</strong><br>${task.solution}</div>`;
    }
    
    html += `<div class="actions" id="next-actions" style="margin-top:20px; display:none;"><button class="btn btn-primary" onclick="LessonEngine.next()">Следующее задание &rarr;</button></div>`;
    if (this.state.isTeacher) {
      html += `<div class="actions" style="margin-top:20px;"><button class="btn btn-primary" onclick="LessonEngine.next()">Следующее задание &rarr;</button></div>`;
    }

    html += `</div>`;
    container.innerHTML = html;
  },
  
  select(btn, val) {
    if (this.state.answered) return;
    document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    this.state.selected = val;
  },
  
  check() {
    const task = this.data.tabs[this.state.currentTab].tasks[this.state.taskIndex];
    const feedback = document.getElementById('feedback');
    let userVal = '';
    let isCorrect = false;

    if (task.type === 'choice') {
      if (!this.state.selected) return alert('Выберите вариант.');
      userVal = this.state.selected;
    } else if (task.type === 'input') {
      userVal = document.getElementById('input-answer').value.trim();
      if (!userVal) return;
    } else if (task.type === 'open') {
      userVal = document.getElementById('open-answer').value.trim();
      if (!userVal) return;
    }

    // Увеличиваем счетчик выполненных заданий (только если еще не отвечали)
    if (!this.state.answered) {
        this.state.completed++;
        this.state.answered = true;
    }

    if (task.type === 'open') {
      feedback.className = 'feedback show success';
      feedback.innerHTML = `<strong>Принято!</strong> Ответ записан.<br><br><em>Пример для самопроверки:</em> ${task.solution || 'Проверьте себя по тетради.'}`;
      this.finishTask();
      return;
    }

    if (task.type === 'choice') {
      isCorrect = userVal === task.a;
      document.querySelectorAll('.option-btn').forEach(b => {
        b.disabled = true;
        if (b.textContent === task.a) b.classList.add('correct');
        else if (b.textContent === userVal && !isCorrect) b.classList.add('incorrect');
      });
    } else {
      isCorrect = userVal.toLowerCase().replace(/[\s,]/g, '') === task.a.toLowerCase().replace(/[\s,]/g, '');
    }

    if (isCorrect) {
      this.state.score++;
      feedback.className = 'feedback show success';
      feedback.innerHTML = '<strong>Верно!</strong>';
    } else {
      feedback.className = 'feedback show error';
      feedback.innerHTML = `<strong>Не совсем.</strong> ${task.hint || ''}`;
    }

    this.finishTask();
  },

  finishTask() {
    this.renderStats();
    document.getElementById('btn-check').style.display = 'none';
    document.querySelectorAll('.btn-secondary').forEach(b => b.style.display = 'none');
    document.getElementById('next-actions').style.display = 'flex';
  },
  
  hint(text) {
    const feedback = document.getElementById('feedback');
    feedback.className = 'feedback show';
    feedback.style.background = '#FFF9E6';
    feedback.style.color = '#7A5A1A';
    feedback.textContent = text;
  },
  
  next() {
    this.state.taskIndex++;
    this.renderTask();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};
