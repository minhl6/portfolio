import { useEffect } from 'react';

export function useFadeIn(deps = []) {
    useEffect(() => {
        const fadeEls = document.querySelectorAll('.fade-in');

        if (!('IntersectionObserver' in window) || !fadeEls.length) {
            fadeEls.forEach((el) => el.classList.add('is-visible'));
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0 }
        );

        fadeEls.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
}
