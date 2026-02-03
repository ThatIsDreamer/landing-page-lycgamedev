import React, { Suspense, useState } from "react";
import { motion } from "motion/react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Stage } from "@react-three/drei";
import sceneUrl from "./assets/scene.gltf?url";

function RegistrationButton() {
  const [hover, setHover] = useState(false);
  return (
    <motion.button
      type="button"
      onClick={() => document.getElementById("registration")?.scrollIntoView({ behavior: "smooth" })}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      animate={{ borderRadius: hover ? 8 : 9999 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      style={{
        padding: "0.5rem 1.25rem",
        fontSize: "0.95rem",
        fontWeight: 600,
        color: "rgba(255,255,255,0.95)",
        background: "rgba(255,255,255,0.15)",
        border: "1px solid rgba(255,255,255,0.25)",
        cursor: "pointer",
      }}
    >
      Регистрация
    </motion.button>
  );
}

function Model() {
  const { scene } = useGLTF(sceneUrl);
  return (
    <group position={[0.6, 0, -2]}>
      <primitive
        object={scene}
        scale={0.12}
        position={[5, -0.25, 0]}
        rotation={[0.2, -0.35, 0.08]}
      />
    </group>
  );
}

export default function App() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "linear-gradient(135deg, #0a0a0a 0%, #190a27 100%)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Top nav bar */}
      <nav
        style={{
          flexShrink: 0,
          minHeight: 88,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "0.75rem 1.5rem",
          padding: "1rem 5% 1.25rem",
          background: "rgba(0, 0, 0, 0.3)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
        }}
      >
        <span style={{ fontWeight: 700, color: "rgba(255,255,255,0.9)", fontSize: "1.35rem", letterSpacing: "0.02em" }}>
          Coffee Jam 2
        </span>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem 1.25rem", justifyContent: "flex-end", alignItems: "center" }}>
          <a href="#program" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none", fontSize: "0.95rem" }}>Программа</a>
          <a href="#rules" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none", fontSize: "0.95rem" }}>Правила участия</a>
          <a href="#team-chat" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none", fontSize: "0.95rem" }}>Чат для команды</a>
          <a href="#partners" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none", fontSize: "0.95rem" }}>Партнёры и контакты</a>
          <RegistrationButton />
        </div>
      </nav>

      {/* Main content */}
      <div style={{ flex: 1, position: "relative", minHeight: 0 }}>
      {/* Huge title behind the mug */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          paddingLeft: "8%",
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "clamp(4rem, 18vw, 14rem)",
            fontWeight: 800,
            color: "rgba(255, 255, 255, 0.28)",
            letterSpacing: "-0.02em",
            lineHeight: 0.9,
            textTransform: "uppercase",
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}
        >
          Coffee
          <br />
          Jam 2
        </h1>
      </div>

      {/* 3D mug on the right side */}
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: "45%",
          zIndex: 1,
        }}
      >
        <Canvas dpr={[1, 2]} camera={{ fov: 90 }} gl={{ alpha: true }}>
          <Suspense fallback={null}>
            <Stage environment="city" intensity={0.6}>
              <Model />
            </Stage>
          </Suspense>
          <OrbitControls enableZoom={false} enablePan={false} />
        </Canvas>
      </div>
      </div>
    </div>
  );
}