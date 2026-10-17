  renderComplete() {
    const container = document.getElementById('task-container');
    let answersHtml = "";
    
    if (Object.keys(this.state.openAnswers).length > 0) {
        answersHtml = `<div style="text-align: left; margin-top: 20px;">
            <h4 style="font-family: 'Montserrat'; margin-bottom: 10px; color: #1AA6C4;">Ваши развернутые ответы:</h4>`;
        for (let key in this.state.openAnswers) {
            answersHtml += `<div style="background: #fff; padding: 15px; border-radius: 8px; margin-bottom: 10px; border-left: 4px solid #8A7AA8;">
                <p style="margin: 0; font-size: 16px;">${this.state.openAnswers[key]}</p>
            </div>`;
        }
        answersHtml += `</div>`;
    }

    // Красивая карточка-отчет
    container.innerHTML = `
      <div class="report-card" style="background: #fff; border: 3px solid #1AA6C4; border-radius: 16px; padding: 30px; text-align: center; box-shadow: 0 10px 30px rgba(26,166,196,0.15); margin-top: 20px;">
        
        <div style="font-family: 'Montserrat'; font-size: 14px; letter-spacing: 2px; color: #6B7785; text-transform: uppercase; margin-bottom: 10px;">Отчет об уроке</div>
        <h2 style="font-family: 'Montserrat'; font-size: 28px; color: #1A2024; margin-bottom: 5px;">Урок завершен!</h2>
        <div style="font-family: 'Montserrat'; color: #1AA6C4; font-weight: 600; margin-bottom: 20px;">${this.data.subject}</div>
        
        <div style="background: #F0F7FA; display: inline-block; padding: 15px 30px; border-radius: 12px; margin-bottom: 20px;">
          <div style="font-family: 'Montserrat'; font-size: 14px; color: #6B7785;">Тестов решено верно:</div>
          <div style="font-size: 32px; font-weight: bold; color: #1A2024;">${this.state.score} <span style="font-size: 20px; color: #6B7785;">из ${this.state.totalTasks}</span></div>
        </div>
        
        ${answersHtml}
        
        <div style="background: #FFF9E6; border: 2px dashed #F5B301; padding: 20px; border-radius: 12px; margin-top: 30px;">
            <h3 style="font-family: 'Montserrat'; font-size: 18px; color: #C99A1A; margin-bottom: 10px;">Как сдать работу?</h3>
            <p style="margin-bottom: 10px; font-size: 15px;">1. <strong>Сделайте скриншот этого экрана</strong> (на ПК: Win+Shift+S или PrtSc; на телефоне: свайп или спец. кнопка).</p>
            <p style="margin-bottom: 0; font-size: 15px;">2. Загрузите скриншот и <strong>фото тетради</strong> на платформу Взнание.</p>
        </div>

        <div style="margin-top: 30px; display: flex; gap: 10px; justify-content: center;">
            <button class="btn btn-secondary" onclick="LessonEngine.copyAnswers()">Скопировать текст ответов</button>
            <button class="btn btn-primary" onclick="window.location.reload()">Пройти заново</button>
        </div>
        
      </div>
    `;
  },

  copyAnswers() {
    let text = `Результаты урока: ${this.data.subject}\nТестов решено верно: ${this.state.score} из ${this.state.totalTasks}\n\n--- РАЗВЕРНУТЫЕ ОТВЕТЫ ---\n\n`;
    let hasAnswers = false;
    for (let key in this.state.openAnswers) {
        hasAnswers = true;
        text += `Ответ: ${this.state.openAnswers[key]}\n\n`;
    }
    if (!hasAnswers) text += "Развернутых ответов нет.\n";

    navigator.clipboard.writeText(text).then(() => {
      alert('Текст скопирован! Теперь вы можете вставить его в Взнание, если скриншот не вместил весь текст.');
    }).catch(err => {
      alert('Не удалось скопировать автоматически. Пожалуйста, сделайте скриншот.');
    });
  }
};
