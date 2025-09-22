document.addEventListener('DOMContentLoaded', () => {
    const screen1 = document.getElementById('screen1');
    const screen2 = document.getElementById('screen2');
    const screen3 = document.getElementById('screen3');

    const gradeButtons = document.querySelectorAll('.grade-button');
    const maxQuestionsInput = document.getElementById('maxQuestionsInput');
    const setQuestionsButton = document.getElementById('setQuestionsButton');
    const correctAnswersInput = document.getElementById('correctAnswersInput');
    const resultGradeSpan = document.getElementById('resultGrade');
    const calculateButton = document.getElementById('calculateButton');
    const backButton1 = document.getElementById('backButton1');
    const backButton2 = document.getElementById('backButton2');

    let maxGrade = 0;
    let maxQuestions = 0;

    // Функція для перемикання екранів
    function showScreen(screenToShow) {
        screen1.classList.add('hidden');
        screen2.classList.add('hidden');
        screen3.classList.add('hidden');
        screenToShow.classList.remove('hidden');
    }

    // Екран 1: Вибір максимальної оцінки
    gradeButtons.forEach(button => {
        button.addEventListener('click', () => {
            maxGrade = parseInt(button.dataset.grade, 10);
            showScreen(screen2);
        });
    });

    // Екран 2: Вибір максимальної кількості питань
    setQuestionsButton.addEventListener('click', () => {
        maxQuestions = parseInt(maxQuestionsInput.value, 10);
        if (maxQuestions >= 10 && maxQuestions <= 30) {
            correctAnswersInput.max = maxQuestions; // Обмежуємо введення
            correctAnswersInput.value = ''; // Очищаємо поле
            resultGradeSpan.textContent = '-';
            showScreen(screen3);
        } else {
            alert("Кількість питань має бути в межах від 10 до 30.");
        }
    });

    // Екран 3: Розрахунок
    calculateButton.addEventListener('click', () => {
        const correctAnswers = parseInt(correctAnswersInput.value, 10);
        if (correctAnswers <= maxQuestions && correctAnswers >= 0) {
            const calculatedGrade = (correctAnswers / maxQuestions) * maxGrade;
            const finalGrade = (calculatedGrade % 1 >= 0.5) ? Math.ceil(calculatedGrade) : Math.floor(calculatedGrade);
            resultGradeSpan.textContent = finalGrade;
        } else {
            alert(`Кількість правильних відповідей має бути в межах від 0 до ${maxQuestions}.`);
        }
    });

    // Кнопка "Назад" з Екрану 2
    backButton1.addEventListener('click', () => {
        showScreen(screen1);
    });

    // Кнопка "Повернутися до налаштувань" з Екрану 3
    backButton2.addEventListener('click', () => {
        showScreen(screen1);
    });

    // Показуємо перший екран при завантаженні
    showScreen(screen1);
});