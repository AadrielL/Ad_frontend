import React, { useState, useEffect, useRef } from 'react';

// Assumindo que este componente usa useRef e useEffect para observação de scroll/delay.

const AnimatedSection = ({ children, className = '', delay = 0, once = true, threshold = 0.5 }) => {
    // Se você não está usando um hook de observação, isso pode ser simplificado:
    // const [isVisible, setIsVisible] = useState(false);
    // useEffect(() => {
    //     setTimeout(() => setIsVisible(true), delay);
    // }, [delay]);
    // const classes = `transition-all duration-1000 ease-out ${className} ${isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-16'}`;
    // return <div className={classes}>{children}</div>;


    // --- SE ESTIVER USANDO INTERSECTION OBSERVER (MAIS CORRETO) ---

    const ref = useRef(null);
    const [inView, setInView] = useState(false);

    // Configurações do Intersection Observer (exemplo)
    useEffect(() => {
        const currentRef = ref.current; // <--- COPIANDO A REFERÊNCIA AQUI
        if (!currentRef) return;

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setInView(true);
                if (once) observer.unobserve(currentRef);
            } else if (!once) {
                setInView(false); // Permite resetar se 'once' for falso
            }
        }, { threshold });

        observer.observe(currentRef);

        return () => {
            // USANDO A VARIÁVEL LOCAL DENTRO DO CLEANUP
            if (currentRef) { // Certificando-se de que currentRef ainda existe
                observer.unobserve(currentRef);
            }
        };
    }, [once, threshold]); // Adicione as dependências (threshold, once)

    const classes = `transition-all duration-1000 ease-out ${className}
        ${inView ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-16'}`;

    return (
        <div ref={ref} className={classes}>
            {children}
        </div>
    );
};

export default AnimatedSection;