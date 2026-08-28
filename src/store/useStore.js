import { create } from 'zustand';
import { DOG_SITES, SITE_STATUS } from '../constants/sites';

/**
 * Single Zustand store, sliced by domain: sites / volunteers / feedings / offers
 * / inspector / ui.
 *
 * Persistence boundary: every mutation that a backend would own goes through an
 * async action that awaits `dataAdapter`. Today that adapter is the in-memory
 * mock below; swapping in Supabase means replacing the adapter, not rewriting
 * components. Components therefore must treat writes as async and read the
 * `pending` flags.
 */

/** Simulated latency so the UI's pending states are exercised in development. */
const MOCK_LATENCY_MS = 260;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const nextId = (prefix) => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

/**
 * Data adapter seam. Phase 2 replaces this object with a Supabase-backed one
 * exposing the same method signatures.
 */
export const dataAdapter = {
    async saveOffer(offer) {
        await delay(MOCK_LATENCY_MS);
        return { ...offer, id: nextId('offer'), createdAt: new Date().toISOString() };
    },
    async saveRotaChange(slot) {
        await delay(MOCK_LATENCY_MS / 2);
        return slot;
    },
    async saveFeeding(entry) {
        await delay(MOCK_LATENCY_MS / 2);
        return { ...entry, id: nextId('feed') };
    },
};

/**
 * Seed rota. Deliberately generic tasks reflecting the real loop: water twice
 * daily at Safawi, food 3x/week, water 3x/week at Dhulail, trough clearing.
 */
const SEED_ROTA = [
    {
        id: 'rota-1',
        siteId: 'safawi-roadside-troughs',
        day: { ar: 'السبت', en: 'Saturday' },
        task: { ar: 'ملء الأحواض بالماء (صهريج)', en: 'Fill troughs with water (tanker)' },
        assignee: null,
        done: false,
    },
    {
        id: 'rota-2',
        siteId: 'safawi-roadside-troughs',
        day: { ar: 'السبت', en: 'Saturday' },
        task: { ar: 'تنظيف الطين من الأحواض', en: 'Clear mud from troughs' },
        assignee: null,
        done: false,
    },
    {
        id: 'rota-3',
        siteId: 'safawi-roadside-troughs',
        day: { ar: 'الاثنين', en: 'Monday' },
        task: { ar: 'توزيع الطعام', en: 'Distribute food' },
        assignee: null,
        done: false,
    },
    {
        id: 'rota-4',
        siteId: 'dhulail-private-land',
        day: { ar: 'الثلاثاء', en: 'Tuesday' },
        task: { ar: 'توصيل ماء إلى الأرض الخاصة', en: 'Deliver water to private land' },
        assignee: null,
        done: false,
    },
    {
        id: 'rota-5',
        siteId: 'dhulail-private-land',
        day: { ar: 'الخميس', en: 'Thursday' },
        task: { ar: 'متابعة أصحاب الأرض للحصول على إذن', en: 'Follow up with landowners for permission' },
        assignee: null,
        done: false,
    },
];

/**
 * SAMPLE feeding log — layout data only, clearly flagged in the UI as such.
 * Replaced by real records once volunteers start logging.
 */
const SAMPLE_FEEDINGS = [
    { id: 'feed-s1', siteId: 'safawi-roadside-troughs', date: '2026-08-24', action: 'water', litres: 2000, sample: true },
    { id: 'feed-s2', siteId: 'safawi-roadside-troughs', date: '2026-08-25', action: 'food', kg: 25, sample: true },
    { id: 'feed-s3', siteId: 'dhulail-private-land', date: '2026-08-26', action: 'water', litres: 800, sample: true },
    { id: 'feed-s4', siteId: 'safawi-roadside-troughs', date: '2026-08-27', action: 'water', litres: 2000, sample: true },
];

/** SAMPLE dog-count timeline — layout data only. */
const SAMPLE_COUNTS = [
    { date: '2026-05', count: 28, sample: true },
    { date: '2026-06', count: 33, sample: true },
    { date: '2026-07', count: 37, sample: true },
    { date: '2026-08', count: 40, sample: true },
];

const useStore = create((set, get) => ({
    // ── sites ────────────────────────────────────────────────
    sites: DOG_SITES,
    setSiteStatus: (siteId, status) =>
        set((s) => ({
            sites: s.sites.map((site) => (site.id === siteId ? { ...site, status } : site)),
        })),

    // ── inspector (Godseye pattern: one selected entity at a time) ──
    inspector: null,
    setInspector: (payload) => set({ inspector: payload }),
    clearInspector: () => set({ inspector: null }),

    // ── map readiness ────────────────────────────────────────
    mapReady: false,
    mapFailed: false,
    setMapReady: (ready) => set({ mapReady: ready }),
    setMapFailed: (failed) => set({ mapFailed: failed }),
    /** Bumped to ask the Cesium layer to re-frame the field view. */
    resetViewNonce: 0,
    requestResetView: () => set((s) => ({ resetViewNonce: s.resetViewNonce + 1 })),

    // ── volunteers / rota ────────────────────────────────────
    rota: SEED_ROTA,
    volunteerName: '',
    rotaPending: {},
    setVolunteerName: (name) => set({ volunteerName: name }),
    assignRota: async (slotId, name) => {
        const assignee = (name || '').trim();
        if (!assignee) return { ok: false, reason: 'no-name' };
        set((s) => ({ rotaPending: { ...s.rotaPending, [slotId]: true } }));
        const slot = get().rota.find((r) => r.id === slotId);
        try {
            await dataAdapter.saveRotaChange({ ...slot, assignee });
            set((s) => ({
                rota: s.rota.map((r) => (r.id === slotId ? { ...r, assignee } : r)),
            }));
            return { ok: true };
        } finally {
            set((s) => {
                const pending = { ...s.rotaPending };
                delete pending[slotId];
                return { rotaPending: pending };
            });
        }
    },
    completeRota: async (slotId) => {
        set((s) => ({ rotaPending: { ...s.rotaPending, [slotId]: true } }));
        const slot = get().rota.find((r) => r.id === slotId);
        try {
            await dataAdapter.saveRotaChange({ ...slot, done: true });
            set((s) => ({
                rota: s.rota.map((r) => (r.id === slotId ? { ...r, done: true } : r)),
            }));
            // A completed water run is exactly what flips a site out of
            // 'trough-empty' — keep map state coherent with ops state.
            if (slot?.siteId) {
                set((s) => ({
                    sites: s.sites.map((site) =>
                        site.id === slot.siteId && site.status === SITE_STATUS.TROUGH_EMPTY
                            ? { ...site, status: SITE_STATUS.FED }
                            : site,
                    ),
                }));
            }
            return { ok: true };
        } finally {
            set((s) => {
                const pending = { ...s.rotaPending };
                delete pending[slotId];
                return { rotaPending: pending };
            });
        }
    },

    // ── feedings / counts (evidence) ─────────────────────────
    feedings: SAMPLE_FEEDINGS,
    dogCounts: SAMPLE_COUNTS,
    addFeeding: async (entry) => {
        const saved = await dataAdapter.saveFeeding(entry);
        set((s) => ({ feedings: [...s.feedings, saved] }));
        return saved;
    },

    // ── photo log ────────────────────────────────────────────
    photoLog: [],
    addPhotoLogEntry: (entry) =>
        set((s) => ({ photoLog: [{ id: nextId('photo'), ...entry }, ...s.photoLog] })),

    // ── offers (intake form) ─────────────────────────────────
    offers: [],
    offerStatus: 'idle', // idle | submitting | submitted | error
    submitOffer: async (offer) => {
        set({ offerStatus: 'submitting' });
        try {
            const saved = await dataAdapter.saveOffer(offer);
            set((s) => ({ offers: [saved, ...s.offers], offerStatus: 'submitted' }));
            return { ok: true, offer: saved };
        } catch (err) {
            set({ offerStatus: 'error' });
            return { ok: false, error: err };
        }
    },
    resetOfferStatus: () => set({ offerStatus: 'idle' }),
}));

export default useStore;
