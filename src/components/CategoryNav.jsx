import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BowlFood, CookingPot, Cookie, ForkKnife,
  Hamburger, Star, Cake, Plus, Gift, Fire
} from '@phosphor-icons/react';
import styles from './CategoryNav.module.css';

/* Icon map — same as ItemRow */
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

export default function CategoryNav({ categories, activeId, onSelect }) {
  const navRef = useRef(null);

  useEffect(() => {
    if (!navRef.current || !activeId) return;
    const el = navRef.current.querySelector(`[data-cat="${activeId}"]`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [activeId]);

  return (
    <nav className={styles.nav} aria-label="أقسام المنيو">
      <div className={styles.list} ref={navRef}>
        {categories.map((cat, i) => {
          const Icon    = CAT_ICONS[cat.id] || ForkKnife;
          const isActive = activeId === cat.id;
          return (
            <motion.button
              key={cat.id}
              data-cat={cat.id}
              className={`${styles.pill} ${isActive ? styles.active : ''}`}
              onClick={() => onSelect(cat.id)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              whileTap={{ scale: 0.93 }}
              aria-label={cat.name}
              aria-pressed={isActive}
            >
              <Icon
                size={15}
                weight={isActive ? 'fill' : 'regular'}
                className={styles.icon}
              />
              <span className={styles.label}>{cat.name}</span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
