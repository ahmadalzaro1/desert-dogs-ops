import { motion } from 'framer-motion';

/**
 * Scroll-reveal wrapper. Animates once when it enters the viewport.
 * Reduced-motion users get an instant, non-animated render (Framer reads the
 * OS preference automatically and skips transforms).
 */
export default function Reveal({ children, delay = 0, className = '', y = 24 }) {
    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, y }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay, ease: 'easeOut' }}
        >
            {children}
        </motion.div>
    );
}
