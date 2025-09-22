document.addEventListener('DOMContentLoaded', () => {
    const screen1 = document.getElementById('screen1');
    const screen2 = document.getElementById('screen2');
    const screen3 = document.getElementById('screen3');

    const gradeButtons = document.querySelectorAll('.grade-button');
    const setQuestionsButton = document.getElementById('setQuestionsButton');
    const maxQuestionsPicker = document.getElementById('maxQuestionsPicker');
    const correctAnswersPicker = document.getElementById('correctAnswersPicker');
    const resultGradeSpan = document.getElementById('resultGrade');
    const calculateButton = document.getElementById('calculateButton');
    const backButton1 = document.getElementById('backButton1');
    const backButton2 = document.getElementById('backButton2');

    let maxGrade = 0;
    let maxQuestions = 20;  // Значення по замовчуванню
    let correctAnswers = 20; // Значення по замовчуванню

    function showScreen(screenToShow) {
        screen1.classList.add('hidden');
        screen2.classList.add('hidden');
        screen3.classList.add('hidden');
        screenToShow.classList.remove('hidden');
    }

    // Кнопки вибору оцінки
    gradeButtons.forEach(button => {
        button.addEventListener('click', () => {
            maxGrade = parseInt(button.dataset.grade, 10);
            showScreen(screen2);
        });
    });

    // Створення колеса (wheel picker)
    function createWheelPicker(element, min, max, defaultValue, onChange) {
        let current = defaultValue;
        let startY = null;
        let swipeAccum = 0;

        function render() {
            element.innerHTML = '';
            for (let i = current - 1; i <= current + 1; i++) {
                const div = document.createElement('div');
                if (i < min || i > max) {
                    div.textContent = '';
                } else {
                    div.textContent = i;
                }
                div.className = 'picker-value ' + (i === current ? 'active' : 'inactive');
                element.appendChild(div);
            }
        }

        function setValue(val) {
            if (val < min) val = min;
            if (val > max) val = max;
            if (val !== current) {
                current = val;
                onChange(current);
                render();
            }
        }

        // Touch support
        element.addEventListener('touchstart', e => {
            if (e.touches.length === 1) {
                startY = e.touches[0].clientY;
            }
        });

        element.addEventListener('touchmove', e => {
            if (startY !== null) {
                const deltaY = e.touches[0].clientY - startY;
                swipeAccum += deltaY;
                const stepSize = 30; // 30px на один крок
                let steps = Math.trunc(swipeAccum / stepSize);
                if (steps !== 0) {
                    setValue(current - steps);
                    swipeAccum -= steps * stepSize;
                }
                startY = e.touches[0].clientY;
                e.preventDefault();
            }
        }, { passive: false });

        element.addEventListener('touchend', () => {
            startY = null;
            swipeAccum = 0;
        });

        // Mouse wheel
        element.addEventListener('wheel', e => {
            let steps = Math.round(e.deltaY / 40);
            if (steps !== 0) setValue(current + steps);
            e.preventDefault();
        });

        render();
        return { setValue, getValue: () => current };
    }

    // Колесо для maxQuestions (екран 2)
    const maxQuestionsWheel = createWheelPicker(
        maxQuestionsPicker, 10, 30, maxQuestions, val => {
            maxQuestions = val;
            // Автоматично коригує correctAnswers, якщо більше maxQuestions
            if (correctAnswers > maxQuestions) {
                correctAnswers = maxQuestions;
                correctAnswersWheel.setValue(correctAnswers);
            }
        }
    );

    // Колесо для correctAnswers (екран 3)
    let correctAnswersWheel;
    function updateCorrectAnswersPicker() {
        if (!correctAnswersWheel) {
            correctAnswersWheel = createWheelPicker(
                correctAnswersPicker, 0, maxQuestions, correctAnswers, val => {
                    correctAnswers = val;
                }
            );
        } else {
            correctAnswersWheel.setValue(correctAnswers);
        }
    }
    updateCorrectAnswersPicker();

    // Екран 2: кнопка "Готово"
    setQuestionsButton.addEventListener('click', () => {
        correctAnswers = 20; // скидаємо на 20 по замовчуванню
        resultGradeSpan.textContent = '';
        updateCorrectAnswersPicker();
        showScreen(screen3);
    });

    // Розрахунок оцінки (екран 3)
    calculateButton.addEventListener('click', () => {
        const calculatedGrade = (correctAnswers / maxQuestions) * maxGrade;
        const finalGrade = (calculatedGrade % 1 >= 0.5) ? Math.ceil(calculatedGrade) : Math.floor(calculatedGrade);
        resultGradeSpan.textContent = finalGrade;
    });

    // Кнопки "Назад"
    backButton1.addEventListener('click', () => showScreen(screen1));
    backButton2.addEventListener('click', () => showScreen(screen1));

    // Показуємо перший екран при завантаженні
    showScreen(screen1);
});
