import { useI18n } from '../../i18n/I18nProvider';
import { getSources, POLICY_SOURCE_IDS } from '../../constants/sources';
import Reveal from '../Reveal';

/**
 * The evidence-base section. Two jobs:
 *  1. Show what the volunteer operation records (counts, feeds, imagery) — stub
 *     now, swap-ready for a real data feed later.
 *  2. Make the policy case: vaccination + spay/neuter (ABC/TNR) is the
 *     evidence-based alternative to culling. Sources are fetch-verified.
 */
export default function Evidence() {
    const { t, L } = useI18n();
    const policy = getSources(POLICY_SOURCE_IDS);

    return (
        <section id="evidence" className="ddo-section">
            <div className="ddo-section-head">
                <Reveal><span className="ddo-eyebrow">{t('evidence.eyebrow')}</span></Reveal>
                <Reveal delay={0.08}><h2 className="ddo-section-title">{t('evidence.title')}</h2></Reveal>
                <Reveal delay={0.16}><p className="ddo-section-lead">{t('evidence.lead')}</p></Reveal>
            </div>

            <Reveal className="ddo-evidence-stub glass-panel">
                <p className="ddo-evidence-stub-note">{t('evidence.stub')}</p>
            </Reveal>

            <Reveal className="ddo-policy">
                <h3 className="ddo-card-title">{t('evidence.policy.title')}</h3>
                <p className="ddo-card-body">{t('evidence.policy.body')}</p>
                <ul className="ddo-citation-list">
                    {policy.map((s) => (
                        <li key={s.id} className="ddo-citation">
                            <a href={s.url} target="_blank" rel="noopener noreferrer" className="ddo-citation-link">
                                {s.title}
                            </a>
                            <span className="ddo-citation-meta">
                                {s.publisher}{s.date ? ` · ${s.date}` : ''}
                            </span>
                            <span className="ddo-citation-supports">{L(s.supports)}</span>
                        </li>
                    ))}
                </ul>
            </Reveal>
        </section>
    );
}
