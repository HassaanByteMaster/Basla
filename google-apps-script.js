/**
 * ═══════════════════════════════════════════════════════════
 *  🧅  بصلة مصر — نظام المنيو الرقمي السحابي  v3.1 Premium
 * ═══════════════════════════════════════════════════════════
 */

var SH = {
  MENU:      '🍽️ المنيو',
  ORDERS:    '📦 الطلبات',
  DASHBOARD: '🏠 لوحة التحكم',
};

var CLR = {
  BRAND:     '#F5890A',  BRAND2:   '#C96D00',  BRAND_BG: '#FFF7ED', BRAND_BR: '#FED7AA',
  DARK:      '#0F172A',  SLATE:    '#1E293B',   MID:      '#334155', MUTED:    '#64748B',
  WHITE:     '#FFFFFF',  OFF:      '#F8FAFC',   BORDER:   '#E2E8F0',
  GREEN:     '#15803D',  GREEN_BG: '#DCFCE7',   GREEN_BR: '#86EFAC',
  AMBER:     '#92400E',  AMBER_BG: '#FEF3C7',   AMBER_BR: '#FDE68A',
  RED:       '#991B1B',  RED_BG:   '#FEE2E2',   RED_BR:   '#FECACA',
  BLUE:      '#1E40AF',  BLUE_BG:  '#DBEAFE',   BLUE_BR:  '#BFDBFE',
  VIOLET:    '#6D28D9',  VIOL_BG:  '#EDE9FE',   VIOL_BR:  '#C4B5FD',
  VAR_BG:    '#F0FDF4',
};

var CAT_MAP = {
  'الكشري':        { id: 'koshary',       icon: 'bowl-food',   color: '#F5890A' },
  'طواجن بصلة':    { id: 'tajeen',        icon: 'cooking-pot', color: '#E88030' },
  'حلو بصلة':      { id: 'sweets',        icon: 'cake',        color: '#E8A020' },
  'إضافات بصلة':   { id: 'extras',        icon: 'plus',        color: '#6699AA' },
  'كريب فراخ':     { id: 'crepe-chicken', icon: 'fork-knife',  color: '#E09030' },
  'كريب لحوم':     { id: 'crepe-meat',    icon: 'fork-knife',  color: '#D07020' },
  'كريب حلو':      { id: 'crepe-sweet',   icon: 'cookie',      color: '#C06020' },
  'قسم الشاورما':  { id: 'shawarma',      icon: 'hamburger',   color: '#D04010' },
  'قسم الفراخ':    { id: 'chicken',       icon: 'fire',        color: '#E05020' },
  'قسم السوري':    { id: 'syrian',        icon: 'star',        color: '#CC5500' },
  'وجبات التوفير': { id: 'combos',        icon: 'gift',        color: '#EE2200' },
};

var STATUSES = ['جديد 🔴', 'قيد التحضير 🟡', 'جاهز للتسليم 🟢', 'تم التسليم ✅', 'ملغي ❌'];

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('🧅 بصلة مصر')
    .addItem('🗑️ حذف الصف المحدد', 'deleteSelectedRow')
    .addToUi();
}

function deleteSelectedRow() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var sheetName = sheet.getName();
  
  if (sheetName !== SH.MENU && sheetName !== SH.ORDERS) {
    SpreadsheetApp.getUi().alert('⚠️ يرجى اختيار صف في شيت المنيو أو شيت الطلبات لحذفه.');
    return;
  }
  
  var activeCell = sheet.getActiveCell();
  var row = activeCell.getRow();
  
  if (row < 4) {
    SpreadsheetApp.getUi().alert('⚠️ لا يمكن حذف صفوف الترويسة أو التعليمات.');
    return;
  }
  
  var confirm = SpreadsheetApp.getUi().alert(
    '❓ تأكيد الحذف',
    'هل أنت متأكد من حذف الصف رقم ' + row + '؟ سيتم إزالة هذا الصنف أو الطلب نهائياً ولا يمكن التراجع.',
    SpreadsheetApp.getUi().ButtonSet.YES_NO
  );
  
  if (confirm === SpreadsheetApp.getUi().Button.YES) {
    sheet.deleteRow(row);
  }
}

function setupDatabase() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  _buildMenuSheet(ss);
  _buildOrdersSheet(ss);
  _buildDashboardSheet(ss);

  var order = [SH.DASHBOARD, SH.MENU, SH.ORDERS];
  order.forEach(function(name, i) {
    var sh = ss.getSheetByName(name);
    if (sh) { ss.setActiveSheet(sh); ss.moveActiveSheet(i + 1); }
  });

  ss.setActiveSheet(ss.getSheetByName(SH.DASHBOARD));

  try {
    SpreadsheetApp.getUi().alert(
      '✅  تم إعداد قاعدة البيانات بنجاح!\n\n' +
      '📌  الخطوة التالية:\n' +
      'Deploy > New Deployment > Web App\n' +
      'ثم انسخ الـ URL وضعه في src/config.js'
    );
  } catch (e) {
    Logger.log(
      '✅  تم إعداد قاعدة البيانات بنجاح!\n\n' +
      '📌  الخطوة التالية:\n' +
      'Deploy > New Deployment > Web App\n' +
      'ثم انسخ الـ URL وضعه في src/config.js'
    );
  }
}

function _buildMenuSheet(ss) {
  var sh = _getOrCreate(ss, SH.MENU);
  sh.clear();
  sh.getRange('A1:M1000').clearDataValidations();
  sh.clearConditionalFormatRules();
  sh.setHiddenGridlines(false);
  sh.getRange('A1:M1000').setFontFamily('Cairo');

  var NUM_COLS = 13;

  sh.getRange('A1:M1').merge()
    .setValue('🍽️   منيو بصلة مصر  —  أضف أصنافك هنا بسهولة')
    .setBackground(CLR.BRAND).setFontColor('#000').setFontWeight('bold').setFontSize(15)
    .setHorizontalAlignment('center').setVerticalAlignment('middle');
  sh.setRowHeight(1, 52);

  sh.getRange('A2:M2').merge()
    .setValue(
      '📌  كيفية الإضافة: اختر اسم القسم من القايمة ← اكتب اسم الصنف ← اكتب السعر' +
      '   |   🎯  الأحجام اختيارية: لو الصنف بيجي بحجم واحد اتركها فارغة' +
      '   |   📸 الصورة: اكتب اسم الملف (مثال: koshary.png) أو رابطاً كاملاً'
    )
    .setBackground('#1E3A5F').setFontColor('#93C5FD').setFontSize(8.5).setFontWeight('bold')
    .setHorizontalAlignment('center').setVerticalAlignment('middle');
  sh.setRowHeight(2, 30);

  var headers = [
    'اسم القسم',
    'اسم الصنف',
    'السعر\nج.م',
    'حجم ١\n(اختياري)',
    'سعره\nج.م',
    'حجم ٢\n(اختياري)',
    'سعره\nج.م',
    'حجم ٣\n(اختياري)',
    'سعره\nج.م',
    'خصم\n%',
    'الوصف\n(اختياري)',
    'متوفر',
    'الصورة\n(اختياري)',
  ];

  sh.setRowHeight(3, 44);
  var hdrRange = sh.getRange(3, 1, 1, headers.length);
  hdrRange.setValues([headers])
    .setFontWeight('bold').setFontSize(9).setFontFamily('Cairo')
    .setHorizontalAlignment('center').setVerticalAlignment('middle').setWrap(true);

  sh.getRange(3, 1, 1, 1).setBackground(CLR.SLATE).setFontColor(CLR.WHITE);
  sh.getRange(3, 2, 1, 1).setBackground(CLR.SLATE).setFontColor(CLR.WHITE);
  sh.getRange(3, 3, 1, 1).setBackground(CLR.BRAND).setFontColor('#000');
  sh.getRange(3, 4, 1, 6).setBackground('#14532D').setFontColor('#BBFBBB');
  sh.getRange(3, 10, 1, 1).setBackground(CLR.VIOLET).setFontColor(CLR.WHITE);
  sh.getRange(3, 11, 1, 1).setBackground(CLR.MID).setFontColor(CLR.WHITE);
  sh.getRange(3, 12, 1, 1).setBackground(CLR.SLATE).setFontColor(CLR.WHITE);
  sh.getRange(3, 13, 1, 1).setBackground(CLR.MID).setFontColor(CLR.WHITE);

  var demo = [
    ['الكشري','علبة صغيرة',15,'','','','','','','','كشري المصري الأصيل','✓ متوفر',''],
    ['الكشري','علبة لارج',20,'','','','','','','','علبة كبيرة غنية بالعدس والتقلية','✓ متوفر',''],
    ['الكشري','علبة بصلة',25,'','','','','','','','علبة بصلة بخلطتنا السحرية','✓ متوفر',''],
    ['الكشري','علبة جامبو',30,'','','','','','','','وجبة جامبو مشبعة مع الصلصة الحارة','✓ متوفر',''],
    ['الكشري','علبة عائلي',40,'','','','','','','','علبة كشري عائلية للمشاركة','✓ متوفر',''],
    ['الكشري','جامبو عائلي',50,'','','','','','','','أكبر حجم للعيلة الكبيرة','✓ متوفر',''],

    ['طواجن بصلة','طاجن لحمة',35,'','','','','','','','طاجن مكرونة باللحمة الطازجة في الفرن','✓ متوفر',''],
    ['طواجن بصلة','طاجن فراخ',45,'','','','','','','','طاجن مكرونة بقطع الفراخ المتبلة','✓ متوفر',''],
    ['طواجن بصلة','طاجن لحمة موتزاريلا',55,'','','','','','','','طاجن لحمة مع طبقة غنية من الموتزاريلا','✓ متوفر',''],
    ['طواجن بصلة','طاجن فراخ موتزاريلا',65,'','','','','','','','طاجن فراخ مع الموتزاريلا اللي يسيّل الجنب','✓ متوفر',''],
    ['طواجن بصلة','ميكس طاجن لحمة',55,'','','','','','','','ميكس المكرونة واللحمة بتوليفة الشيف','✓ متوفر',''],
    ['طواجن بصلة','ميكس طاجن فراخ',65,'','','','','','','','ميكس الفراخ مع مكرونة الفرن','✓ متوفر',''],

    ['حلو بصلة','أرز باللبن ساده',15,'','','','','','','','كريمي بيتي محضر يومياً','✓ متوفر',''],
    ['حلو بصلة','أرز باللبن ساده كبير',20,'','','','','','','','حجم كبير من أرز اللبن الكريمي','✓ متوفر',''],
    ['حلو بصلة','أرز باللبن مكسرات',25,'','','','','','','','أرز اللبن مع تشكيلة مكسرات مقرمشة','✓ متوفر',''],
    ['حلو بصلة','أرز باللبن بسبوسه',25,'','','','','','','','توليفة البسبوسة مع أرز اللبن','✓ متوفر',''],
    ['حلو بصلة','أرز باللبن باللوتس',25,'','','','','','','','لمسة فاخرة — لوتس فوق الكريمة','✓ متوفر',''],
    ['حلو بصلة','أرز باللبن فرن',20,'','','','','','','','محمر بالفرن بطريقة تراثية','✓ متوفر',''],
    ['حلو بصلة','كريم كراميل',25,'','','','','','','','ناعم بصلصة الكراميل الذهبية','✓ متوفر',''],
    ['حلو بصلة','مهلبية',20,'','','','','','','','مهلبية كريمية بتاعت بصلة','✓ متوفر',''],
    ['حلو بصلة','مهلبية فرن',25,'','','','','','','','مهلبية محمرة بالفرن على الطريقة التقليدية','✓ متوفر',''],

    ['إضافات بصلة','تقلية / عدس / حمص',8,'','','','','','','','إضافة من التقلية أو العدس أو الحمص','✓ متوفر',''],
    ['إضافات بصلة','طماطم متبلة + شطة زيت',6,'','','','','','','','طماطم بالثوم والخل مع زيت الشطة الحار','✓ متوفر',''],
    ['إضافات بصلة','سلطة خيار + توست',8,'','','','','','','','سلطة خيار بالليمون مع قطع توست','✓ متوفر',''],
    ['إضافات بصلة','إضافة موتزريلا',20,'','','','','','','','طبقة إضافية من الموتزاريلا','✓ متوفر',''],
    ['إضافات بصلة','أرز بسمتي',25,'','','','','','','','أرز بسمتي مطبوخ بالزيت والكمون','✓ متوفر',''],
    ['إضافات بصلة','تومية',10,'','','','','','','','صلصة التوم البيتي الكريمية','✓ متوفر',''],
    ['إضافات بصلة','مخلل',10,'','','','','','','','مخلل خضار طازج','✓ متوفر',''],
    ['إضافات بصلة','عيش سوري',5,'','','','','','','','خبز سوري طازج','✓ متوفر',''],

    ['كريب فراخ','كريب بانيه',60,'صغير',50,'كبير',70,'','','','كريب البانيه المقرمش الشهير','✓ متوفر',''],
    ['كريب فراخ','كريب كرانشي',70,'صغير',60,'كبير',80,'','','','كريب الكرانشي الهش جواه وقرمش برا','✓ متوفر',''],
    ['كريب فراخ','كريب شيش',70,'صغير',60,'كبير',80,'','','','كريب الشيش طاووق المتبل بالليمون','✓ متوفر',''],
    ['كريب فراخ','كريب شاورما فراخ',80,'صغير',70,'كبير',90,'','','','كريب الشاورما بتتبيلة البيت','✓ متوفر',''],
    ['كريب فراخ','كريب فاهيتا',70,'صغير',60,'كبير',80,'','','','كريب الفاهيتا بالفلفل الملوّن','✓ متوفر',''],
    ['كريب فراخ','كريب بصلة جامبو',90,'','','','','','','','كريب جامبو خاص — وجبة متكاملة','✓ متوفر',''],

    ['كريب لحوم','كريب برجر',60,'صغير',50,'كبير',70,'','','','كريب البرجر بالجبن والصوص','✓ متوفر',''],
    ['كريب لحوم','كريب كفتة',55,'صغير',45,'كبير',65,'','','','كريب الكفتة المشوية المتبلة','✓ متوفر',''],
    ['كريب لحوم','كريب سوسيس',55,'صغير',45,'كبير',65,'','','','كريب السوسيس مع الجبن الذائب','✓ متوفر',''],
    ['كريب لحوم','كريب مشكل لحوم',70,'صغير',60,'كبير',80,'','','','مشكل اللحوم في كريب واحد','✓ متوفر',''],
    ['كريب لحوم','كريب بطاطس',45,'صغير',40,'كبير',50,'','','','كريب البطاطس الكرانشي بالجبن','✓ متوفر',''],

    ['كريب حلو','كريب نوتيلا',40,'','','','','','','','كريب النوتيلا الكلاسيكي بالبندق','✓ متوفر',''],
    ['كريب حلو','كريب مكسرات',35,'','','','','','','','كريب المكسرات المقرمشة بالعسل','✓ متوفر',''],
    ['كريب حلو','كريب موز',35,'','','','','','','','كريب الموز الطازج مع الكريمة','✓ متوفر',''],

    ['قسم الشاورما','شاورما فراخ',60,'صغير',50,'كبير',70,'','','','شاورما الفراخ المتبلة على الأوود','✓ متوفر',''],
    ['قسم الشاورما','وجبة شاورما عربي',80,'','','','','','','','وجبة الشاورما العربي الأصيل','✓ متوفر',''],
    ['قسم الشاورما','وجبة شاورما عربي دوبل',150,'','','','','','','','دوبل شاورما للجوع الحقيقي','✓ متوفر',''],
    ['قسم الشاورما','فتة شاورما',88,'وسط',75,'كبير',100,'','','','فتة الشاورما البيتية الشهيرة','✓ متوفر',''],
    ['قسم الشاورما','فتة كريسبي',88,'وسط',80,'كبير',95,'','','','فتة الكريسبي المقرمش المذهل','✓ متوفر',''],
    ['قسم الشاورما','وجبة شيش طاووق',100,'صغير',90,'كبير',110,'','','','شيش طاووق مشوي على الجمر','✓ متوفر',''],
    ['قسم الشاورما','شاورما عائلية عربي',260,'','','','','','','','شاورما عائلية كبيرة تكفي الجميع','✓ متوفر',''],

    ['قسم الفراخ','فرخة شواية كاملة',300,'','','','','','','','فرخة كاملة مشوية على الجمر','✓ متوفر',''],
    ['قسم الفراخ','½ فرخة شواية',160,'','','','','','','','نص فرخة مشوية بالتبيلة','✓ متوفر',''],
    ['قسم الفراخ','¼ فرخة صدر',90,'','','','','','','','ربع صدر مشوي','✓ متوفر',''],
    ['قسم الفراخ','¼ فرخة ورك',80,'','','','','','','','ربع ورك مشوي','✓ متوفر',''],
    ['قسم الفراخ','وجبة دبل أوراك مشوية',210,'','','','','','','','دوبل أوراك مشوية مع الأرز','✓ متوفر',''],
    ['قسم الفراخ','فرخة شواية سادة',275,'','','','','','','','فرخة كاملة مشوية سادة','✓ متوفر',''],

    ['قسم السوري','بطاطس سوري',20,'صغير',15,'وسط',20,'كبير',25,'','بطاطس سوري كرانشي بالتوابل','✓ متوفر',''],
    ['قسم السوري','بطاطس جبنة',25,'صغير',20,'كبير',30,'','','','بطاطس بالجبن الذائب','✓ متوفر',''],
    ['قسم السوري','بانية على بطاطس',25,'صغير',20,'كبير',30,'','','','بانيه على بطاطس بالصوص','✓ متوفر',''],
    ['قسم السوري','بانية فريش',48,'صغير',40,'كبير',55,'','','','بانيه فريش كرانشي','✓ متوفر',''],
    ['قسم السوري','كرسبي فريش',58,'صغير',50,'كبير',65,'','','','كرسبي مقرمش جداً','✓ متوفر',''],
    ['قسم السوري','زنجر',50,'صغير',45,'كبير',55,'','','','زنجر بتتبيلة التحدي الحار','✓ متوفر',''],
    ['قسم السوري','شيش طاووق',60,'صغير',50,'كبير',70,'','','','شيش طاووق بصوص الليمون','✓ متوفر',''],
    ['قسم السوري','هوت دوج',30,'صغير',25,'كبير',35,'','','','هوت دوج بالجبن والصوص','✓ متوفر',''],
    ['قسم السوري','برجر',40,'صغير',35,'كبير',45,'','','','برجر لحمة طازجة بالجبن','✓ متوفر',''],
    ['قسم السوري','فاهيتا',63,'صغير',55,'كبير',70,'','','','فاهيتا الفراخ بالفلفل الملوّن','✓ متوفر',''],

    ['وجبات التوفير','كومبو طاجن لحمة',60,'','','','','','',10,'طاجن لحمة + كانز + بطاطس (وفّر 10 ج.م)','✓ متوفر',''],
    ['وجبات التوفير','كومبو طاجن فراخ',75,'','','','','','',10,'طاجن فراخ + كانز + بطاطس (وفّر 10 ج.م)','✓ متوفر',''],
  ];

  var dataStart = 4;
  var TOTAL_ROWS = 1000;

  var currentMax = sh.getMaxRows();
  if (currentMax < TOTAL_ROWS) {
    sh.insertRowsAfter(currentMax, TOTAL_ROWS - currentMax);
  }

  sh.getRange(dataStart, 1, demo.length, NUM_COLS).setValues(demo);

  var bgs = [];
  for (var r = dataStart; r <= TOTAL_ROWS; r++) {
    var isEven = (r % 2 === 0);
    var rowBgs = [];
    for (var c = 1; c <= NUM_COLS; c++) {
      if (c >= 4 && c <= 9) {
        rowBgs.push(isEven ? '#F0FDF4' : '#F7FFFC');
      } else {
        rowBgs.push(isEven ? '#FAFAFA' : CLR.WHITE);
      }
    }
    bgs.push(rowBgs);
  }
  sh.getRange(dataStart, 1, TOTAL_ROWS - dataStart + 1, NUM_COLS).setBackgrounds(bgs);

  sh.setRowHeights(dataStart, TOTAL_ROWS - dataStart + 1, 28);

  sh.getRange('C' + dataStart + ':C' + TOTAL_ROWS).setFontWeight('bold').setFontColor(CLR.BRAND2);
  sh.getRange('B' + dataStart + ':B' + TOTAL_ROWS).setFontWeight('bold');

  sh.getRange('E' + dataStart + ':E' + TOTAL_ROWS).setFontWeight('bold').setFontColor('#166534');
  sh.getRange('G' + dataStart + ':G' + TOTAL_ROWS).setFontWeight('bold').setFontColor('#166534');
  sh.getRange('I' + dataStart + ':I' + TOTAL_ROWS).setFontWeight('bold').setFontColor('#166534');

  var catNames = Object.keys(CAT_MAP);
  var catValidation = SpreadsheetApp.newDataValidation()
    .requireValueInList(catNames, true)
    .setAllowInvalid(false)
    .setHelpText('اختر اسم القسم من القايمة')
    .build();
  sh.getRange(dataStart, 1, TOTAL_ROWS - dataStart + 1, 1).setDataValidation(catValidation);

  var availValidation = SpreadsheetApp.newDataValidation()
    .requireValueInList(['✓ متوفر', '✗ مخفي'], true)
    .setAllowInvalid(false).build();
  sh.getRange(dataStart, 12, TOTAL_ROWS - dataStart + 1, 1).setDataValidation(availValidation);

  var cfRules = sh.getConditionalFormatRules();
  cfRules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('✗ مخفي')
    .setBackground('#FEE2E2').setFontColor('#9B1C1C')
    .setRanges([sh.getRange('L' + dataStart + ':L' + TOTAL_ROWS)]).build());
  cfRules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('✓ متوفر')
    .setFontColor(CLR.GREEN)
    .setRanges([sh.getRange('L' + dataStart + ':L' + TOTAL_ROWS)]).build());
  sh.setConditionalFormatRules(cfRules);

  sh.getRange(1, 1, TOTAL_ROWS, NUM_COLS)
    .setBorder(true, true, true, true, true, true, CLR.BORDER, SpreadsheetApp.BorderStyle.SOLID);

  sh.getRange(3, 4, 1, 6)
    .setBorder(true, true, true, true, false, false, '#166534', SpreadsheetApp.BorderStyle.MEDIUM);

  var widths = [130, 195, 65, 85, 60, 85, 60, 85, 60, 55, 220, 80, 150];
  widths.forEach(function(w, i) { sh.setColumnWidth(i + 1, w); });

  sh.getRange('C' + dataStart + ':C' + TOTAL_ROWS).setNumberFormat('#,##0');
  sh.getRange('E' + dataStart + ':E' + TOTAL_ROWS).setNumberFormat('#,##0');
  sh.getRange('G' + dataStart + ':G' + TOTAL_ROWS).setNumberFormat('#,##0');
  sh.getRange('I' + dataStart + ':I' + TOTAL_ROWS).setNumberFormat('#,##0');

  sh.getRange('C' + dataStart + ':C' + TOTAL_ROWS).setHorizontalAlignment('center');
  sh.getRange('E' + dataStart + ':E' + TOTAL_ROWS).setHorizontalAlignment('center');
  sh.getRange('G' + dataStart + ':G' + TOTAL_ROWS).setHorizontalAlignment('center');
  sh.getRange('I' + dataStart + ':I' + TOTAL_ROWS).setHorizontalAlignment('center');
  sh.getRange('J' + dataStart + ':J' + TOTAL_ROWS).setHorizontalAlignment('center').setFontColor(CLR.VIOLET);
  sh.getRange('L' + dataStart + ':L' + TOTAL_ROWS).setHorizontalAlignment('center');

  sh.setFrozenRows(3);
}

function _buildOrdersSheet(ss) {
  var sh = _getOrCreate(ss, SH.ORDERS);
  sh.clear();
  sh.getRange('A1:J1000').clearDataValidations();
  sh.clearConditionalFormatRules();
  sh.setHiddenGridlines(false);
  sh.getRange('A1:J1000').setFontFamily('Cairo');

  sh.getRange('A1:H1').merge()
    .setValue('📦   سجل الطلبات  —  تصل تلقائياً من المنيو الرقمي')
    .setBackground(CLR.DARK).setFontColor(CLR.BRAND).setFontWeight('bold').setFontSize(14)
    .setHorizontalAlignment('center').setVerticalAlignment('middle');
  sh.setRowHeight(1, 50);

  sh.getRange('A2:H2').merge()
    .setValue(
      '🔴 جديد   ←   🟡 قيد التحضير   ←   🟢 جاهز للتسليم   ←   ✅ تم التسليم' +
      '   |   غيّر عمود "الحالة" لتحديث كل طلب   |   ❌ ملغي للإلغاء'
    )
    .setBackground(CLR.SLATE).setFontColor('#94A3B8').setFontSize(8.5).setFontWeight('bold')
    .setHorizontalAlignment('center').setVerticalAlignment('middle');
  sh.setRowHeight(2, 28);

  var headers = ['#', 'الوقت', 'الطاولة', 'الأصناف والكميات', 'ملاحظات', 'الإجمالي', 'الحالة', 'ملاحظة داخلية'];
  sh.setRowHeight(3, 36);
  sh.getRange(3, 1, 1, headers.length).setValues([headers])
    .setBackground(CLR.BRAND).setFontColor('#000').setFontWeight('bold').setFontSize(10)
    .setHorizontalAlignment('center').setVerticalAlignment('middle');

  sh.getRange(4, 1, 500, headers.length)
    .setFontFamily('Cairo').setFontSize(10)
    .setHorizontalAlignment('center').setVerticalAlignment('middle').setWrap(true);

  for (var r = 4; r <= 200; r++) sh.setRowHeight(r, 30);

  sh.getRange('B4:B1000').setNumberFormat('dd/MM  HH:mm');
  sh.getRange('F4:F1000').setNumberFormat('"ج.م " #,##0').setFontWeight('bold').setFontColor(CLR.GREEN);
  sh.getRange('A4:A1000').setFontColor(CLR.MUTED).setFontSize(9);

  var statusValidation = SpreadsheetApp.newDataValidation()
    .requireValueInList(STATUSES, true).setAllowInvalid(true).build();
  sh.getRange('G4:G1000').setDataValidation(statusValidation);

  var statusCFRange = sh.getRange('A4:H1000');
  var cfRules = sh.getConditionalFormatRules();

  var statusStyles = [
    { txt: 'جديد 🔴',          bg: '#FEF2F2', fg: '#991B1B' },
    { txt: 'قيد التحضير 🟡',   bg: '#FFFBEB', fg: '#92400E' },
    { txt: 'جاهز للتسليم 🟢',  bg: '#F0FDF4', fg: '#166534' },
    { txt: 'تم التسليم ✅',     bg: '#F8FAFC', fg: '#64748B' },
    { txt: 'ملغي ❌',           bg: '#F1F5F9', fg: '#94A3B8' },
  ];

  statusStyles.forEach(function(s) {
    cfRules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=$G4="' + s.txt + '"')
      .setBackground(s.bg).setFontColor(s.fg)
      .setRanges([statusCFRange]).build());
  });
  sh.setConditionalFormatRules(cfRules);

  sh.getRange(1, 1, 3, headers.length)
    .setBorder(true, true, true, true, true, true, '#000', SpreadsheetApp.BorderStyle.SOLID);
  sh.getRange(4, 1, 200, headers.length)
    .setBorder(true, true, true, true, true, true, CLR.BORDER, SpreadsheetApp.BorderStyle.SOLID);

  var widths = [70, 110, 80, 310, 180, 100, 145, 180];
  widths.forEach(function(w, i) { sh.setColumnWidth(i + 1, w); });

  sh.setFrozenRows(3);
}

function _buildDashboardSheet(ss) {
  var sh = _getOrCreate(ss, SH.DASHBOARD);
  sh.clear();
  sh.getRange('A1:K120').clearDataValidations();
  sh.clearConditionalFormatRules();
  sh.setHiddenGridlines(false);

  sh.getRange('A1:K120').setBackground(CLR.WHITE).setFontFamily('Cairo');

  var heights = {1:14, 2:66, 3:10, 4:28, 5:16, 6:28, 7:52, 8:16, 9:30, 10:16,
                 11:40, 12:34, 13:300};
  Object.keys(heights).forEach(function(r) { sh.setRowHeight(Number(r), heights[r]); });

  sh.getRange('A2:K2').merge()
    .setValue('🧅   بصلة مصر  —  لوحة التحكم السحابية')
    .setBackground(CLR.BRAND).setFontColor(CLR.WHITE).setFontWeight('bold').setFontSize(22)
    .setHorizontalAlignment('center').setVerticalAlignment('middle');

  sh.getRange('A4:K4').merge()
    .setFormula(
      '="📅  " & TEXT(TODAY(),"dddd dd mmmm yyyy") & ' +
      '"   ·   الوقت: " & TEXT(NOW(),"HH:mm") & ' +
      '"   ·   الإحصائيات تتحدث تلقائياً   ·   غيّر حالات الطلبات من شيت الطلبات"'
    )
    .setBackground(CLR.OFF).setFontColor(CLR.MUTED).setFontSize(9).setFontWeight('bold')
    .setHorizontalAlignment('center').setVerticalAlignment('middle');

  _dash_kpi(sh, 'A6:B6', 'A7:B7',
    '💰  مبيعات اليوم',
    '=IFERROR(SUMIFS(\'📦 الطلبات\'!F:F,\'📦 الطلبات\'!B:B,">="&TODAY(),\'📦 الطلبات\'!B:B,"<"&(TODAY()+1)),0)',
    CLR.BRAND2, CLR.BRAND_BG, '"ج.م " #,##0'
  );
  _dash_kpi(sh, 'C6:D6', 'C7:D7',
    '📦  طلبات اليوم',
    '=COUNTIFS(\'📦 الطلبات\'!B:B,">="&TODAY(),\'📦 الطلبات\'!B:B,"<"&(TODAY()+1))',
    CLR.GREEN, CLR.GREEN_BG, '#,##0'
  );
  _dash_kpi(sh, 'E6:F6', 'E7:F7',
    '🔴  نشطة الآن',
    '=COUNTIF(\'📦 الطلبات\'!G:G,"جديد 🔴")+COUNTIF(\'📦 الطلبات\'!G:G,"قيد التحضير 🟡")',
    '#C2410C', '#FFEDD5', '#,##0'
  );
  _dash_kpi(sh, 'G6:H6', 'G7:H7',
    '📈  متوسط الطلب',
    '=IFERROR(AVERAGEIFS(\'📦 الطلبات\'!F:F,\'📦 الطلبات\'!B:B,">="&TODAY(),\'📦 الطلبات\'!B:B,"<"&(TODAY()+1)),0)',
    CLR.BLUE, CLR.BLUE_BG, '"ج.م " #,##0'
  );
  _dash_kpi(sh, 'I6:K6', 'I7:K7',
    '💎  إجمالي الكل',
    '=IFERROR(SUMIF(\'📦 الطلبات\'!G:G,"<>ملغي ❌",\'📦 الطلبات\'!F:F),0)',
    CLR.VIOLET, CLR.VIOL_BG, '"ج.م " #,##0'
  );

  sh.getRange('A9:K9').merge()
    .setFormula(
      '="🔴 جديد: " & COUNTIF(\'📦 الطلبات\'!G:G,"جديد 🔴") & ' +
      '"    |    🟡 قيد التحضير: " & COUNTIF(\'📦 الطلبات\'!G:G,"قيد التحضير 🟡") & ' +
      '"    |    🟢 جاهز: " & COUNTIF(\'📦 الطلبات\'!G:G,"جاهز للتسليم 🟢") & ' +
      '"    |    ✅ تم التسليم: " & COUNTIF(\'📦 الطلبات\'!G:G,"تم التسليم ✅") & ' +
      '"    |    إجمالي كل الطلبات: " & (COUNTA(\'📦 الطلبات\'!A:A)-3)'
    )
    .setBackground(CLR.OFF).setFontColor(CLR.MID).setFontSize(10).setFontWeight('bold')
    .setHorizontalAlignment('center').setVerticalAlignment('middle');

  sh.getRange('A11:K11').merge()
    .setValue('📋   شاشة المطبخ  —  الطلبات النشطة (تتحدث تلقائياً)')
    .setBackground('#F1F5F9').setFontColor(CLR.SLATE).setFontWeight('bold').setFontSize(13)
    .setHorizontalAlignment('center').setVerticalAlignment('middle');
  sh.getRange('A11:K11').setBorder(false, false, true, false, false, false,
    CLR.BORDER, SpreadsheetApp.BorderStyle.DOUBLE);

  var kHeaders = ['#الطلب', 'الوقت', 'الطاولة', 'الأصناف والكميات', 'ملاحظات العميل', 'الإجمالي', 'الحالة'];
  sh.getRange(12, 1, 1, kHeaders.length).setValues([kHeaders])
    .setBackground(CLR.SLATE).setFontColor(CLR.WHITE).setFontWeight('bold').setFontSize(10)
    .setHorizontalAlignment('center').setVerticalAlignment('middle');

  sh.getRange('A13').setFormula(
    '=IFERROR(' +
    'FILTER(\'📦 الطلبات\'!A4:G,\'📦 الطلبات\'!A4:A<>""),' +
    '"📭 لا توجد طلبات مسجلة حالياً")'
  );

  var liveZone = sh.getRange('A13:G120');
  liveZone.setBackground(CLR.WHITE).setFontColor(CLR.DARK).setFontSize(10)
    .setHorizontalAlignment('center').setVerticalAlignment('middle').setWrap(true);
  sh.getRange('B13:B120').setNumberFormat('HH:mm');
  sh.getRange('F13:F120').setNumberFormat('"ج.م " #,##0').setFontWeight('bold').setFontColor(CLR.BRAND2);

  var cfRules = sh.getConditionalFormatRules();
  [
    { txt:'جديد 🔴',         bg:'#FEF2F2', fg:'#991B1B' },
    { txt:'قيد التحضير 🟡',  bg:'#FFFBEB', fg:'#92400E' },
    { txt:'جاهز للتسليم 🟢', bg:'#F0FDF4', fg:'#166534' },
    { txt:'تم التسليم ✅',     bg:'#F8FAFC', fg:'#64748B' },
    { txt:'ملغي ❌',           bg:'#F1F5F9', fg:'#94A3B8' },
  ].forEach(function(s) {
    cfRules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=$G13="' + s.txt + '"')
      .setBackground(s.bg).setFontColor(s.fg)
      .setRanges([sh.getRange('A13:G120')]).build());
  });
  sh.setConditionalFormatRules(cfRules);

  for (var r = 13; r <= 80; r++) sh.setRowHeight(r, 34);

  sh.getRange('A12:G120')
    .setBorder(true, true, true, true, true, true, CLR.BORDER, SpreadsheetApp.BorderStyle.SOLID);

  sh.setColumnWidth(1, 80);
  sh.setColumnWidth(2, 120);
  sh.setColumnWidth(3, 80);
  sh.setColumnWidth(4, 300);
  sh.setColumnWidth(5, 170);
  sh.setColumnWidth(6, 100);
  sh.setColumnWidth(7, 145);
  sh.setColumnWidth(8, 20);
  sh.setColumnWidth(9, 20);
  sh.setColumnWidth(10, 20);
  sh.setColumnWidth(11, 20);

  sh.setFrozenRows(0);
}

function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) || '';
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  if (action === 'getMenu')  return _serveMenu(ss);
  if (action === 'getAll')   return _json({ categories: JSON.parse(_serveMenu(ss).getContent()).categories });
  return _json({ error: 'Use ?action=getMenu or ?action=getAll' });
}

function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var payload;
  try { payload = JSON.parse(e.postData.contents); }
  catch (err) { return _json({ error: 'Invalid JSON: ' + err.message }); }

  if (payload.action === 'submitOrder')  return _handleSubmitOrder(ss, payload);
  if (payload.action === 'updateStatus') return _handleUpdateStatus(ss, payload);
  return _json({ error: 'Unknown action: ' + payload.action });
}

function _handleSubmitOrder(ss, payload) {
  var sh = ss.getSheetByName(SH.ORDERS);
  if (!sh) return _json({ error: 'Orders sheet not found. Run setupDatabase() first.' });

  var lastRow = sh.getLastRow();
  var newId = 1001;
  if (lastRow > 3) {
    var lastId = sh.getRange(lastRow, 1).getValue();
    if (!isNaN(lastId) && lastId !== '') newId = Number(lastId) + 1;
  }

  var itemsStr = (payload.items || []).map(function(item) {
    var t = item.qty + '× ' + item.name;
    if (item.variant) t += ' (' + item.variant + ')';
    return t;
  }).join('\n');

  sh.appendRow([
    newId,
    new Date(),
    payload.table || '1',
    itemsStr,
    payload.note || '',
    Number(payload.total) || 0,
    'جديد 🔴',
    '',
  ]);

  var newRow = sh.getLastRow();
  sh.setRowHeight(newRow, 34);

  return _json({ success: true, orderId: newId });
}

function _handleUpdateStatus(ss, payload) {
  var sh = ss.getSheetByName(SH.ORDERS);
  if (!sh) return _json({ error: 'Orders sheet not found.' });

  var data = sh.getRange(4, 1, sh.getLastRow(), 1).getValues();
  for (var i = 0; i < data.length; i++) {
    if (String(data[i][0]) === String(payload.orderId)) {
      sh.getRange(i + 4, 7).setValue(payload.status);
      return _json({ success: true, orderId: payload.orderId, status: payload.status });
    }
  }
  return _json({ error: 'Order #' + payload.orderId + ' not found.' });
}

function _serveMenu(ss) {
  var sh = ss.getSheetByName(SH.MENU);
  if (!sh) return _json({ error: 'Menu sheet not found.' });

  var lastRow = sh.getLastRow();
  if (lastRow < 4) return _json({ categories: [] });

  var rows = sh.getRange(4, 1, lastRow - 3, 13).getValues();

  var catMap    = {};
  var catOrder  = [];
  var catCtrs   = {};

  rows.forEach(function(row) {
    var catName  = String(row[0] || '').trim();
    var itemName = String(row[1] || '').trim();
    var price    = Number(row[2]) || 0;
    var s1n = String(row[3] || '').trim(), s1p = Number(row[4]) || 0;
    var s2n = String(row[5] || '').trim(), s2p = Number(row[6]) || 0;
    var s3n = String(row[7] || '').trim(), s3p = Number(row[8]) || 0;
    var discount = Number(row[9]) || 0;
    var desc     = String(row[10] || '').trim();
    var avail    = String(row[11] || '').trim();
    var img      = String(row[12] || '').trim();

    if (!catName || !itemName) return;
    if (avail === '✗ مخفي') return;

    var catInfo = CAT_MAP[catName] || { id: _slug(catName), icon: 'fork-knife', color: '#F5890A' };
    var catId   = catInfo.id;

    if (!catMap[catId]) {
      catMap[catId] = { id: catId, name: catName, icon: catInfo.icon, color: catInfo.color, items: [] };
      catOrder.push(catId);
    }

    catCtrs[catId] = (catCtrs[catId] || 0) + 1;
    var itemId = catId.substring(0, 2).replace(/[^a-z]/gi, 'x') + catCtrs[catId];

    var variants = [];
    if (s1n && s1p > 0) variants.push({ name: s1n, price: s1p });
    if (s2n && s2p > 0) variants.push({ name: s2n, price: s2p });
    if (s3n && s3p > 0) variants.push({ name: s3n, price: s3p });

    var originalPrice = null;
    var finalPrice    = price;
    if (discount > 0) {
      originalPrice = price;
      finalPrice    = Math.round(price * (1 - discount / 100));
      variants = variants.map(function(v) {
        return { name: v.name, price: Math.round(v.price * (1 - discount / 100)) };
      });
    }

    catMap[catId].items.push({
      id:            itemId,
      name:          itemName,
      price:         finalPrice,
      originalPrice: originalPrice,
      variants:      variants.length > 0 ? variants : null,
      description:   desc,
      image:         img,
    });
  });

  return _json({ categories: catOrder.map(function(id) { return catMap[id]; }) });
}

function _getOrCreate(ss, name) {
  return ss.getSheetByName(name) || ss.insertSheet(name);
}

function _json(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function _slug(text) {
  return String(text).toLowerCase()
    .replace(/\s+/g, '-').replace(/[^\w\u0621-\u064A-]+/g, '')
    .replace(/--+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
}

function _dash_kpi(sh, labelRange, valueRange, label, formula, color, bgDark, numFmt) {
  var lRow = Number(labelRange.match(/\d+/)[0]);

  sh.getRange(labelRange).merge()
    .setValue(label)
    .setBackground(bgDark).setFontColor(color)
    .setFontSize(9).setFontWeight('bold').setFontFamily('Cairo')
    .setHorizontalAlignment('center').setVerticalAlignment('middle');

  sh.getRange(valueRange).merge()
    .setFormula(formula)
    .setBackground(bgDark).setFontColor(color)
    .setFontSize(26).setFontWeight('bold').setFontFamily('Cairo')
    .setNumberFormat(numFmt || '#,##0')
    .setHorizontalAlignment('center').setVerticalAlignment('middle');

  var fullRange = labelRange.split(':')[0] + ':' + valueRange.split(':')[1];
  sh.getRange(fullRange)
    .setBorder(true, true, true, true, false, true, color + '55', SpreadsheetApp.BorderStyle.SOLID);
  sh.getRange(fullRange).setBorder(true, true, true, true, false, false,
    color, SpreadsheetApp.BorderStyle.MEDIUM);
}
