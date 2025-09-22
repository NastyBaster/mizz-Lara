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
    let maxQuestions = 20;
    let correctAnswers = 0;

    // Показуємо/ховаємо екрани
    function showScreen(screenToShow) {
        screen1.classList.add('hidden');
        screen2.classList.add('hidden');
        screen3.classList.add('hidden');
        screenToShow.classList.remove('hidden');
    }

    // Обробка кнопок оцінки
    gradeButtons.forEach(button => {
        button.addEventListener('click', () => {
            maxGrade = parseInt(button.dataset.grade, 10);
            showScreen(screen2);
        });
    });

    // Wheel Picker
    function createWheelPicker(element, min, max, value, onChange) {
        let current = value;
        let startY = null;
        let swipeAccum = 0;

        function render() {
            element.innerHTML = '';
            const prev = document.createElement('div');
            prev.className = 'picker-value inactive';
            prev.textContent = current > min ? current - 1 : '';
            element.appendChild(prev);

            const curr = document.createElement('div');
            curr.className = 'picker-value';
            curr.textContent = current;
            element.appendChild(curr);

            const next = document.createElement('div');
            next.className = 'picker-value inactive';
            next.textContent = current < max ? current + 1 : '';
            element.appendChild(next);
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

        // TOUCH: плавний свайп
        element.addEventListener('touchstart', e => {
            if (e.touches.length === 1) {
                startY = e.touches[0].clientY;
                swipeAccum = 0;
            }
        });

        element.addEventListener('touchmove', e => {
            if (startY !== null) {
                const deltaY = e.touches[0].clientY - startY;
                swipeAccum += deltaY;

                const stepSize = 30; // 30px = 1 крок
                let steps = Math.trunc(swipeAccum / stepSize);

                if (steps !== 0) {
                    setValue(current - steps);
                    swipeAccum -= steps * stepSize;
                }

                startY = e.touches[0].clientY;
                e.preventDefault(); // блокуємо скрол лише всередині колеса
            }
        }, { passive: false });

        element.addEventListener('touchend', () => {
            startY = null;
            swipeAccum = 0;
        });

        // Мишка
        element.addEventListener('wheel', e => {
            let steps = Math.round(e.deltaY / 40);
            if (steps !== 0) setValue(current + steps);
            e.preventDefault();
        });

        render();

        return {
            setValue,
            getValue: () => current
        };
    }

    // Пікери
    const maxQuestionsWheel = createWheelPicker(
        maxQuestionsPicker, 10, 30, maxQuestions, val => {
            maxQuestions = val;
            if (correctAnswers > maxQuestions) {
                correctAnswers = maxQuestions;
                correctAnswersWheel.setValue(correctAnswers);
            }
        }
    );

    let correctAnswersWheel;
    function updateCorrectAnswersPicker() {
        if (correctAnswersPicker.childNodes.length === 0) {
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
        correctAnswers = 0;
        resultGradeSpan.textContent = '';
        updateCorrectAnswersPicker();
        showScreen(screen3);
    });

    // Екран 3: Розрахунок
    calculateButton.addEventListener('click', () => {
        const calculatedGrade = (correctAnswers / maxQuestions) * maxGrade;
        const finalGrade = (calculatedGrade % 1 >= 0.5) ? Math.ceil(calculatedGrade) : Math.floor(calculatedGrade);
        resultGradeSpan.textContent = finalGrade;
    });

    // Кнопки "Назад"
    backButton1.addEventListener('click', () => showScreen(screen1));
    backButton2.addEventListener('click', () => showScreen(screen1));

    // Показуємо перший екран
    showScreen(screen1);
});
