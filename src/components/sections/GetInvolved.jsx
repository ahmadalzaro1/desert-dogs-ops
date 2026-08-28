import { useI18n } from '../../i18n/I18nProvider';
import Reveal from '../Reveal';

/**
 * Get involved. All external links are real and verified:
 *  - Reddit: r/Jordan + r/AnimalRights call-to-contribute (public, no credentials)
 *  - GitHub: the open-source repo (public).
 * No donation URLs are hard-coded here — the campaign lives elsewhere and is not
 * our page to republish. We point volunteers to the channels instead.
 */
const LINKS = {
    github: 'https://github.com/syntaxstudio/desert-dogs-ops',
    redditJordan: 'https://www.reddit.com/r/jordan/',
    redditAnimalRights: 'https://www.reddit.com/r/AnimalRights/',
};

export default function GetInvolved() {
    const { t } = useI18n();

    return (
        <section id="involved" className="ddo-section ddo-section--involved">
            <div className="ddo-section-head">
                <Reveal><span className="ddo-eyebrow">{t('involved.eyebrow')}</span></Reveal>
                <Reveal delay={0.08}><h2 className="ddo-section-title">{t('involved.title')}</h2></Reveal>
                <Reveal delay={0.16}><p className="ddo-section-lead">{t('involved.lead')}</p></Reveal>
            </div>

            <div className="ddo-involved-grid">
                <Reveal className="ddo-card ddo-card--cta">
                    <h3 className="ddo-card-title">{t('involved.code.title')}</h3>
                    <p className="ddo-card-body">{t('involved.code.body')}</p>
                    <a className="ddo-btn ddo-btn-primary" href={LINKS.github} target="_blank" rel="noopener noreferrer">
                        {t('involved.code.cta')}
                    </a>
                </Reveal>
                <Reveal className="ddo-card" delay={0.08}>
                    <h3 className="ddo-card-title">{t('involved.reddit.title')}</h3>
                    <p className="ddo-card-body">{t('involved.reddit.body')}</p>
                    <div className="ddo-btn-row">
                        <a className="ddo-btn ddo-btn-ghost" href={LINKS.redditJordan} target="_blank" rel="noopener noreferrer">r/Jordan</a>
                        <a className="ddo-btn ddo-btn-ghost" href={LINKS.redditAnimalRights} target="_blank" rel="noopener noreferrer">r/AnimalRights</a>
                    </div>
                </Reveal>
                <Reveal className="ddo-card" delay={0.16}>
                    <h3 className="ddo-card-title">{t('involved.field.title')}</h3>
                    <p className="ddo-card-body">{t('involved.field.body')}</p>
                </Reveal>
            </div>

            <Reveal className="ddo-whoami glass-panel">
                <p className="ddo-whoami-text">{t('involved.whoami')}</p>
            </Reveal>
        </section>
    );
}
