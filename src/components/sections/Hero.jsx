import { useI18n } from '../../i18n/I18nProvider';
import DesertShaderBackground from '../DesertShaderBackground';
import Reveal from '../Reveal';

/**
 * Full-viewport hero. The WebGPU shader paints behind; the CSS gradient on
 * .ddo-shader-fallback is the real fallback for browsers without navigator.gpu.
 * Content sits in the dark upper band where we measured >=5:1 contrast.
 */
export default function Hero() {
    const { t } = useI18n();

    return (
        <section id="hero" className="ddo-hero">
            <DesertShaderBackground />

            <div className="ddo-hero-inner">
                <Reveal>
                    <p className="ddo-eyebrow">{t('hero.kicker')}</p>
                </Reveal>
                <Reveal delay={0.08}>
                    <h1 className="ddo-hero-title">{t('hero.title')}</h1>
                </Reveal>
                <Reveal delay={0.16}>
                    <p className="ddo-hero-sub">{t('hero.subtitle')}</p>
                </Reveal>
                <Reveal delay={0.24}>
                    <div className="ddo-hero-cta">
                        <a className="ddo-btn ddo-btn-primary" href="#involved">{t('hero.cta')}</a>
                        <a className="ddo-btn ddo-btn-ghost" href="#problem">{t('hero.learn')}</a>
                    </div>
                </Reveal>
                <Reveal delay={0.32}>
                    <p className="ddo-hero-meta">{t('hero.locations')}</p>
                </Reveal>
            </div>

            <a className="ddo-scroll-cue" href="#problem" aria-label={t('nav.problem')}>
                <span aria-hidden="true">↓</span>
            </a>
        </section>
    );
}
