import React, { useState, useRef } from 'react';
import { FileText, Moon, Sun, Droplet, Coffee, Eye, Download, Upload } from 'lucide-react';

const PDFThemeConverter = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [selectedTheme, setSelectedTheme] = useState('dark');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [originalPages, setOriginalPages] = useState([]);
  const [processedPages, setProcessedPages] = useState([]);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);

  const themes = {
    dark: {
      name: 'Dark Mode',
      icon: Moon,
      bg: '#1a1a1a',
      text: '#ffffff',
      description: '눈에 편안한 다크 모드',
      filter: (imageData) => invertColors(imageData)
    },
    sepia: {
      name: 'Sepia',
      icon: Coffee,
      bg: '#f4ecd8',
      text: '#5b4636',
      description: '따뜻한 세피아 톤',
      filter: (imageData) => applySepiaFilter(imageData)
    },
    night: {
      name: 'Night Blue',
      icon: Moon,
      bg: '#0a1929',
      text: '#90caf9',
      description: '블루라이트 감소',
      filter: (imageData) => applyNightFilter(imageData)
    },
    green: {
      name: 'Eye Care',
      icon: Eye,
      bg: '#1a2f1a',
      text: '#c5e1a5',
      description: '눈 건강 그린 모드',
      filter: (imageData) => applyGreenFilter(imageData)
    },
    contrast: {
      name: 'High Contrast',
      icon: Sun,
      bg: '#000000',
      text: '#ffff00',
      description: '고대비 모드',
      filter: (imageData) => applyHighContrastFilter(imageData)
    }
  };

  const invertColors = (imageData) => {
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      data[i] = 255 - data[i];       // R
      data[i + 1] = 255 - data[i + 1]; // G
      data[i + 2] = 255 - data[i + 2]; // B
    }
    return imageData;
  };

  const applySepiaFilter = (imageData) => {
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      data[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189));
      data[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168));
      data[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131));
    }
    return imageData;
  };

  const applyNightFilter = (imageData) => {
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      // Invert and reduce blue light
      data[i] = 255 - data[i];
      data[i + 1] = 255 - data[i + 1];
      data[i + 2] = Math.max(0, (255 - data[i + 2]) * 0.6);
    }
    return imageData;
  };

  const applyGreenFilter = (imageData) => {
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      const inverted = 255 - avg;
      
      data[i] = inverted * 0.3;
      data[i + 1] = inverted * 1.2;
      data[i + 2] = inverted * 0.3;
    }
    return imageData;
  };

  const applyHighContrastFilter = (imageData) => {
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      const color = avg > 128 ? 0 : 255;
      
      data[i] = color;
      data[i + 1] = color;
      data[i + 2] = color;
    }
    return imageData;
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      setProcessedPages([]);
      setOriginalPages([]);
      setProgress(0);

      // 원본 미리보기 로드
      setIsLoadingPreview(true);
      try {
        const pdfjsLib = window['pdfjs-dist/build/pdf'];
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

        // 첫 페이지만 미리보기
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 1.5 });

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({
          canvasContext: context,
          viewport: viewport
        }).promise;

        setOriginalPages([canvas.toDataURL('image/jpeg', 0.85)]);
      } catch (error) {
        console.error('미리보기 로드 중 오류:', error);
      } finally {
        setIsLoadingPreview(false);
      }
    } else {
      alert('PDF 파일만 업로드 가능합니다.');
    }
  };

  const processPDF = async () => {
    if (!pdfFile) return;

    setIsProcessing(true);
    setProgress(0);
    setProcessedPages([]);

    try {
      // Load PDF.js
      const pdfjsLib = window['pdfjs-dist/build/pdf'];
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdf.numPages;
      const pages = [];

      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 2 });
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({
          canvasContext: context,
          viewport: viewport
        }).promise;

        // Apply theme filter
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const filteredData = themes[selectedTheme].filter(imageData);
        context.putImageData(filteredData, 0, 0);

        // JPEG 사용으로 용량 감소, 품질 0.92로 화질 유지
        pages.push(canvas.toDataURL('image/jpeg', 0.92));
        setProgress(Math.round((pageNum / numPages) * 100));
      }

      setProcessedPages(pages);
    } catch (error) {
      console.error('PDF 처리 중 오류:', error);
      alert('PDF 처리 중 오류가 발생했습니다.');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadPDF = async () => {
    if (processedPages.length === 0) return;

    try {
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: 'a4'
      });

      for (let i = 0; i < processedPages.length; i++) {
        if (i > 0) pdf.addPage();
        
        const img = new Image();
        img.src = processedPages[i];
        await new Promise((resolve) => {
          img.onload = resolve;
        });

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const imgRatio = img.width / img.height;
        const pageRatio = pageWidth / pageHeight;

        let width, height;
        if (imgRatio > pageRatio) {
          width = pageWidth;
          height = pageWidth / imgRatio;
        } else {
          height = pageHeight;
          width = pageHeight * imgRatio;
        }

        pdf.addImage(processedPages[i], 'JPEG', 0, 0, width, height, undefined, 'FAST');
      }

      pdf.save(`${pdfFile.name.replace('.pdf', '')}_${selectedTheme}.pdf`);
    } catch (error) {
      console.error('PDF 다운로드 중 오류:', error);
      alert('PDF 다운로드 중 오류가 발생했습니다.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 50%, #16213e 100%)',
      color: '#e0e0e0',
      fontFamily: "'Inter', -apple-system, sans-serif",
      padding: '2rem'
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .card {
          background: rgba(26, 26, 46, 0.6);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 2rem;
          transition: all 0.3s ease;
        }

        .card:hover {
          border-color: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }

        .theme-button {
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 1.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          text-align: center;
        }

        .theme-button:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.3);
          transform: scale(1.05);
        }

        .theme-button.selected {
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.2));
          border-color: #6366f1;
          box-shadow: 0 0 20px rgba(99, 102, 241, 0.3);
        }

        .upload-zone {
          border: 2px dashed rgba(255, 255, 255, 0.2);
          border-radius: 16px;
          padding: 3rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          background: rgba(255, 255, 255, 0.02);
        }

        .upload-zone:hover {
          border-color: #6366f1;
          background: rgba(99, 102, 241, 0.05);
        }

        .button {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border: none;
          border-radius: 12px;
          padding: 1rem 2rem;
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1rem;
        }

        .button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(99, 102, 241, 0.4);
        }

        .button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .preview-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-top: 2rem;
        }

        .page-preview {
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          transition: transform 0.3s ease;
        }

        .page-preview:hover {
          transform: scale(1.05);
        }

        .progress-bar {
          width: 100%;
          height: 8px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          overflow: hidden;
          margin-top: 1rem;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #6366f1, #8b5cf6);
          transition: width 0.3s ease;
          border-radius: 4px;
        }
      `}</style>

      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '1rem',
            marginBottom: '1rem'
          }}>
            <FileText size={48} color="#6366f1" />
            <h1 style={{ 
              fontSize: '3rem', 
              fontWeight: '700',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: 0
            }}>
              PDF Theme Converter
            </h1>
          </div>
          <p style={{ 
            fontSize: '1.1rem', 
            color: '#a0a0a0',
            fontFamily: "'JetBrains Mono', monospace"
          }}>
            논문을 눈에 편안한 테마로 변환하세요
          </p>
        </div>

        {/* Upload Section */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
            <div
              className="upload-zone"
              onClick={() => fileInputRef.current?.click()}
              style={{ flex: originalPages.length > 0 ? '0 0 300px' : '1' }}
            >
              <Upload size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
              <h3 style={{ marginBottom: '0.5rem' }}>
                {pdfFile ? pdfFile.name : 'PDF 파일을 업로드하세요'}
              </h3>
              <p style={{ color: '#808080', fontSize: '0.9rem' }}>
                클릭하거나 파일을 드래그하세요
              </p>
            </div>

            {/* 원본 첫 페이지 미리보기 */}
            {isLoadingPreview && (
              <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#808080'
              }}>
                미리보기 로딩 중...
              </div>
            )}
            {originalPages.length > 0 && !isLoadingPreview && (
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#a0a0a0',
                  marginBottom: '0.5rem'
                }}>
                  원본 미리보기 (첫 페이지)
                </div>
                <img
                  src={originalPages[0]}
                  alt="PDF Preview"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '300px',
                    borderRadius: '8px',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Theme Selection */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>테마 선택</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '1rem'
          }}>
            {Object.entries(themes).map(([key, theme]) => (
                <div
                  key={key}
                  className={`theme-button ${selectedTheme === key ? 'selected' : ''}`}
                  onClick={() => setSelectedTheme(key)}
                >
                  {/* 미니 프리뷰 */}
                  <div style={{
                    width: '100%',
                    height: '60px',
                    background: theme.bg,
                    borderRadius: '6px',
                    padding: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}>
                    <div style={{
                      width: '70%',
                      height: '6px',
                      background: theme.text,
                      borderRadius: '2px',
                      opacity: 0.9
                    }} />
                    <div style={{
                      width: '100%',
                      height: '4px',
                      background: theme.text,
                      borderRadius: '2px',
                      opacity: 0.6
                    }} />
                    <div style={{
                      width: '85%',
                      height: '4px',
                      background: theme.text,
                      borderRadius: '2px',
                      opacity: 0.6
                    }} />
                    <div style={{
                      width: '60%',
                      height: '4px',
                      background: theme.text,
                      borderRadius: '2px',
                      opacity: 0.6
                    }} />
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                      {theme.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#808080' }}>
                      {theme.description}
                    </div>
                  </div>
                </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          justifyContent: 'center',
          marginBottom: '2rem'
        }}>
          <button
            className="button"
            onClick={processPDF}
            disabled={!pdfFile || isProcessing}
          >
            {isProcessing ? '처리 중...' : '변환 시작'}
          </button>
          
          {processedPages.length > 0 && (
            <button
              className="button"
              onClick={downloadPDF}
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)'
              }}
            >
              <Download size={20} />
              다운로드
            </button>
          )}
        </div>

        {/* Progress Bar */}
        {isProcessing && (
          <div className="card" style={{ marginBottom: '2rem' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              marginBottom: '0.5rem'
            }}>
              <span>처리 중...</span>
              <span>{progress}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {/* Preview */}
        {processedPages.length > 0 && (
          <div className="card">
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>
              미리보기 ({processedPages.length} 페이지)
            </h2>
            <div className="preview-grid">
              {processedPages.map((page, index) => (
                <div key={index} className="page-preview">
                  <img 
                    src={page} 
                    alt={`Page ${index + 1}`}
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                  />
                  <div style={{ 
                    padding: '0.5rem',
                    background: 'rgba(0, 0, 0, 0.5)',
                    textAlign: 'center',
                    fontSize: '0.875rem'
                  }}>
                    Page {index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Load external libraries */}
      <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    </div>
  );
};

export default PDFThemeConverter;
