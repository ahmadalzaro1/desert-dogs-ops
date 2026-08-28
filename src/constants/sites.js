/**
 * Fixed field coordinates for the two operating areas.
 *
 * Provenance: Safawi town centre (32.19306 N, 37.12667 E) is the anchor the
 * volunteer loop is described against (Baghdad road / Highway 10 corridor,
 * Mafraq governorate). Dhulail is the private-land site in Zarqa governorate.
 *
 * IMPORTANT — these are AREA anchors, deliberately coarse. They are the towns
 * and the roadside corridor, NOT verified enclosure/dump pin locations. Exact
 * enclosure GPS is unknown until a volunteer records a pin in the field, and we
 * do not publish invented precision for a welfare case. Any site whose
 * `precision` is 'area' must render as an approximate area in the UI.
 */

export const AREA_ANCHORS = {
    safawi: { lat: 32.19306, lon: 37.12667, label: { ar: 'الصفاوي', en: 'Safawi' } },
    dhulail: { lat: 32.15583, lon: 36.22861, label: { ar: 'الضليل', en: 'Dhulail' } },
};

/** Status vocabulary. Drives marker colour + inspector styling. */
export const SITE_STATUS = {
    FED: 'fed',
    CRITICAL: 'critical',
    TROUGH_EMPTY: 'trough-empty',
    UNKNOWN: 'unknown',
};

export const STATUS_COLOR = {
    [SITE_STATUS.FED]: '#4ade80',
    [SITE_STATUS.CRITICAL]: '#ff3b30',
    [SITE_STATUS.TROUGH_EMPTY]: '#ffaa00',
    [SITE_STATUS.UNKNOWN]: '#8a8a9e',
};

export const STATUS_LABEL = {
    [SITE_STATUS.FED]: { ar: 'تم الإطعام', en: 'Fed' },
    [SITE_STATUS.CRITICAL]: { ar: 'حالة حرجة', en: 'Critical' },
    [SITE_STATUS.TROUGH_EMPTY]: { ar: 'الحوض فارغ', en: 'Trough empty' },
    [SITE_STATUS.UNKNOWN]: { ar: 'غير معروف', en: 'Unknown' },
};

/**
 * Seed sites. `precision: 'area'` means the marker is an approximate area
 * anchor, not a surveyed point — the UI must say so.
 */
export const DOG_SITES = [
    {
        id: 'safawi-roadside-troughs',
        name: { ar: 'أحواض طريق بغداد — الصفاوي', en: 'Baghdad road troughs — Safawi' },
        area: 'safawi',
        lat: AREA_ANCHORS.safawi.lat,
        lon: AREA_ANCHORS.safawi.lon,
        precision: 'area',
        status: SITE_STATUS.TROUGH_EMPTY,
        troughs: 6,
        dogsEstimate: 40,
        water: { ar: 'مرتان يومياً (صهريج)', en: 'Twice daily (tanker)' },
        food: { ar: '3 مرات أسبوعياً', en: '3× per week' },
        costPerFillJod: 15,
        notes: {
            ar: 'ستة أحواض، معظمها مسدود بالطين ويحتاج تنظيفاً متكراً. لا ظل ولا رعاية بيطرية في الموقع.',
            en: 'Six troughs, most silted up with mud and needing repeated clearing. No shade and no veterinary care on site.',
        },
    },
    {
        id: 'dhulail-private-land',
        name: { ar: 'أرض خاصة — الضليل', en: 'Private land — Dhulail' },
        area: 'dhulail',
        lat: AREA_ANCHORS.dhulail.lat,
        lon: AREA_ANCHORS.dhulail.lon,
        precision: 'area',
        status: SITE_STATUS.CRITICAL,
        troughs: 0,
        dogsEstimate: null,
        water: { ar: '3 مرات أسبوعياً', en: '3× per week' },
        food: { ar: 'غير منتظم', en: 'Irregular' },
        costPerFillJod: null,
        notes: {
            ar: 'لا يمكن بناء أحواض ثابتة قبل الوصول إلى أصحاب الأرض والحصول على إذن. عدد الكلاب غير مؤكد.',
            en: 'Fixed basins cannot be built until the landowners are reached and permission is given. Dog count unconfirmed.',
        },
    },
];

/** Camera framing for the two-site view (north-east Jordan). */
export const FIELD_VIEW = {
    lat: 32.18,
    lon: 36.9,
    height: 190000,
};
