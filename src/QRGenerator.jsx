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
  const [genMode, setGenMode] = useState('tables'); // 'tables' or 'general'
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

      const prefix = genMode === 'general' ? 'general-menu' : 'table-qrs';
      const fileName = `${prefix}-${(BRAND_CONFIG.nameEn || 'basla').toLowerCase().replace(/\s+/g, '-')}.pdf`;
      const opt = {
        margin: 10,
        filename: fileName,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2.5, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['css', 'legacy'] }
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
    const url = tableNum ? `${baseUrl}?table=${tableNum}` : baseUrl;
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
            <h2>توليد أكواد QR لـ {BRAND_CONFIG.name}</h2>
          </div>
          <p className="qr-controls__desc">
            اختر نوع الباركود الذي ترغب في توليده. يمكنك توليد أكواد مخصصة لكل طاولة تتيح للعملاء الطلب مباشرة، أو كود عام للمنيو يعرض الوجبات فقط للقراءة.
          </p>

          <div className="qr-form" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
            {/* Row 1: Mode Select */}
            <div className="qr-field">
              <label style={{ marginBottom: '6px', fontWeight: '800' }}>نوع الباركود:</label>
              <div style={{
                display: 'inline-flex',
                background: 'rgba(0, 0, 0, 0.35)',
                padding: '4px',
                borderRadius: '14px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                width: '100%',
                maxWidth: '480px'
              }}>
                <button
                  type="button"
                  style={{
                    flex: 1,
                    padding: '10px 16px',
                    borderRadius: '10px',
                    border: 'none',
                    background: genMode === 'tables' ? 'var(--primary, #F5890A)' : 'transparent',
                    color: genMode === 'tables' ? '#fff' : 'var(--text-muted, #9ca3af)',
                    fontFamily: 'inherit',
                    fontSize: '0.88rem',
                    fontWeight: '800',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    boxShadow: genMode === 'tables' ? '0 4px 12px rgba(245, 137, 10, 0.25)' : 'none'
                  }}
                  onClick={() => setGenMode('tables')}
                >
                  أكواد الطاولات (طلب مباشر)
                </button>
                <button
                  type="button"
                  style={{
                    flex: 1,
                    padding: '10px 16px',
                    borderRadius: '10px',
                    border: 'none',
                    background: genMode === 'general' ? 'var(--primary, #F5890A)' : 'transparent',
                    color: genMode === 'general' ? '#fff' : 'var(--text-muted, #9ca3af)',
                    fontFamily: 'inherit',
                    fontSize: '0.88rem',
                    fontWeight: '800',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    boxShadow: genMode === 'general' ? '0 4px 12px rgba(245, 137, 10, 0.25)' : 'none'
                  }}
                  onClick={() => setGenMode('general')}
                >
                  منيو عام (عرض فقط)
                </button>
              </div>
            </div>

            {/* Row 2: Inputs Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: genMode === 'tables' ? 'repeat(auto-fit, minmax(200px, 1fr))' : '1fr',
              gap: '20px',
              width: '100%'
            }}>
              {genMode === 'tables' && (
                <div className="qr-field">
                  <label htmlFor="table-input">عدد الطاولات:</label>
                  <input
                    id="table-input"
                    type="number"
                    min="1"
                    max="100"
                    value={tableCount}
                    onChange={(e) => setTableCount(Math.max(1, parseInt(e.target.value) || 1))}
                    style={{ textAlign: 'center' }}
                  />
                </div>
              )}

              <div className="qr-field">
                <label htmlFor="url-input">رابط المنيو الأساسي:</label>
                <input
                  id="url-input"
                  type="text"
                  value={baseUrl}
                  onChange={(e) => setBaseUrl(e.target.value)}
                  placeholder="https://basla.egypt/"
                  style={{ direction: 'ltr', textAlign: 'left' }}
                />
              </div>
            </div>

            {/* Row 3: Action Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '5px' }}>
              <button
                className="print-all-btn"
                onClick={handleDownloadPDF}
                disabled={isDownloading}
                style={{ width: '100%', maxWidth: '320px' }}
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
          </div>
        </section>

        {/* Printable Grid */}
        <section className="qr-grid">
          {genMode === 'general' ? (
            <div className="qr-card">
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
                    src={getQRUrl(null)}
                    alt="General Menu QR Code"
                    className="qr-card__code-img"
                    loading="lazy"
                  />
                </div>

                {/* Table Label */}
                <div className="qr-card__table-num">
                  <strong style={{ fontSize: '1.25rem' }}>Scan Now</strong>
                </div>

                {/* Call to Action */}
                <div className="qr-card__footer">
                  <h4 className="qr-card__welcome">أهلاً بك في {BRAND_CONFIG.name}</h4>
                  <p className="qr-card__instruction">تفضّل بمسح الرمز السريع لتصفح قائمة المأكولات مباشرة من هاتفك</p>
                  <div className="qr-card__deco-line">✦ ✦ ✦</div>
                </div>
              </div>
            </div>
          ) : (
            Array.from({ length: isNaN(tableCount) ? 12 : Math.max(1, tableCount) }, (_, idx) => {
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
            })
          )}
        </section>
      </main>
    </div>
  );
}
