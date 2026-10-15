// 문제 데이터 관리 모듈

const questionManager = {
    allQuestions: [],

    // JSON 파일에서 문제 로드
    async loadQuestions() {
        try {
            const response = await fetch('data/questions.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.allQuestions = data.questions || [];
            console.log(`${this.allQuestions.length}개의 문제가 로드되었습니다.`);
            return this.allQuestions;
        } catch (error) {
            console.error('문제 로드 실패:', error);
            alert('문제를 로드할 수 없습니다. 네트워크를 확인해주세요.');
            return [];
        }
    },

    // 문제 개수 확인
    getQuestionCount() {
        return this.allQuestions.length;
    },

    // 특정 과목의 문제 개수
    getQuestionCountBySubject(subject) {
        return this.allQuestions.filter(q => q.subject === subject).length;
    },

    // 모든 과목 목록
    getAllSubjects() {
        const subjects = new Set();
        this.allQuestions.forEach(q => subjects.add(q.subject));
        return Array.from(subjects);
    },

    // 모든 연도 목록
    getAllYears() {
        const years = new Set();
        this.allQuestions.forEach(q => years.add(q.year));
        return Array.from(years).sort((a, b) => b - a);
    },

    // 과목별 문제 개수 통계
    getSubjectStats() {
        const stats = {};
        this.allQuestions.forEach(q => {
            stats[q.subject] = (stats[q.subject] || 0) + 1;
        });
        return stats;
    },

    // 연도별 문제 개수 통계
    getYearStats() {
        const stats = {};
        this.allQuestions.forEach(q => {
            stats[q.year] = (stats[q.year] || 0) + 1;
        });
        return stats;
    },

    // 랜덤 문제 선택 (중복 제거)
    getRandomQuestions(count, subjects = null) {
        let filtered = this.allQuestions;

        // 과목 필터링
        if (subjects && subjects.length > 0) {
            filtered = this.allQuestions.filter(q => subjects.includes(q.subject));
        }

        // 요청한 개수가 사용 가능한 개수보다 많으면 모두 반환
        if (count >= filtered.length) {
            return this.shuffleArray([...filtered]);
        }

        // Fisher-Yates 셔플을 사용하여 랜덤 선택
        const shuffled = this.shuffleArray([...filtered]);
        return shuffled.slice(0, count);
    },

    // 배열 셔플 (Fisher-Yates)
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    },

    // 문제 ID로 문제 찾기
    getQuestionById(id) {
        return this.allQuestions.find(q => q.id === id);
    },

    // 5개 과목에서 골고루 문제 선택
    getBalancedQuestions(totalCount = 20) {
        const subjects = this.getAllSubjects();
        const questionsPerSubject = Math.ceil(totalCount / subjects.length);

        const selected = [];
        const subjectQuestions = {};

        // 과목별 문제 그룹화
        subjects.forEach(subject => {
            subjectQuestions[subject] = this.allQuestions.filter(q => q.subject === subject);
        });

        // 각 과목에서 균등하게 선택
        subjects.forEach(subject => {
            const available = subjectQuestions[subject];
            const shuffled = this.shuffleArray(available);
            const count = Math.min(questionsPerSubject, shuffled.length);
            selected.push(...shuffled.slice(0, count));
        });

        // 정확히 totalCount개가 되도록 조정
        if (selected.length > totalCount) {
            return selected.slice(0, totalCount);
        }

        // 부족하면 남은 문제에서 추가
        if (selected.length < totalCount) {
            const remaining = this.allQuestions.filter(q => !selected.includes(q));
            const shuffled = this.shuffleArray(remaining);
            selected.push(...shuffled.slice(0, totalCount - selected.length));
        }

        return this.shuffleArray(selected);
    }
};

// 페이지 로드 시 문제 로드
document.addEventListener('DOMContentLoaded', async () => {
    await questionManager.loadQuestions();
});
