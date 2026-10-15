@echo off
chcp 65001 > nul
echo 필요한 라이브러리를 설치하는 중...
pip install tensorflow pillow numpy -q
echo.
echo 프로그램을 실행합니다...
python handwriting_recognition.py
pause
