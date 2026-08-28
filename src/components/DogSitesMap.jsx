import { useEffect, useRef } from 'react';
import { useI18n } from '../i18n/I18nProvider';
import useStore from '../store/useStore';
import { DOG_SITES, FIELD_VIEW, STATUS_COLOR, STATUS_LABEL } from '../constants/sites';
import RenderBoundary from './RenderBoundary';

/**
 * Cesium Dog Sites map. Reuses Godseye's KEYLESS Esri World Imagery basemap
 * (no Cesium Ion token required). Plots each seed site as a coloured point by
 * status and opens the Inspector (Godseye pattern) on click.
 *
 * Resilience: wrapped in RenderBoundary upstream; if Cesium fails to init (no
 * WebGL, blocked CDN) the fallback message shows instead of a blank panel.
 */
function DogSitesMapInner() {
    const { L } = useI18n();
    const containerRef = useRef(null);
    const viewerRef = useRef(null);
    const setInspector = useStore((s) => s.setInspector);
    const setMapReady = useStore((s) => s.setMapReady);
    const setMapFailed = useStore((s) => s.setMapFailed);
    const resetViewNonce = useStore((s) => s.resetViewNonce);

    useEffect(() => {
        let disposed = false;
        const init = async () => {
            try {
                const Cesium = (await import('cesium')).default;
                if (disposed || !containerRef.current) return;

                // ── keyless Esri World Imagery (verbatim from Godseye) ──
                const esriProvider = await Cesium.ArcGisMapServerImageryProvider.fromUrl(
                    'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer',
                    { enablePickFeatures: false },
                );

                const viewer = new Cesium.Viewer(containerRef.current, {
                    terrainProvider: new Cesium.EllipsoidTerrainProvider(),
                    baseLayer: new Cesium.ImageryLayer(esriProvider),
                    baseLayerPicker: false,
                    animation: false,
                    fullscreenButton: false,
                    geocoder: false,
                    homeButton: false,
                    infoBox: false,
                    sceneModePicker: false,
                    selectionIndicator: false,
                    timeline: false,
                    navigationHelpButton: false,
                    creditContainer: document.createElement('div'),
                });
                viewerRef.current = viewer;
                viewer.scene.globe.enableLighting = false;
                viewer.scene.backgroundColor = Cesium.Color.fromCssColorString('#0a0a0f');

                // ── seed sites ──
                for (const site of DOG_SITES) {
                    viewer.entities.add({
                        id: site.id,
                        name: L(site.name),
                        position: Cesium.Cartesian3.fromDegrees(site.lon, site.lat, 0),
                        point: {
                            pixelSize: 14,
                            color: Cesium.Color.fromCssColorString(STATUS_COLOR[site.status]),
                            outlineColor: Cesium.Color.WHITE,
                            outlineWidth: 2,
                        },
                        properties: { siteId: site.id },
                    });
                }

                viewer.camera.flyTo({
                    destination: Cesium.Cartesian3.fromDegrees(
                        FIELD_VIEW.lon,
                        FIELD_VIEW.lat,
                        FIELD_VIEW.height,
                    ),
                });

                const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
                handler.setInputAction((click) => {
                    const picked = viewer.scene.pick(click.position);
                    if (Cesium.defined(picked) && picked.id?.properties?.siteId) {
                        const site = DOG_SITES.find((s) => s.id === picked.id.properties.siteId.getValue());
                        if (site) setInspector({ type: 'site', site });
                    }
                }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

                if (!disposed) setMapReady(true);
            } catch (err) {
                console.error('[Cesium] DogSites init failed', err);
                if (!disposed) setMapFailed(true);
            }
        };

        init();
        return () => {
            disposed = true;
            try {
                viewerRef.current?.destroy();
            } catch { /* ignore teardown races */ }
            viewerRef.current = null;
        };
    }, [L, setInspector, setMapReady, setMapFailed]);

    // Re-frame when the user asks for a reset (nav "Map" focus, etc.).
    useEffect(() => {
        if (!viewerRef.current || resetViewNonce === 0) return;
        const Cesium = window.Cesium;
        if (!Cesium) return;
        viewerRef.current.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(FIELD_VIEW.lon, FIELD_VIEW.lat, FIELD_VIEW.height),
        });
    }, [resetViewNonce]);

    return <div className="ddo-map-root" ref={containerRef} />;
}

export default function DogSitesMap() {
    const { t } = useI18n();
    const mapFailed = useStore((s) => s.mapFailed);

    return (
        <section id="map" className="ddo-section ddo-section--map">
            <div className="ddo-section-head">
                <span className="ddo-eyebrow">{t('map.eyebrow')}</span>
                <h2 className="ddo-section-title">{t('map.title')}</h2>
                <p className="ddo-section-lead">{t('map.lead')}</p>
            </div>
            <div className="ddo-map-wrap glass-panel">
                <RenderBoundary name="dog-sites-map">
                    <DogSitesMapInner />
                </RenderBoundary>
                {mapFailed && (
                    <div className="ddo-map-fallback">{t('map.fallback')}</div>
                )}
            </div>
            <Legend />
        </section>
    );
}

function Legend() {
    const { t, L } = useI18n();
    return (
        <div className="ddo-legend" role="list" aria-label={t('map.legend')}>
            {Object.entries(STATUS_COLOR).map(([status, color]) => (
                <span key={status} className="ddo-legend-item" role="listitem">
                    <span className="ddo-legend-dot" style={{ background: color }} aria-hidden="true" />
                    {L(STATUS_LABEL[status])}
                </span>
            ))}
        </div>
    );
}
