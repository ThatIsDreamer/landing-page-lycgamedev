import React, { Suspense, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Stage } from "@react-three/drei";
import cupModelUrl from "./assets/CupForWeb.glb?url";
import loaderVideoUrl from "./assets/loader.webm?url";

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

function LoadingScreen({
  progress,
  onComplete,
}: {
  progress: number;
  onComplete: () => void;
}) {
  const prevProgress = useRef(0);
  useEffect(() => {
    if (progress >= 100 && prevProgress.current < 100) {
      const t = setTimeout(onComplete, 400);
      return () => clearTimeout(t);
    }
    prevProgress.current = progress;
  }, [progress, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "linear-gradient(135deg, #0a0a0a 0%, #190a27 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          position: "relative",
          width: 200,
          height: 200,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Progress ring */}
        <svg
          width={200}
          height={200}
          style={{ position: "absolute", transform: "rotate(-90deg)" }}
        >
          <circle
            cx={100}
            cy={100}
            r={94}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth={6}
          />
          <motion.circle
            cx={100}
            cy={100}
            r={94}
            fill="none"
            stroke="rgba(255,255,255,0.5)"
            strokeWidth={6}
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 94}
            initial={{ strokeDashoffset: 2 * Math.PI * 94 }}
            animate={{ strokeDashoffset: 2 * Math.PI * 94 * (1 - progress / 100) }}
            transition={{ duration: 0.2 }}
          />
        </svg>
        {/* Circle clip for video */}
        <div
          style={{
            position: "relative",
            width: 160,
            height: 160,
            borderRadius: "50%",
            overflow: "hidden",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <video
            src={loaderVideoUrl}
            autoPlay
            loop
            muted
            playsInline
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>
        {/* Progress percentage */}
        <span
          style={{
            position: "absolute",
            bottom: -28,
            left: "50%",
            transform: "translateX(-50%)",
            color: "rgba(255,255,255,0.6)",
            fontSize: "0.9rem",
          }}
        >
          {Math.round(progress)}%
        </span>
      </div>
    </motion.div>
  );
}

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
  const { scene } = useGLTF(cupModelUrl);
  return (
    <group position={[0.6, 0, -4]}>
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
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  // Simulate progress 0 → 85% over ~2.5s while loading
  useEffect(() => {
    if (!loading || progress >= 85) return;
    const step = 85 / 50;
    const interval = setInterval(() => {
      setProgress((p) => {
        const next = p + step;
        return next >= 85 ? 85 : next;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [loading, progress]);

  const handleModelLoaded = () => setProgress(100);
  const handleLoadingComplete = () => setLoading(false);

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && (
          <LoadingScreen progress={progress} onComplete={handleLoadingComplete} />
        )}
      </AnimatePresence>

      <div
        style={{
          width: "100vw",
          minHeight: "100vh",
          background: "linear-gradient(135deg, #0a0a0a 0%, #190a27 100%)",
          display: "flex",
          flexDirection: "column",
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

      {/* Hero */}
      <div style={{ height: "calc(100vh - 88px)", position: "relative", flexShrink: 0 }}>
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
            <ModelWrapper onLoaded={handleModelLoaded}>
              <Stage environment="city" intensity={0.6}>
                <Model />
              </Stage>
            </ModelWrapper>
          </Suspense>
          <OrbitControls enableZoom={false} enablePan={false} />
        </Canvas>
      </div>
      </div>

      {/* Sections */}
      <section
        id="program"
        style={{
          padding: "4rem 5%",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <h2 style={{ margin: "0 0 1.5rem", color: "rgba(255,255,255,0.9)", fontSize: "1.75rem" }}>
          Программа
        </h2>
        <h3 style={{ margin: "0 0 0.75rem", color: "rgba(255,255,255,0.7)", fontSize: "1.2rem" }}>
          Расписание
        </h3>
        <p style={{ margin: 0, color: "rgba(255,255,255,0.5)", lineHeight: 1.6, maxWidth: "60ch" }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
        </p>
        <h3 style={{ margin: "2.5rem 0 0.75rem", color: "rgba(255,255,255,0.7)", fontSize: "1.2rem" }}>
          Формат
        </h3>
        <p style={{ margin: 0, color: "rgba(255,255,255,0.5)", lineHeight: 1.6, maxWidth: "60ch" }}>
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
      </section>

      <section
        id="rules"
        style={{
          padding: "4rem 5%",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <h2 style={{ margin: "0 0 1.5rem", color: "rgba(255,255,255,0.9)", fontSize: "1.75rem" }}>
          Правила участия
        </h2>
        <p style={{ margin: 0, color: "rgba(255,255,255,0.5)", lineHeight: 1.6, maxWidth: "60ch" }}>
          Placeholder text for rules. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </p>
      </section>

      <section
        id="team-chat"
        style={{
          padding: "4rem 5%",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <h2 style={{ margin: "0 0 1.5rem", color: "rgba(255,255,255,0.9)", fontSize: "1.75rem" }}>
          Чат для поиска команды
        </h2>
        <p style={{ margin: 0, color: "rgba(255,255,255,0.5)", lineHeight: 1.6, maxWidth: "60ch" }}>
          Placeholder text for team chat. Специально созданный чат для поиска команды на джем.
        </p>
      </section>

      <section
        id="partners"
        style={{
          padding: "4rem 5%",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <h2 style={{ margin: "0 0 1.5rem", color: "rgba(255,255,255,0.9)", fontSize: "1.75rem" }}>
          Партнёры и контакты
        </h2>
        <h3 style={{ margin: "0 0 0.75rem", color: "rgba(255,255,255,0.7)", fontSize: "1.2rem" }}>
          Партнёры
        </h3>
        <p style={{ margin: 0, color: "rgba(255,255,255,0.5)", lineHeight: 1.6, maxWidth: "60ch" }}>
          Placeholder: информация о партнёрах мероприятия. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </p>
        <h3 style={{ margin: "2.5rem 0 0.75rem", color: "rgba(255,255,255,0.7)", fontSize: "1.2rem" }}>
          Контакты организаторов
        </h3>
        <p style={{ margin: 0, color: "rgba(255,255,255,0.5)", lineHeight: 1.6, maxWidth: "60ch" }}>
          Placeholder: контакты организаторов. Email, телеграм и другие способы связи будут добавлены позже.
        </p>
      </section>

      <section
        id="registration"
        style={{
          padding: "4rem 5%",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <h2 style={{ margin: "0 0 1.5rem", color: "rgba(255,255,255,0.9)", fontSize: "1.75rem" }}>
          Регистрация
        </h2>
        <p style={{ margin: 0, color: "rgba(255,255,255,0.5)", lineHeight: 1.6, maxWidth: "60ch" }}>
          Placeholder: форма регистрации. Жду формы от Камиллы.
        </p>
      </section>
    </div>
    </>
  );
}