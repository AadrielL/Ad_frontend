// src/hooks/useSmartHeader.js

import { useState, useEffect, useCallback } from 'react';

export const useSmartHeader = () => {
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    const handleScroll = useCallback(() => {
        const currentScrollY = window.scrollY;

        // Se a rolagem for grande o suficiente
        if (Math.abs(currentScrollY - lastScrollY) > 5) {
            // Rolar para baixo (esconder)
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setIsVisible(false);
            }
            // Rolar para cima (mostrar)
            else if (currentScrollY < lastScrollY) {
                setIsVisible(true);
            }
        }
        setLastScrollY(currentScrollY);
    }, [lastScrollY]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    return isVisible;
};