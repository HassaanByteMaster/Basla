import { motion, AnimatePresence } from 'framer-motion';
import {
  BowlFood, CookingPot, Cookie, ForkKnife,
  Hamburger, Star, Cake, Plus, Gift, Fire,
  CaretLeft
} from '@phosphor-icons/react';
import { CONFIG } from '../config';
import styles from './SizeModal.module.css';

const CAT_ICONS = {
  kushary:         BowlFood,
  tawagen:         CookingPot,
  'crepe-chicken': ForkKnife,
  'crepe-meat':    ForkKnife,
  'crepe-sweet':   Cookie,
  chicken:         Fire,
  shawarma:        Hamburger,
  syrian:          Star,
  sweets:          Cake,
  extras:          Plus,
  offers:          Gift,
};

export default function SizeModal({ item, cat, isOpen, onClose, onSelect }) {
  if (!item) return null;
  const Icon = cat ? (CAT_ICONS[cat.id] || ForkKnife) : ForkKnife;

  const imageUrl = item.image
    ? (item.image.startsWith('http') ? item.image : (item.image.startsWith('/') ? item.image : `/${item.image}`))
    : null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className={styles.sheet}
            initial={{ y: '100%' }}
            animate={{ y: 0, transition: { type: 'spring', stiffness: 420, damping: 38 } }}
            exit={{ y: '100%', transition: { duration: 0.26, ease: [0.7, 0, 1, 0.6] } }}
            onClick={e => e.stopPropagation()}
          >
            {/* Design Spell: shimmer on open */}
            <div className={styles.sheetShimmer} />

            <div className={styles.handle} />

            <div className={styles.header}>
              <div className={styles.iconWrap}>
                {imageUrl ? (
                  <>
                    <img
                      src={imageUrl}
                      alt={item.name}
                      className={styles.modalImg}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const sibling = e.currentTarget.nextSibling;
                        if (sibling) sibling.style.display = 'flex';
                      }}
                    />
                    <div className={styles.fallbackIcon} style={{ display: 'none' }}>
                      <Icon size={26} weight="duotone" color="#F5922A" />
                    </div>
                  </>
                ) : (
                  <div className={styles.fallbackIcon}>
                    <Icon size={26} weight="duotone" color="#F5922A" />
                  </div>
                )}
              </div>
              <div>
                <p className={styles.label}>اختر الحجم</p>
                <h3 className={styles.itemName}>{item.name}</h3>
              </div>
            </div>

            <div className={styles.options}>
              {item.variants?.map((v, i) => (
                <motion.button
                  key={v.name}
                  className={styles.option}
                  onClick={() => onSelect(item, v)}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  whileTap={{ scale: 0.97 }}
                >
                  <div className={styles.optionLeft}>
                    <span className={styles.optionName}>{v.name}</span>
                  </div>
                  <div className={styles.optionRight}>
                    <span className={styles.optionPrice}>
                      {v.price}
                      <span className={styles.optionSym}> {CONFIG.brand.symbol}</span>
                    </span>
                    <CaretLeft size={14} weight="bold" color="rgba(0,0,0,0.6)" />
                  </div>
                </motion.button>
              ))}
            </div>

            <button className={styles.cancelBtn} onClick={onClose}>إلغاء</button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
