import { useState, useEffect, useRef } from 'react';

// Este é um mock simples. Você usaria uma biblioteca como 'react-intersection-observer' na produção.
const useInViewAnimation = (options = {}) => {
    const ref = useRef(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            // Quando o elemento entra na view (ou em uma margem definida)
            setInView(entry.isIntersecting);
        }, options);

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, [options]);

    return [ref, inView];
};

export default useInViewAnimation;