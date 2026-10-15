import tkinter as tk
from tkinter import messagebox
from PIL import Image, ImageDraw
import numpy as np
from tensorflow import keras
import io

class HandwritingApp:
    def __init__(self, root):
        self.root = root
        self.root.title("손글씨 인식 프로그램")
        self.root.geometry("600x650")
        self.root.configure(bg='#f0f0f0')

        # 모델 로드
        self.load_model()

        # 제목
        title = tk.Label(root, text="✏️ 손글씨 인식", font=("Arial", 24, "bold"), bg='#f0f0f0')
        title.pack(pady=20)

        # Canvas
        self.canvas = tk.Canvas(root, width=280, height=280, bg='white', cursor="crosshair", relief="solid", borderwidth=2)
        self.canvas.pack(pady=10)

        # 마우스 이벤트 바인딩
        self.canvas.bind("<Button-1>", self.start_draw)
        self.canvas.bind("<B1-Motion>", self.draw)
        self.canvas.bind("<ButtonRelease-1>", self.stop_draw)

        self.is_drawing = False
        self.last_x = None
        self.last_y = None

        # 버튼 프레임
        button_frame = tk.Frame(root, bg='#f0f0f0')
        button_frame.pack(pady=10)

        # 인식 버튼
        self.recognize_btn = tk.Button(button_frame, text="인식하기", command=self.recognize,
                                       bg='#667eea', fg='white', font=("Arial", 12, "bold"),
                                       padx=20, pady=10, relief="flat", cursor="hand2")
        self.recognize_btn.pack(side=tk.LEFT, padx=5)

        # 초기화 버튼
        clear_btn = tk.Button(button_frame, text="초기화", command=self.clear_canvas,
                             bg='#e0e0e0', fg='#333', font=("Arial", 12, "bold"),
                             padx=20, pady=10, relief="flat", cursor="hand2")
        clear_btn.pack(side=tk.LEFT, padx=5)

        # 결과 표시 레이블
        result_label = tk.Label(root, text="인식 결과", font=("Arial", 10, "bold"), bg='#f0f0f0', fg='#999')
        result_label.pack(pady=(20, 5))

        # 결과 박스
        self.result_frame = tk.Frame(root, bg='white', relief="solid", borderwidth=1)
        self.result_frame.pack(padx=30, pady=10, fill=tk.BOTH, expand=False)

        self.result_text = tk.Label(self.result_frame, text="손글씨를 그린 후 인식하기를 누르세요",
                                   font=("Arial", 14), bg='white', fg='#999', pady=15)
        self.result_text.pack()

        # 신뢰도 표시
        self.confidence_label = tk.Label(root, text="", font=("Arial", 10), bg='#f0f0f0', fg='#666')

        # 정보 텍스트
        info = tk.Label(root, text="💡 0~9 숫자를 그려보세요", font=("Arial", 10), bg='#f0f0f0', fg='#999')
        info.pack(pady=10)

    def load_model(self):
        try:
            messagebox.showinfo("로드 중", "MNIST 모델을 로드하는 중입니다...\n약 1-2분 정도 소요됩니다.")

            # MNIST 데이터 로드 및 모델 생성
            (x_train, y_train), (x_test, y_test) = keras.datasets.mnist.load_data()

            # 모델 생성
            self.model = keras.Sequential([
                keras.layers.Conv2D(32, (3, 3), activation='relu', input_shape=(28, 28, 1)),
                keras.layers.MaxPooling2D((2, 2)),
                keras.layers.Conv2D(64, (3, 3), activation='relu'),
                keras.layers.MaxPooling2D((2, 2)),
                keras.layers.Conv2D(64, (3, 3), activation='relu'),
                keras.layers.Flatten(),
                keras.layers.Dense(128, activation='relu'),
                keras.layers.Dropout(0.5),
                keras.layers.Dense(10, activation='softmax')
            ])

            self.model.compile(optimizer='adam',
                              loss='sparse_categorical_crossentropy',
                              metrics=['accuracy'])

            # 데이터 전처리
            x_train = x_train.astype("float32") / 255
            x_test = x_test.astype("float32") / 255
            x_train = np.expand_dims(x_train, -1)
            x_test = np.expand_dims(x_test, -1)

            # 모델 훈련 (epochs 증가)
            print("모델 훈련 중...")
            self.model.fit(x_train, y_train, batch_size=128, epochs=10,
                          validation_data=(x_test, y_test), verbose=0)

            messagebox.showinfo("완료", "모델 로드 완료!\n이제 손글씨를 그려보세요.")

        except Exception as e:
            messagebox.showerror("오류", f"모델 로드 실패: {str(e)}")

    def start_draw(self, event):
        self.is_drawing = True
        self.last_x = event.x
        self.last_y = event.y

    def draw(self, event):
        if self.is_drawing and self.last_x and self.last_y:
            self.canvas.create_line(self.last_x, self.last_y, event.x, event.y,
                                   fill='black', width=5, capstyle=tk.ROUND, smooth=True)
            self.last_x = event.x
            self.last_y = event.y

    def stop_draw(self, event):
        self.is_drawing = False

    def recognize(self):
        try:
            # Canvas에서 이미지 캡처
            img = Image.new('L', (280, 280), color=255)
            draw = ImageDraw.Draw(img)

            # Canvas의 모든 아이템 가져오기
            for item_id in self.canvas.find_all():
                item_type = self.canvas.type(item_id)
                if item_type == "line":
                    coords = self.canvas.coords(item_id)
                    if len(coords) >= 4:
                        # 좌표를 2개씩 쌍으로 묶기
                        for i in range(0, len(coords) - 2, 2):
                            x1, y1, x2, y2 = coords[i], coords[i+1], coords[i+2], coords[i+3]
                            draw.line([(x1, y1), (x2, y2)], fill=0, width=6)

            # 이미지 정규화 및 리사이즈
            img_array = np.array(img, dtype=np.float32)

            # 역반전 (검은색이 배경, 흰색이 글씨) - MNIST와 맞추기
            img_array = 255 - img_array
            img_array = img_array / 255.0

            # 28x28로 리사이즈
            img_resized = Image.fromarray((img_array * 255).astype(np.uint8))
            img_resized = img_resized.resize((28, 28), Image.Resampling.LANCZOS)

            # numpy 배열로 변환 및 정규화
            img_array = np.array(img_resized, dtype=np.float32) / 255.0
            img_array = np.expand_dims(img_array, axis=0)
            img_array = np.expand_dims(img_array, axis=-1)

            # 예측
            predictions = self.model.predict(img_array, verbose=0)
            digit = np.argmax(predictions[0])
            confidence = np.max(predictions[0])

            # 결과 표시
            self.result_text.config(text=str(digit), font=("Arial", 48, "bold"), fg='#667eea')

            # 신뢰도 표시
            if not self.confidence_label.winfo_viewable():
                self.confidence_label.pack(pady=5)

            confidence_percent = int(confidence * 100)
            self.confidence_label.config(text=f"정확도: {confidence_percent}%")

        except Exception as e:
            messagebox.showerror("오류", f"인식 실패: {str(e)}")

    def clear_canvas(self):
        self.canvas.delete("all")
        self.result_text.config(text="손글씨를 그린 후 인식하기를 누르세요", font=("Arial", 14), fg='#999')
        self.confidence_label.pack_forget()

if __name__ == "__main__":
    root = tk.Tk()
    app = HandwritingApp(root)
    root.mainloop()
