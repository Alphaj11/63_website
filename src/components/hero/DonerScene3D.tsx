'use client';
/**
 * Scène WebGL de la broche (React Three Fiber).
 * Chargée en différé et uniquement si WebGL est disponible ; sinon HeroFallback prend le relais.
 * Tout est procédural (aucun modèle 3D à télécharger) pour rester léger.
 */
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

const INTRO = 3.6; // durée du mouvement de caméra d'introduction (s)

function makeMeatTexture() {
  const w = 512, h = 1024;
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const g = c.getContext('2d')!;
  g.fillStyle = '#3d1c0c';
  g.fillRect(0, 0, w, h);
  // Lamelles de viande superposées, irrégulières
  for (let y = -10; y < h + 10; y += 5 + Math.random() * 6) {
    let x = -40;
    while (x < w) {
      const len = 40 + Math.random() * 170;
      const th = 7 + Math.random() * 13;
      const light = 16 + Math.random() * 20;
      g.fillStyle = `hsl(${17 + Math.random() * 12}, ${42 + Math.random() * 18}%, ${light}%)`;
      g.beginPath();
      g.ellipse(x + len / 2, y + (Math.random() - 0.5) * 4, len / 2, th / 2, (Math.random() - 0.5) * 0.08, 0, Math.PI * 2);
      g.fill();
      x += len * (0.6 + Math.random() * 0.3);
    }
  }
  // Bords grillés et caramélisés
  for (let i = 0; i < 2200; i++) {
    const x = Math.random() * w, yy = Math.random() * h, r = Math.random() * 5 + 1;
    g.fillStyle = `rgba(22,8,2,${0.2 + Math.random() * 0.45})`;
    g.beginPath(); g.ellipse(x, yy, r * 2.2, r * 0.6, 0, 0, Math.PI * 2); g.fill();
  }
  // Reflets de jus
  for (let i = 0; i < 500; i++) {
    const x = Math.random() * w, yy = Math.random() * h;
    g.fillStyle = `rgba(240,170,110,${0.08 + Math.random() * 0.22})`;
    g.beginPath(); g.ellipse(x, yy, 3 + Math.random() * 8, 1 + Math.random() * 1.5, 0, 0, Math.PI * 2); g.fill();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

function softSprite(color: string) {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d')!;
  const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grd.addColorStop(0, color);
  grd.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = grd; g.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function Doner({ start }: { start: React.MutableRefObject<number> }) {
  const ref = useRef<THREE.Group>(null);
  const tex = useMemo(makeMeatTexture, []);
  const geo = useMemo(() => {
    const pts: THREE.Vector2[] = [];
    const N = 48;
    for (let i = 0; i <= N; i++) {
      const t = i / N; // 0 bas → 1 haut
      const y = -1.55 + t * 3.1;
      const r = 0.42 + 0.34 * Math.pow(t, 0.8) + Math.sin(t * 22) * 0.012 + Math.sin(t * 7) * 0.02;
      pts.push(new THREE.Vector2(r, y));
    }
    pts.unshift(new THREE.Vector2(0.02, -1.55));
    pts.push(new THREE.Vector2(0.02, 1.55));
    const g = new THREE.LatheGeometry(pts, 96);
    g.computeVertexNormals();
    return g;
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime() - start.current;
    ref.current.rotation.y = t * 0.35;
    const appear = Math.min(1, Math.max(0, (t - 0.8) / 1.2));
    const e = 1 - Math.pow(1 - appear, 3);
    ref.current.scale.setScalar(0.85 + e * 0.15);
    ref.current.position.y = -0.4 * (1 - e);
  });

  return (
    <group ref={ref}>
      <mesh geometry={geo} castShadow>
        <meshStandardMaterial map={tex} bumpMap={tex} bumpScale={0.05} roughness={0.42} metalness={0.04}
          emissive={new THREE.Color('#2a0c03')} emissiveIntensity={0.2} />
      </mesh>
      {/* Broche métallique */}
      <mesh position={[0, 2.05, 0]}>
        <cylinderGeometry args={[0.035, 0.035, 1.1, 16]} />
        <meshStandardMaterial color="#9a9a9a" metalness={1} roughness={0.25} />
      </mesh>
      <mesh position={[0, 1.6, 0]}>
        <cylinderGeometry args={[0.18, 0.12, 0.06, 32]} />
        <meshStandardMaterial color="#777" metalness={1} roughness={0.3} />
      </mesh>
      <mesh position={[0, -1.66, 0]}>
        <cylinderGeometry args={[0.7, 0.7, 0.05, 48]} />
        <meshStandardMaterial color="#555" metalness={1} roughness={0.35} />
      </mesh>
    </group>
  );
}

function Burner({ start }: { start: React.MutableRefObject<number> }) {
  const halo = useRef<THREE.MeshBasicMaterial>(null);
  const bars = useRef<THREE.MeshBasicMaterial[]>([]);
  const light = useRef<THREE.PointLight>(null);
  const tex = useMemo(() => softSprite('rgba(255,90,30,1)'), []);
  const rows = 8;
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const ramp = Math.min(1, Math.max(0, (t - start.current) / 1.2));
    if (halo.current) halo.current.opacity = ramp * (0.95 + Math.sin(t * 5) * 0.06 + Math.random() * 0.04);
    bars.current.forEach((m, i) => { m.opacity = ramp * (0.5 + Math.sin(t * 6 + i * 1.7) * 0.18); });
    if (light.current) light.current.intensity = ramp * (14 + Math.sin(t * 9) * 2 + Math.random() * 1.5);
  });
  return (
    <group position={[-0.35, 0, -1.25]}>
      <mesh scale={[4.2, 5.4, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial ref={halo} map={tex} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
      {Array.from({ length: rows }).map((_, i) => (
        <mesh key={i} position={[0, -1.3 + i * 0.37, 0.02]}>
          <planeGeometry args={[0.7, 0.03]} />
          <meshBasicMaterial ref={(m) => { if (m) bars.current[i] = m; }} color="#ff5a1a" transparent depthWrite={false} blending={THREE.AdditiveBlending} />
        </mesh>
      ))}
      <pointLight ref={light} position={[0, 0, 0.6]} color="#ff4a1a" distance={5} decay={1.5} />
    </group>
  );
}

function Embers({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null);
  const sprite = useMemo(() => softSprite('rgba(255,170,90,1)'), []);
  const { positions, speeds } = useMemo(() => {
    const p = new Float32Array(count * 3);
    const s = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 4;
      p[i * 3 + 1] = Math.random() * 5 - 2.5;
      p[i * 3 + 2] = (Math.random() - 0.5) * 3;
      s[i] = 0.25 + Math.random() * 0.8;
    }
    return { positions: p, speeds: s };
  }, [count]);
  useFrame((_, dt) => {
    const geo = ref.current?.geometry;
    if (!geo) return;
    const a = geo.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      a[i * 3 + 1] += speeds[i] * dt;
      a[i * 3] += Math.sin(a[i * 3 + 1] * 2 + i) * dt * 0.15;
      if (a[i * 3 + 1] > 2.8) { a[i * 3 + 1] = -2.2; a[i * 3] = (Math.random() - 0.5) * 3; }
    }
    geo.attributes.position.needsUpdate = true;
  });
  return (
    <points ref={ref}>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry>
      <pointsMaterial map={sprite} size={0.07} sizeAttenuation transparent depthWrite={false} blending={THREE.AdditiveBlending} color="#ffb070" />
    </points>
  );
}

function Smoke() {
  const group = useRef<THREE.Group>(null);
  const tex = useMemo(() => softSprite('rgba(220,210,200,0.55)'), []);
  const puffs = useMemo(() => Array.from({ length: 7 }).map((_, i) => ({ x: (Math.random() - 0.5) * 3, y: -1 + i * 0.6, s: 1.6 + Math.random() * 1.6, sp: 0.12 + Math.random() * 0.12, r: Math.random() * 6 })), []);
  useFrame((_, dt) => {
    group.current?.children.forEach((c, i) => {
      c.position.y += puffs[i].sp * dt;
      c.position.x += Math.sin(c.position.y + i) * dt * 0.05;
      (c as THREE.Sprite).material.rotation += dt * 0.05;
      if (c.position.y > 3) c.position.y = -2;
    });
  });
  return (
    <group ref={group}>
      {puffs.map((p, i) => (
        <sprite key={i} position={[p.x, p.y, -0.3 + (i % 3) * 0.6]} scale={[p.s, p.s, 1]}>
          <spriteMaterial map={tex} transparent opacity={0.1} depthWrite={false} rotation={p.r} />
        </sprite>
      ))}
    </group>
  );
}

function CameraRig({ start, pointer }: { start: React.MutableRefObject<number>; pointer: React.MutableRefObject<{ x: number; y: number }> }) {
  const { camera, size } = useThree();
  const look = useMemo(() => new THREE.Vector3(0, 0.1, 0), []);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() - start.current;
    const k = Math.min(1, Math.max(0, t / INTRO));
    const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2; // easeInOutCubic
    const angle = -1.2 + e * 1.5 + Math.max(0, t - INTRO) * 0.03 + pointer.current.x * 0.12;
    const portrait = size.width < size.height;
    const dist = (3.2 + e * 4.0) * (portrait ? 1.3 : 1);
    look.y = portrait ? -0.7 : 0.1;
    const h = -0.9 + e * 1.3 + pointer.current.y * 0.25;
    camera.position.set(Math.sin(angle) * dist, h, Math.cos(angle) * dist);
    camera.lookAt(look);
  });
  return null;
}

function Lights({ start }: { start: React.MutableRefObject<number> }) {
  const red = useRef<THREE.PointLight>(null);
  const key = useRef<THREE.SpotLight>(null);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() - start.current;
    const r = Math.min(1, Math.max(0, t / 1.0));
    if (red.current) red.current.intensity = r * 9;
    if (key.current) key.current.intensity = Math.min(1, Math.max(0, (t - 0.9) / 1.2)) * 60;
  });
  return (
    <>
      <ambientLight intensity={0.08} />
      <pointLight ref={red} position={[1.6, -1, 2]} color="#D34B25" distance={8} decay={1.4} />
      <spotLight ref={key} position={[3, 4, 3]} angle={0.5} penumbra={0.8} color="#ffd9a8" distance={14} decay={1.3} />
      <pointLight position={[-2, 2.5, -2]} intensity={6} color="#E9C88D" distance={8} />
    </>
  );
}

export default function DonerScene3D({ skip, lowPower }: { skip: boolean; lowPower: boolean }) {
  const pointer = useRef({ x: 0, y: 0 });
  const start = useRef<number>(0);
  const clockRef = useRef<THREE.Clock | null>(null);

  // « Passer l'intro » pendant l'animation : on saute à l'état final.
  useEffect(() => {
    if (skip && clockRef.current) start.current = Math.min(start.current, clockRef.current.getElapsedTime() - INTRO - 1);
  }, [skip]);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.current.y = (e.clientY / window.innerHeight - 0.5) * -2;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  return (
    <Canvas dpr={lowPower ? [1, 1.25] : [1, 1.8]} camera={{ fov: 34, position: [0, 0, 6] }} gl={{ antialias: !lowPower, powerPreference: 'high-performance', alpha: true }}
      onCreated={({ clock, gl, scene }) => {
        // Passer l'intro : on avance l'horloge de la scène à son état final.
        clockRef.current = clock;
        start.current = skip ? clock.getElapsedTime() - INTRO - 1 : clock.getElapsedTime();
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.15;
        scene.fog = new THREE.Fog('#151515', 5, 11);
      }}>
      <Scene start={start} pointer={pointer} lowPower={lowPower} />
    </Canvas>
  );
}

function Scene({ start: s, pointer, lowPower }: { start: React.MutableRefObject<number>; pointer: React.MutableRefObject<{ x: number; y: number }>; lowPower: boolean }) {
  return (
    <>
      <Lights start={s} />
      <CameraRig start={s} pointer={pointer} />
      <group position={[0.15, 0, 0]}>
        <Doner start={s} />
        <Burner start={s} />
      </group>
      <Embers count={lowPower ? 90 : 220} />
      <Smoke />
    </>
  );
}
