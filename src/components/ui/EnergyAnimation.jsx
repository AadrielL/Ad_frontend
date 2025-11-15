import React, { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';

/**
 * Animação 3D de fundo para a seção Hero, simulando campos eletromagnéticos ou fluxo de energia.
 * Baseado em Three.js, cria uma rede de linhas e pontos animados.
 */
function EnergyAnimation() {
    const mountRef = useRef(null);
    const animationFrameId = useRef(null);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const rendererRef = useRef(null);
    const particlesRef = useRef(null);
    const linesRef = useRef(null);

    const initThree = useCallback(() => {
        const currentMount = mountRef.current;
        if (!currentMount) return;

        // Dimensões
        const width = currentMount.clientWidth;
        const height = currentMount.clientHeight;

        // Cena
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0a0a0a); // Fundo quase preto para contraste
        sceneRef.current = scene;

        // Câmera
        // Ajustado o FOV e a posição Z para cobrir melhor a tela (mais angular)
        const camera = new THREE.PerspectiveCamera(65, width / height, 0.1, 1000);
        camera.position.z = 7;
        cameraRef.current = camera;

        // Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);

        // Limpeza para evitar duplicação do canvas
        while (currentMount.firstChild) {
            currentMount.removeChild(currentMount.firstChild);
        }
        currentMount.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // --- Geometria da Rede de Partículas e Linhas ---
        const particleCount = 250; // Aumentado para melhor densidade
        const particlePositions = [];
        const particleColors = [];
        const particleVelocities = [];

        const color1 = new THREE.Color(0x00aaff); // Azul elétrico
        const color2 = new THREE.Color(0xffaa00); // Amarelo/Laranja energia
        const maxRange = 10; // Aumentado o range para cobrir mais espaço na nova Hero

        // Criação de Partículas
        for (let i = 0; i < particleCount; i++) {
            // Posição aleatória no cubo
            particlePositions.push((Math.random() * 2 - 1) * maxRange);
            particlePositions.push((Math.random() * 2 - 1) * maxRange);
            particlePositions.push((Math.random() * 2 - 1) * maxRange);

            // Cor com variação
            const factor = Math.random();
            const mixedColor = new THREE.Color().copy(color1).lerp(color2, factor);
            particleColors.push(mixedColor.r, mixedColor.g, mixedColor.b);

            // Velocidade aleatória para simular movimento de íons
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

        // Criação de Linhas Conectando Partículas Próximas
        // (Lógica omitida ou simplificada para desempenho, focando apenas nas partículas móveis)
        const linesGeometry = new THREE.BufferGeometry();
        const lineMaterial = new THREE.LineBasicMaterial({
            vertexColors: true,
            blending: THREE.AdditiveBlending,
            transparent: true,
            opacity: 0.5,
            depthWrite: false,
        });
        const lineSystem = new THREE.LineSegments(linesGeometry, lineMaterial);
        scene.add(lineSystem);
        linesRef.current = {
            geometry: linesGeometry,
            positions: [],
            colors: [],
        };


        // --- Animação (Loop de Renderização) ---
        let frame = 0;
        const animate = () => {
            frame++;
            animationFrameId.current = requestAnimationFrame(animate);

            // Movimento da Câmera (sutil para dar profundidade)
            camera.position.x = Math.sin(frame * 0.0005) * 2;
            camera.position.y = Math.cos(frame * 0.0005) * 2;
            camera.lookAt(scene.position);

            // Atualiza posições das partículas
            const currentParticlePositions = particlesRef.current.geometry.attributes.position.array;
            const currentParticleVelocities = particlesRef.current.velocities;
            for (let i = 0; i < particleCount; i++) {
                currentParticlePositions[i * 3] += currentParticleVelocities[i * 3];
                currentParticlePositions[i * 3 + 1] += currentParticleVelocities[i * 3 + 1];
                currentParticlePositions[i * 3 + 2] += currentParticleVelocities[i * 3 + 2];

                // Se a partícula sair do limite, reposiciona-a aleatoriamente
                if (Math.abs(currentParticlePositions[i * 3]) > maxRange + 2 ||
                    Math.abs(currentParticlePositions[i * 3 + 1]) > maxRange + 2 ||
                    Math.abs(currentParticlePositions[i * 3 + 2]) > maxRange + 2) {
                    currentParticlePositions[i * 3] = (Math.random() * 2 - 1) * maxRange;
                    currentParticlePositions[i * 3 + 1] = (Math.random() * 2 - 1) * maxRange;
                    currentParticlePositions[i * 3 + 2] = (Math.random() * 2 - 1) * maxRange;
                }
            }
            particlesRef.current.geometry.attributes.position.needsUpdate = true;

            // Rotação suave de todo o sistema de partículas e linhas
            particleSystem.rotation.y += 0.0008;
            lineSystem.rotation.y += 0.0008;
            particleSystem.rotation.x += 0.0002;
            lineSystem.rotation.x += 0.0002;

            renderer.render(scene, camera);
        };

        // --- Responsividade ---
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
            // Limpar recursos (melhoria de performance)
            rendererRef.current.dispose();
            particleSystem.geometry.dispose();
            particleMaterial.dispose();
            lineSystem.geometry.dispose();
            lineMaterial.dispose();
            scene.children.forEach(child => scene.remove(child));
        };
    }, []);

    useEffect(() => {
        initThree();
    }, [initThree]);

    return (
        <div
            ref={mountRef}
            className="absolute inset-0 z-0 w-full h-full"
            style={{ overflow: 'hidden' }}
        >
            {/* O canvas Three.js será anexado aqui */}
        </div>
    );
}

export default EnergyAnimation;