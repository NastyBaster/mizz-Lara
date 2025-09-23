// Початкові значення
let maxGrade = 0;
let corectAnswers = 0;
const totalQuestions = 20;

// Отримуємо доступ до елементів на сторінці
const maxGradeContainer = document.getElementById("choseMaxGrade");
const answersContainer = document.getElementById("answersContainer");
const resultDisplay = document.getElementById("result");

// Функція для оновлення результату на екрані
function updateScore() {
  // Якщо максимальна оцінка ще не обрана, нічого не робимо
  if (maxGrade === 0) {
    resultDisplay.textContent = "Please choose a max grade first.";
    return;
  }
  
  // Якщо кількість відповідей ще не обрана
  if (corectAnswers === 0) {
    resultDisplay.textContent = "Now, choose the number of correct answers.";
    return;
  }

  // Розраховуємо оцінку
  const score = Math.round((corectAnswers / totalQuestions) * maxGrade);
  
  // Відображаємо результат
  resultDisplay.textContent = `Grade: ${score} / ${maxGrade}`;
}

// Додаємо обробник подій для кнопок вибору МАКСИМАЛЬНОЇ ОЦІНКИ
maxGradeContainer.addEventListener("click", (e) => {
  // Перевіряємо, чи клік був саме по кнопці
  if (e.target.tagName === 'BUTTON') {
    // Встановлюємо значення maxGrade з data-атрибута кнопки
    maxGrade = parseInt(e.target.dataset.grade, 10);
    
    // Підсвічуємо обрану кнопку
    const allButtons = maxGradeContainer.querySelectorAll('button');
    allButtons.forEach(btn => btn.classList.remove('selected'));
    e.target.classList.add('selected');

    // Оновлюємо результат
    updateScore();
  }
});

// Додаємо обробник подій для кнопок вибору КІЛЬКОСТІ ВІДПОВІДЕЙ
answersContainer.addEventListener("click", (e) => {
  // Перевіряємо, чи клік був саме по кнопці
  if (e.target.tagName === 'BUTTON') {
    // Встановлюємо значення corectAnswers з data-атрибута кнопки
    corectAnswers = parseInt(e.target.dataset.grade, 10);
    
    // Підсвічуємо обрану кнопку
    const allButtons = answersContainer.querySelectorAll('button');
    allButtons.forEach(btn => btn.classList.remove('selected'));
    e.target.classList.add('selected');

    // Оновлюємо результат
    updateScore();
  }
});