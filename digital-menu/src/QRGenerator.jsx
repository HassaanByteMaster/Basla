import React, { useState, useEffect } from 'react';
import { BRAND_CONFIG } from './config';
import { ArrowRight, Layers, Lock, Printer, Loader2, Download } from 'lucide-react';
import './QRGenerator.css';

// Dynamic script loader for html2pdf.js (CDN-based to prevent bundler size bloat)
const loadHtml2Pdf = () => {
  return new Promise((resolve, reject) => {
    if (window.html2pdf) {
      resolve(window.html2pdf);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
    script.onload = () => resolve(window.html2pdf);
    script.onerror = reject;
    document.body.appendChild(script);
  });
};

export default function QRGenerator() {
  const [tableCount, setTableCount] = useState(12);
  const [baseUrl, setBaseUrl] = useState('');
  
  // PDF download loading state
  const [isDownloading, setIsDownloading] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);
  
  // Password lock state
  const [password, setPassword] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(() => {
    return sessionStorage.getItem('qr_unlocked') === 'true';
  });
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    // Automatically detect the base url on page load
    const currentUrl = window.location.origin + window.location.pathname;
    setBaseUrl(currentUrl);
  }, []);

  const handleUnlock = (e) => {
    e.preventDefault();
    const correctPassword = BRAND_CONFIG.adminPassword || 'basla123';
    if (password === correctPassword) {
      setIsUnlocked(true);
      sessionStorage.setItem('qr_unlocked', 'true');
      setErrorMsg('');
    } else {
      setErrorMsg('⚠️ كلمة المرور غير صحيحة، حاول مجدداً.');
      setPassword('');
    }
  };

  const handleDownloadPDF = async () => {
    try {
      setIsDownloading(true);
      const html2pdf = await loadHtml2Pdf();
      
      const gridElement = document.querySelector('.qr-grid');
      if (!gridElement) return;

      // Temporarily transform to vertical PDF layout
      gridElement.classList.add('qr-grid--pdf');

      const fileName = `qr-codes-${(BRAND_CONFIG.nameEn || 'basla').toLowerCase().replace(/\s+/g, '-')}.pdf`;
      const opt = {
        margin:       10,
        filename:     fileName,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2.5, useCORS: true, logging: false },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak:    { mode: ['css', 'legacy'] }
      };

      await html2pdf().set(opt).from(gridElement).save();

      // Restore screen grid layout
      gridElement.classList.remove('qr-grid--pdf');
      setIsDownloading(false);
    } catch (err) {
      console.error('PDF Generation Error:', err);
      const gridElement = document.querySelector('.qr-grid');
      if (gridElement) gridElement.classList.remove('qr-grid--pdf');
      setIsDownloading(false);
      alert('حدث خطأ أثناء تحميل ملف الـ PDF. يرجى المحاولة لاحقاً.');
    }
  };

  const handleGoBack = () => {
    window.location.href = '/';
  };

  const getQRUrl = (tableNum) => {
    const url = `${baseUrl}?table=${tableNum}`;
    const qrColor = (BRAND_CONFIG.primaryColor || '#F5890A').replace('#', '');
    return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(url)}&color=${qrColor}&bgcolor=ffffff&qzone=1`;
  };

  // 🔒 Lock screen rendering
  if (!isUnlocked) {
    return (
      <div className="qr-lock-screen">
        <div className="wavy-bg" aria-hidden="true" />
        
        <form onSubmit={handleUnlock} className="qr-lock-card animate-scale">
          <div className="qr-lock-card__header">
            <div className="lock-icon-wrap">
              <Lock size={26} />
            </div>
            <h2>منطقة الإدارة والتحكم</h2>
            <p>برجاء إدخال كلمة مرور النظام لتوليد الباركود الخاص بالطاولات لـ <strong>{BRAND_CONFIG.name}</strong></p>
          </div>

          <div className="qr-lock-card__body">
            <div className="lock-field">
              <label htmlFor="pass-input">كلمة المرور:</label>
              <input
                id="pass-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoFocus
              />
            </div>

            {errorMsg && <p className="lock-error-msg">{errorMsg}</p>}

            <button type="submit" className="unlock-btn">
              <span>دخول النظام</span>
            </button>
          </div>

          <div className="qr-lock-card__foot">
            <button type="button" className="lock-back-btn" onClick={handleGoBack}>
              <span>العودة للموقع</span>
            </button>
          </div>
        </form>
      </div>
    );
  }

  // 🖨️ Main Generator rendering (unlocked)
  return (
    <div className="qr-gen-page">
      <div className="wavy-bg" aria-hidden="true" />
      
      {/* Control Panel (Hidden during printing) */}
      <header className="qr-header no-print">
        <div className="qr-header__inner">
          <button className="back-btn" onClick={handleGoBack}>
            <ArrowRight size={18} />
            <span>العودة للمنيو</span>
          </button>
          
          <div className="qr-header__brand">
            <span className="logo-emoji">🧅</span>
            <h1>مُنظّم وجداول QR Codes</h1>
          </div>
        </div>
      </header>

      <main className="qr-container">
        {/* Controls Card */}
        <section className="qr-controls no-print animate-scale">
          <div className="qr-controls__title">
            <Layers className="icon-orange" size={22} />
            <h2>توليد أكواد الطاولات لـ {BRAND_CONFIG.name}</h2>
          </div>
          <p className="qr-controls__desc">
            أدخل عدد الطاولات في مطعمك لتوليد بطاقات الرمز السريع (QR Codes) المخصصة لكل طاولة. يمكنك تحميل البطاقات كملف PDF ملون عالي الجودة للطباعة فوراً.
          </p>
          
          <div className="qr-form">
            <div className="qr-field">
              <label htmlFor="table-input">عدد الطاولات:</label>
              <input 
                id="table-input"
                type="number" 
                min="1" 
                max="100" 
                value={tableCount} 
                onChange={(e) => setTableCount(Math.max(1, parseInt(e.target.value) || 1))}
              />
            </div>
            
            <div className="qr-field">
              <label htmlFor="url-input">رابط المنيو الأساسي:</label>
              <input 
                id="url-input"
                type="text" 
                value={baseUrl} 
                onChange={(e) => setBaseUrl(e.target.value)}
                placeholder="https://basla.egypt/"
              />
            </div>

            <button 
              className="print-all-btn" 
              onClick={handleDownloadPDF}
              disabled={isDownloading}
            >
              {isDownloading ? (
                <>
                  <Loader2 size={18} className="spin" />
                  <span>جاري تصدير الـ PDF...</span>
                </>
              ) : (
                <>
                  <Download size={18} />
                  <span>تحميل كروت الـ PDF</span>
                </>
              )}
            </button>
          </div>
        </section>

        {/* Printable Grid */}
        <section className="qr-grid">
          {Array.from({ length: isNaN(tableCount) ? 12 : Math.max(1, tableCount) }, (_, idx) => {
            const tableNum = idx + 1;
            
            return (
              <div key={tableNum} className="qr-card">
                <div className="qr-card__inner">
                  {/* Brand Header */}
                  <div className="qr-card__brand">
                    {!logoFailed ? (
                      <img 
                        src={BRAND_CONFIG.logo} 
                        alt={BRAND_CONFIG.nameEn} 
                        className="qr-card__logo"
                        onError={() => setLogoFailed(true)}
                      />
                    ) : (
                      <span className="qr-card__emoji-logo">🧅</span>
                    )}
                    <h3>{BRAND_CONFIG.name}</h3>
                    <p className="qr-card__tagline">{BRAND_CONFIG.tagline}</p>
                  </div>
                  
                  {/* QR Frame */}
                  <div className="qr-card__code-wrap">
                    <img 
                      src={getQRUrl(tableNum)} 
                      alt={`Table ${tableNum} QR Code`} 
                      className="qr-card__code-img"
                      loading="lazy"
                    />
                  </div>

                  {/* Table Label */}
                  <div className="qr-card__table-num">
                    <span>طاولة رقم</span>
                    <strong>{tableNum}</strong>
                  </div>

                  {/* Call to Action */}
                  <div className="qr-card__footer">
                    <h4 className="qr-card__welcome">أهلاً بك في {BRAND_CONFIG.name}</h4>
                    <p className="qr-card__instruction">تفضّل بمسح الرمز السريع لتصفح قائمة المأكولات وطلب وجبتك المفضلة مباشرة من طاولتك</p>
                    <div className="qr-card__deco-line">✦ ✦ ✦</div>
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      </main>
    </div>
  );
}
