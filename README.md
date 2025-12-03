# 📄 PDF Theme Converter

논문과 문서를 눈에 편안한 다크 모드 및 다양한 테마로 변환하는 웹 애플리케이션입니다.

![PDF Theme Converter](https://img.shields.io/badge/PDF-Theme%20Converter-6366f1?style=for-the-badge&logo=adobe-acrobat-reader)
![React](https://img.shields.io/badge/React-18-61dafb?style=for-the-badge&logo=react)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

## ✨ 주요 기능

- 🌙 **다크 모드**: 논문의 흰 배경을 검은색으로, 텍스트를 흰색으로 반전
- ☕ **세피아 톤**: 따뜻하고 눈에 편안한 세피아 필터
- 🌊 **블루라이트 감소**: 야간 독서를 위한 블루 필터
- 🌿 **눈 건강 모드**: 그린 스크린 필터로 눈의 피로 감소
- ⚡ **고대비 모드**: 가독성을 극대화한 흑백 고대비
- 📥 **간편한 사용**: 드래그 앤 드롭으로 PDF 업로드
- 💾 **빠른 변환**: 실시간 미리보기와 즉시 다운로드

## 🚀 데모

온라인 데모: [여기에 배포 URL 추가]

## 📦 설치 방법

### 옵션 1: 웹에서 바로 사용

`index.html` 파일을 브라우저에서 열어 바로 사용할 수 있습니다.

```bash
# 저장소 클론
git clone https://github.com/yourusername/pdf-theme-converter.git
cd pdf-theme-converter

# 브라우저에서 열기
open index.html  # macOS
start index.html # Windows
xdg-open index.html # Linux
```

### 옵션 2: 개발 서버 실행

```bash
# 의존성 설치
npm install

# 개발 서버 시작
npm start
```

## 💻 사용 방법

1. **PDF 업로드**: "PDF 파일을 업로드하세요" 영역을 클릭하거나 파일을 드래그하여 업로드
2. **테마 선택**: 원하는 테마 모드 선택 (다크, 세피아, 블루라이트 감소 등)
3. **변환 시작**: "변환 시작" 버튼 클릭
4. **다운로드**: 변환이 완료되면 "다운로드" 버튼으로 새 PDF 저장

## 🎨 지원 테마

| 테마 | 설명 | 추천 사용 시기 |
|------|------|----------------|
| 🌙 Dark Mode | 검은 배경에 흰 글씨 | 야간 독서, 어두운 환경 |
| ☕ Sepia | 따뜻한 갈색 톤 | 장시간 독서, 편안한 분위기 |
| 🌊 Night Blue | 블루라이트 감소 | 취침 전 독서 |
| 🌿 Eye Care | 녹색 필터 | 눈의 피로 감소 |
| ⚡ High Contrast | 흑백 고대비 | 명확한 가독성 필요 시 |

## 🛠️ 기술 스택

- **Frontend**: React 18
- **PDF 처리**: PDF.js
- **PDF 생성**: jsPDF
- **UI**: Custom CSS with glassmorphism
- **Icons**: Lucide React

## 📱 호환성

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 🤝 기여하기

기여를 환영합니다! 다음과 같이 기여할 수 있습니다:

1. Fork 프로젝트
2. Feature 브랜치 생성 (`git checkout -b feature/AmazingFeature`)
3. 변경사항 커밋 (`git commit -m 'Add some AmazingFeature'`)
4. 브랜치에 Push (`git push origin feature/AmazingFeature`)
5. Pull Request 생성

## 📝 로드맵

- [ ] 사용자 정의 색상 조합 추가
- [ ] 여백 및 폰트 크기 조절 기능
- [ ] 일괄 변환 기능
- [ ] 변환 설정 저장 기능
- [ ] 다국어 지원 (English, 日本語, 中文)
- [ ] PWA 지원
- [ ] 북마크 및 하이라이트 보존

## ⚠️ 제한사항

- 최대 파일 크기: 50MB 권장
- 스캔된 이미지 PDF의 경우 OCR 기능 미지원
- 암호화된 PDF는 먼저 암호를 해제해야 합니다

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 🙏 감사의 말

- [PDF.js](https://mozilla.github.io/pdf.js/) - PDF 렌더링
- [jsPDF](https://github.com/parallax/jsPDF) - PDF 생성
- [Lucide](https://lucide.dev/) - 아이콘 세트

## 📧 연락처

프로젝트 Link: [https://github.com/yourusername/pdf-theme-converter](https://github.com/yourusername/pdf-theme-converter)

---

⭐ 이 프로젝트가 도움이 되었다면 Star를 눌러주세요!

## 🌐 English Version

# 📄 PDF Theme Converter

A web application that converts academic papers and documents into eye-friendly dark mode and various themes.

## ✨ Key Features

- 🌙 **Dark Mode**: Inverts white backgrounds to black and text to white
- ☕ **Sepia Tone**: Warm and eye-comfortable sepia filter
- 🌊 **Blue Light Reduction**: Blue filter for night reading
- 🌿 **Eye Care Mode**: Green screen filter to reduce eye strain
- ⚡ **High Contrast Mode**: Black and white high contrast for maximum readability
- 📥 **Easy to Use**: Drag and drop PDF upload
- 💾 **Fast Conversion**: Real-time preview and instant download

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/pdf-theme-converter.git
cd pdf-theme-converter

# Open in browser
open index.html
```

## 💻 Usage

1. **Upload PDF**: Click the upload area or drag and drop your PDF file
2. **Select Theme**: Choose your preferred theme (Dark, Sepia, Blue Light Reduction, etc.)
3. **Convert**: Click the "변환 시작" (Start Conversion) button
4. **Download**: Once converted, click "다운로드" (Download) to save the new PDF

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Made with ❤️ for researchers and night readers
