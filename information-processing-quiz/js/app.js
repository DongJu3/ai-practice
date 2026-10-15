// 메인 앱 로직

const app = {
    // 화면 전환
    showScreen(screenId) {
        // 모든 화면 숨기기
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });

        // 해당 화면 표시
        const screen = document.getElementById(screenId);
        if (screen) {
            screen.classList.add('active');
        }
    },

    // 메인 화면으로 이동
    goToMain() {
        this.showScreen('mainScreen');
    },

    // 퀴즈 시작
    goToQuiz() {
        quiz.startQuiz();
        this.showScreen('quizScreen');
    },

    // 과목별 퀴즈 화면
    goToSubjectQuiz() {
        this.showScreen('subjectQuizScreen');
        this.updateQuestionCountInfo();
    },

    // 오답노트 화면
    goToWrongNotes() {
        this.showScreen('wrongNotesScreen');
        this.renderWrongNotes();
    },

    // 학습 기록 화면
    goToStudyRecord() {
        this.showScreen('studyRecordScreen');
        this.renderStudyRecords();
    },

    // 문제 관리 화면
    goToQuestionManager() {
        this.showScreen('questionManagerScreen');
        this.renderQuestionManager();
    },

    // 과목별 퀴즈 설정 - 문제 개수 정보 업데이트
    updateQuestionCountInfo() {
        const subjects = this.getSelectedSubjectsFromUI();
        let totalCount = 0;

        subjects.forEach(subject => {
            totalCount += questionManager.getQuestionCountBySubject(subject);
        });

        const selectedCount = document.querySelector('input[name="questionCount"]:checked');
        const count = selectedCount ? selectedCount.value : '20';

        let displayCount = totalCount;
        if (count !== 'all') {
            displayCount = Math.min(parseInt(count), totalCount);
        }

        document.getElementById('questionCountInfo').textContent =
            `선택된 조건의 문제: ${displayCount}개`;
    },

    // UI에서 선택된 과목 가져오기
    getSelectedSubjectsFromUI() {
        const checkboxes = document.querySelectorAll('.subject-checkbox:checked');
        return Array.from(checkboxes).map(cb => cb.value);
    },

    // 과목 선택 변경 시
    setupSubjectQuizListeners() {
        document.querySelectorAll('.subject-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                app.updateQuestionCountInfo();
            });
        });

        document.querySelectorAll('input[name="questionCount"]').forEach(radio => {
            radio.addEventListener('change', () => {
                app.updateQuestionCountInfo();
            });
        });
    },

    // 오답노트 렌더링
    renderWrongNotes() {
        const wrongNotes = storage.getWrongNotes();
        const listDiv = document.getElementById('wrongNotesList');
        const countDiv = document.getElementById('wrongNotesCount');
        const retakeBtn = document.getElementById('retakeWrongBtn');

        countDiv.textContent = `틀린 문제: ${wrongNotes.length}개`;

        if (wrongNotes.length === 0) {
            listDiv.innerHTML = '<div style="text-align: center; color: var(--text-secondary); padding: 40px 20px;">틀린 문제가 없습니다!</div>';
            retakeBtn.disabled = true;
            return;
        }

        retakeBtn.disabled = false;
        listDiv.innerHTML = '';

        wrongNotes.forEach(note => {
            const item = document.createElement('div');
            item.className = 'wrong-note-item';

            const myAnswerText = note.myAnswer ? String.fromCharCode(64 + note.myAnswer) : '미답';
            const correctAnswerText = String.fromCharCode(64 + note.correctAnswer);

            item.innerHTML = `
                <div class="wrong-note-question">${note.question}</div>
                <div class="wrong-note-detail">
                    <span class="wrong-note-my-answer"><strong>내 답:</strong> ${myAnswerText}</span>
                </div>
                <div class="wrong-note-detail">
                    <span class="wrong-note-correct-answer"><strong>정답:</strong> ${correctAnswerText}</span>
                </div>
                <div class="wrong-note-explanation">${note.explanation}</div>
                <div class="wrong-note-footer">
                    <span>틀린 횟수: ${note.wrongCount}회 | 마지막 실수: ${note.lastWrongDate}</span>
                    <button class="wrong-note-remove" onclick="app.removeWrongNote(${note.questionId})">제거</button>
                </div>
            `;

            listDiv.appendChild(item);
        });
    },

    // 오답노트에서 제거
    removeWrongNote(questionId) {
        if (confirm('이 오답 문제를 제거하시겠습니까?')) {
            storage.removeWrongNote(questionId);
            this.renderWrongNotes();
        }
    },

    // 학습 기록 렌더링
    renderStudyRecords() {
        const records = storage.getStudyRecords();
        const tbody = document.getElementById('recordTableBody');

        if (records.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: var(--text-secondary); padding: 30px;">학습 기록이 없습니다.</td></tr>';
            return;
        }

        tbody.innerHTML = '';

        records.forEach(record => {
            const row = document.createElement('tr');
            const accuracy = Math.round((record.correctAnswers / record.totalQuestions) * 100);

            row.innerHTML = `
                <td>${record.date}</td>
                <td>${record.totalQuestions}</td>
                <td>${record.correctAnswers}</td>
                <td>${record.wrongAnswers}</td>
                <td>${record.score}</td>
                <td>${accuracy}%</td>
            `;

            tbody.appendChild(row);
        });
    },

    // 문제 관리 렌더링
    renderQuestionManager() {
        const totalCount = questionManager.getQuestionCount();
        document.getElementById('totalQuestionCount').textContent = totalCount;

        // 과목별 통계
        const subjectStats = questionManager.getSubjectStats();
        const subjectList = document.getElementById('subjectStatsList');
        subjectList.innerHTML = '';

        Object.entries(subjectStats).forEach(([subject, count]) => {
            const div = document.createElement('div');
            div.className = 'stat-item';
            div.innerHTML = `
                <span class="stat-item-name">${subject}</span>
                <span class="stat-item-count">${count}개</span>
            `;
            subjectList.appendChild(div);
        });

        // 연도별 통계
        const yearStats = questionManager.getYearStats();
        const yearList = document.getElementById('yearStatsList');
        yearList.innerHTML = '';

        Object.entries(yearStats)
            .sort((a, b) => b[0] - a[0])
            .forEach(([year, count]) => {
                const div = document.createElement('div');
                div.className = 'stat-item';
                div.innerHTML = `
                    <span class="stat-item-name">${year}년</span>
                    <span class="stat-item-count">${count}개</span>
                `;
                yearList.appendChild(div);
            });
    }
};

// 페이지 로드 시 이벤트 설정
document.addEventListener('DOMContentLoaded', () => {
    // 과목별 퀴즈 화면으로 이동할 때마다 리스너 설정
    const originalGoToSubjectQuiz = app.goToSubjectQuiz;
    app.goToSubjectQuiz = function() {
        originalGoToSubjectQuiz.call(this);
        app.setupSubjectQuizListeners();
    };

    // 초기 리스너 설정
    app.setupSubjectQuizListeners();
});
