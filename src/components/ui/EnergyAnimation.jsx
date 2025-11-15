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
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;
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
    const particleCount = 200;
    const particlePositions = [];
    const particleColors = [];
    const particleVelocities = []; // Para movimento individual das partículas

    const linePositions = [];
    const lineColors = [];

    const color1 = new THREE.Color(0x00aaff); // Azul elétrico
    const color2 = new THREE.Color(0xffaa00); // Amarelo/Laranja energia
    const maxRange = 8; // Espaço onde as partículas e linhas se movem

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
    const tempPositions = particlePositions; // Apenas para referência de posições
    for (let i = 0; i < particleCount; i++) {
      for (let j = i + 1; j < particleCount; j++) {
        const x1 = tempPositions[i * 3];
        const y1 = tempPositions[i * 3 + 1];
        const z1 = tempPositions[i * 3 + 2];
        const x2 = tempPositions[j * 3];
        const y2 = tempPositions[j * 3 + 1];
        const z2 = tempPositions[j * 3 + 2];

        const distance = Math.sqrt(
          (x2 - x1) ** 2 + (y2 - y1) ** 2 + (z2 - z1) ** 2
        );

        if (distance < 1.5) { // Conecta partículas que estão próximas
          linePositions.push(x1, y1, z1, x2, y2, z2);

          const factor1 = Math.random();
          const mixedColor1 = new THREE.Color().copy(color1).lerp(color2, factor1);
          lineColors.push(mixedColor1.r, mixedColor1.g, mixedColor1.b);

          const factor2 = Math.random();
          const mixedColor2 = new THREE.Color().copy(color1).lerp(color2, factor2);
          lineColors.push(mixedColor2.r, mixedColor2.g, mixedColor2.b);
        }
      }
    }

    const linesGeometry = new THREE.BufferGeometry();
    linesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    linesGeometry.setAttribute('color', new THREE.Float32BufferAttribute(lineColors, 3));

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
      positions: linePositions, // Manter referência para reconstruir se necessário
      colors: lineColors,
    };

    // --- Animação (Loop de Renderização) ---
    let frame = 0;
    const animate = () => {
      frame++;
      animationFrameId.current = requestAnimationFrame(animate);

      // Movimento da Câmera (sutil para dar profundidade)
      camera.position.x = Math.sin(frame * 0.0005) * 2;
      camera.position.y = Math.cos(frame * 0.0005) * 2;
      camera.lookAt(scene.position); // Garante que a câmera sempre olhe para o centro

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
      rendererRef.current.dispose();
      particleSystem.geometry.dispose();
      particleMaterial.dispose();
      lineSystem.geometry.dispose();
      lineMaterial.dispose();
      // Limpar refs
      sceneRef.current = null;
      cameraRef.current = null;
      rendererRef.current = null;
      particlesRef.current = null;
      linesRef.current = null;
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