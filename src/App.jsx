import React, {
  useState, useEffect, useRef,
  createContext, useContext, useCallback,
} from 'react';
import {
  ShoppingCart, X, Plus, Minus,
  Phone, MessageCircle, Star, Clock,
  Check, Loader2, Send, Trash2,
  Sun, Moon, Hash,
  Search, UtensilsCrossed, CakeSlice,
  Flame, Sandwich, Beef, Candy, Pizza,
  Package, PlusCircle, ChefHat, Drumstick,
  ChevronDown, ChevronLeft, ChevronRight,
  Tag, Zap, Users,
} from 'lucide-react';
import { BRAND_CONFIG, MENU_DATA, SLIDER_IMAGES, OFFERS_DATA } from './config';
import QRGenerator from './QRGenerator';
import './App.css';

// ──── Custom brand icons ────
function FacebookIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}
function InstagramIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function parseSizes(priceRange) {
  if (!priceRange) return null;
  const prices = priceRange.split('-').map(Number).filter(n => !isNaN(n) && n > 0);
  if (prices.length < 2) return null;
  const labels = prices.length >= 3 ? ['صغير', 'وسط', 'كبير'] : ['صغير', 'كبير'];
  return prices.slice(0, labels.length).map((price, i) => ({ label: labels[i], price }));
}

// ──────────────────────────────────────────────────────
// Cart Context
// ──────────────────────────────────────────────────────
const CartContext = createContext(null);

function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [tableNumber] = useState(() => {
    const p = new URLSearchParams(window.location.search);
    return p.get('table') || null;
  });
  const isReadOnly = !tableNumber;

  const add = useCallback((cartItem) => {
    setItems(prev => {
      const ex = prev.find(i => i.cartId === cartItem.cartId);
      const addedQty = cartItem.qty || 1;
      if (ex) return prev.map(i => i.cartId === cartItem.cartId ? { ...i, qty: i.qty + addedQty } : i);
      return [...prev, { ...cartItem, qty: addedQty }];
    });
  }, []);

  const remove = useCallback((cartId) => setItems(prev => prev.filter(i => i.cartId !== cartId)), []);

  const updateQty = useCallback((cartId, qty) => {
    if (qty < 1) { remove(cartId); return; }
    setItems(prev => prev.map(i => i.cartId === cartId ? { ...i, qty } : i));
  }, [remove]);

  const clear = useCallback(() => setItems([]), []);
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  const count = items.reduce((s, i) => s + i.qty, 0);

  return (
    <CartContext.Provider value={{ items, add, remove, updateQty, clear, total, count, tableNumber, isReadOnly }}>
      {children}
    </CartContext.Provider>
  );
}
const useCart = () => useContext(CartContext);

// ──── Category Icon Map ────
const ICON_MAP = {
  'bowl-food': UtensilsCrossed, 'cake': CakeSlice,
  'plus-circle': PlusCircle, 'flame': Flame, 'utensils': ChefHat,
  'beef': Beef, 'candy': Candy, 'sandwich': Sandwich,
  'drumstick': Drumstick, 'pizza': Pizza, 'package': Package,
};
function CatIcon({ name, size = 17 }) {
  const Icon = ICON_MAP[name] || UtensilsCrossed;
  return <Icon size={size} strokeWidth={2} aria-hidden="true" />;
}

// ──────────────────────────────────────────────────────
// 🎠 Clean Crossfade Slider — بدون blur — object-fit:cover
// ──────────────────────────────────────────────────────
function ImageSlider() {
  const [cur, setCur] = useState(0);
  const [prev, setPrev] = useState(null);
  const thumbsRef = useRef(null);
  const pauseRef = useRef(false);
  const total = SLIDER_IMAGES.length;

  const goTo = useCallback((n) => {
    const next = ((n % total) + total) % total;
    setPrev(cur);
    setCur(next);
    // Scroll thumbs without scrollIntoView (no page scroll!)
    const strip = thumbsRef.current;
    if (strip && strip.children[next]) {
      const th = strip.children[next];
      strip.scrollTo({ left: th.offsetLeft - strip.offsetWidth / 2 + th.offsetWidth / 2, behavior: 'smooth' });
    }
  }, [cur, total]);

  // Auto-advance
  useEffect(() => {
    const t = setInterval(() => { if (!pauseRef.current) goTo(cur + 1); }, 5000);
    return () => clearInterval(t);
  }, [cur, goTo]);

  // Touch swipe
  const touchX = useRef(null);
  const onTS = (e) => { touchX.current = e.touches[0].clientX; pauseRef.current = true; };
  const onTE = (e) => {
    if (touchX.current === null) return;
    const dx = touchX.current - e.changedTouches[0].clientX;
    if (Math.abs(dx) > 44) goTo(cur + (dx > 0 ? 1 : -1));
    touchX.current = null;
    setTimeout(() => { pauseRef.current = false; }, 2500);
  };

  return (
    <div
      className="cslider"
      onMouseEnter={() => { pauseRef.current = true; }}
      onMouseLeave={() => { pauseRef.current = false; }}
      onTouchStart={onTS}
      onTouchEnd={onTE}
      aria-roledescription="carousel"
      aria-label="معرض صور بصلة مصر"
    >
      {/* Ambient background glow */}
      <div className="cslider__aura" />

      {/* Stage — 3D Perspective Stage */}
      <div className="cslider__stage">
        {SLIDER_IMAGES.map((img, i) => {
          let diff = i - cur;
          if (diff < -total / 2) diff += total;
          if (diff > total / 2) diff -= total;

          const stateClass = diff === 0 ? 'active' : diff === -1 ? 'prev' : diff === 1 ? 'next' : 'hidden';

          return (
            <div
              key={i}
              className={`cslider__slide cslider__slide--${stateClass}`}
              aria-hidden={diff !== 0}
              onClick={() => { if (diff !== 0) goTo(i); }}
            >
              <img src={img.src} alt={img.alt} className="cslider__img" loading={i < 3 ? 'eager' : 'lazy'} />
              {diff === 0 && (
                <div className="cslider__caption" key={i}>
                  <div className="cslider__caption-inner">
                    <span className="cslider__badge">مميّز 🔥</span>
                    <h2 className="cslider__title">{img.caption}</h2>
                    <p className="cslider__sub">{img.sub}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Arrows */}
      <button className="cslider__arrow cslider__arrow--r" onClick={() => goTo(cur - 1)} aria-label="السابق">
        <ChevronRight size={20} strokeWidth={2.5} />
      </button>
      <button className="cslider__arrow cslider__arrow--l" onClick={() => goTo(cur + 1)} aria-label="التالي">
        <ChevronLeft size={20} strokeWidth={2.5} />
      </button>

      {/* Progress track & dots pagination */}
      <div className="cslider__controls-wrap">
        <div className="cslider__progress-track">
          <div className="cslider__progress-bar" style={{ width: `${((cur + 1) / total) * 100}%` }} />
        </div>
        <div className="cslider__dots">
          {SLIDER_IMAGES.map((_, idx) => (
            <button
              key={idx}
              className={`cslider__dot ${idx === cur ? 'cslider__dot--active' : ''}`}
              onClick={() => goTo(idx)}
              aria-label={`الذهاب للصورة رقم ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Counter */}
      <div className="cslider__counter">{cur + 1} / {total}</div>

      {/* Thumbnail strip */}
      <div className="cslider__thumbs" ref={thumbsRef}>
        {SLIDER_IMAGES.map((img, i) => (
          <button
            key={i}
            className={`cslider__thumb ${i === cur ? 'on' : ''}`}
            onClick={() => goTo(i)}
            aria-label={img.alt}
          >
            <img src={img.src} alt={img.alt} loading="lazy" />
            {i === cur && <span className="cslider__thumb-bar" />}
          </button>
        ))}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────
// 🌟 Hero Section
// ──────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="hero" aria-label="معلومات المطعم">
      <div className="hero__glow" aria-hidden="true" />
      <div className="hero__body">
        <h1 className="hero__title">{BRAND_CONFIG.name}</h1>
        <p className="hero__tagline">{BRAND_CONFIG.tagline}</p>
        <div className="hero__chips">
          <span className="hero__chip"><Clock size={13} strokeWidth={2} /> خدمة 24 ساعة</span>
          <span className="hero__chip"><Star size={13} strokeWidth={2} fill="currentColor" /> جودة مضمونة</span>
          <a href={`tel:${BRAND_CONFIG.phone}`} className="hero__chip hero__chip--link">
            <Phone size={13} strokeWidth={2} /> {BRAND_CONFIG.phone}
          </a>
        </div>
        <div className="hero__socials">
          {BRAND_CONFIG.socialLinks.facebook && (
            <a href={BRAND_CONFIG.socialLinks.facebook} target="_blank" rel="noopener noreferrer"
              className="social-pill social-pill--fb">
              <FacebookIcon size={16} /><span>تابعنا على فيسبوك</span>
            </a>
          )}
          {BRAND_CONFIG.socialLinks.whatsapp && (
            <a href={`https://wa.me/2${BRAND_CONFIG.socialLinks.whatsapp}`} target="_blank" rel="noopener noreferrer"
              className="social-pill social-pill--wa">
              <MessageCircle size={16} strokeWidth={2} /><span>واتساب</span>
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────
// 🏷️ Offers Section
// ──────────────────────────────────────────────────────
const OFFER_ICON_MAP = {
  Flame: Flame,
  Star: Star,
  Users: Users,
};

function OffersSection({ onAddEffect }) {
  const { add, items, updateQty, isReadOnly } = useCart();

  const getOfferDetails = (offer) => {
    if (offer.id === 'offer1') {
      return { cartId: 'k1', id: 'k1', name: 'كشري بصلة التاريخي (علبة صغيرة)', price: 15 };
    } else if (offer.id === 'offer2') {
      return { cartId: 'co1', id: 'co1', name: 'كومبو طاجن (لحمة+كانز+بطاطس)', price: 60 };
    } else if (offer.id === 'offer3') {
      return { cartId: 'sh10', id: 'sh10', name: 'وجبة شاورما عائلية', price: 260 };
    }
    return null;
  };

  const handleOrderOffer = (offer, e) => {
    e.stopPropagation();
    const cartItem = getOfferDetails(offer);
    if (cartItem) {
      add(cartItem);
      onAddEffect?.(e);
    }
  };

  return (
    <section className="offers-section" aria-label="العروض والوجبات المميزة">
      <div className="offers-section__head">
        <div className="offers-section__title"><Zap size={20} strokeWidth={2.5} /><span>عروض ووجبات بصلة</span></div>
        <div className="offers-section__sub">اختار اللي يناسبك</div>
      </div>
      <div className="offers-grid">
        {OFFERS_DATA.map((offer, i) => {
          const IconComponent = OFFER_ICON_MAP[offer.badgeIcon] || Star;
          const priceText = offer.id === 'offer1' ? '15 ج' : offer.id === 'offer2' ? '60 ج' : '260 ج';

          const details = getOfferDetails(offer);
          const existing = details ? items.find(item => item.cartId === details.cartId) : null;

          return (
            <div key={offer.id} className="offer-card" style={{ '--oc': offer.color, animationDelay: `${i * 0.1}s` }}>
              <div className="offer-card__img-wrap">
                <img src={offer.image} alt={offer.title} className="offer-card__img" loading="lazy" />
                <div className="offer-card__img-overlay" />
              </div>
              <div className="offer-card__body">
                <span className="offer-card__badge">
                  <IconComponent size={13} strokeWidth={2.5} />
                  <span>{offer.badgeText}</span>
                </span>
                <h3 className="offer-card__title">{offer.title}</h3>
                <p className="offer-card__desc">{offer.desc}</p>

                {isReadOnly ? (
                  <div className="offer-card__price-tag" style={{
                    background: 'var(--bg-3)',
                    color: 'var(--primary)',
                    borderRadius: '50px',
                    textAlign: 'center',
                    padding: '8px 16px',
                    fontWeight: '800',
                    fontSize: '0.9rem',
                    border: '1px solid var(--border)',
                    marginTop: '10px'
                  }}>
                    السعر: {priceText}
                  </div>
                ) : existing ? (
                  <div className="qty-ctrl qty-ctrl--offer" onClick={(e) => e.stopPropagation()}>
                    <button className="qty-btn" onClick={(e) => { e.stopPropagation(); updateQty(details.cartId, existing.qty - 1); }} aria-label="تقليل الكمية">
                      <Minus size={14} strokeWidth={2.5} />
                    </button>
                    <span className="qty-val">{existing.qty}</span>
                    <button className="qty-btn qty-btn--plus" onClick={(e) => { e.stopPropagation(); updateQty(details.cartId, existing.qty + 1); }} aria-label="زيادة الكمية">
                      <Plus size={14} strokeWidth={2.5} />
                    </button>
                  </div>
                ) : (
                  <button className="offer-card__btn" onClick={(e) => handleOrderOffer(offer, e)}>
                    <span>اطلب العرض الآن</span>
                    <strong className="price-badge">{priceText}</strong>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────
// Header
// ──────────────────────────────────────────────────────
function Header({ theme, toggleTheme, onCartClick }) {
  const { count } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const prevCount = useRef(count);
  const [bounce, setBounce] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    if (count > prevCount.current) { setBounce(true); setTimeout(() => setBounce(false), 450); }
    prevCount.current = count;
  }, [count]);

  return (
    <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
      <div className="header__inner">
        <div className="header__brand">
          <div className="header__logo-box">
            <img src={BRAND_CONFIG.logo} alt={BRAND_CONFIG.nameEn} className="header__logo-img"
              onError={e => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling.style.display = 'flex'; }} />
            <span className="header__logo-emoji" style={{ display: 'none' }}>🧅</span>
          </div>
          <div className="header__brand-text">
            <span className="header__name">{BRAND_CONFIG.name}</span>
            <span className="header__sub">{BRAND_CONFIG.tagline}</span>
          </div>
        </div>
        <div className="header__actions">
          <button className="hdr-icon-btn" onClick={toggleTheme} aria-label="تغيير الثيم">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button className={`cart-btn ${count > 0 ? 'cart-btn--active' : ''}`} onClick={onCartClick} aria-label={`السلة — ${count} صنف`}>
            <ShoppingCart size={19} strokeWidth={2} />
            <span className="cart-btn__text">السلة</span>
            {count > 0 && <span className={`cart-btn__bubble ${bounce ? 'cart-btn__bubble--pop' : ''}`}>{count}</span>}
          </button>
        </div>
      </div>
    </header>
  );
}

// Table Banner
function TableBanner({ tableNumber, isReadOnly }) {
  if (isReadOnly) {
    return (
      <div className="table-banner" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div className="table-banner__pill" style={{ background: 'var(--bg-3)', color: 'var(--primary)', borderColor: 'var(--border)', border: '1px solid var(--border)' }}>
          <span className="table-banner__dot" style={{ background: 'var(--primary)' }} aria-hidden="true" />
          <span>أهلاً بيك في كشري وطواجن بصلة</span>
          <span className="table-banner__dot" style={{ background: 'var(--primary)' }} aria-hidden="true" />
        </div>
      </div>
    );
  }
  if (!tableNumber) return null;
  return (
    <div className="table-banner">
      <div className="table-banner__pill">
        <span className="table-banner__dot" aria-hidden="true" />
        <Hash size={14} strokeWidth={2.5} aria-hidden="true" />
        <span>طاولة</span>
        <strong className="table-banner__num">#{tableNumber}</strong>
      </div>
    </div>
  );
}

// Search
function SearchBar({ value, onChange }) {
  const inputRef = useRef(null);
  return (
    <div className="search-box">
      <Search size={17} strokeWidth={2} className="search-box__ico" aria-hidden="true" />
      <input ref={inputRef} type="search" className="search-box__input" placeholder="ابحث في المنيو..." value={value}
        onChange={e => onChange(e.target.value)} dir="rtl" autoComplete="off" aria-label="البحث في المنيو" />
      {value && (
        <button className="search-box__clear" onClick={() => { onChange(''); inputRef.current?.focus(); }} aria-label="مسح">
          <X size={15} strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
}

// Category Tabs
function CategoryTabs({ categories, activeId, onSelect }) {
  const activeRef = useRef(null);
  useEffect(() => {
    activeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [activeId]);
  return (
    <nav className="cat-tabs-sticky" aria-label="أقسام المنيو">
      <div className="cat-tabs-rail" role="tablist">
        {categories.map((cat, i) => (
          <button key={cat.id} ref={activeId === cat.id ? activeRef : null} role="tab"
            aria-selected={activeId === cat.id}
            className={`cat-tab ${activeId === cat.id ? 'cat-tab--on' : ''}`}
            style={{ '--cc': cat.color, animationDelay: `${i * 0.03}s` }}
            onClick={() => onSelect(cat.id)}>
            <CatIcon name={cat.icon} size={15} /><span>{cat.name}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

// Size Picker
function SizePicker({ sizes, selectedIndex, onSelect }) {
  return (
    <div className="size-picker" role="group" aria-label="اختر الحجم">
      {sizes.map((s, i) => (
        <button key={i} className={`size-btn ${selectedIndex === i ? 'size-btn--on' : ''}`} onClick={() => onSelect(i)}>
          <span className="size-btn__label">{s.label}</span>
          <span className="size-btn__price">{s.price}</span>
        </button>
      ))}
    </div>
  );
}

// Item Card
function ItemCard({ item, delay, onItemClick, onAddEffect, category }) {
  const { add, items, updateQty, isReadOnly } = useCart();
  const sizes = parseSizes(item.priceRange);
  const hasMultiSize = sizes && sizes.length >= 2;
  const [sizeIdx, setSizeIdx] = useState(0);
  const [justAdded, setJustAdded] = useState(false);
  const [showSizes, setShowSizes] = useState(false);

  const activeSize = hasMultiSize ? sizes[sizeIdx] : null;
  const activePrice = activeSize ? activeSize.price : item.price;
  const cartId = hasMultiSize ? `${item.id}-${sizeIdx}` : item.id;
  const baseLabel = hasMultiSize ? `${item.name} (${activeSize.label})` : item.name;
  const cartLabel = category && category.name ? `${baseLabel} - ${category.name}` : baseLabel;
  const existing = items.find(i => i.cartId === cartId);

  const handleAdd = (e) => {
    add({ cartId, id: item.id, name: cartLabel, price: activePrice });
    setJustAdded(true); setShowSizes(false);
    setTimeout(() => setJustAdded(false), 1100);
    onAddEffect?.(e);
  };

  const handleCardClick = (e) => {
    if (
      e.target.closest('.qty-ctrl') ||
      e.target.closest('.add-btn') ||
      e.target.closest('.size-panel') ||
      e.target.closest('.size-picker') ||
      e.target.closest('.confirm-add-btn')
    ) {
      return;
    }
    onItemClick?.(item, category);
  };

  return (
    <article className="item-card" style={{ animationDelay: `${Math.min(delay * 0.05, 0.45)}s` }} onClick={handleCardClick}>
      <div className="item-card__main">
        <div className="item-card__info">
          <h3 className="item-card__name">{item.name}</h3>
          {item.description && <p className="item-card__desc">{item.description}</p>}
          {hasMultiSize && (
            <div className="item-card__sizes-preview">
              {sizes.map((s, i) => (
                <span key={i} className="size-preview-chip">{s.label}: <strong>{s.price}</strong></span>
              ))}
            </div>
          )}
        </div>
        <div className="item-card__side">
          <div className="item-card__price-wrap">
            {hasMultiSize
              ? <span className="item-card__price-range">{sizes[0].price}–{sizes[sizes.length - 1].price}<small> {BRAND_CONFIG.currency}</small></span>
              : <span className="item-card__price">{item.price}<small> {BRAND_CONFIG.currency}</small></span>}
          </div>
          {isReadOnly ? null : (!hasMultiSize && existing
            ? <div className="qty-ctrl">
              <button className="qty-btn" onClick={() => updateQty(cartId, existing.qty - 1)}><Minus size={13} strokeWidth={2.5} /></button>
              <span className="qty-val">{existing.qty}</span>
              <button className="qty-btn qty-btn--plus" onClick={() => updateQty(cartId, existing.qty + 1)}><Plus size={13} strokeWidth={2.5} /></button>
            </div>
            : !hasMultiSize
              ? <button className={`add-btn ${justAdded ? 'add-btn--done' : ''}`} onClick={handleAdd}>
                {justAdded ? <Check size={14} strokeWidth={3} /> : <Plus size={14} strokeWidth={2.5} />}
                {justAdded ? 'أُضيف' : 'أضف'}
              </button>
              : <button className={`add-btn add-btn--size ${showSizes ? 'add-btn--open' : ''}`} onClick={() => setShowSizes(v => !v)}>
                <Plus size={14} strokeWidth={2.5} /> أضف
                <ChevronDown size={13} className={`add-btn__chevron ${showSizes ? 'add-btn__chevron--up' : ''}`} />
              </button>
          )}
        </div>
      </div>
      {hasMultiSize && showSizes && (
        <div className="size-panel">
          <p className="size-panel__label">اختر الحجم:</p>
          <SizePicker sizes={sizes} selectedIndex={sizeIdx} onSelect={setSizeIdx} />
          <div className="size-panel__foot">
            {existing
              ? <div className="qty-ctrl qty-ctrl--wide">
                <button className="qty-btn" onClick={() => updateQty(cartId, existing.qty - 1)}><Minus size={13} strokeWidth={2.5} /></button>
                <span className="qty-val">{existing.qty}</span>
                <button className="qty-btn qty-btn--plus" onClick={() => updateQty(cartId, existing.qty + 1)}><Plus size={13} strokeWidth={2.5} /></button>
              </div>
              : <button className={`confirm-add-btn ${justAdded ? 'confirm-add-btn--done' : ''}`} onClick={handleAdd}>
                {justAdded ? <><Check size={15} strokeWidth={3} /> تم الإضافة!</> : <><Plus size={15} /> أضف للسلة — {activePrice} {BRAND_CONFIG.currency}</>}
              </button>
            }
          </div>
        </div>
      )}
    </article>
  );
}

// Category Section
function CategorySection({ category, searchQuery, sectionRef, onItemClick, onAddEffect }) {
  const filtered = category.items.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
  if (!filtered.length) return null;
  return (
    <section className="cat-section" ref={sectionRef} id={`cat-${category.id}`}>
      <div className="cat-section__hd">
        <div className="cat-badge" style={{ '--cc': category.color }}>
          <CatIcon name={category.icon} size={18} /><span>{category.name}</span>
        </div>
        <div className="cat-divider" style={{ '--cc': category.color }} />
        <span className="cat-count">{filtered.length}</span>
      </div>
      <div className="items-grid">
        {filtered.map((item, i) => (
          <ItemCard
            key={item.id}
            item={item}
            delay={i}
            onItemClick={onItemClick}
            onAddEffect={onAddEffect}
            category={category}
          />
        ))}
      </div>
    </section>
  );
}

// Cart Drawer
function CartDrawer({ isOpen, onClose }) {
  const { items, remove, updateQty, total, count, tableNumber, clear } = useCart();
  const [status, setStatus] = useState('idle');
  const [note, setNote] = useState('');

  useEffect(() => { document.body.style.overflow = isOpen ? 'hidden' : ''; return () => { document.body.style.overflow = ''; }; }, [isOpen]);

  const handleOrder = async () => {
    if (!items.length) return;
    setStatus('sending');
    const payload = { action: 'submitOrder', table: tableNumber, items: items.map(i => ({ name: i.name, qty: i.qty, price: i.price })), total, note, time: new Date().toLocaleString('ar-EG') };
    if (BRAND_CONFIG.googleSheetApiUrl) {
      try {
        await fetch(BRAND_CONFIG.googleSheetApiUrl, {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'text/plain;charset=utf-8'
          },
          body: JSON.stringify(payload)
        });
        setStatus('success');
        setTimeout(() => { clear(); onClose(); setStatus('idle'); setNote(''); }, 2800);
      } catch (err) {
        console.error("Error submitting order to Google Sheets API:", err);
        setStatus('error');
        setTimeout(() => setStatus('idle'), 3000);
      }
    } else {
      await new Promise(r => setTimeout(r, 1400));
      setStatus('success');
      setTimeout(() => { clear(); onClose(); setStatus('idle'); setNote(''); }, 2800);
    }
  };

  return (
    <>
      <div className={`overlay ${isOpen ? 'overlay--on' : ''}`} onClick={onClose} aria-hidden="true" />
      <aside className={`drawer ${isOpen ? 'drawer--on' : ''}`} aria-modal="true" role="dialog" aria-label="سلة الطلبات">
        <div className="drawer__hd">
          <div className="drawer__title"><ShoppingCart size={20} strokeWidth={2} /> سلة الطلبات {count > 0 && <span className="drawer__cnt">{count}</span>}</div>
          <button className="hdr-icon-btn" onClick={onClose} aria-label="إغلاق"><X size={18} strokeWidth={2} /></button>
        </div>
        <div className="drawer__table-chip"><Hash size={13} strokeWidth={2.5} /> طاولة رقم <strong>{tableNumber}</strong></div>

        {status === 'sending' && <div className="drawer__state"><Loader2 size={48} className="spin" /><p>جاري إرسال طلبك...</p></div>}
        {status === 'success' && <div className="drawer__state"><div className="success-icon"><Check size={38} strokeWidth={3} /></div><h3>تم إرسال طلبك! 🎉</h3><p>سيصل طلبك قريباً — شكراً لك</p></div>}
        {status === 'error' && <div className="drawer__err"><p>⚠️ حدث خطأ، حاول مرة أخرى</p><button className="retry-btn" onClick={() => setStatus('idle')}>إعادة المحاولة</button></div>}

        {status === 'idle' && (
          !items.length
            ? <div className="drawer__empty"><span className="drawer__empty-emoji">🧅</span><p>السلة فارغة</p><small>أضف أصناف من المنيو</small></div>
            : <>
              <div className="drawer__items">
                {items.map(item => (
                  <div key={item.cartId} className="d-item">
                    <div className="d-item__info"><span className="d-item__name">{item.name}</span><span className="d-item__price">{item.price * item.qty} {BRAND_CONFIG.currency}</span></div>
                    <div className="d-item__ctrl">
                      <button className="qty-btn" onClick={() => updateQty(item.cartId, item.qty - 1)}><Minus size={12} strokeWidth={2.5} /></button>
                      <span className="qty-val">{item.qty}</span>
                      <button className="qty-btn qty-btn--plus" onClick={() => updateQty(item.cartId, item.qty + 1)}><Plus size={12} strokeWidth={2.5} /></button>
                      <button className="d-item__del" onClick={() => remove(item.cartId)}><Trash2 size={13} strokeWidth={2} /></button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="drawer__note">
                <label htmlFor="order-note" className="drawer__note-lbl">ملاحظات (اختياري)</label>
                <textarea id="order-note" className="drawer__note-ta" placeholder="مثال: بدون بصل، شطة إضافية..." value={note} onChange={e => setNote(e.target.value)} rows={2} dir="rtl" />
              </div>
              <div className="drawer__total"><span>الإجمالي</span><span className="drawer__total-num">{total} {BRAND_CONFIG.currency}</span></div>
              <div className="drawer__foot">
                <button className="order-btn" onClick={handleOrder}><Send size={17} strokeWidth={2} /> أرسل الطلب</button>
                <button className="clear-link" onClick={clear}><Trash2 size={13} /> إفراغ السلة</button>
              </div>
            </>
        )}
      </aside>
    </>
  );
}

// Floating Cart FAB
function FloatingCart({ onClick }) {
  const { count, total } = useCart();
  if (!count) return null;
  return (
    <button className="fab" onClick={onClick} aria-label={`افتح السلة — ${count} صنف`}>
      <div className="fab__left"><ShoppingCart size={19} strokeWidth={2} /><span>{count} {count === 1 ? 'صنف' : 'أصناف'}</span></div>
      <span className="fab__price">{total} {BRAND_CONFIG.currency}</span>
    </button>
  );
}

// Footer
function Footer() {
  return (
    <footer className="site-footer">
      <img src={BRAND_CONFIG.logo} alt={BRAND_CONFIG.nameEn} className="site-footer__logo" onError={e => { e.currentTarget.style.display = 'none'; }} />
      <p className="site-footer__tagline">{BRAND_CONFIG.tagline}</p>
      <div className="site-footer__links">
        <a href={`tel:${BRAND_CONFIG.phone}`} className="f-link"><Phone size={14} strokeWidth={2} /> الخط الساخن: {BRAND_CONFIG.phone}</a>
        {BRAND_CONFIG.phones.map(p => <a key={p} href={`tel:${p}`} className="f-link"><Phone size={14} strokeWidth={2} /> {p}</a>)}
        <a href={`https://wa.me/2${BRAND_CONFIG.whatsapp}`} target="_blank" rel="noopener noreferrer" className="f-link f-link--wa"><MessageCircle size={14} strokeWidth={2} /> واتساب</a>
        {BRAND_CONFIG.socialLinks.facebook && <a href={BRAND_CONFIG.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="f-link f-link--fb"><FacebookIcon size={14} /> صفحتنا على فيسبوك</a>}
      </div>
      <p className="site-footer__copy">© {new Date().getFullYear()} {BRAND_CONFIG.nameEn} — جميع الحقوق محفوظة</p>
    </footer>
  );
}

// ──────────────────────────────────────────────────────
// 🍔 Item Detail Modal (Popup)
// ──────────────────────────────────────────────────────
function ItemDetailModal({ item, category, onClose, onAdd }) {
  const { isReadOnly } = useCart();
  const [sizeIdx, setSizeIdx] = useState(0);
  const [instructions, setInstructions] = useState('');
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const sizes = parseSizes(item.priceRange);
  const hasMultiSize = sizes && sizes.length >= 2;
  const activeSize = hasMultiSize ? sizes[sizeIdx] : null;
  const activePrice = activeSize ? activeSize.price : item.price;

  const getCategoryImage = (catId) => {
    const maps = {
      koshary: "/Images/672688994_122127123633050215_6655007981988485268_n.jpg",
      sweets: "/Images/708700887_122130519231050215_8390209153081266837_n.jpg",
      tajeen: "/Images/706477052_122130120453050215_8515994582264094129_n.jpg",
      'crepe-chicken': "/Images/702637444_122129861583050215_2024559277383344822_n.jpg",
      'crepe-meat': "/Images/702637444_122129861583050215_2024559277383344822_n.jpg",
      'crepe-sweet': "/Images/702637444_122129861583050215_2024559277383344822_n.jpg",
      shawarma: "/Images/690574064_122128559133050215_2724818770922357598_n.jpg",
      chicken: "/Images/712269033_122130889827050215_3135680032512992590_n.jpg",
      syrian: "/Images/720656374_989270923988781_6706559874247879838_n.jfif",
    };
    return maps[catId] || "/Images/672688994_122127123633050215_6655007981988485268_n.jpg";
  };

  const handleAdd = (e) => {
    const cartId = hasMultiSize ? `${item.id}-${sizeIdx}` : item.id;
    const baseLabel = hasMultiSize ? `${item.name} (${activeSize.label})` : item.name;
    const cartLabel = category && category.name ? `${baseLabel} - ${category.name}` : baseLabel;
    const finalLabel = instructions.trim() ? `${cartLabel} [${instructions}]` : cartLabel;

    onAdd({
      cartId,
      id: item.id,
      name: finalLabel,
      price: activePrice,
      qty
    }, e);

    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 850);
  };

  return (
    <div className="detail-modal-overlay" onClick={onClose}>
      <div className="detail-modal animate-scale" onClick={e => e.stopPropagation()}>
        <div className="detail-modal__handle" onClick={onClose} />

        <button className="detail-modal__close" onClick={onClose} aria-label="إغلاق">
          <X size={18} strokeWidth={2.5} />
        </button>

        <div className="detail-modal__img-wrap">
          <img src={getCategoryImage(category?.id)} alt={item.name} className="detail-modal__img" />
          <div className="detail-modal__img-overlay" />
          {category && (
            <span className="detail-modal__badge" style={{ '--cc': category.color }}>
              <CatIcon name={category.icon} size={13} />
              <span>{category.name}</span>
            </span>
          )}
        </div>

        <div className="detail-modal__content">
          <h2 className="detail-modal__title">{item.name}</h2>
          {item.description ? (
            <p className="detail-modal__desc">{item.description}</p>
          ) : (
            <p className="detail-modal__desc detail-modal__desc--placeholder">طبق لذيذ محضر بعناية من أجود المكونات الطازجة لتقديم نكهة أصيلة تسعد حواسك.</p>
          )}

          {hasMultiSize && (
            <div className="detail-modal__section">
              <label className="detail-modal__section-lbl">اختر الحجم:</label>
              <div className="detail-modal__sizes">
                {sizes.map((s, idx) => (
                  <button
                    key={idx}
                    className={`detail-modal__size-btn ${sizeIdx === idx ? 'on' : ''}`}
                    onClick={() => setSizeIdx(idx)}
                  >
                    <span className="label">{s.label}</span>
                    <span className="price">{s.price} {BRAND_CONFIG.currency}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {isReadOnly ? (
            <div className="detail-modal__price-tag-only" style={{
              background: 'var(--bg-3)',
              color: 'var(--primary)',
              borderRadius: '12px',
              textAlign: 'center',
              padding: '14px',
              fontWeight: '900',
              fontSize: '1.25rem',
              border: '1px solid var(--border)',
              marginTop: '16px',
              fontFamily: 'var(--font)'
            }}>
              السعر: {activePrice} {BRAND_CONFIG.currency}
            </div>
          ) : (
            <>
              <div className="detail-modal__section">
                <label htmlFor="modal-note-area" className="detail-modal__section-lbl">تعليمات خاصة:</label>
                <textarea
                  id="modal-note-area"
                  className="detail-modal__textarea"
                  placeholder="مثال: بدون بصل، زيادة شطة، تغليف إضافي..."
                  value={instructions}
                  onChange={e => setInstructions(e.target.value)}
                  rows={2}
                  dir="rtl"
                />
              </div>

              <div className="detail-modal__footer">
                <div className="detail-modal__qty">
                  <button className="qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))}>
                    <Minus size={14} strokeWidth={2.5} />
                  </button>
                  <span className="qty-val">{qty}</span>
                  <button className="qty-btn qty-btn--plus" onClick={() => setQty(q => q + 1)}>
                    <Plus size={14} strokeWidth={2.5} />
                  </button>
                </div>

                <button className={`detail-modal__add-btn ${added ? 'done' : ''}`} onClick={handleAdd}>
                  {added ? <Check size={18} strokeWidth={3} /> : <Plus size={18} strokeWidth={2.5} />}
                  <span>{added ? 'تمت الإضافة للسلة' : `أضف للسلة — ${activePrice * qty} ${BRAND_CONFIG.currency}`}</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────
// Main Menu Page
// ──────────────────────────────────────────────────────
function MenuPage() {
  const [theme, setTheme] = useState(BRAND_CONFIG.defaultTheme);
  const [cartOpen, setCartOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [menuData, setMenuData] = useState(MENU_DATA);
  const [isLoading, setIsLoading] = useState(false);
  const [activeCat, setActiveCat] = useState(MENU_DATA.categories[0].id);
  const sectionRefs = useRef({});
  const observerRef = useRef(null);
  const { tableNumber, add, isReadOnly } = useCart();

  // Premium Detail Modal State
  const [activeDetailItem, setActiveDetailItem] = useState(null);
  const [activeDetailCategory, setActiveDetailCategory] = useState(null);

  // Premium Flying Particles State
  const [flyingParticles, setFlyingParticles] = useState([]);

  useEffect(() => { document.documentElement.setAttribute('data-theme', theme); }, [theme]);

  // Fetch dynamic categories/items from Google Sheet Apps Script API if configured
  useEffect(() => {
    if (!BRAND_CONFIG.googleSheetApiUrl) return;
    setIsLoading(true);
    fetch(`${BRAND_CONFIG.googleSheetApiUrl}?action=getMenu`)
      .then(res => res.json())
      .then(data => {
        if (data && data.categories && data.categories.length > 0) {
          setMenuData(data);
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Error fetching menu from Google Sheets API:", err);
        setIsLoading(false); // Falls back to local MENU_DATA
      });
  }, []);

  // Update active category when menuData loads dynamically
  useEffect(() => {
    if (menuData && menuData.categories && menuData.categories.length > 0) {
      setActiveCat(menuData.categories[0].id);
    }
  }, [menuData]);

  useEffect(() => {
    if (isLoading) return;
    observerRef.current?.disconnect();
    observerRef.current = new IntersectionObserver(entries => {
      const vis = entries.filter(e => e.isIntersecting);
      if (vis.length) {
        const top = vis.reduce((a, b) => a.boundingClientRect.top < b.boundingClientRect.top ? a : b);
        setActiveCat(top.target.id.replace('cat-', ''));
      }
    }, { rootMargin: '-20% 0px -60% 0px', threshold: 0 });
    Object.values(sectionRefs.current).forEach(r => r && observerRef.current.observe(r));
    return () => observerRef.current?.disconnect();
  }, [query, menuData, isLoading]);

  const scrollToCategory = id => {
    setActiveCat(id);
    const el = document.getElementById(`cat-${id}`);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 160, behavior: 'smooth' });
  };

  const triggerFly = (e) => {
    if (!e) return;
    const rect = document.querySelector('.cart-btn--active, .fab, .cart-btn')?.getBoundingClientRect();
    if (!rect) return;
    const targetX = rect.left + rect.width / 2;
    const targetY = rect.top + rect.height / 2;

    let startX = e.clientX;
    let startY = e.clientY;

    if (!startX && e.touches && e.touches[0]) {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }

    if (!startX && e.nativeEvent) {
      if (e.nativeEvent.clientX) {
        startX = e.nativeEvent.clientX;
        startY = e.nativeEvent.clientY;
      } else if (e.nativeEvent.touches && e.nativeEvent.touches[0]) {
        startX = e.nativeEvent.touches[0].clientX;
        startY = e.nativeEvent.touches[0].clientY;
      }
    }

    if (!startX) {
      startX = window.innerWidth / 2;
      startY = window.innerHeight / 2;
    }

    const id = Date.now() + Math.random();
    setFlyingParticles(prev => [...prev, { id, startX, startY, targetX, targetY }]);
    setTimeout(() => {
      setFlyingParticles(prev => prev.filter(p => p.id !== id));
    }, 600);
  };

  const visibleCats = query
    ? menuData.categories.filter(c => c.items.some(i => i.name.toLowerCase().includes(query.toLowerCase())))
    : menuData.categories;

  return (
    <div className="app">
      <div className="wavy-bg" aria-hidden="true" />
      <Header theme={theme} toggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} onCartClick={() => setCartOpen(true)} />
      <main className="main">
        <ImageSlider />
        <Hero />
        <TableBanner tableNumber={tableNumber} isReadOnly={isReadOnly} />
        <div className="offers-wrap"><OffersSection onAddEffect={triggerFly} /></div>
        <div className="search-wrap"><SearchBar value={query} onChange={setQuery} /></div>

        {!query && !isLoading && <CategoryTabs categories={menuData.categories} activeId={activeCat} onSelect={scrollToCategory} />}

        {isLoading ? (
          <div className="menu-loading">
            <Loader2 size={38} className="spin icon-orange" />
            <p>جاري تحميل قائمة المأكولات الطازجة...</p>
          </div>
        ) : (
          <div className="menu-body">
            {visibleCats.map(cat => (
              <CategorySection
                key={cat.id}
                category={cat}
                searchQuery={query}
                sectionRef={el => sectionRefs.current[cat.id] = el}
                onItemClick={(item, category) => {
                  setActiveDetailItem(item);
                  setActiveDetailCategory(category);
                }}
                onAddEffect={triggerFly}
              />
            ))}
            {!visibleCats.length && (
              <div className="no-results">
                <span>🔍</span>
                <p>لا نتائج لـ «{query}»</p>
                <button className="no-results__btn" onClick={() => setQuery('')}>مسح البحث</button>
              </div>
            )}
          </div>
        )}
        <Footer />
      </main>
      {!isReadOnly && <FloatingCart onClick={() => setCartOpen(true)} />}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Item Detail Modal */}
      {activeDetailItem && (
        <ItemDetailModal
          item={activeDetailItem}
          category={activeDetailCategory}
          onClose={() => {
            setActiveDetailItem(null);
            setActiveDetailCategory(null);
          }}
          onAdd={(cartItem, e) => {
            add(cartItem);
            if (e) triggerFly(e);
          }}
        />
      )}

      {/* Flying particles */}
      {flyingParticles.map(p => (
        <div
          key={p.id}
          className="flying-particle"
          style={{
            '--startX': `${p.startX}px`,
            '--startY': `${p.startY}px`,
            '--targetX': `${p.targetX}px`,
            '--targetY': `${p.targetY}px`
          }}
        />
      ))}
    </div>
  );
}

export default function App() {
  const page = new URLSearchParams(window.location.search).get('page');

  if (page === 'qr') {
    return <QRGenerator />;
  }

  return <CartProvider><MenuPage /></CartProvider>;
}
