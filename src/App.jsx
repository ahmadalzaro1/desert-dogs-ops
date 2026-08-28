import { useEffect } from 'react';
import DesertNav from './components/DesertNav';
import SiteInspector from './components/SiteInspector';
import RenderBoundary from './components/RenderBoundary';
import Hero from './components/sections/Hero';
import Problem from './components/sections/Problem';
import DogSitesMap from './components/DogSitesMap';
import FieldOps from './components/sections/FieldOps';
import Evidence from './components/sections/Evidence';
import GetInvolved from './components/sections/GetInvolved';
import Footer from './components/sections/Footer';

/**
 * Site shell. Lenis smooth-scroll is opt-in and disabled under
 * prefers-reduced-motion so we never fight the OS accessibility setting.
 */
export default function App() {
    useEffect(() => {
        let lenis = null;
        let raf = null;
        const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
        if (reduce) return undefined;

        (async () => {
            try {
                const Lenis = (await import('lenis')).default;
                lenis = new Lenis({ duration: 1.1, smoothWheel: true });
                const tick = (time) => {
                    lenis.raf(time);
                    raf = requestAnimationFrame(tick);
                };
                raf = requestAnimationFrame(tick);
            } catch {
                /* Lenis is a progressive enhancement; scroll works without it. */
            }
        })();

        return () => {
            if (raf) cancelAnimationFrame(raf);
            lenis?.destroy?.();
        };
    }, []);

    return (
        <div className="ddo-app">
            <DesertNav />
            <main id="main">
                <Hero />
                <Problem />
                <DogSitesMap />
                <FieldOps />
                <Evidence />
                <GetInvolved />
            </main>
            <Footer />
            <RenderBoundary name="inspector">
                <SiteInspector />
            </RenderBoundary>
        </div>
    );
}
