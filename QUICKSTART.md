# 🚀 빠른 시작 가이드 (Quick Start Guide)

PDF Theme Converter를 사용하는 가장 빠른 방법!

## 🎯 3가지 사용 방법

### 1️⃣ 브라우저에서 바로 사용 (가장 간단!)

1. `index.html` 파일을 다운로드
2. 파일을 더블클릭하여 브라우저에서 열기
3. PDF 업로드하고 바로 사용!

**추가 설치 필요 없음!**

### 2️⃣ 로컬 서버로 실행

```bash
# 1. 프로젝트 다운로드
git clone https://github.com/YOUR_USERNAME/pdf-theme-converter.git
cd pdf-theme-converter

# 2. 간단한 서버 실행 (Python 사용)
python -m http.server 8000

# 또는 (Python 3)
python3 -m http.server 8000

# 또는 (Node.js 사용)
npx http-server -p 8000

# 3. 브라우저에서 열기
# http://localhost:8000
```

### 3️⃣ GitHub Pages로 배포 (온라인 공유)

자세한 내용은 `DEPLOYMENT.md`를 참조하세요.

## 📖 사용 방법

1. **PDF 업로드**
   - "PDF 파일을 업로드하세요" 영역 클릭
   - 또는 PDF 파일을 드래그 앤 드롭

2. **테마 선택**
   - 🌙 Dark Mode: 기본 다크모드
   - ☕ Sepia: 따뜻한 세피아
   - 🌊 Night Blue: 블루라이트 감소
   - 🌿 Eye Care: 눈 건강 그린
   - ⚡ High Contrast: 고대비

3. **변환**
   - "변환 시작" 버튼 클릭
   - 진행률 확인

4. **다운로드**
   - 미리보기 확인
   - "다운로드" 버튼으로 저장

## 💡 팁

### 대용량 PDF 처리
- 50MB 이하 권장
- 페이지 수가 많으면 시간이 걸릴 수 있습니다

### 최적의 결과를 위해
- 고해상도 PDF 사용
- 텍스트 기반 PDF 권장 (이미지 PDF도 가능)

### 브라우저 추천
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🔧 문제 해결

### 파일이 업로드되지 않음
- PDF 파일인지 확인
- 파일 크기 확인 (50MB 이하 권장)
- 브라우저를 새로고침

### 변환이 느림
- PDF 페이지 수가 많으면 시간이 걸립니다
- 브라우저 콘솔에서 진행 상황 확인

### 다운로드가 안 됨
- 팝업 차단 해제
- 다른 브라우저에서 시도

## 📞 도움말

- 버그 리포트: GitHub Issues
- 기능 제안: GitHub Discussions
- 문서: README.md

## 🎨 커스터마이징

코드를 수정하여 자신만의 테마를 추가할 수 있습니다!

`index.html` 또는 `pdf-theme-converter.jsx`에서 `themes` 객체를 수정하세요.

```javascript
myCustomTheme: {
    name: 'My Theme',
    icon: '🎨',
    description: '나만의 테마',
    filter: (imageData) => {
        // 여기에 필터 로직 추가
        return imageData;
    }
}
```

---

즐거운 독서 되세요! 📚✨
