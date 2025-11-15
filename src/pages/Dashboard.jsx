import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext'; // Caminho Corrigido
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three'; // Assumindo que o Three.js está disponível via módulo
import { Code, Zap, Globe, MapPin, Mail, Phone, Clock } from 'lucide-react';

// --- Componentes Auxiliares ---

// 1. EnergyAnimation (Integrado no Hero)
const EnergyAnimation = () => {
    const mountRef = useRef(null);
    const animationFrameId = useRef(null);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const rendererRef = useRef(null);
    const particlesRef = useRef(null);

    const initThree = useCallback(() => {
        const currentMount = mountRef.current;
        if (!currentMount) return;

        const width = currentMount.clientWidth;
        const height = currentMount.clientHeight;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0a0a0a);
        sceneRef.current = scene;

        const camera = new THREE.PerspectiveCamera(65, width / height, 0.1, 1000);
        camera.position.z = 7;
        cameraRef.current = camera;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);

        while (currentMount.firstChild) {
            currentMount.removeChild(currentMount.firstChild);
        }
        currentMount.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        const particleCount = 250;
        const particlePositions = [];
        const particleColors = [];
        const particleVelocities = [];

        const color1 = new THREE.Color(0x00aaff);
        const color2 = new THREE.Color(0xffaa00);
        const maxRange = 10;

        for (let i = 0; i < particleCount; i++) {
            particlePositions.push((Math.random() * 2 - 1) * maxRange);
            particlePositions.push((Math.random() * 2 - 1) * maxRange);
            particlePositions.push((Math.random() * 2 - 1) * maxRange);

            const factor = Math.random();
            const mixedColor = new THREE.Color().copy(color1).lerp(color2, factor);
            particleColors.push(mixedColor.r, mixedColor.g, mixedColor.b);

            particleVelocities.push(
                (Math.random() - 0.5) * 0.01,
                (Math.random() - 0.5) * 0.01,
                (Math.random() - 0.5) * 0.01
            );
        }

        const particlesGeometry = new THREE.BufferGeometry();
        particlesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(particlePositions, 3));
        particlesGeometry.setAttribute('color', new THREE.Float32BufferAttribute(particleColors, 3));

        const particleMaterial = new THREE.PointsMaterial({
            size: 0.08,
            vertexColors: true,
            blending: THREE.AdditiveBlending,
            transparent: true,
            depthWrite: false,
        });
        const particleSystem = new THREE.Points(particlesGeometry, particleMaterial);
        scene.add(particleSystem);
        particlesRef.current = {
            geometry: particlesGeometry,
            positions: particlePositions,
            colors: particleColors,
            velocities: particleVelocities,
        };

        let frame = 0;
        const animate = () => {
            frame++;
            animationFrameId.current = requestAnimationFrame(animate);

            camera.position.x = Math.sin(frame * 0.0005) * 2;
            camera.position.y = Math.cos(frame * 0.0005) * 2;
            camera.lookAt(scene.position);

            const currentParticlePositions = particlesRef.current.geometry.attributes.position.array;
            const currentParticleVelocities = particlesRef.current.velocities;
            for (let i = 0; i < particleCount; i++) {
                currentParticlePositions[i * 3] += currentParticleVelocities[i * 3];
                currentParticlePositions[i * 3 + 1] += currentParticleVelocities[i * 3 + 1];
                currentParticlePositions[i * 3 + 2] += currentParticleVelocities[i * 3 + 2];

                if (Math.abs(currentParticlePositions[i * 3]) > maxRange + 2 ||
                    Math.abs(currentParticlePositions[i * 3 + 1]) > maxRange + 2 ||
                    Math.abs(currentParticlePositions[i * 3 + 2]) > maxRange + 2) {
                    currentParticlePositions[i * 3] = (Math.random() * 2 - 1) * maxRange;
                    currentParticlePositions[i * 3 + 1] = (Math.random() * 2 - 1) * maxRange;
                    currentParticlePositions[i * 3 + 2] = (Math.random() * 2 - 1) * maxRange;
                }
            }
            particlesRef.current.geometry.attributes.position.needsUpdate = true;

            particleSystem.rotation.y += 0.0008;
            particleSystem.rotation.x += 0.0002;

            renderer.render(scene, camera);
        };

        const onWindowResize = () => {
            const newWidth = currentMount.clientWidth;
            const newHeight = currentMount.clientHeight;
            if (cameraRef.current && rendererRef.current) {
                cameraRef.current.aspect = newWidth / newHeight;
                cameraRef.current.updateProjectionMatrix();
                rendererRef.current.setSize(newWidth, newHeight);
            }
        };

        window.addEventListener('resize', onWindowResize);
        animate();

        return () => {
            cancelAnimationFrame(animationFrameId.current);
            window.removeEventListener('resize', onWindowResize);
            if (currentMount && rendererRef.current.domElement) {
                currentMount.removeChild(rendererRef.current.domElement);
            }
            if (rendererRef.current) rendererRef.current.dispose();
            if (particleSystem.geometry) particleSystem.geometry.dispose();
            if (particleMaterial) particleMaterial.dispose();
        };
    }, []);

    useEffect(() => {
        initThree();
    }, [initThree]);

    return (
        <div
            ref={mountRef}
            className="absolute inset-0 z-0 w-full h-full opacity-50" // Opacidade para o fundo
            style={{ overflow: 'hidden' }}
        />
    );
};

// 2. MapHighlight (Mapa do Brasil com Tocantins em destaque)
const MapHighlight = () => {
    // SVG de um mapa abstrato do Brasil, destacando Tocantins em vermelho (red-500)
    const BrazilSVG = (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 500 500"
            className="w-full max-w-md h-auto mx-auto"
        >
            {/* Fundo do Brasil (Geometria abstrata/simplificada, verde azulado) */}
            <path
                fill="#10b981" // emerald-500
                fillOpacity="0.2"
                stroke="#059669" // emerald-600
                strokeWidth="2"
                d="M100,50 Q50,50 50,150 L50,450 Q200,550 450,450 L450,150 Q450,50 300,50 L100,50 Z"
            />
            {/* O estado de Tocantins (TO) - Centro-Norte do mapa abstrato */}
            <path
                fill="#ef4444" // red-500 (Destaque)
                stroke="#b91c1c" // red-700
                strokeWidth="2"
                className="transition duration-500 hover:scale-105 transform origin-center"
                d="M230,150 L270,150 L270,250 L230,250 Z" // Retângulo simples para TO
            />

            {/* Rótulo de Tocantins */}
            <text x="250" y="270" fontSize="20" fill="#ef4444" fontWeight="bold" textAnchor="middle">TOCANTINS</text>

            {/* Destaque da Capital Palmas */}
            <circle cx="250" cy="200" r="8" fill="#f97316" className="animate-pulse" />

            {/* Estilos e Animação */}
            <style>{`
                .animate-pulse { animation: pulse 2s infinite; }
                @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
            `}</style>
        </svg>
    );

    return (
        <div className="p-6 bg-white rounded-xl shadow-2xl">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Área de Atuação</h3>
            {BrazilSVG}
            <p className="mt-6 text-center text-gray-600 font-medium">
                Nossa atuação é focada no Brasil, com especialização e base de operações estratégicas em <strong className="text-red-600">Tocantins (TO)</strong>.
            </p>
        </div>
    );
};

// 3. AnimatedSection (Mantido como estava)
const AnimatedSection = ({ children, delay = 0, className = "" }) => {
    const [isVisible, setIsVisible] = useState(false);
    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), delay);
        return () => clearTimeout(timer);
    }, [delay]);

    return (
        <div
            className={`transition-all duration-1000 ease-out 
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} ${className}`}
        >
            {children}
        </div>
    );
};

// --- COMPONENTE PRINCIPAL: LANDING PAGE ---

const LandingPage = () => {
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();

    const heroText = "Otimize seu orçamento de projetos elétricos com precisão e velocidade.";
    const [displayedText, setDisplayedText] = useState('');
    const [cursor, setCursor] = useState('|');

    // Lógica da Animação: Efeito de Digitação
    useEffect(() => {
        if (displayedText.length < heroText.length) {
            const timer = setTimeout(() => {
                setDisplayedText(heroText.substring(0, displayedText.length + 1));
            }, 50);
            return () => clearTimeout(timer);
        }
    }, [displayedText, heroText]);

    // Lógica do cursor piscando
    useEffect(() => {
        const cursorTimer = setInterval(() => {
            setCursor(c => (c === '|' ? '' : '|'));
        }, 500);
        return () => clearInterval(cursorTimer);
    }, []);

    return (
        <div className="min-h-screen bg-gray-900 text-white relative">

            {/* Fundo 3D ANIMADO */}
            <EnergyAnimation />

            <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* 1. HERO SECTION (#home) */}
                <section id="home" className="text-center py-32 sm:py-48 min-h-[60vh] flex flex-col justify-center">
                    <AnimatedSection>
                        <h1 className="text-4xl sm:text-7xl font-extrabold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600">
                            Orçamentista Digital
                        </h1>
                    </AnimatedSection>

                    <AnimatedSection delay={500}>
                        <p className="mt-6 text-xl sm:text-3xl text-gray-300 font-light max-w-3xl mx-auto h-16">
                            {displayedText}
                            <span className="font-bold text-blue-400 transition-opacity">{displayedText.length < heroText.length ? cursor : ''}</span>
                        </p>
                    </AnimatedSection>

                    {/* CTA baseado na Autenticação */}
                    <AnimatedSection delay={2000}>
                        <div className="mt-10">
                            {isAuthenticated ? (
                                <button
                                    onClick={() => navigate('/calculadora')}
                                    className="px-10 py-4 bg-indigo-600 text-white text-xl font-semibold rounded-full shadow-2xl hover:bg-indigo-700 transition duration-300 transform hover:scale-105"
                                >
                                    Começar Cálculo Agora
                                </button>
                            ) : (
                                <button
                                    onClick={() => navigate('/login')}
                                    className="px-10 py-4 bg-blue-600 text-white text-xl font-semibold rounded-full shadow-2xl hover:bg-blue-700 transition duration-300 transform hover:scale-105"
                                >
                                    Faça Login para Acessar
                                </button>
                            )}
                        </div>
                    </AnimatedSection>

                    <AnimatedSection delay={2500}>
                        {isAuthenticated && (
                            <p className="mt-6 text-base text-gray-400">
                                Olá, {user?.username || 'Usuário'}! Acesse sua <Link to="/home" className="text-indigo-400 hover:underline font-bold">Área de Membro</Link>.
                            </p>
                        )}
                    </AnimatedSection>
                </section>

                {/* 2. ABOUT/SERVIÇOS SECTION (#servicos) */}
                <section id="servicos" className="py-20 bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-2xl mt-12 mb-20">
                    <h2 className="text-4xl font-extrabold text-center mb-12 text-blue-400">Nossos Serviços e Vantagens</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-6">

                        <AnimatedSection delay={0} className="hover:scale-105 transition-transform duration-300">
                            <div className="bg-gray-900 p-8 rounded-xl border border-indigo-500 shadow-xl space-y-3">
                                <Code size={32} className="text-indigo-400 mb-2"/>
                                <h3 className="text-2xl font-semibold">Cálculo Rápido</h3>
                                <p className="text-gray-400">Gere orçamentos elétricos detalhados em minutos, não em horas. Utilize nosso quiz inteligente para entrada de dados.</p>
                            </div>
                        </AnimatedSection>

                        <AnimatedSection delay={200} className="hover:scale-105 transition-transform duration-300">
                            <div className="bg-gray-900 p-8 rounded-xl border border-blue-500 shadow-xl space-y-3">
                                <Globe size={32} className="text-blue-400 mb-2"/>
                                <h3 className="text-2xl font-semibold">Dados Confiáveis</h3>
                                <p className="text-gray-400">Utilizamos bases de dados atualizadas do setor elétrico para garantir a precisão de cada item orçado.</p>
                            </div>
                        </AnimatedSection>

                        <AnimatedSection delay={400} className="hover:scale-105 transition-transform duration-300">
                            <div className="bg-gray-900 p-8 rounded-xl border border-amber-500 shadow-xl space-y-3">
                                <Zap size={32} className="text-amber-400 mb-2"/>
                                <h3 className="text-2xl font-semibold">Gestão de Projetos</h3>
                                <p className="text-gray-400">Armazene e gerencie todos os seus orçamentos, projetos e histórico de clientes na sua Área de Controle.</p>
                            </div>
                        </AnimatedSection>

                    </div>
                </section>

                {/* 3. CONTATO SECTION (#contato) */}
                <section id="contato" className="py-20">
                    <h2 className="text-4xl font-extrabold text-center mb-12 text-blue-400">Fale Conosco e Cobertura</h2>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

                        {/* Mapa de Cobertura */}
                        <AnimatedSection delay={0}>
                            <MapHighlight />
                        </AnimatedSection>

                        {/* Detalhes de Contato */}
                        <AnimatedSection delay={200} className="space-y-6 bg-gray-800/80 p-8 rounded-xl shadow-2xl">
                            <p className="text-lg text-gray-300">Entre em contato para solicitar orçamentos personalizados ou tirar dúvidas sobre projetos elétricos complexos.</p>

                            <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <MapPin size={24} className="text-indigo-400 min-w-8"/>
                                    <p className="text-lg text-gray-200">Palmas, Tocantins - Atendemos todo o Brasil.</p>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Mail size={24} className="text-indigo-400 min-w-8"/>
                                    <p className="text-lg text-gray-200">contato@adcomandos.com</p>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Phone size={24} className="text-indigo-400 min-w-8"/>
                                    <p className="text-lg text-gray-200">(63) 98888-7777 (WhatsApp)</p>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Clock size={24} className="text-indigo-400 min-w-8"/>
                                    <p className="text-lg text-gray-200">Seg. a Sex. | 08:00 - 18:00</p>
                                </div>
                            </div>

                            <Link to="/calculadora" className="block text-center mt-6 w-full py-3 bg-amber-500 text-gray-900 font-bold rounded-lg hover:bg-amber-600 transition duration-300">
                                Inicie Seu Orçamento Gratuito
                            </Link>
                        </AnimatedSection>

                    </div>
                </section>

            </div>
            {/* O Footer será renderizado fora deste componente, pelo seu Layout Component. */}
        </div>
    );
};

export default LandingPage;