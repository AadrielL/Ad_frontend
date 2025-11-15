import React, { useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';
// Revertendo para .js. Se o erro persistir, o arquivo '../../hooks/useSmartHeader.js' precisa ser criado ou ter seu caminho ajustado.
import { useSmartHeader } from '../../hooks/useSmartHeader.js';

/**
 * Componente que renderiza uma animação abstrata de íons/energia usando Three.js.
 * Perfeito para a seção Hero da Landing Page.
 * Requer que o Three.js esteja carregado (ex: via CDN no index.html).
 */
const IonAnimation = () => {
    const mountRef = useRef(null);
    const animationRef = useRef({ scene: null, camera: null, renderer: null, particles: [], clock: new THREE.Clock() });
    // Hook usado aqui apenas para exemplo de interação com o estado global da UI
    const isHeaderVisible = useSmartHeader();

    // Função de inicialização do Three.js
    const initThree = useCallback(() => {
        const currentMount = mountRef.current;
        if (!currentMount) return;

        // 1. Configuração da Cena, Câmera e Renderizador
        const scene = new THREE.Scene();
        scene.background = null;

        const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
        camera.position.z = 5;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);

        // Limpa o DOM e anexa o novo canvas
        while (currentMount.firstChild) {
            currentMount.removeChild(currentMount.firstChild);
        }
        currentMount.appendChild(renderer.domElement);

        // 2. Criação das Partículas (Íons)
        const geometry = new THREE.SphereGeometry(0.05, 8, 8);
        const material = new THREE.MeshBasicMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.8 }); // Azul Primário

        const particleCount = 200;
        const particles = [];
        for (let i = 0; i < particleCount; i++) {
            const particle = new THREE.Mesh(geometry, material.clone());
            // Distribuição aleatória
            particle.position.set(
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10
            );
            // Armazena a direção de movimento
            particle.userData.velocity = new THREE.Vector3(
                (Math.random() - 0.5) * 0.005,
                (Math.random() - 0.5) * 0.005,
                (Math.random() - 0.5) * 0.005
            );
            particles.push(particle);
            scene.add(particle);
        }

        // 3. Criação de Conexões (Linhas de Circuito)
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0xf97316, opacity: 0.2 }); // Laranja Secundário
        const lines = [];

        // Cria linhas entre partículas aleatórias
        for (let i = 0; i < 5; i++) {
            const p1 = particles[Math.floor(Math.random() * particleCount)];
            const p2 = particles[Math.floor(Math.random() * particleCount)];
            const points = [p1.position.clone(), p2.position.clone()];
            const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
            const line = new THREE.Line(lineGeometry, lineMaterial);
            lines.push(line);
            scene.add(line);
        }


        // Armazenamento das referências
        animationRef.current = { scene, camera, renderer, particles, lines, clock: new THREE.Clock() };

        // Tratamento de redimensionamento
        const handleResize = () => {
            if (mountRef.current) {
                camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
            }
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Loop de Animação
    const animate = useCallback(() => {
        const { scene, camera, renderer, particles, clock } = animationRef.current;
        if (!scene || !camera || !renderer) return;

        requestAnimationFrame(animate);

        const delta = clock.getDelta();

        // Movimento e re-spawn das partículas
        particles.forEach(particle => {
            // Move a partícula
            particle.position.add(particle.userData.velocity.clone().multiplyScalar(delta * 50));

            // Se a partícula sair dos limites, a reposiciona
            if (particle.position.length() > 8) {
                particle.position.set(
                    (Math.random() - 0.5) * 4,
                    (Math.random() - 0.5) * 4,
                    (Math.random() - 0.5) * 4
                );
                // Atualiza a velocidade
                particle.userData.velocity.set(
                    (Math.random() - 0.5) * 0.005,
                    (Math.random() - 0.5) * 0.005,
                    (Math.random() - 0.5) * 0.005
                );
            }

            particle.rotation.y += 0.01;
        });

        camera.rotation.y += 0.0005; // Movimento sutil da câmera

        renderer.render(scene, camera);
    }, []);


    useEffect(() => {
        initThree();
        animate();

        return () => {
            if (animationRef.current.renderer) {
                animationRef.current.renderer.dispose();
            }
        };
    }, [initThree, animate]);

    return (
        <div
            ref={mountRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-0"
            style={{
                minHeight: '400px',
                opacity: isHeaderVisible ? 0.9 : 0.95
            }}
        >
            {/* O canvas do Three.js será injetado aqui */}
        </div>
    );
};

export default IonAnimation;