import { useI18n } from '../../i18n/I18nProvider';
import Reveal from '../Reveal';

const LICENSES = [
    {
        id: 'apache-godseye',
        name: 'Godseye (upstream)',
        spdx: 'Apache-2.0',
        url: 'https://github.com/VrushankPatel/godseye',
        note: 'Forked base — Cesium globe, HUD system, resilience pattern.',
    },
    {
        id: 'mit-vgpu',
        name: 'vgpu (Vercel Labs)',
        spdx: 'MIT',
        url: 'https://github.com/vercel-labs/vgpu',
        note: 'WebGPU/WGSL hero shader engine.',
    },
    {
        id: 'mit-desert-dogs-ops',
        name: 'Desert Dogs Ops',
        spdx: 'MIT',
        url: 'https://github.com/syntaxstudio/desert-dogs-ops',
        note: 'Site, store, sections and content.',
    },
];

export default function Footer() {
    const { t } = useI18n();

    return (
        <footer id="footer" className="ddo-footer">
            <div className="ddo-footer-inner">
                <Reveal>
                    <p className="ddo-footer-statement">{t('footer.statement')}</p>
                </Reveal>

                <Reveal className="ddo-footer-licenses" delay={0.08}>
                    <p className="ddo-footer-head">{t('footer.licenses')}</p>
                    <ul className="ddo-license-list">
                        {LICENSES.map((lic) => (
                            <li key={lic.id} className="ddo-license">
                                <a href={lic.url} target="_blank" rel="noopener noreferrer" className="ddo-license-name">
                                    {lic.name}
                                </a>
                                <span className="ddo-license-spdx">{lic.spdx}</span>
                                <span className="ddo-license-note">{lic.note}</span>
                            </li>
                        ))}
                    </ul>
                </Reveal>

                <Reveal className="ddo-footer-disclaimer" delay={0.16}>
                    <p>{t('footer.disclaimer')}</p>
                </Reveal>

                <Reveal className="ddo-footer-credit" delay={0.2}>
                    <p>{t('footer.credit')}</p>
                </Reveal>
            </div>
        </footer>
    );
}
