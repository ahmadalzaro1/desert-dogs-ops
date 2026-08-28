import { useI18n } from '../i18n/I18nProvider';

const NAV_ITEMS = [
    { id: 'problem', key: 'nav.problem' },
    { id: 'map', key: 'nav.map' },
    { id: 'ops', key: 'nav.ops' },
    { id: 'evidence', key: 'nav.evidence' },
    { id: 'involved', key: 'nav.involved' },
];

/**
 * Fixed top bar. Brand on the leading edge, section anchors in the middle,
 * language toggle on the trailing edge. Because dir flips with language, the
 * bar naturally mirrors for RTL — no separate layout needed.
 */
export default function DesertNav() {
    const { t, toggleLang } = useI18n();

    return (
        <header className="ddo-nav glass-panel">
            <a href="#hero" className="ddo-nav-brand" aria-label={t('site.title')}>
                <span className="ddo-nav-dot" aria-hidden="true" />
                {t('site.title')}
            </a>

            <nav className="ddo-nav-links" aria-label="Primary">
                <a href="#main" className="sr-only-focusable">{t('nav.skipToContent')}</a>
                {NAV_ITEMS.map((item) => (
                    <a key={item.id} href={`#${item.id}`} className="ddo-nav-link">
                        {t(item.key)}
                    </a>
                ))}
            </nav>

            <button
                type="button"
                className="ddo-lang-toggle"
                onClick={toggleLang}
                aria-label={t('lang.switchTo')}
                title={t('lang.switchTo')}
            >
                {t('lang.toggle')}
            </button>
        </header>
    );
}
