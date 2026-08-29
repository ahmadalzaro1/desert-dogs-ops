import { describe, it, expect, beforeEach, vi } from 'vitest';

/**
 * Exercises the store's async actions against the in-memory dataAdapter mock.
 * These are the seams that get swapped for Supabase later — verifying them now
 * means the swap is a matter of replacing `dataAdapter`, not rewriting callers.
 */

describe('field-ops store', () => {
    beforeEach(() => {
        // reset to seed state by re-importing the module fresh
        vi.resetModules();
    });

    it('assignRota rejects an empty name', async () => {
        const { default: store } = await import('../src/store/useStore');
        const s = store.getState();
        const res = await s.assignRota('rota-1', '   ');
        expect(res.ok).toBe(false);
        expect(res.reason).toBe('no-name');
        // state unchanged
        expect(store.getState().rota.find((r) => r.id === 'rota-1').assignee).toBeNull();
    });

    it('assignRota sets the assignee through the adapter', async () => {
        const { default: store } = await import('../src/store/useStore');
        const res = await store.getState().assignRota('rota-1', 'Aseel');
        expect(res.ok).toBe(true);
        expect(store.getState().rota.find((r) => r.id === 'rota-1').assignee).toBe('Aseel');
    });

    it('completeRota marks done and promotes a trough-empty site to fed', async () => {
        const { default: store } = await import('../src/store/useStore');
        await store.getState().completeRota('rota-1');
        const site = store.getState().sites.find((x) => x.id === 'safawi-roadside-troughs');
        expect(store.getState().rota.find((r) => r.id === 'rota-1').done).toBe(true);
        expect(site.status).toBe('fed');
    });

    it('submitOffer appends an offer and flips status to submitted', async () => {
        const { default: store } = await import('../src/store/useStore');
        const before = store.getState().offers.length;
        const res = await store.getState().submitOffer({ kind: 'land', detail: 'x', contact: 'y' });
        expect(res.ok).toBe(true);
        expect(store.getState().offers.length).toBe(before + 1);
        expect(store.getState().offerStatus).toBe('submitted');
    });

    it('setSiteStatus changes a site status', async () => {
        const { default: store } = await import('../src/store/useStore');
        store.getState().setSiteStatus('dhulail-private-land', 'unknown');
        expect(
            store.getState().sites.find((s) => s.id === 'dhulail-private-land').status,
        ).toBe('unknown');
    });
});
