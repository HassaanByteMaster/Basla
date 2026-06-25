import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CONFIG } from '../config';
import styles from './CartDrawer.module.css';

const overlay = { hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 } };
const sheet   = { hidden: { y: '100%' }, visible: { y: 0, transition: { type: 'spring', stiffness: 380, damping: 38 } }, exit: { y: '100%', transition: { duration: 0.28, ease: [0.7, 0, 1, 0.6] } } };

export default function CartDrawer({ isOpen, onClose, cart, onRemove, onIncrement, onClear, onOrder, tableNumber }) {
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const { items, total, isEmpty } = cart;

  async function handleOrder() {
    if (isEmpty) return;
    setLoading(true);
    await onOrder(notes);
    setNotes('');
    setLoading(false);
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className={styles.overlay} variants={overlay} initial="hidden" animate="visible" exit="exit">
          {/* Backdrop */}
          <div className={styles.backdrop} onClick={onClose} />

          {/* Drawer */}
          <motion.div className={styles.drawer} variants={sheet} initial="hidden" animate="visible" exit="exit">
            {/* Handle */}
            <div className={styles.handle} />

            {/* Header */}
            <div className={styles.header}>
              <button className={styles.closeBtn} onClick={onClose} aria-label="إغلاق">✕</button>
              <h2 className={styles.title}>طلبك 🛒</h2>
              {!isEmpty && (
                <button className={styles.clearBtn} onClick={onClear}>تفريغ</button>
              )}
            </div>

            {/* Table */}
            <div className={styles.tableInfo}>
              <span className={styles.tableLabel}>طاولة</span>
              <span className={styles.tableNum}>{tableNumber}</span>
            </div>

            {/* Items */}
            <div className={styles.body}>
              {isEmpty ? (
                <div className={styles.empty}>
                  <span className={styles.emptyIcon}>🛒</span>
                  <p>السلة فاضية<br /><span>ابدأ بإضافة أصنافك</span></p>
                </div>
              ) : (
                <div className={styles.itemsList}>
                  <AnimatePresence>
                    {items.map(item => (
                      <motion.div
                        key={item.cartId}
                        className={styles.row}
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30, height: 0, marginBottom: 0, padding: 0 }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        layout
                      >
                        <div className={styles.rowInfo}>
                          <span className={styles.rowName}>{item.name}</span>
                          {item.variant && <span className={styles.rowVariant}>{item.variant}</span>}
                        </div>
                        <div className={styles.rowRight}>
                          <span className={styles.rowPrice}>{item.price * item.qty} {CONFIG.brand.symbol}</span>
                          <div className={styles.qtyControls}>
                            <button className={styles.qtyBtn} onClick={() => onRemove(item.cartId)}>−</button>
                            <span className={styles.qty}>{item.qty}</span>
                            <button className={styles.qtyBtn} onClick={() => onIncrement(item.cartId)}>+</button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer */}
            {!isEmpty && (
              <div className={styles.footer}>
                {/* Notes */}
                <div className={styles.notesWrap}>
                  <label className={styles.notesLabel} htmlFor="cart-notes">ملاحظات (اختياري)</label>
                  <textarea
                    id="cart-notes"
                    className={styles.notes}
                    placeholder="مثال: بدون تقلية، شطة على الجانب..."
                    rows={2}
                    maxLength={300}
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                  />
                </div>

                {/* Total */}
                <div className={styles.totalRow}>
                  <span className={styles.totalLabel}>الإجمالي</span>
                  <motion.span
                    key={total}
                    className={styles.totalAmount}
                    initial={{ scale: 1.2, color: '#FFB347' }}
                    animate={{ scale: 1, color: '#F5F5F5' }}
                    transition={{ duration: 0.3 }}
                  >
                    {total} {CONFIG.brand.symbol}
                  </motion.span>
                </div>

                {/* Order Button */}
                <button className={styles.orderBtn} onClick={handleOrder} disabled={loading}>
                  {loading ? '⏳ جاري الإرسال...' : '🚀 تأكيد الطلب والإرسال للمطبخ'}
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
