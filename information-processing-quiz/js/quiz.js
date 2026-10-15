// 퀴즈 진행 로직 모듈

const quiz = {
    currentQuestions: [],
    currentQuestionIndex: 0,
    userAnswers: [],
    isAnswered: false,
    quizMode: 'normal', // 'normal', 'subject', 'wrong'
    subjectScores: {},

    // 표준 퀴즈 시작 (20문제, 5개 과목 균등)
    startQuiz() {
        this.quizMode = 'normal';
        this.currentQuestions = questionManager.getBalancedQuestions(20);
        this.initializeQuiz();
        this.displayQuestion();
    },

    // 과목별 퀴즈 시작
    startSubjectQuiz() {
        const subjects = this.getSelectedSubjects();
        const count = this.getSelectedQuestionCount();

        if (subjects.length === 0) {
            alert('최소 1개 이상의 과목을 선택해주세요.');
            return;
        }

        this.quizMode = 'subject';
        this.currentQuestions = questionManager.getRandomQuestions(count, subjects);

        if (this.currentQuestions.length === 0) {
            alert('선택한 조건의 문제가 없습니다.');
            return;
        }

        this.initializeQuiz();
        this.displayQuestion();
    },

    // 오답 문제만 다시 풀기
    retakeWrongQuestions() {
        const wrongNotes = storage.getWrongNotes();

        if (wrongNotes.length === 0) {
            alert('오답 문제가 없습니다.');
            return;
        }

        this.quizMode = 'wrong';
        this.currentQuestions = wrongNotes
            .map(note => questionManager.getQuestionById(note.questionId))
            .filter(q => q !== undefined);

        if (this.currentQuestions.length === 0) {
            alert('오답 문제를 찾을 수 없습니다.');
            return;
        }

        this.currentQuestions = questionManager.shuffleArray(this.currentQuestions);
        this.initializeQuiz();
        this.displayQuestion();
    },

    // 퀴즈 초기화
    initializeQuiz() {
        this.currentQuestionIndex = 0;
        this.userAnswers = new Array(this.currentQuestions.length).fill(null);
        this.isAnswered = false;
        this.subjectScores = {};
        this.updateQuestionNav();
    },

    // 현재 문제 표시
    displayQuestion() {
        if (this.currentQuestionIndex >= this.currentQuestions.length) {
            this.showResults();
            return;
        }

        const question = this.currentQuestions[this.currentQuestionIndex];

        // 문제 정보 업데이트
        document.getElementById('questionNumber').textContent =
            `${this.currentQuestionIndex + 1} / ${this.currentQuestions.length}`;

        const score = this.userAnswers.filter((ans, idx) =>
            ans !== null && ans === this.currentQuestions[idx].answer
        ).length;
        document.getElementById('currentScore').textContent = `${score}점`;

        // 과목 배지
        document.getElementById('subjectBadge').textContent = question.subject;

        // 문제 텍스트
        document.getElementById('questionText').textContent = question.question;

        // 선택지 생성
        const choicesContainer = document.getElementById('choicesContainer');
        choicesContainer.innerHTML = '';

        question.choices.forEach((choice, index) => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.innerHTML = `
                <span class="choice-number">${String.fromCharCode(65 + index)}</span>
                <span class="choice-text">${choice}</span>
            `;
            btn.onclick = () => this.selectChoice(index + 1);

            if (this.isAnswered) {
                btn.disabled = true;
                if (index + 1 === question.answer) {
                    btn.classList.add('correct');
                } else if (index + 1 === this.userAnswers[this.currentQuestionIndex]) {
                    btn.classList.add('wrong');
                }
            } else if (this.userAnswers[this.currentQuestionIndex] === index + 1) {
                btn.classList.add('selected');
            }

            choicesContainer.appendChild(btn);
        });

        // 진행률 업데이트
        this.updateProgress();

        // 피드백 숨기기
        document.getElementById('answerFeedback').style.display = 'none';
        document.getElementById('confirmBtn').disabled = this.userAnswers[this.currentQuestionIndex] === null;
        document.getElementById('confirmBtn').style.display = 'block';
        document.getElementById('nextBtn').style.display = 'none';
    },

    // 선택지 선택
    selectChoice(choiceNumber) {
        if (this.isAnswered) return;

        this.userAnswers[this.currentQuestionIndex] = choiceNumber;

        // UI 업데이트
        document.querySelectorAll('.choice-btn').forEach((btn, idx) => {
            if (idx + 1 === choiceNumber) {
                btn.classList.add('selected');
            } else {
                btn.classList.remove('selected');
            }
        });

        // 정답 확인 버튼 활성화
        document.getElementById('confirmBtn').disabled = false;
    },

    // 정답 확인
    checkAnswer() {
        if (this.isAnswered) return;
        if (this.userAnswers[this.currentQuestionIndex] === null) return;

        const question = this.currentQuestions[this.currentQuestionIndex];
        const myAnswer = this.userAnswers[this.currentQuestionIndex];
        const isCorrect = myAnswer === question.answer;

        this.isAnswered = true;

        // 선택지 버튼 비활성화
        document.querySelectorAll('.choice-btn').forEach((btn, idx) => {
            btn.disabled = true;
            if (idx + 1 === question.answer) {
                btn.classList.add('correct');
            } else if (idx + 1 === myAnswer && !isCorrect) {
                btn.classList.add('wrong');
            }
        });

        // 피드백 표시
        const feedbackDiv = document.getElementById('answerFeedback');
        const messageDiv = document.getElementById('feedbackMessage');
        const detailsDiv = document.getElementById('feedbackDetails');

        if (isCorrect) {
            messageDiv.textContent = '✓ 정답입니다!';
            messageDiv.className = 'feedback-message correct';
        } else {
            messageDiv.textContent = '✗ 틀렸습니다.';
            messageDiv.className = 'feedback-message wrong';

            // 오답노트에 저장
            storage.saveWrongNote(
                question.id,
                question.question,
                myAnswer,
                question.answer,
                question.explanation,
                question.subject
            );
        }

        const myAnswerText = question.choices[myAnswer - 1];
        const correctAnswerText = question.choices[question.answer - 1];

        detailsDiv.innerHTML = `
            <p><strong>내 답:</strong> <span class="feedback-details-answer">${String.fromCharCode(64 + myAnswer)}</span> ${myAnswerText}</p>
            <p><strong>정답:</strong> <span class="feedback-details-answer">${String.fromCharCode(64 + question.answer)}</span> ${correctAnswerText}</p>
            <div class="wrong-note-explanation"><strong>해설:</strong> ${question.explanation}</div>
        `;

        feedbackDiv.style.display = 'block';

        // 버튼 표시 변경
        document.getElementById('confirmBtn').style.display = 'none';
        document.getElementById('nextBtn').style.display = 'block';

        // 과목별 점수 기록
        if (!this.subjectScores[question.subject]) {
            this.subjectScores[question.subject] = { correct: 0, total: 0 };
        }
        this.subjectScores[question.subject].total++;
        if (isCorrect) {
            this.subjectScores[question.subject].correct++;
        }
    },

    // 다음 문제
    nextQuestion() {
        this.currentQuestionIndex++;
        this.isAnswered = false;
        this.displayQuestion();
    },

    // 다시 풀기
    retakeQuiz() {
        this.initializeQuiz();
        this.displayQuestion();
    },

    // 결과 표시
    showResults() {
        const correctCount = this.userAnswers.filter((ans, idx) =>
            ans === this.currentQuestions[idx].answer
        ).length;
        const wrongCount = this.currentQuestions.length - correctCount;
        const score = Math.round((correctCount / this.currentQuestions.length) * 100);

        // 결과 정보 업데이트
        document.getElementById('totalQuestions').textContent = this.currentQuestions.length;
        document.getElementById('correctAnswers').textContent = correctCount;
        document.getElementById('wrongAnswers').textContent = wrongCount;
        document.getElementById('finalScore').textContent = score + '점';

        // 과목별 결과
        const subjectResultsDiv = document.getElementById('subjectResults');
        subjectResultsDiv.innerHTML = '';

        const subjects = questionManager.getAllSubjects();
        subjects.forEach(subject => {
            const scores = this.subjectScores[subject] || { correct: 0, total: 0 };
            const div = document.createElement('div');
            div.className = 'subject-result-item';
            div.innerHTML = `
                <span class="subject-result-name">${subject}</span>
                <span class="subject-result-score">${scores.correct} / ${scores.total}</span>
            `;
            subjectResultsDiv.appendChild(div);
        });

        // 학습 기록 저장
        storage.saveStudyRecord(
            this.currentQuestions.length,
            correctCount,
            wrongCount,
            this.subjectScores
        );

        // 화면 전환
        app.showScreen('resultScreen');
    },

    // 진행률 업데이트
    updateProgress() {
        const progress = ((this.currentQuestionIndex) / this.currentQuestions.length) * 100;
        document.getElementById('progressFill').style.width = progress + '%';
    },

    // 문제 네비게이션 업데이트
    updateQuestionNav() {
        const navDiv = document.getElementById('questionNav');
        navDiv.innerHTML = '';

        for (let i = 0; i < this.currentQuestions.length; i++) {
            const btn = document.createElement('button');
            btn.className = 'nav-btn';
            btn.textContent = (i + 1);

            if (i === this.currentQuestionIndex) {
                btn.classList.add('current');
            } else if (this.userAnswers[i] !== null) {
                const isCorrect = this.userAnswers[i] === this.currentQuestions[i].answer;
                btn.classList.add(isCorrect ? 'answered' : 'wrong');
            }

            btn.onclick = () => this.jumpToQuestion(i);
            navDiv.appendChild(btn);
        }
    },

    // 특정 문제로 이동
    jumpToQuestion(index) {
        if (this.isAnswered) return; // 답을 한 상태에서는 점프 불가
        if (index < 0 || index >= this.currentQuestions.length) return;

        this.currentQuestionIndex = index;
        this.isAnswered = false;
        this.displayQuestion();
    },

    // 선택된 과목 가져오기
    getSelectedSubjects() {
        const checkboxes = document.querySelectorAll('.subject-checkbox:checked');
        return Array.from(checkboxes).map(cb => cb.value);
    },

    // 선택된 문제 개수 가져오기
    getSelectedQuestionCount() {
        const allCount = questionManager.getQuestionCount();
        const selected = document.querySelector('input[name="questionCount"]:checked');

        if (!selected) return 20;
        if (selected.value === 'all') return allCount;
        return parseInt(selected.value);
    }
};
