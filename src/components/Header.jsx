import { motion } from 'framer-motion';
import { Phone } from '@phosphor-icons/react';
import { CONFIG } from '../config';
import styles from './Header.module.css';

/* Onion SVG logo — accurate to brand */
function OnionLogo({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      {/* Outer ring */}
      <circle cx="50" cy="50" r="46" fill="#0D0D0D" stroke="#F5922A" strokeWidth="3"/>

      {/* Right half — orange */}
      <path d="M50 4 A46 46 0 0 1 50 96 Z" fill="#F5922A"/>

      {/* Onion body — right orange half layers */}
      <path d="M50 12 Q75 30 75 50 Q75 70 50 88" stroke="rgba(0,0,0,0.15)" strokeWidth="4" fill="none" strokeLinecap="round"/>
      <path d="M50 18 Q68 32 68 50 Q68 68 50 82" stroke="rgba(0,0,0,0.1)" strokeWidth="3" fill="none" strokeLinecap="round"/>

      {/* Left half — dark with orange arcs */}
      <path d="M50 4 A46 46 0 0 0 50 96 Z" fill="#141414"/>
      <path d="M50 16 Q30 30 30 50 Q30 70 50 84" stroke="#F5922A" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.7"/>
      <path d="M50 24 Q36 35 36 50 Q36 65 50 76" stroke="#F5922A" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.45"/>

      {/* Dividing line */}
      <line x1="50" y1="4" x2="50" y2="96" stroke="rgba(255,255,255,0.12)" strokeWidth="1"/>

      {/* Top stem */}
      <path d="M46 10 Q50 2 54 10" stroke="#22C55E" strokeWidth="3" strokeLinecap="round" fill="none"/>

      {/* Shine dot */}
      <circle cx="62" cy="32" r="4" fill="rgba(255,255,255,0.2)"/>

      {/* Outer glow ring */}
      <circle cx="50" cy="50" r="46" stroke="#F5922A" strokeWidth="1" opacity="0.3"/>
    </svg>
  );
}

export default function Header({ tableNumber }) {
  return (
    <motion.header
      className={styles.header}
      initial={{ y: -90, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Shimmer sweep on header */}
      <div className={styles.headerShimmer} aria-hidden />

      <div className={styles.inner}>

        {/* Brand */}
        <div className={styles.brand}>
          <motion.div
            className={styles.logoWrap}
            whileHover={{ scale: 1.08, rotate: -5 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          >
            <img
              src={CONFIG.brand.logo}
              alt={CONFIG.brand.name}
              className={styles.logoImg}
              onError={e => { e.target.style.display = 'none'; }}
            />
            <OnionLogo size={50} />
          </motion.div>

          <div className={styles.brandText}>
            <div className={styles.brandName}>
              <span className={styles.bw}>كشري </span>
              <span className={styles.bo}>بصلة</span>
            </div>
            <p className={styles.tagline}>{CONFIG.brand.tagline}</p>
            <div className={styles.hotline}>
              <Phone size={10} weight="fill" />
              <span>{CONFIG.contact.hotline}</span>
            </div>
          </div>
        </div>

        {/* Table Badge */}
        <motion.div
          className={styles.tableBadge}
          initial={{ scale: 0, rotate: 10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 420, damping: 20 }}
        >
          {/* Pulse ring */}
          <div className={styles.pulseRing} />
          {tableNumber ? (
            <>
              <span className={styles.tableLabel}>طاولة</span>
              <span className={styles.tableNum}>{tableNumber}</span>
            </>
          ) : (
            <span className={styles.tableLabel} style={{ fontSize: '0.85rem', fontWeight: 900, color: '#000', padding: '6px 0', display: 'block' }}>منيو عام</span>
          )}
        </motion.div>

      </div>

      {/* Orange bottom glow line */}
      <div className={styles.glowLine} />
    </motion.header>
  );
}
