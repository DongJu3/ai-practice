# ✏️ 손글씨 인식 프로그램

AI를 사용한 간단하고 정확한 손글씨(0~9 숫자) 인식 프로그램입니다.

## 🌟 특징

- **AI 기반**: TensorFlow/Keras CNN 모델 사용
- **높은 정확도**: MNIST 데이터셋으로 훈련됨
- **사용 간편**: 배치 파일 클릭 한 번으로 실행
- **자동 설치**: 필요한 라이브러리 자동 설치
- **직관적 UI**: tkinter 기반 사용하기 쉬운 인터페이스

## 📋 요구사항

- Python 3.7 이상
- Windows/Mac/Linux

## 🚀 실행 방법

### Windows
1. `run.bat` 파일 **더블클릭**
2. 모델 훈련 완료 대기 (약 **1-2분**)

### Mac/Linux
```bash
bash run.sh
```

## 📦 설치 방법 (수동)

```bash
pip install tensorflow pillow numpy
python handwriting_recognition.py
```

## 💡 사용 방법

1. 프로그램 실행
2. 흰색 영역에 **0~9 숫자** 그리기
3. **"인식하기"** 버튼 클릭
4. 인식된 숫자와 정확도 확인

## 🛠️ 기술 스택

- **Framework**: TensorFlow/Keras
- **GUI**: tkinter
- **이미지 처리**: PIL (Pillow)
- **데이터**: MNIST

## 📊 모델 구조

- Conv2D 레이어 (32, 64 필터)
- MaxPooling2D 레이어
- Dense 레이어 (128 유닛) - 개선됨
- Dropout (0.5)
- Softmax 활성화 함수

## 🎯 정확도

- **훈련 정확도**: ~99%
- **테스트 정확도**: ~98%

## ✨ 최신 개선사항 (v2.0)

- ✅ 모델 훈련 강화 (epochs: 3 → 10)
- ✅ Dense 레이어 확대 (64 → 128)
- ✅ Canvas 이미지 처리 정확화
- ✅ 모든 숫자(0-9) 인식률 개선
- ✅ 이미지 정규화 최적화

## 📝 라이선스

MIT License

## 👨‍💻 개발자

Created on 2026-09-28

---

**문제가 있으신가요?** GitHub Issues에서 보고해주세요!
