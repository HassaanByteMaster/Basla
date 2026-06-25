import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BowlFood, CookingPot, Cookie, ForkKnife,
  Hamburger, Star, Cake, Plus, Gift, Fire
} from '@phosphor-icons/react';
import { CONFIG } from '../config';
import styles from './ItemCard.module.css';

/* ── Per-category color theme ── */
const THEMES = {
  kushary:         { Icon: BowlFood,   color: '#F5922A', rgb: '245,146,42'  },
  tawagen:         { Icon: CookingPot, color: '#E88030', rgb: '232,128,48'  },
  'crepe-chicken': { Icon: ForkKnife,  color: '#E09030', rgb: '224,144,48'  },
  'crepe-meat':    { Icon: ForkKnife,  color: '#D07020', rgb: '208,112,32'  },
  'crepe-sweet':   { Icon: Cookie,     color: '#C06020', rgb: '192,96,32'   },
  chicken:         { Icon: Fire,       color: '#E05020', rgb: '224,80,32'   },
  shawarma:        { Icon: Hamburger,  color: '#D04010', rgb: '208,64,16'   },
  syrian:          { Icon: Star,       color: '#CC5500', rgb: '204,85,0'    },
  sweets:          { Icon: Cake,       color: '#AA6633', rgb: '170,102,51'  },
  extras:          { Icon: Plus,       color: '#6699AA', rgb: '102,153,170' },
  offers:          { Icon: Gift,       color: '#EE2200', rgb: '238,34,0'    },
};

export default function ItemCard({ item, cat, onAdd, delay = 0, featured = false }) {
  const [added, setAdded]       = useState(false);
  const [glow, setGlow]         = useState({ x: '50%', y: '50%', show: false });
  const cardRef                 = useRef(null);

  const hasVariants  = item.variants?.length > 0;
  const isOffer      = !!item.originalPrice;
  const priceRange   = hasVariants
    ? `${item.variants[0].price}–${item.variants[item.variants.length - 1].price}`
    : item.price;

  const { Icon = ForkKnife, color = '#F5922A', rgb = '245,146,42' } = THEMES[cat.id] || {};

  /* Spotlight border — Design Spell */
  const onMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    setGlow({ x: e.clientX - r.left, y: e.clientY - r.top, show: true });
  }, []);

  const onMouseLeave = useCallback(() => setGlow(g => ({ ...g, show: false })), []);

  function handleAdd() {
    if (hasVariants) { onAdd(item, cat, true); }
    else {
      onAdd(item, cat, false);
      setAdded(true);
      setTimeout(() => setAdded(false), 900);
    }
  }

  return (
    <motion.article
      ref={cardRef}
      className={`${styles.card} ${featured ? styles.featured : ''}`}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{
        '--c':   color,
        '--rgb': rgb,
        '--sx':  `${glow.x}px`,
        '--sy':  `${glow.y}px`,
      }}
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
      layout
      whileHover={{ y: -4 }}
    >
      {/* ── Spotlight glow ── */}
      {glow.show && (
        <div className={styles.spotlight} aria-hidden />
      )}

      {/* ── Offer badge ── */}
      {isOffer && (
        <div className={styles.badge}>
          خصم {item.originalPrice - item.price} {CONFIG.brand.symbol}
        </div>
      )}

      {/* ── Visual (icon section) ── */}
      <div className={styles.visual}>
        {/* Ambient radial background */}
        <div className={styles.ambient} />

        <motion.div
          className={styles.iconWrap}
          whileHover={{ scale: 1.12, rotate: -6 }}
          transition={{ type: 'spring', stiffness: 380, damping: 14 }}
        >
          <Icon
            size={featured ? 44 : 36}
            weight="duotone"
            color={color}
          />
        </motion.div>
      </div>

      {/* ── Color divider ── */}
      <div className={styles.divider} />

      {/* ── Info ── */}
      <div className={styles.body}>
        <h3 className={styles.name}>{item.name}</h3>
        {hasVariants && (
          <p className={styles.variants}>{item.variants.map(v => v.name).join(' · ')}</p>
        )}
        {item.description && featured && (
          <p className={styles.desc}>{item.description}</p>
        )}
      </div>

      {/* ── Footer ── */}
      <div className={styles.foot}>
        <div className={styles.priceWrap}>
          {isOffer && (
            <s className={styles.oldPrice}>{item.originalPrice}</s>
          )}
          <span className={styles.price}>
            {priceRange}
            <span className={styles.sym}> {CONFIG.brand.symbol}</span>
          </span>
        </div>

        <motion.button
          className={`${styles.btn} ${added ? styles.btnAdded : ''}`}
          onClick={handleAdd}
          whileTap={{ scale: 0.82 }}
          aria-label={`إضافة ${item.name}`}
        >
          <AnimatePresence mode="wait">
            {added ? (
              <motion.span key="ok"
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.18 }}
              >✓</motion.span>
            ) : (
              <motion.span key="pl"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              ><Plus size={14} weight="bold" /></motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.article>
  );
}
