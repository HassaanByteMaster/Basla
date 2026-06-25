import { motion, AnimatePresence } from 'framer-motion';
import { CONFIG } from '../config';
import styles from './CartBar.module.css';

export default function CartBar({ count, total, onOpen }) {
  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.div
          className={styles.bar}
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 420, damping: 36 }}
        >
          <div className={styles.countWrap}>
            <motion.span
              className={styles.countBadge}
              key={count}
              initial={{ scale: 1.5 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 18 }}
            >
              {count}
            </motion.span>
            <span className={styles.countLabel}>
              {count === 1 ? 'صنف في السلة' : 'أصناف في السلة'}
            </span>
          </div>

          <button className={styles.cta} onClick={onOpen}>
            <span className={styles.ctaTotal}>
              {total} {CONFIG.brand.symbol}
            </span>
            <span className={styles.ctaArrow}>عرض الطلب ←</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
