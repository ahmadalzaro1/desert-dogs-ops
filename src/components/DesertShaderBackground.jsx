import React, { useEffect, useRef, useState } from 'react';
import { DESERT_SHADER } from '../shaders/desertShader';

/**
 * WebGPU desert ambient background, rendered with vgpu (MIT).
 *
 * Resilience contract (borrowed from Godseye's independent-feed pattern): this
 * component is fully self-contained and never throws upward. Three ways it can
 * degrade, all ending in the CSS gradient fallback:
 *   1. navigator.gpu absent      → Safari / Firefox / older browsers
 *   2. init()/adapter rejects    → no compatible adapter, driver blocklist
 *   3. device lost / shader error→ caught, loop stopped, fallback swapped in
 * The fallback is a real static desert gradient, not an empty box, so the hero
 * always has its aesthetic.
 *
 * It also honours prefers-reduced-motion by slowing the clock rather than
 * freezing it (params.reduced), and pauses entirely when the tab is hidden or
 * the hero scrolls out of view — a background shader must not burn a field
 * volunteer's battery.
 */
export default function DesertShaderBackground({ className = '', intensity = 1 }) {
    const canvasRef = useRef(null);
    const [supported, setSupported] = useState(null); // null = probing
    const [failureReason, setFailureReason] = useState(null);

    useEffect(() => {
        let disposed = false;
        let gpu = null;
        let loop = null;
        let stopObservers = () => {};

        const fail = (reason) => {
            if (disposed) return;
            setFailureReason(reason);
            setSupported(false);
        };

        // Guard 1: capability probe before importing the engine at all, so
        // browsers without WebGPU never pay for the module.
        if (typeof navigator === 'undefined' || !navigator.gpu) {
            setSupported(false);
            setFailureReason('no-webgpu');
            return undefined;
        }

        const run = async () => {
            try {
                const { init, effect, surface, frameLoop, uniforms } = await import('vgpu');
                if (disposed) return;

                const canvas = canvasRef.current;
                if (!canvas) return;

                gpu = await init();
                if (disposed || !canvas.isConnected) {
                    gpu?.dispose?.();
                    return;
                }

                // Surface owns canvas sizing (autoResize + dpr clamp: a 3x dpr
                // fullscreen fragment shader is wasted fill rate on mobile).
                const view = surface(gpu, canvas, {
                    autoResize: true,
                    dpr: [1, 2],
                    alphaMode: 'opaque',
                    label: 'desert-hero',
                });

                const prefersReduced =
                    typeof window !== 'undefined' &&
                    typeof window.matchMedia === 'function' &&
                    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

                const params = uniforms(gpu, {
                    time: 0,
                    aspect: 1,
                    intensity,
                    reduced: prefersReduced ? 1 : 0,
                });

                const fx = effect(gpu, DESERT_SHADER, { label: 'desert', set: { params } });

                // Surface device-level errors instead of rendering silent black.
                gpu.onError?.((err) => {
                    console.error('[vgpu] device error', err);
                    fail('device-error');
                    try {
                        loop?.stop();
                    } catch {
                        /* already stopped */
                    }
                });

                const start = performance.now();
                let visible = true;
                let onScreen = true;

                const syncRunning = () => {
                    const shouldRun = visible && onScreen && !disposed;
                    if (shouldRun && !loop) {
                        loop = frameLoop(gpu, (frame) => {
                            const [w, h] = view.size;
                            params.set({
                                time: (performance.now() - start) / 1000,
                                aspect: h > 0 ? w / h : 1,
                            });
                            frame.pass({ target: view, clear: true }, (pass) => pass.draw(fx));
                        });
                    } else if (!shouldRun && loop) {
                        loop.stop();
                        loop = null;
                    }
                };

                const onVisibility = () => {
                    visible = !document.hidden;
                    syncRunning();
                };
                document.addEventListener('visibilitychange', onVisibility);

                // Pause when the hero is scrolled away.
                let io = null;
                if (typeof IntersectionObserver === 'function') {
                    io = new IntersectionObserver(
                        (entries) => {
                            onScreen = entries.some((e) => e.isIntersecting);
                            syncRunning();
                        },
                        { threshold: 0.01 },
                    );
                    io.observe(canvas);
                }

                stopObservers = () => {
                    document.removeEventListener('visibilitychange', onVisibility);
                    io?.disconnect();
                };

                syncRunning();
                if (!disposed) setSupported(true);
            } catch (err) {
                console.error('[vgpu] desert background unavailable', err);
                fail('init-failed');
                try {
                    gpu?.dispose?.();
                } catch {
                    /* nothing to clean */
                }
                gpu = null;
            }
        };

        run();

        return () => {
            disposed = true;
            stopObservers();
            try {
                loop?.stop();
            } catch {
                /* already stopped */
            }
            try {
                // dispose() tears down loops, caches and the device in order.
                gpu?.dispose?.();
            } catch {
                /* best effort */
            }
        };
        // intensity is read once at init; changing it remounts via key upstream.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className={`ddo-shader-root ${className}`} aria-hidden="true" data-gpu={String(supported)}>
            {/* Fallback paints first and stays beneath: if WebGPU dies mid-session
                the canvas simply stops covering it, so there is never a blank hero. */}
            <div className="ddo-shader-fallback" data-reason={failureReason || ''} />
            {supported !== false && <canvas ref={canvasRef} className="ddo-shader-canvas" />}
        </div>
    );
}
