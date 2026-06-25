import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BowlFood, CookingPot, Cookie, ForkKnife,
  Hamburger, Cake, Plus, Gift, Fire,
  Star
} from '@phosphor-icons/react';
import { CONFIG } from '../config';
import styles from './ItemRow.module.css';

/* Icon map — category id → Phosphor icon */
const ICONS = {
  kushary:         { Icon: BowlFood,    color: '#F5922A' },
  tawagen:         { Icon: CookingPot,  color: '#E07820' },
  'crepe-chicken': { Icon: ForkKnife,   color: '#D97A1A' },
  'crepe-meat':    { Icon: ForkKnife,   color: '#C86B10' },
  'crepe-sweet':   { Icon: Cookie,      color: '#A0522D' },
  chicken:         { Icon: Fire,        color: '#CC6600' },
  shawarma:        { Icon: Hamburger,   color: '#BB5500' },
  syrian:          { Icon: Star,        color: '#AA4400' },
  sweets:          { Icon: Cake,        color: '#996633' },
  extras:          { Icon: Plus,        color: '#778888' },
  offers:          { Icon: Gift,        color: '#CC2200' },
};

export default function ItemRow({ item, cat, onAdd, delay = 0, isReadOnly = false }) {
  const [added, setAdded]  = useState(false);
  const [pressed, setPressed] = useState(false);
  const hasVariants        = item.variants?.length > 0;
  const isOffer            = !!item.originalPrice;
  const displayPrice       = hasVariants ? item.variants[0].price : item.price;
  const priceRange         = hasVariants
    ? `${item.variants[0].price}–${item.variants[item.variants.length - 1].price}`
    : item.price;

  const { Icon = ForkKnife, color = '#F5922A' } = ICONS[cat.id] || {};

  function handleAdd() {
    if (hasVariants) {
      onAdd(item, cat, true);
    } else {
      onAdd(item, cat, false);
      setAdded(true);
      setTimeout(() => setAdded(false), 1000);
    }
  }

  const imageUrl = item.image
    ? (item.image.startsWith('http') ? item.image : (item.image.startsWith('/') ? item.image : `/${item.image}`))
    : null;

  return (
    <motion.div
      className={`${styles.row} ${isOffer ? styles.offerRow : ''}`}
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
      layout
    >
      {/* Shimmer overlay on hover */}
      <div className={styles.shimmer} aria-hidden />

      {/* Orange left accent */}
      <div className={styles.accent} style={{ background: color }} />

      {/* Icon / Image */}
      <div className={styles.iconWrap} style={{ borderColor: `${color}30` }}>
        {imageUrl ? (
          <>
            <img
              src={imageUrl}
              alt={item.name}
              className={styles.itemImg}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const sibling = e.currentTarget.nextSibling;
                if (sibling) sibling.style.display = 'flex';
              }}
            />
            <div className={styles.fallbackIcon} style={{ display: 'none' }}>
              <Icon size={20} weight="duotone" color={color} />
            </div>
          </>
        ) : (
          <div className={styles.fallbackIcon}>
            <Icon size={20} weight="duotone" color={color} />
          </div>
        )}
      </div>

      {/* Info */}
      <div className={styles.info}>
        <span className={styles.name}>{item.name}</span>
        {item.description && <span className={styles.desc}>{item.description}</span>}
        {hasVariants && (
          <div className={styles.variants}>
            {item.variants.map(v => (
              <span key={v.name} className={styles.variantChip}>{v.name}</span>
            ))}
          </div>
        )}
      </div>

      {/* Price + Add */}
      <div className={styles.right}>
        <div className={styles.priceBlock}>
          {isOffer && (
            <span className={styles.originalPrice}>{item.originalPrice}</span>
          )}
          <span className={styles.price}>
            {priceRange}
            <span className={styles.sym}> ج.م</span>
          </span>
        </div>

        {/* Add button */}
        {!isReadOnly && (
          <motion.button
            className={`${styles.addBtn} ${added ? styles.added : ''}`}
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
                  transition={{ duration: 0.15 }}
                >
                  <Plus size={16} weight="bold" />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
