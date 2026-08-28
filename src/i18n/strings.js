/**
 * Bilingual string map. Arabic is the primary language (dir=rtl); English is the
 * toggle. Every key must exist in both maps — `t()` falls back to the key itself
 * so a missing string is loud rather than silently blank.
 */

export const LANGS = {
    ar: { code: 'ar', dir: 'rtl', label: 'العربية', htmlLang: 'ar' },
    en: { code: 'en', dir: 'ltr', label: 'English', htmlLang: 'en' },
};

export const DEFAULT_LANG = 'ar';

export const STRINGS = {
    ar: {
        'site.title': 'عمليات كلاب الصحراء',
        'site.tagline': 'ماء وطعام ورعاية لكلاب الصحراء في الصفاوي والضليل',
        'site.mission':
            'مجموعة تطوعية مفتوحة المصدر توثّق وتوصل الماء والطعام لكلاب الصحراء، وتجمع الأدلة لاستبدال الحجز في الصحراء ببرنامج تعقيم وتطعيم إنساني.',

        'nav.problem': 'المشكلة',
        'nav.map': 'الخريطة',
        'nav.ops': 'العمليات',
        'nav.evidence': 'الأدلة',
        'nav.involved': 'شارك معنا',
        'nav.skipToContent': 'تجاوز إلى المحتوى',

        'hero.cta': 'شارك معنا',
        'hero.ctaSecondary': 'اقرأ المشكلة',
        'hero.scroll': 'مرّر للأسفل',

        'problem.heading': 'المشكلة',
        'problem.lead':
            'يتم جمع الكلاب الضالة من المدن وتركها في أماكن نائية في الصحراء. الكلاب لا تختفي — بل تبقى بلا ماء ولا ظل ولا طعام ولا رعاية بيطرية.',
        'problem.p1':
            'في الصفاوي على طريق بغداد، يعتمد عدد من الكلاب على ستة أحواض ماء يملؤها متطوعون بصهريج. معظم الأحواض مسدود بالطين ويحتاج تنظيفاً متكراً، وكل عملية ملء تكلّف حوالي ١٥ ديناراً أردنياً.',
        'problem.p2':
            'في الضليل، الكلاب على أرض خاصة ولا يمكن بناء أحواض ثابتة قبل الوصول إلى أصحاب الأرض والحصول على إذن. الماء يوصل ٣ مرات أسبوعياً فقط.',
        'problem.p3':
            'الحجز في الصحراء لا يحل مشكلة التعداد. الدليل العلمي يشير إلى أن القتل أو النقل القسري لا يقلّل أعداد الكلاب على المدى الطويل، بينما التعقيم والتطعيم (ABC/TNR) يقلّلها ويقلّل خطر داء الكلب.',
        'problem.ask': 'ما نطلبه: ماء موثوق، ظل، رعاية بيطرية، وبرنامج تعقيم وتطعيم بدل الحجز.',
        'problem.sourcesHeading': 'المصادر',
        'problem.sourcesNote':
            'كل رابط أدناه تم التحقق من فتحه. إن لم نتمكن من التحقق من مصدر، نذكر ذلك صراحة بدل تخمينه.',

        'map.heading': 'الخريطة الميدانية',
        'map.lead':
            'مواقع العمل على صور الأقمار الصناعية. اضغط على أي علامة لعرض تفاصيلها.',
        'map.approxWarning':
            'تنبيه: العلامات تمثّل مناطق تقريبية (مركز البلدة أو ممر الطريق)، وليست إحداثيات مسحية للأحواض. الإحداثيات الدقيقة تُضاف فقط عندما يسجّلها متطوع في الميدان.',
        'map.legend': 'الدليل',
        'map.clickHint': 'اضغط على علامة',
        'map.loading': 'جارٍ تحميل الخريطة…',
        'map.unavailable': 'الخريطة غير متوفرة في هذا المتصفح.',
        'map.resetView': 'إعادة العرض',

        'inspector.close': 'إغلاق',
        'inspector.status': 'الحالة',
        'inspector.troughs': 'الأحواض',
        'inspector.dogs': 'تقدير عدد الكلاب',
        'inspector.water': 'الماء',
        'inspector.food': 'الطعام',
        'inspector.cost': 'تكلفة الملء',
        'inspector.notes': 'ملاحظات',
        'inspector.precisionArea': 'موقع تقريبي (منطقة)',
        'inspector.unknown': 'غير معروف',
        'inspector.jod': 'دينار',

        'ops.heading': 'العمليات الميدانية',
        'ops.lead': 'من يذهب، ومتى، وماذا تم فعله. البيانات محلية في المتصفح حالياً.',
        'ops.rota': 'جدول التطوع',
        'ops.rotaAssign': 'أسنِد لي',
        'ops.rotaDone': 'تم',
        'ops.rotaDoneLabel': 'منجز',
        'ops.rotaUnassigned': 'غير مُسند',
        'ops.rotaAssignedTo': 'مُسند إلى',
        'ops.rotaTask': 'المهمة',
        'ops.yourName': 'اسمك',
        'ops.intake': 'استمارة المساعدة',
        'ops.intakeLead': 'اعرض أرضاً أو مستلزمات أو وقتاً.',
        'ops.offerType': 'نوع المساعدة',
        'ops.offerLand': 'أرض',
        'ops.offerSupplies': 'مستلزمات',
        'ops.offerTime': 'وقت',
        'ops.offerTransport': 'نقل / صهريج',
        'ops.contact': 'وسيلة التواصل',
        'ops.contactHint': 'هاتف أو بريد إلكتروني',
        'ops.message': 'التفاصيل',
        'ops.submit': 'إرسال',
        'ops.submitting': 'جارٍ الإرسال…',
        'ops.submitted': 'تم استلام العرض. شكراً لك.',
        'ops.localOnly':
            'ملاحظة: لا يوجد سيرفر بعد — العروض تُحفظ في متصفحك فقط ولا تُرسل إلى أي مكان.',
        'ops.required': 'هذا الحقل مطلوب',
        'ops.photoLog': 'سجل الصور',
        'ops.photoLogEmpty': 'لا توجد صور بعد.',
        'ops.noPhoto': 'بلا صورة',

        'evidence.heading': 'الأدلة',
        'evidence.lead':
            'ما نجمعه لإثبات التغيير: تعداد الكلاب، سجل الإطعام، ومقارنة صور الأقمار الصناعية قبل وبعد.',
        'evidence.timeline': 'تعداد الكلاب مع الوقت',
        'evidence.feedings': 'سجل الإطعام والماء',
        'evidence.beforeAfter': 'قبل / بعد (صور أقمار صناعية)',
        'evidence.stub':
            'هذا القسم هيكل مبدئي. الأرقام أدناه بيانات تجريبية للتصميم فقط، وليست قياسات ميدانية — ستُستبدل ببيانات حقيقية عندما يبدأ التسجيل.',
        'evidence.sampleData': 'بيانات تجريبية',
        'evidence.beforeAfterStub':
            'مقارنة الصور تحتاج صورتين مؤرختين لنفس الموقع. لم تُجمع بعد.',
        'evidence.date': 'التاريخ',
        'evidence.count': 'العدد',
        'evidence.site': 'الموقع',
        'evidence.action': 'الإجراء',

        'involved.heading': 'شارك معنا',
        'involved.lead': 'نحن شخصان يعملان في مجال تقنية المعلومات. المشروع مفتوح المصدر. أي مساعدة تفيد.',
        'involved.needsHeading': 'ما نحتاجه',
        'involved.need1': 'صهريج ماء ومتبرعون لتغطية تكلفة الملء',
        'involved.need2': 'طبيب بيطري متعاون وبرنامج تعقيم وتطعيم',
        'involved.need3': 'أرض أو إذن لبناء أحواض وظل',
        'involved.need4': 'مساعدة في البرمجة أو التصميم أو التوثيق',
        'involved.github': 'المستودع على GitHub',
        'involved.reddit': 'ساهم عبر Reddit',
        'involved.contribute': 'ساهم بالكود',

        'footer.licenses': 'التراخيص',
        'footer.credits': 'شكر وتقدير',
        'footer.godseye': 'مبني على Godseye (رخصة Apache-2.0)',
        'footer.vgpu': 'محرك الرسوم vgpu (رخصة MIT)',
        'footer.cesium': 'CesiumJS (رخصة Apache-2.0)',
        'footer.imagery': 'صور الأقمار الصناعية: Esri World Imagery',
        'footer.disclaimer':
            'إخلاء مسؤولية: هذا مشروع تطوعي مستقل. لا نمثّل أي جهة حكومية أو جمعية أو حملة تبرعات، ولا ننتحل صفة أي شخص. جميع البيانات الميدانية غير مؤكدة إلا إذا ذُكر خلاف ذلك.',
        'footer.openSource': 'مفتوح المصدر',

        'lang.toggle': 'English',
        'lang.switchTo': 'التبديل إلى الإنجليزية',

        'gpu.fallbackNote': 'الرسوم المتحركة تحتاج WebGPU. يتم عرض خلفية بديلة.',
    },

    en: {
        'site.title': 'Desert Dogs Ops',
        'site.tagline': 'Water, food and care for desert dogs in Safawi and Dhulail',
        'site.mission':
            'An open-source volunteer group documenting and delivering water and food to desert dogs, and gathering the evidence to replace desert confinement with a humane spay-and-vaccinate programme.',

        'nav.problem': 'The Problem',
        'nav.map': 'Live Map',
        'nav.ops': 'Field Ops',
        'nav.evidence': 'Evidence',
        'nav.involved': 'Get Involved',
        'nav.skipToContent': 'Skip to content',

        'hero.cta': 'Get Involved',
        'hero.ctaSecondary': 'Read the problem',
        'hero.scroll': 'Scroll',

        'problem.heading': 'The Problem',
        'problem.lead':
            'Stray dogs are collected from towns and left in remote desert locations. The dogs do not disappear — they remain, without water, shade, food or veterinary care.',
        'problem.p1':
            'At Safawi on the Baghdad road, a number of dogs depend on six water troughs filled by volunteers with a tanker. Most of the troughs silt up with mud and need repeated clearing, and each fill costs roughly 15 Jordanian dinars.',
        'problem.p2':
            'At Dhulail the dogs are on private land, and fixed basins cannot be built until the landowners are reached and permission is granted. Water reaches them only three times a week.',
        'problem.p3':
            'Desert confinement does not solve the population problem. The scientific evidence indicates that culling or forced relocation does not reduce dog numbers over the long term, while spay-and-vaccinate programmes (ABC/TNR) reduce both numbers and rabies risk.',
        'problem.ask': 'What we are asking for: reliable water, shade, veterinary care, and a spay-and-vaccinate programme instead of confinement.',
        'problem.sourcesHeading': 'Sources',
        'problem.sourcesNote':
            'Every link below was checked to resolve. Where a source could not be verified we say so explicitly rather than guessing it.',

        'map.heading': 'Field Map',
        'map.lead': 'Operating areas on satellite imagery. Click any marker for its details.',
        'map.approxWarning':
            'Note: markers represent approximate areas (town centre or road corridor), not surveyed trough coordinates. Precise coordinates are added only when a volunteer records them in the field.',
        'map.legend': 'Legend',
        'map.clickHint': 'Click a marker',
        'map.loading': 'Loading map…',
        'map.unavailable': 'The map is unavailable in this browser.',
        'map.resetView': 'Reset view',

        'inspector.close': 'Close',
        'inspector.status': 'Status',
        'inspector.troughs': 'Troughs',
        'inspector.dogs': 'Estimated dogs',
        'inspector.water': 'Water',
        'inspector.food': 'Food',
        'inspector.cost': 'Cost per fill',
        'inspector.notes': 'Notes',
        'inspector.precisionArea': 'Approximate location (area)',
        'inspector.unknown': 'Unknown',
        'inspector.jod': 'JOD',

        'ops.heading': 'Field Ops',
        'ops.lead': 'Who goes, when, and what got done. Data is local to your browser for now.',
        'ops.rota': 'Volunteer rota',
        'ops.rotaAssign': 'Assign to me',
        'ops.rotaDone': 'Mark done',
        'ops.rotaDoneLabel': 'Done',
        'ops.rotaUnassigned': 'Unassigned',
        'ops.rotaAssignedTo': 'Assigned to',
        'ops.rotaTask': 'Task',
        'ops.yourName': 'Your name',
        'ops.intake': 'Offer help',
        'ops.intakeLead': 'Offer land, supplies or time.',
        'ops.offerType': 'Type of help',
        'ops.offerLand': 'Land',
        'ops.offerSupplies': 'Supplies',
        'ops.offerTime': 'Time',
        'ops.offerTransport': 'Transport / tanker',
        'ops.contact': 'How to reach you',
        'ops.contactHint': 'Phone or email',
        'ops.message': 'Details',
        'ops.submit': 'Send',
        'ops.submitting': 'Sending…',
        'ops.submitted': 'Offer received. Thank you.',
        'ops.localOnly':
            'Note: there is no server yet — offers are stored in your browser only and are not sent anywhere.',
        'ops.required': 'This field is required',
        'ops.photoLog': 'Photo log',
        'ops.photoLogEmpty': 'No photos yet.',
        'ops.noPhoto': 'No photo',

        'evidence.heading': 'Evidence',
        'evidence.lead':
            'What we collect to prove change: dog counts, feeding logs, and before/after satellite imagery.',
        'evidence.timeline': 'Dog count over time',
        'evidence.feedings': 'Feeding and water log',
        'evidence.beforeAfter': 'Before / after (satellite imagery)',
        'evidence.stub':
            'This section is a scaffold. The figures below are sample data for layout only — not field measurements — and will be replaced with real data once recording begins.',
        'evidence.sampleData': 'Sample data',
        'evidence.beforeAfterStub':
            'An imagery comparison needs two dated images of the same location. Not yet collected.',
        'evidence.date': 'Date',
        'evidence.count': 'Count',
        'evidence.site': 'Site',
        'evidence.action': 'Action',

        'involved.heading': 'Get Involved',
        'involved.lead': "We're two IT people. The project is open-source. Anything helps.",
        'involved.needsHeading': 'What we need',
        'involved.need1': 'A water tanker and donors to cover the cost per fill',
        'involved.need2': 'A cooperating vet and a spay-and-vaccinate programme',
        'involved.need3': 'Land or permission to build troughs and shade',
        'involved.need4': 'Help with code, design or documentation',
        'involved.github': 'Repository on GitHub',
        'involved.reddit': 'Contribute via Reddit',
        'involved.contribute': 'Contribute code',

        'footer.licenses': 'Licenses',
        'footer.credits': 'Credits',
        'footer.godseye': 'Built on Godseye (Apache-2.0)',
        'footer.vgpu': 'vgpu graphics engine (MIT)',
        'footer.cesium': 'CesiumJS (Apache-2.0)',
        'footer.imagery': 'Satellite imagery: Esri World Imagery',
        'footer.disclaimer':
            'Disclaimer: this is an independent volunteer project. We do not represent any government body, registered charity or fundraiser, and we do not impersonate anyone. All field data is unconfirmed unless stated otherwise.',
        'footer.openSource': 'Open source',

        'lang.toggle': 'العربية',
        'lang.switchTo': 'Switch to Arabic',

        'gpu.fallbackNote': 'The animation requires WebGPU. A fallback background is shown.',
    },
};

/** Resolve a key for a language, falling back to the key so gaps are visible. */
export function translate(lang, key) {
    const table = STRINGS[lang] || STRINGS[DEFAULT_LANG];
    if (Object.prototype.hasOwnProperty.call(table, key)) return table[key];
    const fallback = STRINGS[DEFAULT_LANG];
    if (Object.prototype.hasOwnProperty.call(fallback, key)) return fallback[key];
    return key;
}

/** Pick the localized side of a { ar, en } value; tolerates plain strings. */
export function localized(value, lang) {
    if (value === null || value === undefined) return '';
    if (typeof value === 'string') return value;
    return value[lang] ?? value[DEFAULT_LANG] ?? '';
}
