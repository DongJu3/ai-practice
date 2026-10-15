# 🤖 AI Practice

AI와 웹 기술을 학습하기 위한 실습 프로젝트 모음입니다. 각 프로젝트는 독립적으로 실행 가능하며, 다양한 기술과 개념을 다룹니다.

---

## 📋 프로젝트 목록

### 1. 🖊️ **Handwriting Recognition** (손글씨 인식)
**위치**: `handwriting-recognition/handwriting-recognition-main/`

손글씨를 AI 모델을 이용해 인식하는 프로젝트입니다.

**주요 기술**:
- Python
- 머신러닝 (Machine Learning)
- MNIST 데이터셋
- 신경망 (Neural Network)

**실행 방법**:
```bash
cd handwriting-recognition/handwriting-recognition-main
python handwriting_recognition.py
# 또는
run.bat
```

**주요 기능**:
- 손글씨 숫자 인식
- 이미지 처리
- 모델 학습 및 평가

---

### 2. 📚 **Information Processing Exam Quiz** (정보처리기사 필기 퀴즈)
**위치**: `information-processing-quiz/`

정보처리기사 필기시험을 대비하기 위한 웹 기반 퀴즈 게임입니다.

**주요 기술**:
- HTML5
- CSS3
- JavaScript (Vanilla)
- localStorage (로컬 데이터 저장)

**실행 방법**:
```bash
# Python 3.x를 이용한 로컬 서버 실행
cd information-processing-quiz
python -m http.server 8000

# 브라우저에서 http://localhost:8000 접속
```

**주요 기능**:
- 📖 20문제 랜덤 퀴즈
- 📝 과목별 퀴즈 (5개 과목)
- ✅ 실시간 채점 및 해설
- 📌 오답노트 (자동 저장)
- 📊 학습 기록 추적
- 🎯 과목별 성적 분석
- 📱 반응형 디자인

**5개 과목**:
- 소프트웨어 설계
- 소프트웨어 개발
- 데이터베이스 구축
- 프로그래밍 언어 활용
- 정보시스템 구축관리

---

### 3. ✅ **Task Manager** (작업 관리 앱)
**위치**: `task-manager/task-manager-main/`

일일 작업을 효율적으로 관리할 수 있는 웹 애플리케이션입니다.

**주요 기술**:
- React
- TypeScript
- Tailwind CSS
- Context API
- IndexedDB

**실행 방법**:
```bash
cd task-manager/task-manager-main
npm install
npm run dev

# 브라우저에서 http://localhost:5173 접속
```

**주요 기능**:
- 📋 작업 생성 및 관리
- 🏷️ 카테고리 분류
- 📅 캘린더 뷰
- 📊 통계 및 분석
- 🔔 작업 알림
- 💾 데이터 자동 저장
- 🎨 다양한 UI 테마

---

## 🚀 빠른 시작 가이드

### 필수 요구사항
- **Python** 3.8 이상 (Handwriting Recognition, Information Processing Quiz)
- **Node.js** 16.0 이상 (Task Manager)
- **Git**
- 현대 웹 브라우저 (Chrome, Firefox, Edge, Safari)

### 저장소 클론
```bash
git clone https://github.com/DongJu3/ai-practice.git
cd ai-practice
```

### 각 프로젝트별 실행
```bash
# 1. 손글씨 인식
cd handwriting-recognition/handwriting-recognition-main
python handwriting_recognition.py

# 2. 정보처리기사 퀴즈
cd information-processing-quiz
python -m http.server 8000

# 3. 작업 관리 앱
cd task-manager/task-manager-main
npm install
npm run dev
```

---

## 📁 디렉토리 구조

```
ai-practice/
│
├── handwriting-recognition/
│   └── handwriting-recognition-main/
│       ├── handwriting_recognition.py
│       ├── run.bat
│       └── README.md
│
├── information-processing-quiz/
│   ├── index.html
│   ├── README.md
│   ├── TEST_CHECKLIST.txt
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── app.js
│   │   ├── quiz.js
│   │   ├── storage.js
│   │   └── questionManager.js
│   └── data/
│       └── questions.json
│
├── task-manager/
│   └── task-manager-main/
│       ├── src/
│       │   ├── components/
│       │   ├── pages/
│       │   ├── context/
│       │   └── utils/
│       ├── package.json
│       ├── vite.config.ts
│       └── README.md
│
└── README.md (이 파일)
```

---

## 🎯 학습 목표

각 프로젝트는 다음의 학습 목표를 가지고 있습니다:

| 프로젝트 | 학습 목표 |
|---------|---------|
| Handwriting Recognition | AI/ML 기초, 신경망, 이미지 처리 |
| Information Processing Quiz | 웹 개발, JavaScript, 상태 관리, 로컬 스토리지 |
| Task Manager | React, TypeScript, 컴포넌트 설계, 상태 관리 |

---

## 📖 각 프로젝트의 상세 설명

각 프로젝트의 자세한 내용은 해당 폴더의 `README.md` 파일을 참고하세요:

- [Handwriting Recognition README](./handwriting-recognition/handwriting-recognition-main/README.md)
- [Information Processing Quiz README](./information-processing-quiz/README.md)
- [Task Manager README](./task-manager/task-manager-main/README.md)

---

## 💡 프로젝트 특징

### 🌟 Handwriting Recognition
- 실제 MNIST 데이터셋 사용
- 신경망 모델 구현
- 이미지 전처리
- 모델 정확도 평가

### 🌟 Information Processing Quiz
- 실제 기출 문제 기반
- 과목별 학습 추적
- 오답 자동 저장
- 브라우저 종료 후에도 데이터 유지

### 🌟 Task Manager
- 모던 React 아키텍처
- TypeScript로 타입 안정성 확보
- Tailwind CSS로 스타일링
- IndexedDB로 로컬 데이터 관리

---

## 🔧 기술 스택 요약

| 프로젝트 | 프론트엔드 | 백엔드 | 데이터베이스 |
|---------|-----------|--------|------------|
| Handwriting Recognition | N/A | Python | MNIST Dataset |
| Information Processing Quiz | HTML/CSS/JavaScript | Browser API | localStorage |
| Task Manager | React/TypeScript/Tailwind | Node.js | IndexedDB |

---

## 📝 라이선스

이 프로젝트는 학습 목적으로 만들어졌습니다.

---

## 👨‍💻 개발자

**Dongju Kim** (ask3086@naver.com)

---

## 🤝 기여

이 프로젝트에 대한 개선 사항이나 버그 리포트는 언제든 환영합니다.

---

## 📞 문의

프로젝트에 대한 질문이나 피드백이 있으시면 이슈(Issue)를 등록해주세요.

---

**마지막 업데이트**: 2026년 10월 15일

Happy Learning! 🚀
