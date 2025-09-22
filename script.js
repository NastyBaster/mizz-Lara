document.addEventListener('DOMContentLoaded', () => {
    // Блокуємо прокрутку сторінки під час свайпу по picker
    function preventScrollOnPicker(picker) {
        picker.addEventListener('touchmove', function(e) {
            e.preventDefault();
        }, { passive: false });
    }
    preventScrollOnPicker(maxQuestionsPicker);
    preventScrollOnPicker(correctAnswersPicker);
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
    const arrowButtons = document.querySelectorAll('.arrow-button');

    let maxGrade = 0;
    let maxQuestions = 20;
    let correctAnswers = 0;

    // Функція для перемикання екранів
    function showScreen(screenToShow) {
        screen1.classList.add('hidden');
        screen2.classList.add('hidden');
        screen3.classList.add('hidden');
        screenToShow.classList.remove('hidden');
    }

    // Обробка кнопок оцінок
    gradeButtons.forEach(button => {
        button.addEventListener('click', () => {
            maxGrade = parseInt(button.dataset.grade, 10);
            showScreen(screen2);
        });
    });


    // Wheel Picker logic
    function createWheelPicker(element, min, max, value, onChange) {
        let current = value;
        let startY = null;
        let moved = false;

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

        element.addEventListener('touchstart', e => {
            if (e.touches.length === 1) {
                startY = e.touches[0].clientY;
                moved = false;
            }
        });
        element.addEventListener('touchmove', e => {
            if (startY !== null) {
                const deltaY = e.touches[0].clientY - startY;
                if (Math.abs(deltaY) > 20) {
                    moved = true;
                    if (deltaY > 0) setValue(current - 1);
                    else setValue(current + 1);
                    startY = e.touches[0].clientY;
                }
                e.preventDefault();
            }
        }, { passive: false });
        element.addEventListener('touchend', () => {
            startY = null;
        });
        // Mouse support
        element.addEventListener('wheel', e => {
            if (e.deltaY > 0) setValue(current + 1);
            else setValue(current - 1);
            e.preventDefault();
        });
        render();
        // API
        return {
            setValue,
            getValue: () => current
        };
    }

    // Picker for maxQuestions (10-30)
    const maxQuestionsWheel = createWheelPicker(
        maxQuestionsPicker, 10, 30, maxQuestions, val => {
            maxQuestions = val;
            // Якщо correctAnswers > maxQuestions, зменшуємо
            if (correctAnswers > maxQuestions) {
                correctAnswers = maxQuestions;
                correctAnswersWheel.setValue(correctAnswers);
            }
        }
    );
    // Picker for correctAnswers (0-maxQuestions)
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


    // Екран 2: Вибір максимальної кількості питань
    setQuestionsButton.addEventListener('click', () => {
    correctAnswers = 0; // Скидаємо лічильник для нового учня
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