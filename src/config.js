// ═══════════════════════════════════════════════
// config.js — Brand & Menu Configuration
// (Only file that changes per client)
// ═══════════════════════════════════════════════

export const CONFIG = {
  brand: {
    name:         'كشري بصلة',
    nameEn:       'Basla Egypt',
    tagline:      'كشري بصلة.... لأنك تستحق',
    logo:         '/assets/logo.png',
    primaryColor: '#FF8C00',
    currency:     'EGP',
    symbol:       'ج.م',
  },

  contact: {
    hotline:  '17752',
    phones:   ['01044922068', '01107559113'],
    whatsapp: '01201722229',
  },

  sheets: {
    apiUrl:   'YOUR_GOOGLE_APPS_SCRIPT_URL',
    demoMode: true,
  },

  menu: [
    {
      id: 'kushary', name: 'الكشري', icon: '🍚', color: '#FF8C00',
      items: [
        { id: 'k1', name: 'علبة صغيرة',  price: 15, image: '' },
        { id: 'k2', name: 'علبة لارج',   price: 20, image: '' },
        { id: 'k3', name: 'علبة بصلة',   price: 25, image: '/assets/612642503_122117054175050215_8087091541401401746_n.jpg' },
        { id: 'k4', name: 'علبة جامبو',  price: 30, image: '' },
        { id: 'k5', name: 'علبة عائلي',  price: 40, image: '' },
        { id: 'k6', name: 'جامبو عائلي', price: 50, image: '' },
      ],
    },
    {
      id: 'tawagen', name: 'طواجن بصلة', icon: '🍲', color: '#E05A00',
      items: [
        { id: 't1', name: 'طاجن لحمة',           price: 35, image: '' },
        { id: 't2', name: 'طاجن فراخ',           price: 45, image: '' },
        { id: 't3', name: 'طاجن لحمة موتزاريلا', price: 55, image: '/assets/614479363_122117054187050215_8479260815665926954_n.jpg' },
        { id: 't4', name: 'طاجن فراخ موتزاريلا', price: 65, image: '' },
        { id: 't5', name: 'ميكس طاجن لحمة',      price: 55, image: '' },
        { id: 't6', name: 'ميكس طاجن فراخ',      price: 65, image: '' },
      ],
    },
    {
      id: 'crepe-chicken', name: 'كريب فراخ', icon: '🥙', color: '#D4600A',
      items: [
        { id: 'cc1', name: 'كريب بانيه',       variants: [{ name: 'صغير', price: 50 }, { name: 'كبير', price: 70 }] },
        { id: 'cc2', name: 'كريب كرانشي',      variants: [{ name: 'صغير', price: 60 }, { name: 'كبير', price: 80 }] },
        { id: 'cc3', name: 'كريب شيش',         variants: [{ name: 'صغير', price: 60 }, { name: 'كبير', price: 80 }] },
        { id: 'cc4', name: 'كريب استربس',      variants: [{ name: 'صغير', price: 60 }, { name: 'كبير', price: 80 }] },
        { id: 'cc5', name: 'كريب شاورما فراخ', variants: [{ name: 'صغير', price: 70 }, { name: 'كبير', price: 90 }] },
        { id: 'cc6', name: 'كريب ميكس فراخ',   variants: [{ name: 'صغير', price: 70 }, { name: 'كبير', price: 90 }] },
        { id: 'cc7', name: 'كريب فاهيتا',      variants: [{ name: 'صغير', price: 60 }, { name: 'كبير', price: 80 }] },
        { id: 'cc8', name: 'كريب بصلة جامبو',  price: 90 },
      ],
    },
    {
      id: 'crepe-meat', name: 'كريب لحوم', icon: '🌯', color: '#C05500',
      items: [
        { id: 'cm1',  name: 'كريب برجر',      variants: [{ name: 'صغير', price: 50 }, { name: 'كبير', price: 70 }] },
        { id: 'cm2',  name: 'كريب كفتة',      variants: [{ name: 'صغير', price: 45 }, { name: 'كبير', price: 65 }] },
        { id: 'cm3',  name: 'كريب سوسيس',     variants: [{ name: 'صغير', price: 45 }, { name: 'كبير', price: 65 }] },
        { id: 'cm4',  name: 'كريب مشكل لحوم', variants: [{ name: 'صغير', price: 60 }, { name: 'كبير', price: 80 }] },
        { id: 'cm5',  name: 'كريب سوبريم',    variants: [{ name: 'صغير', price: 60 }, { name: 'كبير', price: 80 }] },
        { id: 'cm6',  name: 'كريب سجق',       variants: [{ name: 'صغير', price: 50 }, { name: 'كبير', price: 70 }] },
        { id: 'cm7',  name: 'كريب ميلانو',    variants: [{ name: 'صغير', price: 60 }, { name: 'كبير', price: 80 }] },
        { id: 'cm8',  name: 'كريب بطاطس',     variants: [{ name: 'صغير', price: 40 }, { name: 'كبير', price: 50 }] },
        { id: 'cm9',  name: 'كريب رومي',      variants: [{ name: 'صغير', price: 40 }, { name: 'كبير', price: 50 }] },
        { id: 'cm10', name: 'كريب شيدر',      variants: [{ name: 'صغير', price: 40 }, { name: 'كبير', price: 50 }] },
        { id: 'cm11', name: 'كريب مشكل جبن',  variants: [{ name: 'صغير', price: 40 }, { name: 'كبير', price: 50 }] },
        { id: 'cm12', name: 'كريب جبن وخضار', variants: [{ name: 'صغير', price: 40 }, { name: 'كبير', price: 50 }] },
      ],
    },
    {
      id: 'crepe-sweet', name: 'كريب حلو', icon: '🍫', color: '#7B3F00',
      items: [
        { id: 'cs1', name: 'كريب نوتيلا',  price: 40 },
        { id: 'cs2', name: 'كريب مكسرات', price: 35 },
        { id: 'cs3', name: 'كريب موز',    price: 35 },
      ],
    },
    {
      id: 'chicken', name: 'قسم الفراخ', icon: '🍗', color: '#B85C00',
      items: [
        { id: 'ch1', name: 'فرخة شواية',         price: 300 },
        { id: 'ch2', name: '½ فرخة شواية',        price: 160 },
        { id: 'ch3', name: '¼ فرخة شواية صدر',    price: 90  },
        { id: 'ch4', name: '¼ فرخة شواية ورك',    price: 80  },
        { id: 'ch5', name: 'وجبة دبل وراك مشوية', price: 210 },
        { id: 'ch6', name: 'فرخة شواية سادة',     price: 275 },
        { id: 'ch7', name: '½ فرخة شواية سادة',   price: 140 },
      ],
    },
    {
      id: 'shawarma', name: 'قسم الشاورما', icon: '🌮', color: '#A84E00',
      items: [
        { id: 'sh1',  name: 'شاورما فراخ',            variants: [{ name: 'صغير', price: 50 }, { name: 'كبير', price: 70 }] },
        { id: 'sh2',  name: 'وجبة شاورما عربي',       price: 80  },
        { id: 'sh3',  name: 'وجبة شاورما عربي دوبل',  price: 150 },
        { id: 'sh4',  name: 'وجبة شاورما اكسترا',     price: 100 },
        { id: 'sh5',  name: 'فتة شاورما وسط',         variants: [{ name: 'صغير', price: 75 },  { name: 'كبير', price: 100 }] },
        { id: 'sh6',  name: 'فتة كريسبي',             variants: [{ name: 'صغير', price: 80 },  { name: 'كبير', price: 95 }] },
        { id: 'sh7',  name: 'وجبة شيش طاووق',         variants: [{ name: 'صغير', price: 90 },  { name: 'كبير', price: 110 }] },
        { id: 'sh8',  name: 'وجبة بانية فرش',         variants: [{ name: 'صغير', price: 80 },  { name: 'كبير', price: 95 }] },
        { id: 'sh9',  name: 'وجبة كرسبي فرش',         variants: [{ name: 'صغير', price: 90 },  { name: 'كبير', price: 110 }] },
        { id: 'sh10', name: 'وجبة شاورما عائلية',     price: 260 },
      ],
    },
    {
      id: 'syrian', name: 'قسم السوري', icon: '🥔', color: '#9A4500',
      items: [
        { id: 'sy1',  name: 'بطاطس سوري',      variants: [{ name: 'صغير', price: 15 }, { name: 'وسط', price: 20 }, { name: 'كبير', price: 25 }] },
        { id: 'sy2',  name: 'بطاطس جبنة',      variants: [{ name: 'صغير', price: 20 }, { name: 'كبير', price: 30 }] },
        { id: 'sy3',  name: 'بانية على بطاطس', variants: [{ name: 'صغير', price: 20 }, { name: 'كبير', price: 30 }] },
        { id: 'sy4',  name: 'بانية فريش',      variants: [{ name: 'صغير', price: 40 }, { name: 'كبير', price: 55 }] },
        { id: 'sy5',  name: 'كرسبي فريش',      variants: [{ name: 'صغير', price: 50 }, { name: 'كبير', price: 65 }] },
        { id: 'sy6',  name: 'زنجر',            variants: [{ name: 'صغير', price: 45 }, { name: 'كبير', price: 55 }] },
        { id: 'sy7',  name: 'شيش طاووك',       variants: [{ name: 'صغير', price: 50 }, { name: 'كبير', price: 70 }] },
        { id: 'sy8',  name: 'هوت دوج',         variants: [{ name: 'صغير', price: 25 }, { name: 'كبير', price: 35 }] },
        { id: 'sy9',  name: 'برجر',            variants: [{ name: 'صغير', price: 35 }, { name: 'كبير', price: 45 }] },
        { id: 'sy10', name: 'فاهيتا',          variants: [{ name: 'صغير', price: 55 }, { name: 'كبير', price: 70 }] },
      ],
    },
    {
      id: 'sweets', name: 'حلو بصلة', icon: '🍮', color: '#8B4513',
      items: [
        { id: 'sw1',  name: 'أرز باللبن ساده',      price: 15 },
        { id: 'sw2',  name: 'أرز باللبن ساده كبير', price: 20 },
        { id: 'sw3',  name: 'أرز باللبن مكسرات',    price: 25 },
        { id: 'sw4',  name: 'أرز باللبن بسبوسه',    price: 25 },
        { id: 'sw5',  name: 'أرز باللبن باللوتس',   price: 25 },
        { id: 'sw6',  name: 'أرز باللبن فرن',       price: 20 },
        { id: 'sw7',  name: 'كريم كراميل',          price: 25 },
        { id: 'sw8',  name: 'جليلى ساده',           price: 20 },
        { id: 'sw9',  name: 'مهلبية',              price: 20 },
        { id: 'sw10', name: 'مهلبية فرن',          price: 25 },
      ],
    },
    {
      id: 'extras', name: 'إضافات بصلة', icon: '➕', color: '#6B3A00',
      items: [
        { id: 'ex1',  name: 'إضافة بطاطس',           variants: [{ name: 'صغير', price: 20 }, { name: 'كبير', price: 30 }] },
        { id: 'ex2',  name: 'إضافة موتزاريلا',        variants: [{ name: 'صغير', price: 15 }, { name: 'كبير', price: 25 }] },
        { id: 'ex3',  name: 'تقلية - عدس - حمص',     price: 8  },
        { id: 'ex4',  name: 'سلطة خيار + توست',      price: 8  },
        { id: 'ex5',  name: 'طماطم متبلة + شطة زيت', price: 6  },
        { id: 'ex6',  name: 'موتزاريلا اكسترا',      price: 25 },
        { id: 'ex7',  name: 'أرز بسمتي',            variants: [{ name: 'صغير', price: 20 }, { name: 'كبير', price: 30 }] },
        { id: 'ex8',  name: 'تومية',                price: 10 },
        { id: 'ex9',  name: 'مخلل',                 price: 10 },
        { id: 'ex10', name: 'معمره',                price: 15 },
        { id: 'ex11', name: 'عيش سوري',             price: 5  },
      ],
    },
    {
      id: 'offers', name: 'وجبات التوفير', icon: '🎁', color: '#CC2200',
      items: [
        { id: 'of1', name: 'وجبة كشري كاملة',      description: 'علبة كشري + عيش + سلطة + حلو',          price: 40, originalPrice: 50  },
        { id: 'of2', name: 'وجبة طاجن لحمة كاملة', description: 'طاجن لحمة + عيش + سلطة + حلو + كانز',   price: 75, originalPrice: 85  },
        { id: 'of3', name: 'وجبة طاجن فراخ كاملة', description: 'طاجن فراخ + عيش + سلطة + حلو + كانز',   price: 95, originalPrice: 105 },
        { id: 'of4', name: 'كومبو طاجن لحمة',      description: 'طاجن لحمة + كانز + باكيت بطاطس',        price: 60, originalPrice: 70  },
        { id: 'of5', name: 'كومبو طاجن فراخ',      description: 'طاجن فراخ + كانز + باكيت بطاطس',        price: 75, originalPrice: 85  },
      ],
    },
  ],
};
