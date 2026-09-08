import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface CyberneticOrbProps {
  className?: string;
}

export const CyberneticOrb: React.FC<CyberneticOrbProps> = ({ className = '' }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isInteracting, setIsInteracting] = useState(false);
  const [pulseActive, setPulseActive] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Dimensions
    const width = container.clientWidth || 380;
    const height = container.clientHeight || 380;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 7;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);
      container.appendChild(renderer.domElement);
    } catch (e) {
      console.warn('WebGL initialization failed, falling back', e);
      return;
    }

    // Main 3D Pivot Group
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // Inner Orb Core Group (affected by mouse tilt)
    const orbGroup = new THREE.Group();
    mainGroup.add(orbGroup);

    // 1. Base Metallic Sphere
    const sphereGeo = new THREE.SphereGeometry(2, 64, 64);
    const sphereMat = new THREE.MeshStandardMaterial({
      color: 0x081119,
      roughness: 0.35,
      metalness: 0.85,
      emissive: 0x031824,
      emissiveIntensity: 0.6
    });
    const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
    orbGroup.add(sphereMesh);

    // 2. Faceted Armor Contour (Geodesic Wireframe Overlay)
    const wireGeo = new THREE.IcosahedronGeometry(2.03, 2);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x1f3c4d,
      wireframe: true,
      transparent: true,
      opacity: 0.35
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    orbGroup.add(wireMesh);

    // 3. Central Glowing Iris / Optic Core (Front Facing)
    const irisGroup = new THREE.Group();
    irisGroup.position.z = 1.85;
    orbGroup.add(irisGroup);

    // Procedural Glowing Core Texture
    const createGlowTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d')!;
      const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.2, 'rgba(0, 240, 255, 0.9)');
      grad.addColorStop(0.5, 'rgba(6, 182, 212, 0.5)');
      grad.addColorStop(0.8, 'rgba(8, 51, 68, 0.2)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 256, 256);
      return new THREE.CanvasTexture(canvas);
    };

    const coreSpriteMat = new THREE.SpriteMaterial({
      map: createGlowTexture(),
      color: 0x00f0ff,
      transparent: true,
      blending: THREE.AdditiveBlending
    });
    const coreSprite = new THREE.Sprite(coreSpriteMat);
    coreSprite.scale.set(2.2, 2.2, 1);
    irisGroup.add(coreSprite);

    // Core central pupil disc
    const pupilGeo = new THREE.CircleGeometry(0.25, 32);
    const pupilMat = new THREE.MeshBasicMaterial({
      color: 0x67e8f9,
      transparent: true,
      opacity: 0.95
    });
    const pupilMesh = new THREE.Mesh(pupilGeo, pupilMat);
    pupilMesh.position.z = 0.05;
    irisGroup.add(pupilMesh);

    // Center white laser dot
    const dotGeo = new THREE.CircleGeometry(0.08, 16);
    const dotMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const dotMesh = new THREE.Mesh(dotGeo, dotMat);
    dotMesh.position.z = 0.06;
    irisGroup.add(dotMesh);

    // 4. Concentric HUD Targeting Reticle Texture
    const createHudTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d')!;
      const cx = 256;
      const cy = 256;

      ctx.clearRect(0, 0, 512, 512);

      // Outer thin circle
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.7)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cx, cy, 210, 0, Math.PI * 2);
      ctx.stroke();

      // Dashed circle
      ctx.setLineDash([12, 10]);
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.85)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(cx, cy, 165, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Inner solid ring
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.9)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cx, cy, 110, 0, Math.PI * 2);
      ctx.stroke();

      // Crosshairs ticks
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.95)';
      ctx.lineWidth = 3.5;
      // Top
      ctx.beginPath();
      ctx.moveTo(cx, cy - 235);
      ctx.lineTo(cx, cy - 185);
      ctx.stroke();
      // Bottom
      ctx.beginPath();
      ctx.moveTo(cx, cy + 185);
      ctx.lineTo(cx, cy + 235);
      ctx.stroke();
      // Left
      ctx.beginPath();
      ctx.moveTo(cx - 235, cy);
      ctx.lineTo(cx - 185, cy);
      ctx.stroke();
      // Right
      ctx.beginPath();
      ctx.moveTo(cx + 185, cy);
      ctx.lineTo(cx + 235, cy);
      ctx.stroke();

      // Corner target brackets [ ]
      const bracketDist = 130;
      const bracketLen = 22;
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.85)';
      ctx.lineWidth = 2.5;
      // Top-Left
      ctx.beginPath();
      ctx.moveTo(cx - bracketDist, cy - bracketDist + bracketLen);
      ctx.lineTo(cx - bracketDist, cy - bracketDist);
      ctx.lineTo(cx - bracketDist + bracketLen, cy - bracketDist);
      ctx.stroke();
      // Top-Right
      ctx.beginPath();
      ctx.moveTo(cx + bracketDist, cy - bracketDist + bracketLen);
      ctx.lineTo(cx + bracketDist, cy - bracketDist);
      ctx.lineTo(cx + bracketDist - bracketLen, cy - bracketDist);
      ctx.stroke();

      return new THREE.CanvasTexture(canvas);
    };

    const hudGeo = new THREE.PlaneGeometry(3.3, 3.3);
    const hudMat = new THREE.MeshBasicMaterial({
      map: createHudTexture(),
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    });
    const hudPlane = new THREE.Mesh(hudGeo, hudMat);
    hudPlane.position.z = 1.9;
    orbGroup.add(hudPlane);

    // 5. Curved Glowing Neon Green Arcs (Left & Right Thrusters)
    const createCurvedArc = (isLeft: boolean) => {
      const arcGroup = new THREE.Group();
      // Torus section for 3D curved arc
      const torusGeo = new THREE.TorusGeometry(2.1, 0.055, 16, 64, Math.PI / 3);
      const torusMat = new THREE.MeshBasicMaterial({
        color: 0xc2f866,
        transparent: true,
        opacity: 0.95
      });
      const arcMesh = new THREE.Mesh(torusGeo, torusMat);
      if (isLeft) {
        arcMesh.rotation.z = Math.PI * 0.83;
        arcMesh.position.set(-0.25, 0, 0);
      } else {
        arcMesh.rotation.z = -Math.PI * 0.17;
        arcMesh.position.set(0.25, 0, 0);
      }
      arcGroup.add(arcMesh);
      return arcGroup;
    };

    const leftArc = createCurvedArc(true);
    const rightArc = createCurvedArc(false);
    orbGroup.add(leftArc);
    orbGroup.add(rightArc);

    // 6. Top Apex Sensor Beacon with pulsating emitter
    const beaconGroup = new THREE.Group();
    beaconGroup.position.set(0, 2.05, 0);
    orbGroup.add(beaconGroup);

    // Sensor housing post
    const postGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.25, 16);
    const postMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.9, roughness: 0.2 });
    const postMesh = new THREE.Mesh(postGeo, postMat);
    beaconGroup.add(postMesh);

    // Glowing green diode
    const diodeGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const diodeMat = new THREE.MeshBasicMaterial({ color: 0xc2f866 });
    const diodeMesh = new THREE.Mesh(diodeGeo, diodeMat);
    diodeMesh.position.y = 0.16;
    beaconGroup.add(diodeMesh);

    // Diode aura sprite
    const diodeAuraMat = new THREE.SpriteMaterial({
      map: createGlowTexture(),
      color: 0xc2f866,
      transparent: true,
      blending: THREE.AdditiveBlending
    });
    const diodeAura = new THREE.Sprite(diodeAuraMat);
    diodeAura.scale.set(0.9, 0.9, 1);
    diodeAura.position.y = 0.16;
    beaconGroup.add(diodeAura);

    // Vertical sensor beam line
    const beamPoints = [new THREE.Vector3(0, 0.16, 0), new THREE.Vector3(0, 0.55, 0)];
    const beamGeo = new THREE.BufferGeometry().setFromPoints(beamPoints);
    const beamMat = new THREE.LineBasicMaterial({ color: 0xc2f866, transparent: true, opacity: 0.8 });
    const beamLine = new THREE.Line(beamGeo, beamMat);
    beaconGroup.add(beamLine);

    // 7. Outer 3D Holographic Orbit Gimbal Rings (spinning in 3D perspective)
    const gimbalRing1Group = new THREE.Group();
    mainGroup.add(gimbalRing1Group);

    // Outer Dashed Green Orbital Ring
    const createDashedOrbit = (radius: number, color: number) => {
      const curve = new THREE.EllipseCurve(0, 0, radius, radius, 0, 2 * Math.PI, false, 0);
      const points = curve.getPoints(120);
      const orbitGeo = new THREE.BufferGeometry().setFromPoints(points);
      const orbitMat = new THREE.LineDashedMaterial({
        color: color,
        linewidth: 1,
        scale: 1,
        dashSize: 0.25,
        gapSize: 0.25,
        transparent: true,
        opacity: 0.45
      });
      const orbitLine = new THREE.Line(orbitGeo, orbitMat);
      orbitLine.computeLineDistances();
      return orbitLine;
    };

    const orbit1 = createDashedOrbit(2.7, 0x22c55e);
    orbit1.rotation.x = Math.PI * 0.15;
    orbit1.rotation.y = Math.PI * 0.1;
    gimbalRing1Group.add(orbit1);

    const orbit2 = createDashedOrbit(2.5, 0x38bdf8);
    orbit2.rotation.x = -Math.PI * 0.12;
    orbit2.rotation.y = -Math.PI * 0.15;
    gimbalRing1Group.add(orbit2);

    // 8. 3D Floating Telemetry HUD Card
    const createTelemetryCardTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 180;
      const ctx = canvas.getContext('2d')!;

      // Background rounded card
      ctx.fillStyle = 'rgba(9, 13, 18, 0.85)';
      ctx.strokeStyle = 'rgba(51, 65, 85, 0.8)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(10, 10, 236, 160, 16);
      ctx.fill();
      ctx.stroke();

      // Heading "400-835"
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 22px monospace';
      ctx.fillText('400-835', 26, 42);

      // Status lines
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(26, 60);
      ctx.lineTo(190, 60);
      ctx.stroke();

      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(26, 80);
      ctx.lineTo(160, 80);
      ctx.stroke();

      ctx.strokeStyle = '#c2f866';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(26, 100);
      ctx.lineTo(210, 100);
      ctx.stroke();

      // Telemetry Status
      ctx.fillStyle = '#64748b';
      ctx.font = '16px monospace';
      ctx.fillText('SN-059', 26, 132);

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 15px monospace';
      ctx.fillText('SYS.RDY // 100%', 100, 132);

      return new THREE.CanvasTexture(canvas);
    };

    const teleCardGeo = new THREE.PlaneGeometry(1.2, 0.85);
    const teleCardMat = new THREE.MeshBasicMaterial({
      map: createTelemetryCardTexture(),
      transparent: true,
      opacity: 0.95,
      side: THREE.DoubleSide
    });
    const teleCardMesh = new THREE.Mesh(teleCardGeo, teleCardMat);
    teleCardMesh.position.set(1.1, -1.0, 2.1);
    orbGroup.add(teleCardMesh);

    // 9. Floating 3D Star / Cyber-Particle Field
    const particleCount = 70;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = 2.4 + Math.random() * 1.5;

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      if (Math.random() > 0.5) {
        colors[i * 3] = 0.76; // #c2f866 lime
        colors[i * 3 + 1] = 0.97;
        colors[i * 3 + 2] = 0.4;
      } else {
        colors[i * 3] = 0.22; // #38bdf8 cyan
        colors[i * 3 + 1] = 0.74;
        colors[i * 3 + 2] = 0.97;
      }
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.055,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    mainGroup.add(particles);

    // 10. Dynamic Scene Lighting
    const ambientLight = new THREE.AmbientLight(0x0f2330, 1.2);
    scene.add(ambientLight);

    const cyanCoreLight = new THREE.PointLight(0x00f0ff, 3.5, 8);
    cyanCoreLight.position.set(0, 0, 3);
    scene.add(cyanCoreLight);

    const limeBeaconLight = new THREE.PointLight(0xc2f866, 2.0, 5);
    limeBeaconLight.position.set(0, 2.8, 0.5);
    scene.add(limeBeaconLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.5);
    rimLight.position.set(-4, 3, -2);
    scene.add(rimLight);

    // 11. Mouse / Pointer Tracking & Interactive 3D Gyro
    let targetRotationX = 0;
    let targetRotationY = 0;
    let currentRotationX = 0;
    let currentRotationY = 0;
    let pulseProgress = 0;

    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      targetRotationY = x * 0.65;
      targetRotationX = -y * 0.55;
    };

    const onPointerLeave = () => {
      targetRotationX = 0;
      targetRotationY = 0;
    };

    container.addEventListener('pointermove', onPointerMove);
    container.addEventListener('pointerleave', onPointerLeave);

    // 12. Animation Loop with 60FPS Refresh
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth damped lerp toward mouse target
      currentRotationX += (targetRotationX - currentRotationX) * 0.08;
      currentRotationY += (targetRotationY - currentRotationY) * 0.08;

      // Gentle continuous organic 3D float/wobble
      const idleFloatY = Math.sin(elapsedTime * 1.5) * 0.12;
      const idleTiltZ = Math.cos(elapsedTime * 1.2) * 0.04;
      orbGroup.position.y = idleFloatY;
      orbGroup.rotation.z = idleTiltZ;

      // Apply mouse-driven 3D rotation to orb and HUD elements
      orbGroup.rotation.x = currentRotationX + Math.sin(elapsedTime * 0.8) * 0.03;
      orbGroup.rotation.y = currentRotationY + Math.cos(elapsedTime * 0.7) * 0.04;

      // Rotate HUD reticle continuously
      hudPlane.rotation.z = -elapsedTime * 0.35;

      // Slowly rotate outer gimbal rings in 3D
      gimbalRing1Group.rotation.z = elapsedTime * 0.12;
      gimbalRing1Group.rotation.y = elapsedTime * 0.08;

      // Swirl particles
      particles.rotation.y = elapsedTime * 0.06;
      particles.rotation.x = Math.sin(elapsedTime * 0.2) * 0.1;

      // Pulsate glowing core and beacon
      const corePulse = 2.0 + Math.sin(elapsedTime * 4.0) * 0.3;
      coreSprite.scale.set(corePulse, corePulse, 1);
      cyanCoreLight.intensity = 3.2 + Math.sin(elapsedTime * 4.0) * 0.8;

      // Pulsate neon green beacon aura
      const beaconPulse = 0.8 + Math.sin(elapsedTime * 6.0) * 0.3;
      diodeAura.scale.set(beaconPulse, beaconPulse, 1);

      // Handle interactive click pulse wave
      if (pulseProgress > 0) {
        pulseProgress -= 0.03;
        const scaleWave = 1 + Math.sin(pulseProgress * Math.PI) * 0.12;
        mainGroup.scale.set(scaleWave, scaleWave, scaleWave);
        cyanCoreLight.intensity = 5.0 * pulseProgress + 3.0;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize handling
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth || 380;
      const newHeight = container.clientHeight || 380;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerleave', onPointerLeave);
      cancelAnimationFrame(animationFrameId);

      // Clean up Three.js resources
      renderer.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  const triggerPulse = () => {
    setPulseActive(true);
    setTimeout(() => setPulseActive(false), 800);
  };

  return (
    <div
      className={`relative flex items-center justify-center select-none cursor-grab active:cursor-grabbing ${className}`}
      onMouseDown={() => setIsInteracting(true)}
      onMouseUp={() => setIsInteracting(false)}
      onClick={triggerPulse}
    >
      {/* Outer ambient atmospheric glow */}
      <div className="absolute w-80 h-80 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none transition-all duration-700 hover:bg-emerald-400/30" />
      <div className="absolute w-56 h-56 rounded-full bg-cyan-500/25 blur-2xl pointer-events-none" />

      {/* 3D WebGL Canvas Container */}
      <div
        ref={mountRef}
        className="w-72 h-72 sm:w-88 sm:h-88 md:w-[420px] md:h-[420px] relative z-10 flex items-center justify-center touch-none"
        title="Interactive 3D Cybernetic Orb - Drag or hover to tilt"
      />

      {/* Subtle interactive helper hint */}
      <div className="absolute -bottom-2 z-20 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[10px] font-mono text-zinc-400 flex items-center gap-1.5 pointer-events-none opacity-70 hover:opacity-100 transition">
        <span className="w-1.5 h-1.5 rounded-full bg-[#c2f866] animate-pulse" />
        <span>3D Interactive • Move cursor to tilt &amp; click to scan</span>
      </div>
    </div>
  );
};
