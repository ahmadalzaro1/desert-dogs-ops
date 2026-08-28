import { useI18n } from '../i18n/I18nProvider';
import useStore from '../store/useStore';
import { STATUS_COLOR, STATUS_LABEL } from '../constants/sites';

/**
 * Inspector panel (Godseye pattern: one selected entity at a time). Renders a
 * dog site's detail when `inspector.type === 'site'`. Replaces the godseye
 * CCTV/satellite inspector, which hard-returned null for anything else.
 */
export default function SiteInspector() {
    const { t, L } = useI18n();
    const inspector = useStore((s) => s.inspector);
    const clearInspector = useStore((s) => s.clearInspector);

    if (!inspector || inspector.type !== 'site' || !inspector.site) return null;
    const site = inspector.site;
    const color = STATUS_COLOR[site.status];

    return (
        <aside className="ddo-inspector glass-panel" aria-label={t('inspector.title')}>
            <button type="button" className="ddo-inspector-close" onClick={clearInspector} aria-label={t('inspector.close')}>×</button>
            <h3 className="ddo-inspector-name">{L(site.name)}</h3>
            <span className="ddo-inspector-status" style={{ color }}>
                ● {L(STATUS_LABEL[site.status])}
            </span>

            <dl className="ddo-inspector-grid">
                <dt>{t('inspector.precision')}</dt>
                <dd>{t('inspector.precision.area')}</dd>

                <dt>{t('inspector.coords')}</dt>
                <dd>{site.lat.toFixed(5)}, {site.lon.toFixed(5)}</dd>

                {typeof site.troughs === 'number' && (
                    <>
                        <dt>{t('inspector.troughs')}</dt>
                        <dd>{site.troughs}</dd>
                    </>
                )}
                {typeof site.dogsEstimate === 'number' && (
                    <>
                        <dt>{t('inspector.dogs')}</dt>
                        <dd>{site.dogsEstimate}</dd>
                    </>
                )}
                {typeof site.costPerFillJod === 'number' && (
                    <>
                        <dt>{t('inspector.cost')}</dt>
                        <dd>{site.costPerFillJod} JOD</dd>
                    </>
                )}
                <dt>{t('inspector.water')}</dt>
                <dd>{L(site.water)}</dd>
                <dt>{t('inspector.food')}</dt>
                <dd>{L(site.food)}</dd>
            </dl>

            <p className="ddo-inspector-notes">{L(site.notes)}</p>
        </aside>
    );
}
