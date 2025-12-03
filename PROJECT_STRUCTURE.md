# 📁 프로젝트 구조 (Project Structure)

```
pdf-theme-converter/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Pages 자동 배포 설정
├── .gitignore                  # Git 제외 파일 목록
├── README.md                   # 프로젝트 소개 및 문서
├── QUICKSTART.md              # 빠른 시작 가이드
├── DEPLOYMENT.md              # 배포 가이드
├── LICENSE                     # MIT 라이선스
├── package.json               # Node.js 프로젝트 설정
├── index.html                 # 메인 애플리케이션 (standalone)
└── pdf-theme-converter.jsx    # React 컴포넌트 버전
```

## 📄 파일 설명

### 핵심 파일

#### `index.html`
- **용도**: Standalone 웹 애플리케이션
- **특징**: 
  - 추가 설치 없이 바로 실행 가능
  - 모든 기능이 하나의 파일에 포함
  - 외부 라이브러리는 CDN에서 로드
- **실행**: 브라우저에서 직접 열기

#### `pdf-theme-converter.jsx`
- **용도**: React 컴포넌트
- **특징**:
  - React 프로젝트에 통합 가능
  - 재사용 가능한 컴포넌트
  - Props로 커스터마이징 가능
- **사용**: React 앱에 import

### 문서 파일

#### `README.md`
- 프로젝트 개요
- 기능 소개
- 설치 및 사용 방법
- 기술 스택

#### `QUICKSTART.md`
- 3가지 사용 방법
- 단계별 가이드
- 문제 해결 팁

#### `DEPLOYMENT.md`
- GitHub Pages 배포 방법
- 다른 플랫폼 배포 옵션
- DNS 설정 가이드

### 설정 파일

#### `package.json`
- Node.js 프로젝트 메타데이터
- 개발 스크립트
- 의존성 관리

#### `.gitignore`
- Git에서 제외할 파일 목록
- node_modules, 빌드 파일 등

#### `LICENSE`
- MIT 라이선스 전문
- 오픈소스 사용 조건

### GitHub Actions

#### `.github/workflows/deploy.yml`
- 자동 배포 워크플로우
- main 브랜치 푸시 시 자동 실행
- GitHub Pages로 배포

## 🔧 기술 세부사항

### 사용된 라이브러리

1. **PDF.js** (v3.11.174)
   - Mozilla의 PDF 렌더링 라이브러리
   - PDF를 Canvas로 렌더링
   - CDN: `cdnjs.cloudflare.com`

2. **jsPDF** (v2.5.1)
   - PDF 생성 라이브러리
   - Canvas 이미지를 PDF로 변환
   - CDN: `cdnjs.cloudflare.com`

3. **Lucide Icons**
   - React 컴포넌트용 아이콘
   - 경량 SVG 아이콘 세트

### 색상 필터 알고리즘

각 테마는 픽셀 단위 이미지 처리를 수행합니다:

1. **Dark Mode**: RGB 반전 (255 - value)
2. **Sepia**: 세피아 변환 행렬 적용
3. **Night Blue**: RGB 반전 + 블루 채널 감소
4. **Eye Care**: 그레이스케일 + 그린 채널 증폭
5. **High Contrast**: 임계값 기반 흑백 변환

## 🎨 커스터마이징 가이드

### 새로운 테마 추가

`index.html`의 `themes` 객체에 추가:

```javascript
themes.myTheme = {
    name: 'My Custom Theme',
    icon: '🎨',
    description: '나만의 테마 설명',
    filter: function(imageData) {
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            // R, G, B 값 수정
            data[i] = /* 새로운 R 값 */;
            data[i + 1] = /* 새로운 G 값 */;
            data[i + 2] = /* 새로운 B 값 */;
            // A (알파)는 data[i + 3]
        }
        return imageData;
    }
};
```

### 스타일 수정

CSS 변수를 수정하여 디자인 변경:

```css
/* 색상 테마 */
--primary-color: #6366f1;
--secondary-color: #8b5cf6;
--bg-color: #0f0f0f;
--text-color: #e0e0e0;

/* 간격 */
--spacing-sm: 0.5rem;
--spacing-md: 1rem;
--spacing-lg: 2rem;
```

## 🚀 성능 최적화

### 현재 구현
- Canvas를 사용한 효율적인 픽셀 처리
- 페이지별 순차 처리로 메모리 관리
- 진행률 표시로 UX 개선

### 추가 최적화 가능
- Web Workers로 백그라운드 처리
- OffscreenCanvas 사용
- 이미지 압축 옵션 추가

## 📊 브라우저 호환성

| 기능 | Chrome | Firefox | Safari | Edge |
|------|--------|---------|--------|------|
| 기본 기능 | ✅ 90+ | ✅ 88+ | ✅ 14+ | ✅ 90+ |
| Canvas API | ✅ | ✅ | ✅ | ✅ |
| File API | ✅ | ✅ | ✅ | ✅ |
| PDF.js | ✅ | ✅ | ✅ | ✅ |

## 🔐 보안 고려사항

- 모든 처리는 클라이언트 측에서 수행
- 파일이 서버로 전송되지 않음
- 브라우저 샌드박스 내에서 안전하게 실행

## 📝 향후 개선 계획

1. **기능 추가**
   - [ ] OCR 텍스트 추출
   - [ ] 북마크 유지
   - [ ] 주석 보존
   - [ ] 일괄 변환

2. **UX 개선**
   - [ ] 드래그 앤 드롭 영역 개선
   - [ ] 키보드 단축키
   - [ ] 설정 저장

3. **성능**
   - [ ] Web Workers 통합
   - [ ] 점진적 렌더링
   - [ ] 캐싱 전략

---

기여와 피드백을 환영합니다! 🙌
