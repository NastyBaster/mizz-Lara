// Початкові параметри
let maxGrade = 12;
let totalQuestions = 20;
let correctAnswers = 0;

// Елементи DOM
const settingsPanel = document.getElementById('settingsPanel');
const settingsMinPanel = document.getElementById('settingsMinPanel');
const toggleSettingsBtn = document.getElementById('toggleSettings');
const expandSettingsBtn = document.getElementById('expandSettings');
const questionsRange = document.getElementById('questionsRange');
const questionsAmount = document.getElementById('questionsAmount');
const maxGradeSelect = document.getElementById('maxGradeSelect');
const buttonsContainer = document.getElementById('buttonsContainer');
const resultDiv = document.getElementById('result');
const summaryText = document.getElementById('summaryText');

// Оновлення тексту в шторці-згорнутому вигляді
function updateSummaryText() {
  summaryText.textContent = `Питань: ${totalQuestions}, Макс бал: ${maxGrade}`;
}

// Анімація згортання шторки
function collapseSettings() {
  settingsPanel.classList.remove('expanded');
  settingsPanel.classList.add('collapsed');
  settingsMinPanel.classList.remove('hidden');
}

// Анімація розгортання шторки
function expandSettings() {
  settingsPanel.classList.remove('collapsed');
  settingsPanel.classList.add('expanded');
  settingsMinPanel.classList.add('hidden');
}

// Генерація кнопок відповідей
function generateButtons() {
  buttonsContainer.innerHTML = '';
  for (let i = 1; i <= totalQuestions; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    btn.dataset.value = i;
    btn.addEventListener('click', () => {
      correctAnswers = i;
      updateButtonsState();
      updateResult();
    });
    buttonsContainer.appendChild(btn);
  }
}

// Оновлення стану кнопок (підсвічування вибраної)
function updateButtonsState() {
  const btns = buttonsContainer.querySelectorAll('button');
  btns.forEach(btn => {
    btn.classList.toggle('selected', Number(btn.dataset.value) === correctAnswers);
  });
}

// Оновлення результату
function updateResult() {
  if (correctAnswers === 0) {
    resultDiv.textContent = 'Обери кількість правильних відповідей';
    return;
  }
  const score = Math.round((correctAnswers / totalQuestions) * maxGrade);
  resultDiv.textContent = `Оцінка: ${score} / ${maxGrade}`;
}

// Обробники подій

toggleSettingsBtn.addEventListener('click', () => {
  collapseSettings();
});

expandSettingsBtn.addEventListener('click', () => {
  expandSettings();
});

questionsRange.addEventListener('input', (e) => {
  totalQuestions = Number(e.target.value);
  questionsAmount.textContent = totalQuestions;
  correctAnswers = 0; // скидаємо вибір
  updateSummaryText();
  generateButtons();
  updateResult();
});

maxGradeSelect.addEventListener('change', (e) => {
  maxGrade = Number(e.target.value);
  updateSummaryText();
  updateResult();
});

// Початковий рендер
updateSummaryText();
generateButtons();
updateResult();
expandSettings();
