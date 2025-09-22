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

    function preventScrollOnPicker(picker) {
        if (!picker) return;
        picker.addEventListener('touchmove', function(e) {
            e.preventDefault();
        }, { passive: false });
    }
    preventScrollOnPicker(maxQuestionsPicker);
    preventScrollOnPicker(correctAnswersPicker);

    let maxGrade = 0;
    let maxQuestions = 20;
    let correctAnswers = 0;

    function showScreen(screenToShow) {
        screen1.classList.add('hidden');
        screen2.classList.add('hidden');
        screen3.classList.add('hidden');
        screenToShow.classList.remove('hidden');
    }

    gradeButtons.forEach(button => {
        button.addEventListener('click', () => {
            maxGrade = parseInt(button.dataset.grade, 10);
            showScreen(screen2);
        });
    });

    function createWheelPicker(element, min, max, value, onChange) {
        let current = value;
        let startY = null;
        let swipeAccum = 0;

        function render() {
            element.innerHTML = '';
            for (let i = current - 1; i <= current + 1; i++) {
                const div = document.createElement('div');
                div.className = 'picker-value';
                if (i < min || i > max) div.textContent = '';
                else div.textContent = i;
                if (i === current) div.classList.add('active');
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
                const stepSize = 30;
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

        element.addEventListener('wheel', e => {
            let steps = Math.round(e.deltaY / 40);
            if (steps !== 0) setValue(current + steps);
            e.preventDefault();
        });

        render();

        return { setValue, getValue: () => current };
    }

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

    setQuestionsButton.addEventListener('click', () => {
        correctAnswers = 0;
        resultGradeSpan.textContent = '';
        updateCorrectAnswersPicker();
        showScreen(screen3);
    });

    calculateButton.addEventListener('click', () => {
        const calculatedGrade = (correctAnswers / maxQuestions) * maxGrade;
        const finalGrade = (
