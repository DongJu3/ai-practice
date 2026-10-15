// localStorage 관리 모듈

const storage = {
    // 오답노트 저장/로드
    saveWrongNote(questionId, question, myAnswer, correctAnswer, explanation, subject) {
        const wrongNotes = this.getWrongNotes();
        const existingIndex = wrongNotes.findIndex(note => note.questionId === questionId);

        if (existingIndex >= 0) {
            // 기존 오답 업데이트 (틀린 횟수 증가)
            wrongNotes[existingIndex].wrongCount++;
            wrongNotes[existingIndex].lastWrongDate = new Date().toISOString().split('T')[0];
        } else {
            // 새로운 오답 추가
            wrongNotes.push({
                questionId,
                question,
                myAnswer,
                correctAnswer,
                explanation,
                subject,
                wrongCount: 1,
                lastWrongDate: new Date().toISOString().split('T')[0]
            });
        }

        localStorage.setItem('wrongNotes', JSON.stringify(wrongNotes));
    },

    getWrongNotes() {
        const data = localStorage.getItem('wrongNotes');
        return data ? JSON.parse(data) : [];
    },

    removeWrongNote(questionId) {
        const wrongNotes = this.getWrongNotes();
        const filtered = wrongNotes.filter(note => note.questionId !== questionId);
        localStorage.setItem('wrongNotes', JSON.stringify(filtered));
    },

    clearWrongNotes() {
        localStorage.removeItem('wrongNotes');
    },

    // 학습 기록 저장/로드
    saveStudyRecord(totalQuestions, correctAnswers, wrongAnswers, subjectScores) {
        const records = this.getStudyRecords();
        const score = Math.round((correctAnswers / totalQuestions) * 100);

        records.unshift({
            date: new Date().toISOString().split('T')[0],
            totalQuestions,
            correctAnswers,
            wrongAnswers,
            score,
            subjectScores
        });

        // 최근 100개 기록만 유지
        if (records.length > 100) {
            records.pop();
        }

        localStorage.setItem('studyRecords', JSON.stringify(records));
    },

    getStudyRecords() {
        const data = localStorage.getItem('studyRecords');
        return data ? JSON.parse(data) : [];
    },

    clearStudyRecords() {
        localStorage.removeItem('studyRecords');
    },

    // 현재 퀴즈 상태 저장/로드
    saveQuizState(state) {
        localStorage.setItem('currentQuizState', JSON.stringify(state));
    },

    getQuizState() {
        const data = localStorage.getItem('currentQuizState');
        return data ? JSON.parse(data) : null;
    },

    clearQuizState() {
        localStorage.removeItem('currentQuizState');
    }
};
