import React, { Suspense, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Stage } from "@react-three/drei";
import type { Group } from "three";
import cupModelUrl from "../assets/CupForWeb.glb?url";

function ModelWrapper({
  children,
  onLoaded,
}: {
  children: React.ReactNode;
  onLoaded: () => void;
}) {
  const called = useRef(false);
  useEffect(() => {
    if (!called.current) {
      called.current = true;
      onLoaded();
    }
  }, [onLoaded]);
  return <>{children}</>;
}

function Model({ isMobile = false }: { isMobile?: boolean }) {
  const { scene } = useGLTF(cupModelUrl);
  const groupRef = useRef<Group>(null);
  const scaleRef = useRef(isMobile ? 0 : 1);
  const rotationYRef = useRef(0);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    if (isMobile && scaleRef.current < 1) {
      groupRef.current.scale.setScalar(scaleRef.current);
      scaleRef.current = Math.min(1, scaleRef.current + delta * 1.8);
    }
    rotationYRef.current += delta * 0.4;
    groupRef.current.rotation.y = rotationYRef.current;
  });

  return (
    <group ref={groupRef} position={[0, 0, -2]} scale={!isMobile ? 1 : undefined}>
      <primitive
        object={scene}
        scale={2}
        position={[0, -0.25, 0]}
        rotation={[0.2, -0.35, 0.08]}
      />
    </group>
  );
}

export default function HeroScene({
  isMobile,
  onModelLoaded,
}: {
  isMobile: boolean;
  onModelLoaded: () => void;
}) {
  return (
    <div
      style={{
        ...(isMobile
          ? {
              order: 1,
              flex: 1,
              position: "relative" as const,
              width: "100%",
              minHeight: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none" as const,
              touchAction: "none" as const,
            }
          : {
              position: "absolute" as const,
              right: 0,
              top: 30,
              bottom: 0,
              width: "68%",
              zIndex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }),
      }}
    >
      <Canvas
        dpr={isMobile ? [1, 1.5] : [1, 2]}
        camera={{ position: [0, 0, 5], fov: isMobile ? 45 : 50 }}
        gl={{ alpha: true }}
        style={{ width: "100%", height: "100%" }}
      >
        <Suspense fallback={null}>
          <ModelWrapper onLoaded={onModelLoaded}>
            <Stage environment="city" intensity={0.6} adjustCamera={false}>
              <Model isMobile={isMobile} />
            </Stage>
          </ModelWrapper>
        </Suspense>
        {!isMobile && <OrbitControls enableZoom={false} enablePan={false} />}
      </Canvas>
    </div>
  );
}
