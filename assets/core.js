  check() {
    const task = this.data.tasks[this.state.currentStep];
    const feedback = document.getElementById('feedback');
    let userVal = '';
    let isCorrect = false;

    if (task.type === 'choice') {
      if (!this.state.selectedAnswer) return alert('Выберите вариант.');
      userVal = this.state.selectedAnswer;
    } else if (task.type === 'input') {
      userVal = document.getElementById('input-answer').value.trim();
      if (!userVal) return;
    } else if (task.type === 'open') {
      userVal = document.getElementById('open-answer').value.trim();
      if (!userVal) return;
    }

    this.state.attempts++;

    if (task.type === 'open') {
      // Для открытых вопросов не ставим "Верно" и не начисляем баллы
      feedback.className = 'feedback show success';
      feedback.innerHTML = `<strong>Принято!</strong> Ответ записан.<br><br><em>Пример для самопроверки:</em> ${task.solution || 'Проверьте себя по тетради.'}`;
      
      document.getElementById('btn-check').style.display = 'none';
      const hb = document.getElementById('btn-hint'); if (hb) hb.style.display = 'none';
      document.getElementById('next-actions').style.display = 'flex';
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

    this.renderStats();
    document.getElementById('btn-check').style.display = 'none';
    const hb = document.getElementById('btn-hint'); if (hb) hb.style.display = 'none';
    document.getElementById('next-actions').style.display = 'flex';
  },
