import { useI18n } from '../../i18n/I18nProvider';
import { getSources, PROBLEM_SOURCE_IDS } from '../../constants/sources';
import Reveal from '../Reveal';

/**
 * The situation on the ground — plain language, sourced. Every factual
 * claim below is backed by PROBLEM_SOURCE_IDS; the citation list renders
 * real, fetch-verified links only (see constants/sources.js).
 */
export default function Problem() {
    const { t, L } = useI18n();
    const sources = getSources(PROBLEM_SOURCE_IDS);

    return (
        <section id="problem" className="ddo-section">
            <div className="ddo-section-head">
                <Reveal><span className="ddo-eyebrow">{t('problem.eyebrow')}</span></Reveal>
                <Reveal delay={0.08}><h2 className="ddo-section-title">{t('problem.title')}</h2></Reveal>
                <Reveal delay={0.16}><p className="ddo-section-lead">{t('problem.lead')}</p></Reveal>
            </div>

            <div className="ddo-problem-grid">
                <Reveal className="ddo-card">
                    <h3 className="ddo-card-title">{t('problem.enclosure.title')}</h3>
                    <p className="ddo-card-body">{t('problem.enclosure.body')}</p>
                </Reveal>
                <Reveal className="ddo-card" delay={0.08}>
                    <h3 className="ddo-card-title">{t('problem.water.title')}</h3>
                    <p className="ddo-card-body">{t('problem.water.body')}</p>
                </Reveal>
                <Reveal className="ddo-card" delay={0.16}>
                    <h3 className="ddo-card-title">{t('problem.legal.title')}</h3>
                    <p className="ddo-card-body">{t('problem.legal.body')}</p>
                </Reveal>
            </div>

            <Reveal className="ddo-citation-block">
                <p className="ddo-citation-head">{t('problem.sources')}</p>
                <ul className="ddo-citation-list">
                    {sources.map((s) => (
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
