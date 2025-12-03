import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FileText, Moon, Sun, Coffee, Eye, Upload, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Settings, MessageSquare, X, Loader } from 'lucide-react';

const PDFThemeViewer = () => {
  // PDF 상태
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [scale, setScale] = useState(1.5);
  const [isLoading, setIsLoading] = useState(false);

  // 테마 상태
  const [selectedTheme, setSelectedTheme] = useState('dark');

  // LLM 상태
  const [selectedText, setSelectedText] = useState('');
  const [showExplainButton, setShowExplainButton] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });
  const [showSidePanel, setShowSidePanel] = useState(false);
  const [explanation, setExplanation] = useState('');
  const [isExplaining, setIsExplaining] = useState(false);

  // 설정 상태
  const [showSettings, setShowSettings] = useState(false);
  const [hfToken, setHfToken] = useState('');
  const [hfModel, setHfModel] = useState('meta-llama/Llama-3.2-3B-Instruct');

  // Refs
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);
  const textLayerRef = useRef(null);
  const viewerRef = useRef(null);

  // 테마 정의 (CSS 필터 기반)
  const themes = {
    light: {
      name: 'Light',
      icon: Sun,
      description: '기본 밝은 모드',
      filter: 'none',
      bg: '#ffffff',
      text: '#000000'
    },
    dark: {
      name: 'Dark Mode',
      icon: Moon,
      description: '눈에 편안한 다크 모드',
      filter: 'invert(1) hue-rotate(180deg)',
      bg: '#1a1a1a',
      text: '#ffffff'
    },
    sepia: {
      name: 'Sepia',
      icon: Coffee,
      description: '따뜻한 세피아 톤',
      filter: 'sepia(0.8) brightness(0.95)',
      bg: '#f4ecd8',
      text: '#5b4636'
    },
    night: {
      name: 'Night Blue',
      icon: Moon,
      description: '블루라이트 감소',
      filter: 'invert(1) hue-rotate(180deg) brightness(0.85) sepia(0.2)',
      bg: '#0a1929',
      text: '#90caf9'
    },
    green: {
      name: 'Eye Care',
      icon: Eye,
      description: '눈 건강 그린 모드',
      filter: 'invert(1) hue-rotate(90deg) brightness(0.9)',
      bg: '#1a2f1a',
      text: '#c5e1a5'
    }
  };

  // localStorage에서 설정 로드
  useEffect(() => {
    const savedToken = localStorage.getItem('hfToken');
    const savedModel = localStorage.getItem('hfModel');
    if (savedToken) setHfToken(savedToken);
    if (savedModel) setHfModel(savedModel);
  }, []);

  // 설정 저장
  const saveSettings = () => {
    localStorage.setItem('hfToken', hfToken);
    localStorage.setItem('hfModel', hfModel);
    setShowSettings(false);
  };

  // PDF 로드
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      setIsLoading(true);

      try {
        const pdfjsLib = window['pdfjs-dist/build/pdf'];
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

        setPdfDoc(pdf);
        setTotalPages(pdf.numPages);
        setCurrentPage(1);
      } catch (error) {
        console.error('PDF 로드 오류:', error);
        alert('PDF 로드 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    } else {
      alert('PDF 파일만 업로드 가능합니다.');
    }
  };

  // 페이지 렌더링
  const renderPage = useCallback(async () => {
    if (!pdfDoc || !canvasRef.current) return;

    const page = await pdfDoc.getPage(currentPage);
    const viewport = page.getViewport({ scale });

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({
      canvasContext: context,
      viewport: viewport
    }).promise;

    // 텍스트 레이어 렌더링
    if (textLayerRef.current) {
      const textContent = await page.getTextContent();
      const textLayer = textLayerRef.current;
      textLayer.innerHTML = '';
      textLayer.style.width = `${viewport.width}px`;
      textLayer.style.height = `${viewport.height}px`;

      const pdfjsLib = window['pdfjs-dist/build/pdf'];
      pdfjsLib.renderTextLayer({
        textContentSource: textContent,
        container: textLayer,
        viewport: viewport,
        textDivs: []
      });
    }
  }, [pdfDoc, currentPage, scale]);

  useEffect(() => {
    renderPage();
  }, [renderPage]);

  // 텍스트 선택 핸들러
  const handleTextSelection = () => {
    const selection = window.getSelection();
    const text = selection.toString().trim();

    if (text.length > 0) {
      setSelectedText(text);

      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      setButtonPosition({
        x: rect.left + rect.width / 2,
        y: rect.top - 10
      });
      setShowExplainButton(true);
    } else {
      setShowExplainButton(false);
    }
  };

  // Hugging Face API 호출
  const explainText = async () => {
    if (!selectedText) return;

    if (!hfToken) {
      setShowSettings(true);
      alert('Hugging Face 토큰을 설정해주세요.');
      return;
    }

    setShowExplainButton(false);
    setShowSidePanel(true);
    setIsExplaining(true);
    setExplanation('');

    try {
      const response = await fetch(`https://api-inference.huggingface.co/models/${hfModel}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${hfToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inputs: `<|begin_of_text|><|start_header_id|>system<|end_header_id|>
You are a helpful assistant that explains academic text in Korean. Explain clearly and simply.<|eot_id|><|start_header_id|>user<|end_header_id|}
다음 텍스트를 한국어로 쉽게 설명해주세요. 학술 논문의 일부일 수 있으니 전문 용어도 풀어서 설명해주세요.

"${selectedText}"<|eot_id|><|start_header_id|>assistant<|end_header_id|>`,
          parameters: {
            max_new_tokens: 1024,
            temperature: 0.7,
            return_full_text: false
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();

      if (Array.isArray(data) && data[0]?.generated_text) {
        setExplanation(data[0].generated_text);
      } else if (data.generated_text) {
        setExplanation(data.generated_text);
      } else {
        setExplanation(JSON.stringify(data, null, 2));
      }
    } catch (error) {
      console.error('Hugging Face API 오류:', error);
      setExplanation(`Hugging Face API 오류: ${error.message}\n\n해결 방법:\n1. 설정에서 HF 토큰 확인\n2. 토큰 발급: https://huggingface.co/settings/tokens\n3. 모델 접근 권한 확인 (Llama는 승인 필요)`);
    } finally {
      setIsExplaining(false);
    }
  };

  // 페이지 네비게이션
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 50%, #16213e 100%)',
      color: '#e0e0e0',
      fontFamily: "'Inter', -apple-system, sans-serif",
      display: 'flex',
      flexDirection: 'column'
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        .toolbar {
          background: rgba(26, 26, 46, 0.95);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding: 0.75rem 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .toolbar-section {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .toolbar-divider {
          width: 1px;
          height: 24px;
          background: rgba(255, 255, 255, 0.2);
          margin: 0 0.5rem;
        }

        .icon-button {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 0.5rem;
          cursor: pointer;
          color: #e0e0e0;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .icon-button:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.2);
        }

        .icon-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .theme-selector {
          display: flex;
          gap: 0.25rem;
        }

        .theme-chip {
          padding: 0.35rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          cursor: pointer;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.05);
          color: #a0a0a0;
          transition: all 0.2s;
        }

        .theme-chip:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .theme-chip.active {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border-color: transparent;
          color: white;
        }

        .viewer-container {
          flex: 1;
          display: flex;
          overflow: hidden;
        }

        .pdf-viewer {
          flex: 1;
          overflow: auto;
          display: flex;
          justify-content: center;
          padding: 2rem;
          background: #2a2a2a;
        }

        .pdf-page-container {
          position: relative;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
          background: white;
        }

        .text-layer {
          position: absolute;
          left: 0;
          top: 0;
          right: 0;
          bottom: 0;
          overflow: hidden;
          opacity: 0.2;
          line-height: 1.0;
        }

        .text-layer > span {
          color: transparent;
          position: absolute;
          white-space: pre;
          cursor: text;
        }

        .text-layer ::selection {
          background: rgba(99, 102, 241, 0.5);
        }

        .explain-button {
          position: fixed;
          transform: translateX(-50%) translateY(-100%);
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-size: 0.875rem;
          cursor: pointer;
          z-index: 1000;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
        }

        .explain-button:hover {
          transform: translateX(-50%) translateY(-100%) scale(1.05);
        }

        .side-panel {
          width: 400px;
          background: rgba(26, 26, 46, 0.98);
          border-left: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .side-panel-header {
          padding: 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .side-panel-content {
          flex: 1;
          overflow-y: auto;
          padding: 1rem;
        }

        .selected-text-box {
          background: rgba(99, 102, 241, 0.1);
          border: 1px solid rgba(99, 102, 241, 0.3);
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 1rem;
          font-size: 0.875rem;
          line-height: 1.6;
        }

        .explanation-box {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          padding: 1rem;
          font-size: 0.9rem;
          line-height: 1.8;
          white-space: pre-wrap;
        }

        .upload-screen {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        .upload-zone {
          border: 2px dashed rgba(255, 255, 255, 0.2);
          border-radius: 16px;
          padding: 4rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          background: rgba(255, 255, 255, 0.02);
          max-width: 500px;
          width: 100%;
        }

        .upload-zone:hover {
          border-color: #6366f1;
          background: rgba(99, 102, 241, 0.05);
        }

        .settings-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .settings-content {
          background: #1a1a2e;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 2rem;
          width: 400px;
        }

        .settings-input {
          width: 100%;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 0.75rem;
          color: #e0e0e0;
          font-size: 0.9rem;
          margin-top: 0.5rem;
        }

        .settings-input:focus {
          outline: none;
          border-color: #6366f1;
        }

        .settings-button {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border: none;
          border-radius: 8px;
          padding: 0.75rem 1.5rem;
          color: white;
          font-weight: 600;
          cursor: pointer;
          width: 100%;
          margin-top: 1rem;
        }

        .page-input {
          width: 50px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          padding: 0.25rem 0.5rem;
          color: #e0e0e0;
          text-align: center;
          font-size: 0.875rem;
        }

        .page-input:focus {
          outline: none;
          border-color: #6366f1;
        }
      `}</style>

      {/* 툴바 */}
      <div className="toolbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <FileText size={24} color="#6366f1" />
          <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>PDF Theme Viewer</span>
        </div>

        <div className="toolbar-divider" />

        {/* 파일 업로드 */}
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <button
          className="icon-button"
          onClick={() => fileInputRef.current?.click()}
          title="PDF 열기"
        >
          <Upload size={18} />
        </button>

        {pdfDoc && (
          <>
            <div className="toolbar-divider" />

            {/* 페이지 네비게이션 */}
            <div className="toolbar-section">
              <button
                className="icon-button"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage <= 1}
              >
                <ChevronLeft size={18} />
              </button>
              <input
                type="number"
                className="page-input"
                value={currentPage}
                onChange={(e) => goToPage(parseInt(e.target.value) || 1)}
                min={1}
                max={totalPages}
              />
              <span style={{ fontSize: '0.875rem', color: '#808080' }}>/ {totalPages}</span>
              <button
                className="icon-button"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage >= totalPages}
              >
                <ChevronRight size={18} />
              </button>
            </div>

            <div className="toolbar-divider" />

            {/* 줌 */}
            <div className="toolbar-section">
              <button
                className="icon-button"
                onClick={() => setScale(s => Math.max(0.5, s - 0.25))}
              >
                <ZoomOut size={18} />
              </button>
              <span style={{ fontSize: '0.875rem', minWidth: '50px', textAlign: 'center' }}>
                {Math.round(scale * 100)}%
              </span>
              <button
                className="icon-button"
                onClick={() => setScale(s => Math.min(3, s + 0.25))}
              >
                <ZoomIn size={18} />
              </button>
            </div>

            <div className="toolbar-divider" />

            {/* 테마 선택 */}
            <div className="theme-selector">
              {Object.entries(themes).map(([key, theme]) => (
                <button
                  key={key}
                  className={`theme-chip ${selectedTheme === key ? 'active' : ''}`}
                  onClick={() => setSelectedTheme(key)}
                >
                  {theme.name}
                </button>
              ))}
            </div>
          </>
        )}

        <div style={{ flex: 1 }} />

        {/* 설정 */}
        <button
          className="icon-button"
          onClick={() => setShowSettings(true)}
          title="설정"
        >
          <Settings size={18} />
        </button>
      </div>

      {/* 메인 영역 */}
      <div className="viewer-container">
        {!pdfDoc ? (
          // 업로드 화면
          <div className="upload-screen">
            <div
              className="upload-zone"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={64} style={{ margin: '0 auto 1.5rem', opacity: 0.5 }} />
              <h2 style={{ marginBottom: '0.5rem', fontWeight: 500 }}>
                {pdfFile ? pdfFile.name : 'PDF 파일을 업로드하세요'}
              </h2>
              <p style={{ color: '#808080', fontSize: '0.9rem' }}>
                클릭하거나 파일을 드래그하세요
              </p>
              {isLoading && (
                <div style={{ marginTop: '1rem', color: '#6366f1' }}>
                  <Loader size={24} style={{ animation: 'spin 1s linear infinite' }} />
                </div>
              )}
            </div>

            <div style={{ marginTop: '3rem', textAlign: 'center', maxWidth: '600px' }}>
              <h3 style={{ marginBottom: '1rem', color: '#a0a0a0' }}>주요 기능</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                  <Moon size={24} style={{ marginBottom: '0.5rem', color: '#6366f1' }} />
                  <p style={{ fontSize: '0.875rem' }}>다크 모드</p>
                </div>
                <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                  <Eye size={24} style={{ marginBottom: '0.5rem', color: '#10b981' }} />
                  <p style={{ fontSize: '0.875rem' }}>눈 보호</p>
                </div>
                <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                  <MessageSquare size={24} style={{ marginBottom: '0.5rem', color: '#f59e0b' }} />
                  <p style={{ fontSize: '0.875rem' }}>AI 해설</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // PDF 뷰어
          <>
            <div
              ref={viewerRef}
              className="pdf-viewer"
              onMouseUp={handleTextSelection}
            >
              <div
                className="pdf-page-container"
                style={{ filter: themes[selectedTheme].filter }}
              >
                <canvas ref={canvasRef} />
                <div ref={textLayerRef} className="text-layer" />
              </div>
            </div>

            {/* 해설 사이드 패널 */}
            {showSidePanel && (
              <div className="side-panel">
                <div className="side-panel-header">
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MessageSquare size={20} />
                    AI 해설
                  </h3>
                  <button
                    className="icon-button"
                    onClick={() => setShowSidePanel(false)}
                  >
                    <X size={18} />
                  </button>
                </div>
                <div className="side-panel-content">
                  <div className="selected-text-box">
                    <strong style={{ display: 'block', marginBottom: '0.5rem', color: '#6366f1' }}>
                      선택한 텍스트
                    </strong>
                    {selectedText}
                  </div>
                  <div className="explanation-box">
                    {isExplaining && !explanation && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#808080' }}>
                        <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} />
                        해설 생성 중...
                      </div>
                    )}
                    {explanation || (!isExplaining && '해설이 여기에 표시됩니다.')}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* 해설 버튼 (텍스트 선택 시) */}
      {showExplainButton && (
        <button
          className="explain-button"
          style={{ left: buttonPosition.x, top: buttonPosition.y }}
          onClick={explainText}
        >
          <MessageSquare size={16} />
          해설하기
        </button>
      )}

      {/* 설정 모달 */}
      {showSettings && (
        <div className="settings-modal" onClick={() => setShowSettings(false)}>
          <div className="settings-content" onClick={e => e.stopPropagation()}>
            <h2 style={{ marginBottom: '1.5rem' }}>Hugging Face 설정</h2>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.875rem', color: '#a0a0a0' }}>
                HF Token
              </label>
              <input
                type="password"
                className="settings-input"
                value={hfToken}
                onChange={e => setHfToken(e.target.value)}
                placeholder="hf_xxxxxxxxxx..."
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.875rem', color: '#a0a0a0' }}>
                모델
              </label>
              <input
                type="text"
                className="settings-input"
                value={hfModel}
                onChange={e => setHfModel(e.target.value)}
                placeholder="meta-llama/Llama-3.2-3B-Instruct"
              />
            </div>

            <p style={{ fontSize: '0.75rem', color: '#808080', marginBottom: '1rem' }}>
              토큰 발급: https://huggingface.co/settings/tokens<br />
              Llama 모델은 Meta 승인 필요: https://huggingface.co/meta-llama
            </p>

            <button className="settings-button" onClick={saveSettings}>
              저장
            </button>
          </div>
        </div>
      )}

      {/* 외부 라이브러리 로드 */}
      <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
    </div>
  );
};

export default PDFThemeViewer;
