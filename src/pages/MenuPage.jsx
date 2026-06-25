import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';

import { CONFIG } from '../config';
import { useCart } from '../hooks/useCart';

import Header      from '../components/Header';
import CategoryNav from '../components/CategoryNav';
import ItemRow     from '../components/ItemRow';
import CartBar     from '../components/CartBar';
import CartDrawer  from '../components/CartDrawer';
import SizeModal   from '../components/SizeModal';

import styles from './MenuPage.module.css';

export default function MenuPage() {
  const [params]     = useSearchParams();
  const tableNumber  = params.get('table');
  const isReadOnly   = !tableNumber;

  const cart                       = useCart();
  const [cartOpen, setCartOpen]    = useState(false);
  const [sizeItem, setSizeItem]    = useState(null);
  
  const [menu, setMenu]            = useState(CONFIG.menu);
  const [loading, setLoading]      = useState(false);
  const [activeCat, setActiveCat]  = useState(CONFIG.menu[0]?.id || '');

  const sectionRefs  = useRef({});
  const scrollingTo  = useRef(false);

  useEffect(() => {
    if (CONFIG.sheets.demoMode) {
      setMenu(CONFIG.menu);
      return;
    }

    setLoading(true);
    fetch(CONFIG.sheets.apiUrl)
      .then(res => {
        if (!res.ok) throw new Error('فشل تحميل المنيو من السيرفر');
        return res.json();
      })
      .then(data => {
        if (data && data.categories) {
          setMenu(data.categories);
        } else if (data && data.error) {
          throw new Error(data.error);
        } else {
          throw new Error('بيانات المنيو غير صالحة');
        }
      })
      .catch(err => {
        console.error(err);
        toast.error(err.message || 'حدث خطأ في تحميل المنيو', {
          style: { direction: 'rtl', fontFamily: 'Cairo, sans-serif' }
        });
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (menu.length > 0 && !activeCat) {
      setActiveCat(menu[0].id);
    }
  }, [menu, activeCat]);

  useEffect(() => {
    const obs = [];
    menu.forEach(cat => {
      const el = sectionRefs.current[cat.id];
      if (!el) return;
      const o = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting && !scrollingTo.current) setActiveCat(cat.id); },
        { rootMargin: '-35% 0px -55% 0px' }
      );
      o.observe(el);
      obs.push(o);
    });
    return () => obs.forEach(o => o.disconnect());
  }, [menu]);

  function scrollToCategory(id) {
    scrollingTo.current = true;
    setActiveCat(id);
    sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => { scrollingTo.current = false; }, 900);
  }

  function handleItemAdd(item, cat, needsSize) {
    if (needsSize) {
      setSizeItem({ item, cat });
    } else {
      cart.addItem({ itemId: item.id, name: item.name, variant: null, price: item.price });
      toast.success(`تمت الإضافة ✓`, {
        duration: 1400,
        style: { direction: 'rtl', fontFamily: 'Cairo, sans-serif', fontSize: '0.9rem' }
      });
    }
  }

  function handleVariantSelect(item, variant) {
    cart.addItem({
      itemId: `${item.id}_${variant.name}`,
      name: item.name,
      variant: variant.name,
      price: variant.price,
    });
    setSizeItem(null);
    toast.success(`${item.name} — ${variant.name} ✓`, {
      duration: 1500,
      style: { direction: 'rtl', fontFamily: 'Cairo, sans-serif' }
    });
  }

  async function handleOrder(notes) {
    if (isReadOnly) return;
    const payload = { table: tableNumber || 'عام', items: cart.items, total: cart.total, notes };
    try {
      if (!CONFIG.sheets.demoMode) {
        const res  = await fetch(CONFIG.sheets.apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'submitOrder', ...payload }),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.error || 'فشل إرسال الطلب');
      }
      cart.clearCart();
      setCartOpen(false);
      toast.success('🎉 تم إرسال طلبك للمطبخ بنجاح!', {
        duration: 4000,
        style: { direction: 'rtl', fontFamily: 'Cairo, sans-serif', fontSize: '1rem', padding: '14px 18px' },
      });
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'حدث خطأ، حاول مرة أخرى', {
        style: { direction: 'rtl', fontFamily: 'Cairo, sans-serif' }
      });
    }
  }

  if (loading) {
    return (
      <div className={styles.loadingPage}>
        <div className={styles.spinner} />
        <p className={styles.loadingText}>جاري تحميل منيو بصلة مصر...</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Header tableNumber={tableNumber} />
      <CategoryNav categories={menu} activeId={activeCat} onSelect={scrollToCategory} />

      <main className={styles.main}>
        {menu.map(cat => (
          <section
            key={cat.id}
            id={`cat-${cat.id}`}
            ref={el => sectionRefs.current[cat.id] = el}
            className={styles.section}
          >
            {/* Category Header */}
            <motion.div
              className={styles.catHeader}
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-15%' }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className={styles.catTitleWrap}>
                <span className={styles.catIcon}>{cat.icon}</span>
                <h2 className={styles.catName}>{cat.name}</h2>
              </div>
              <div className={styles.catLine} />
              <motion.span
                className={styles.catCount}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 400 }}
              >
                {cat.items.length}
              </motion.span>
            </motion.div>

            {/* Items Block */}
            <div className={styles.itemsBlock}>
              {cat.items.map((item, i) => (
                <ItemRow
                  key={item.id}
                  item={item}
                  cat={cat}
                  delay={i * 0.04}
                  onAdd={handleItemAdd}
                  isReadOnly={isReadOnly}
                />
              ))}
            </div>
          </section>
        ))}

        <div style={{ height: isReadOnly || cart.isEmpty ? 24 : 84 }} />
      </main>

      {!isReadOnly && (
        <>
          <CartBar count={cart.count} total={cart.total} onOpen={() => setCartOpen(true)} />
          <CartDrawer
            isOpen={cartOpen}
            onClose={() => setCartOpen(false)}
            cart={cart}
            onRemove={cart.removeItem}
            onIncrement={cart.incrementItem}
            onClear={cart.clearCart}
            onOrder={handleOrder}
            tableNumber={tableNumber}
          />
        </>
      )}

      <SizeModal
        item={sizeItem?.item}
        cat={sizeItem?.cat}
        isOpen={!!sizeItem}
        onClose={() => setSizeItem(null)}
        onSelect={handleVariantSelect}
      />
    </div>
  );
}
