import { useState } from 'react';
import { useI18n } from '../../i18n/I18nProvider';
import useStore from '../../store/useStore';
import { DOG_SITES } from '../../constants/sites';
import Reveal from '../Reveal';

/**
 * Field operations: the volunteer rota, the intake form, and the photo log.
 * All writes go through the store's async actions (which today hit the in-memory
 * dataAdapter mock). Swapping in Supabase later means replacing the adapter only;
 * these components already treat writes as async and read the pending flags.
 */
export default function FieldOps() {
    const { t, L } = useI18n();
    const rota = useStore((s) => s.rota);
    const rotaPending = useStore((s) => s.rotaPending);
    const volunteerName = useStore((s) => s.volunteerName);
    const setVolunteerName = useStore((s) => s.setVolunteerName);
    const assignRota = useStore((s) => s.assignRota);
    const completeRota = useStore((s) => s.completeRota);
    const photoLog = useStore((s) => s.photoLog);

    const siteLabel = (id) => DOG_SITES.find((s) => s.id === id)?.name || { en: id, ar: id };

    return (
        <section id="ops" className="ddo-section">
            <div className="ddo-section-head">
                <Reveal><span className="ddo-eyebrow">{t('ops.eyebrow')}</span></Reveal>
                <Reveal delay={0.08}><h2 className="ddo-section-title">{t('ops.title')}</h2></Reveal>
                <Reveal delay={0.16}><p className="ddo-section-lead">{t('ops.lead')}</p></Reveal>
            </div>

            <div className="ddo-ops-grid">
                {/* ── Volunteer rota ── */}
                <Reveal className="ddo-card ddo-card--wide">
                    <h3 className="ddo-card-title">{t('ops.rota.title')}</h3>
                    <div className="ddo-name-row">
                        <label className="ddo-field-label" htmlFor="vol-name">{t('ops.rota.yourName')}</label>
                        <input
                            id="vol-name"
                            className="ddo-input"
                            value={volunteerName}
                            onChange={(e) => setVolunteerName(e.target.value)}
                            placeholder={t('ops.rota.namePlaceholder')}
                        />
                    </div>
                    <ul className="ddo-rota-list">
                        {rota.map((slot) => (
                            <li key={slot.id} className={`ddo-rota-item ${slot.done ? 'is-done' : ''}`}>
                                <span className="ddo-rota-day">{L(slot.day)}</span>
                                <span className="ddo-rota-task">{L(slot.task)}</span>
                                <span className="ddo-rota-site">{L(siteLabel(slot.siteId))}</span>
                                <span className="ddo-rota-assignee">
                                    {slot.assignee ? `· ${slot.assignee}` : t('ops.rota.open')}
                                </span>
                                <span className="ddo-rota-actions">
                                    {!slot.done && (
                                        <button
                                            type="button"
                                            className="ddo-btn ddo-btn-tiny"
                                            disabled={rotaPending[slot.id] || !volunteerName.trim()}
                                            onClick={() => assignRota(slot.id, volunteerName)}
                                        >
                                            {t('ops.rota.assign')}
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        className="ddo-btn ddo-btn-tiny ddo-btn-ghost"
                                        disabled={rotaPending[slot.id] || slot.done}
                                        onClick={() => completeRota(slot.id)}
                                    >
                                        {slot.done ? '✓' : t('ops.rota.done')}
                                    </button>
                                </span>
                            </li>
                        ))}
                    </ul>
                </Reveal>

                {/* ── Intake form ── */}
                <Reveal className="ddo-card">
                    <h3 className="ddo-card-title">{t('ops.offer.title')}</h3>
                    <p className="ddo-card-body">{t('ops.offer.body')}</p>
                    <IntakeForm />
                </Reveal>

                {/* ── Photo log ── */}
                <Reveal className="ddo-card">
                    <h3 className="ddo-card-title">{t('ops.photos.title')}</h3>
                    {photoLog.length === 0 ? (
                        <p className="ddo-card-body">{t('ops.photos.empty')}</p>
                    ) : (
                        <ul className="ddo-photo-list">
                            {photoLog.map((p) => (
                                <li key={p.id} className="ddo-photo-item">
                                    <span className="ddo-photo-date">{p.date}</span>
                                    <span className="ddo-photo-gps">{p.gps}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </Reveal>
            </div>
        </section>
    );
}

function IntakeForm() {
    const { t } = useI18n();
    const submitOffer = useStore((s) => s.submitOffer);
    const offerStatus = useStore((s) => s.offerStatus);
    const resetOfferStatus = useStore((s) => s.resetOfferStatus);
    const [form, setForm] = useState({ kind: 'land', detail: '', contact: '' });

    const submit = async (e) => {
        e.preventDefault();
        const res = await submitOffer({ ...form, kind: 'land' });
        if (res.ok) {
            setForm({ kind: 'land', detail: '', contact: '' });
            setTimeout(() => resetOfferStatus(), 2500);
        }
    };

    if (offerStatus === 'submitted') {
        return <p className="ddo-form-success">{t('ops.offer.thanks')}</p>;
    }

    return (
        <form className="ddo-form" onSubmit={submit}>
            <label className="ddo-field-label" htmlFor="offer-detail">{t('ops.offer.what')}</label>
            <textarea
                id="offer-detail"
                className="ddo-input ddo-input-area"
                value={form.detail}
                onChange={(e) => setForm({ ...form, detail: e.target.value })}
                placeholder={t('ops.offer.whatPlaceholder')}
                required
            />
            <label className="ddo-field-label" htmlFor="offer-contact">{t('ops.offer.contact')}</label>
            <input
                id="offer-contact"
                className="ddo-input"
                value={form.contact}
                onChange={(e) => setForm({ ...form, contact: e.target.value })}
                placeholder={t('ops.offer.contactPlaceholder')}
            />
            <button
                type="submit"
                className="ddo-btn ddo-btn-primary"
                disabled={offerStatus === 'submitting'}
            >
                {offerStatus === 'submitting' ? t('ops.offer.submitting') : t('ops.offer.submit')}
            </button>
            {offerStatus === 'error' && <p className="ddo-form-error">{t('ops.offer.error')}</p>}
        </form>
    );
}
