# 🚀 배포 가이드 (Deployment Guide)

이 문서는 PDF Theme Converter를 GitHub Pages에 배포하는 방법을 설명합니다.

## 📋 목차

1. [GitHub 저장소 생성](#1-github-저장소-생성)
2. [코드 업로드](#2-코드-업로드)
3. [GitHub Pages 설정](#3-github-pages-설정)
4. [배포 확인](#4-배포-확인)
5. [사용자 정의 도메인 설정 (선택사항)](#5-사용자-정의-도메인-설정-선택사항)

---

## 1. GitHub 저장소 생성

1. [GitHub](https://github.com)에 로그인
2. 우측 상단의 `+` 버튼 클릭 → `New repository` 선택
3. 저장소 정보 입력:
   - **Repository name**: `pdf-theme-converter` (또는 원하는 이름)
   - **Description**: "Convert PDFs to dark mode and various eye-friendly themes"
   - **Visibility**: Public (GitHub Pages를 무료로 사용하려면 필수)
4. `Create repository` 클릭

## 2. 코드 업로드

### 방법 A: 명령줄 사용 (권장)

```bash
# 프로젝트 디렉토리로 이동
cd pdf-theme-converter

# Git 초기화
git init

# 파일 추가
git add .

# 커밋
git commit -m "Initial commit: PDF Theme Converter"

# 원격 저장소 연결 (YOUR_USERNAME을 실제 GitHub 사용자명으로 변경)
git remote add origin https://github.com/YOUR_USERNAME/pdf-theme-converter.git

# main 브랜치로 푸시
git branch -M main
git push -u origin main
```

### 방법 B: GitHub Desktop 사용

1. [GitHub Desktop](https://desktop.github.com/) 다운로드 및 설치
2. `File` → `Add Local Repository` 선택
3. 프로젝트 폴더 선택
4. `Publish repository` 클릭

### 방법 C: 웹 인터페이스 사용

1. GitHub 저장소 페이지에서 `uploading an existing file` 클릭
2. 모든 파일을 드래그 앤 드롭
3. `Commit changes` 클릭

## 3. GitHub Pages 설정

### 자동 배포 (GitHub Actions 사용)

1. GitHub 저장소 페이지로 이동
2. `Settings` 탭 클릭
3. 좌측 메뉴에서 `Pages` 선택
4. **Source** 섹션에서:
   - Source: `GitHub Actions` 선택
5. 저장 (자동으로 저장됨)

코드를 main 브랜치에 푸시하면 자동으로 배포가 시작됩니다.

### 수동 배포 (간단한 방법)

1. GitHub 저장소 페이지로 이동
2. `Settings` 탭 클릭
3. 좌측 메뉴에서 `Pages` 선택
4. **Source** 섹션에서:
   - Source: `Deploy from a branch` 선택
   - Branch: `main` / `/ (root)` 선택
   - `Save` 클릭

## 4. 배포 확인

1. `Actions` 탭으로 이동
2. 배포 워크플로우가 성공적으로 완료될 때까지 대기 (보통 1-2분)
3. 배포가 완료되면 `Settings` → `Pages`에서 배포 URL 확인
   - URL 형식: `https://YOUR_USERNAME.github.io/pdf-theme-converter/`
4. URL을 클릭하여 사이트 확인

## 5. 사용자 정의 도메인 설정 (선택사항)

자신의 도메인을 사용하려면:

1. 도메인 등록 업체에서 DNS 설정:
   ```
   Type: CNAME
   Name: www (또는 원하는 서브도메인)
   Value: YOUR_USERNAME.github.io
   ```

2. GitHub 저장소의 `Settings` → `Pages`에서:
   - **Custom domain**에 도메인 입력 (예: `www.yourdomain.com`)
   - `Save` 클릭

3. `Enforce HTTPS` 체크박스 활성화

## 📝 업데이트 방법

코드를 수정한 후 다시 배포하려면:

```bash
# 변경사항 추가
git add .

# 커밋
git commit -m "Update: [변경 내용 설명]"

# 푸시 (자동으로 재배포됨)
git push
```

## 🔧 문제 해결

### 배포가 실패하는 경우

1. `Actions` 탭에서 오류 로그 확인
2. 파일 이름과 경로가 올바른지 확인
3. `.github/workflows/deploy.yml` 파일이 올바르게 생성되었는지 확인

### 사이트가 표시되지 않는 경우

1. GitHub Pages가 활성화되어 있는지 확인
2. 브라우저 캐시 삭제
3. 5-10분 정도 대기 후 다시 시도

### 404 오류가 발생하는 경우

1. 저장소 이름과 URL 경로가 일치하는지 확인
2. `index.html` 파일이 루트 디렉토리에 있는지 확인

## 🌐 대체 배포 옵션

GitHub Pages 외에도 다음 플랫폼에 배포할 수 있습니다:

### Vercel

```bash
npm install -g vercel
vercel
```

### Netlify

1. [Netlify](https://netlify.com) 회원가입
2. `New site from Git` 클릭
3. GitHub 저장소 연결

### Cloudflare Pages

1. [Cloudflare Pages](https://pages.cloudflare.com) 접속
2. `Create a project` 클릭
3. GitHub 저장소 연결

## 📧 지원

배포 중 문제가 발생하면:
- GitHub Issues에 문의
- [GitHub Pages 문서](https://docs.github.com/pages) 참조

---

Made with ❤️ for open source
