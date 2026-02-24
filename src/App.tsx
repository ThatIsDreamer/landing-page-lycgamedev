import React, { Suspense, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import loaderVideoUrl from "./assets/loader.webm?url";
import logoCoffeeJam2Url from "./assets/CoffeeJam2.png?url";
import { ArrowUpRight, ChevronDown, MessageCircle, Twitch, Menu, X } from "lucide-react";
import ShinyText from "./components/ShinyText";

const HeroSceneLazy = import.meta.env.SSR
  ? () => null
  : React.lazy(() => import("./components/HeroScene"));

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(
    () => typeof window !== "undefined" && window.matchMedia(query).matches
  );
  useEffect(() => {
    const m = window.matchMedia(query);
    const handler = () => setMatches(m.matches);
    m.addEventListener("change", handler);
    setMatches(m.matches);
    return () => m.removeEventListener("change", handler);
  }, [query]);
  return matches;
}

const FAQ_ITEMS = [
  { q: "Кто такие LycGameDev?", a: "LycGameDev – сообщество, выходящее за рамки спд проекта от лицея НИУ ВШЭ. Мы объединяем самых творческих и разноплановых людей, которые не боятся экспериментировать и создавать что-то своими руками. Наша цель – просвещать окружающих в сфере геймдева, а также дать возможность самим попробовать создавать игры." },
  { q: "Какая была идея геймджема в прошлом году?", a: "Все просто – это кофе! Этот напиток был центральным элементом во всех создающихся играх. Эта идея понравилась вам, а также она понравилась нам, поэтому мы ее доработали и разнообразили, а как именно можно будет узнать уже на самом Coffee Jam 2 ;)" },
  { q: "Сколько человек можно в команду?", a: "В свою команду вы можете позвать максимум 4 человека, но это необязательно! Вы можете работать и поодиночке над своей игрой." },
  { q: "Нужно ли уметь кодить, чтобы участвовать?", a: "Нет. Вы можете найти команду через наш чат участников и реализовать себя в любой отрасли: от геймдизайна до визуализации." },
  { q: "Почему именно кофе?", a: "В Лицее многим не спиться, и мы решили объединить людей по двум критериям: любовь к играм и любовь к кофе. Такая идея многим понравилась, поэтому мы ее продолжили развивать." },
  { q: "Что важнее: графика или идея и атмосфера?", a: "Мы за креативные идеи! Графика – это плюс, который влияет на игровой процесс, но она необязательна. Небольшая, но цельная игра ценится намного выше, чем красивый, но недоделанный проект." },
];

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

const navLinkStyle: React.CSSProperties = {
  color: "rgba(255, 255, 255, 0.8)",
  textDecoration: "none",
  fontSize: "0.95rem",
  fontWeight: 500,
  padding: "0.4rem 0.6rem",
  borderRadius: 6,
  transition: "color 0.2s, background 0.2s",
};

function NavLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick?: () => void }) {
  return (
    <a
      href={href}
      style={navLinkStyle}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = "#fff";
        e.currentTarget.style.background = "rgba(134, 0, 168, 0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = "rgba(255, 255, 255, 0.8)";
        e.currentTarget.style.background = "transparent";
      }}
    >
      {children}
    </a>
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

  // Если долго застряли на 85% (модель не вызвала onLoaded) — принудительно завершаем загрузку
  const stuckAt85 = useRef(false);
  useEffect(() => {
    if (!loading || progress !== 85) return;
    stuckAt85.current = true;
    const fallback = setTimeout(() => {
      if (stuckAt85.current) setProgress(100);
    }, 1000);
    return () => {
      clearTimeout(fallback);
      stuckAt85.current = false;
    };
  }, [loading, progress]);

  const handleModelLoaded = () => {
    stuckAt85.current = false;
    setProgress(100);
  };
  const handleLoadingComplete = () => setLoading(false);
  const [faqOpenIndex, setFaqOpenIndex] = useState<number | null>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [navOpen, setNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
          justifyContent: "center",
          alignItems: "center",
        }}
      >
      {/* Header — sticky; shrinks and slides in when scrolled */}
      <motion.nav
        initial={false}
        animate={{
          minHeight: scrolled ? (isMobile ? 48 : 56) : isMobile ? 56 : 72,
          paddingTop: scrolled ? (isMobile ? "0.35rem" : "0.5rem") : isMobile ? "0.5rem" : "0.875rem",
          paddingBottom: scrolled ? (isMobile ? "0.35rem" : "0.5rem") : isMobile ? "0.5rem" : "0.875rem",
          paddingLeft: scrolled ? "4%" : isMobile ? "4%" : "5%",
          paddingRight: scrolled ? "4%" : isMobile ? "4%" : "5%",
          y: scrolled ? 0 : -6,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 35 }}
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1rem",
          background: "rgba(10, 10, 10, 0.85)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          boxShadow: "0 1px 0 rgba(255, 255, 255, 0.04)",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <a href="#" style={{ display: "flex", alignItems: "center", textDecoration: "none" }} onClick={() => isMobile && setNavOpen(false)}>
          <motion.img
            src={logoCoffeeJam2Url}
            alt="Coffee Jam 2"
            initial={false}
            animate={{ height: scrolled ? (isMobile ? 30 : 36) : isMobile ? 36 : 44 }}
            transition={{ type: "spring", stiffness: 400, damping: 35 }}
            style={{ width: "auto", display: "block" }}
          />
        </a>

        {isMobile ? (
          <>
            <button
              type="button"
              onClick={() => setNavOpen((o) => !o)}
              aria-label={navOpen ? "Закрыть меню" : "Открыть меню"}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 44,
                height: 44,
                padding: 0,
                border: "none",
                background: "transparent",
                color: "#E9AC80",
                cursor: "pointer",
                borderRadius: 8,
              }}
            >
              {navOpen ? <X size={24} strokeWidth={2} /> : <Menu size={24} strokeWidth={2} />}
            </button>
            <AnimatePresence>
              {navOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    background: "rgba(10, 10, 10, 0.98)",
                    backdropFilter: "blur(12px)",
                    borderBottom: "1px solid rgba(233, 172, 128, 0.3)",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    padding: "0.5rem 4% 1rem",
                    gap: "0.25rem",
                  }}
                >
                  <NavLink href="#schedule" onClick={() => setNavOpen(false)}>Расписание</NavLink>
                  <NavLink href="#format" onClick={() => setNavOpen(false)}>Информация</NavLink>
                  <NavLink href="#nominations" onClick={() => setNavOpen(false)}>Номинации</NavLink>
                  <NavLink href="#faq" onClick={() => setNavOpen(false)}>FAQ</NavLink>
                  <NavLink href="#contacts" onClick={() => setNavOpen(false)}>Контакты</NavLink>
                  <a
                    href="https://t.me/lyceventsbot/miniapp?startapp=1"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.4rem",
                      padding: "0.6rem 1rem",
                      borderRadius: 9999,
                      background: "#8600A8",
                      color: "#fff",
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      textDecoration: "none",
                      marginTop: "0.5rem",
                    }}
                    onClick={() => setNavOpen(false)}
                  >
                    Регистрация
                    <ArrowUpRight size={18} strokeWidth={2.5} />
                  </a>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.25rem 1.5rem",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <NavLink href="#schedule">Расписание</NavLink>
            <NavLink href="#format">Информация</NavLink>
            <NavLink href="#nominations">Номинации</NavLink>
            <NavLink href="#faq">FAQ</NavLink>
            <NavLink href="#contacts">Контакты</NavLink>
            <a
              href="https://t.me/lyceventsbot/miniapp?startapp=1"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.4rem",
                padding: "0.5rem 1.25rem",
                borderRadius: 9999,
                background: "#8600A8",
                color: "#fff",
                fontSize: "0.9rem",
                fontWeight: 600,
                textDecoration: "none",
                flexShrink: 0,
                transition: "background 0.2s, transform 0.15s",
                boxShadow: "0 2px 8px rgba(134, 0, 168, 0.4)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#9d00c4";
                e.currentTarget.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#8600A8";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              Регистрация
              <ArrowUpRight size={18} strokeWidth={2.5} />
            </a>
          </div>
        )}
      </motion.nav>

      {/* Hero — desktop: logo left, canvas right; mobile: model center, logo bottom, non-interactive */}
      <div
        style={{
          height: isMobile ? "calc(100vh - 56px)" : "calc(100vh - 88px)",
          flexShrink: 0,
          position: "relative",
          overflow: "hidden",
          width: "100%",
          ...(isMobile && {
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            justifyContent: "flex-start",
          }),
        }}
      >
        {/* Logo — desktop: left behind; mobile: at bottom (order 2) + pointing arrow above logo */}
        <div
          style={{
            ...(isMobile
              ? {
                  order: 2,
                  flex: "0 0 auto",
                  position: "relative" as const,
                  display: "flex",
                  flexDirection: "column" as const,
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0.5rem 1rem 1.25rem",
                  zIndex: 0,
                  pointerEvents: "none",
                }
              : {
                  position: "absolute" as const,
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  paddingLeft: "18%",
                  zIndex: 0,
                  pointerEvents: "none" as const,
                }),
          }}
        >
          {isMobile && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "0.25rem",
                color: "#E9AC80",
              }}
            >
              <motion.span
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                style={{ display: "inline-flex" }}
              >
                <ChevronDown size={28} strokeWidth={2.5} />
              </motion.span>
            </motion.div>
          )}
          {isMobile ? (
            <motion.img
              src={logoCoffeeJam2Url}
              alt="Coffee Jam 2"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 0.9, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              style={{
                height: "clamp(5rem, 26vw, 11rem)",
                width: "auto",
                maxWidth: "92vw",
                objectFit: "contain",
                objectPosition: "center",
              }}
            />
          ) : (
            <img
              src={logoCoffeeJam2Url}
              alt="Coffee Jam 2"
              style={{
                height: "clamp(8rem, 34vw, 26rem)",
                width: "auto",
                maxWidth: "85vw",
                objectFit: "contain",
                objectPosition: "left center",
                opacity: 0.9,
              }}
            />
          )}
        </div>

        {/* Desktop: pointing arrow at bottom of hero */}
        {!isMobile && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            style={{
              position: "absolute",
              bottom: "1.5rem",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 1,
              color: "#E9AC80",
              pointerEvents: "none",
            }}
          >
            <motion.span
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              style={{ display: "inline-flex" }}
            >
              <ChevronDown size={24} strokeWidth={2.5} />
            </motion.span>
          </motion.div>
        )}

        {/* Canvas — client-only; on SSR render placeholder */}
        {import.meta.env.SSR ? (
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
            aria-hidden
          />
        ) : (
          <Suspense
            fallback={
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
              />
            }
          >
            <HeroSceneLazy isMobile={isMobile} onModelLoaded={handleModelLoaded} />
          </Suspense>
        )}
      </div>
      <div className="info-section">
        <h1>
          Регистрация
          </h1>
          <p>
            Пришло время самого масштабного и креативного мероприятия – Coffee Jam 2. Окунитесь в мир зимней сказки и вкусного ароматного кофе, создавая поистине уникальную и запоминающуюся игру. Зарегистрироваться можно <a href="https://t.me/lyceventsbot/miniapp?startapp=1" target="_blank" rel="noopener noreferrer">здесь</a>.
          </p>
          <p>
            Важное условие! Если вы регистрируете свою команду, нужно указать каждого участника.
          </p>
      </div>
      <div className="info-section" id="schedule">
        <h1>Расписание</h1>
        <p style={{ marginBottom: "1.5rem", opacity: 0.9 }}>
          Даты проведения: <strong>27 февраля – 7 марта</strong>
        </p>

        <div style={{ position: "relative", paddingLeft: "2rem" }}>
          {/* 27 февраля */}
          <div style={{ marginBottom: "2rem", position: "relative", paddingLeft: 0 }}>
            <div style={{ position: "absolute", left: "-2rem", top: 4, marginLeft: "-6px", width: 12, height: 12, borderRadius: "50%", background: "#E9AC80", border: "2px solid rgba(255,255,255,0.3)", boxSizing: "border-box" }} />
            <div style={{ fontWeight: 700, color: "#E9AC80", fontSize: "1.15rem", marginBottom: "0.5rem" }}>27 февраля — Открытие: 14:30 – 16:00 (очно)</div>
            <ul style={{ margin: 0, paddingLeft: "1.25rem", color: "rgba(255,255,255,0.88)", lineHeight: 1.7, listStylePosition: "outside" }}>
              <li>14:30 – 15:00: Сбор участников</li>
              <li>15:00 – 16:00: Открытие</li>
              <li>16:00 – 17:30: Шоу кейс, настолки + кофебрейк</li>
              <li>17:30 – 18:30: Лекция от эксперта индустрии про атмосферу и погружение пользователя в игру</li>
              <li>18:30 – 19:00: Рефлексия с менторами по идеям (онлайн)</li>
            </ul>
            <p style={{ margin: "0.5rem 0 0", fontSize: "0.95rem", color: "rgba(255,255,255,0.6)" }}>Локация: Лицей НИУ ВШЭ (Солянка 14Ас1), Актовый зал, 5 этаж</p>
          </div>

          {/* 1 марта */}
          <div style={{ marginBottom: "2rem", position: "relative" }}>
            <div style={{ position: "absolute", left: "-2rem", top: 4, marginLeft: "-6px", width: 12, height: 12, borderRadius: "50%", background: "#E9AC80", border: "2px solid rgba(255,255,255,0.3)", boxSizing: "border-box" }} />
            <div style={{ fontWeight: 700, color: "#E9AC80", fontSize: "1.15rem", marginBottom: "0.5rem" }}>1 марта (онлайн)</div>
            <ul style={{ margin: 0, paddingLeft: "1.25rem", color: "rgba(255,255,255,0.88)", lineHeight: 1.7, listStylePosition: "outside" }}>
              <li>19:30 – 20:00: Консультация с менторами (онлайн)</li>
            </ul>
          </div>

          {/* 2 марта */}
          <div style={{ marginBottom: "2rem", position: "relative" }}>
            <div style={{ position: "absolute", left: "-2rem", top: 4, marginLeft: "-6px", width: 12, height: 12, borderRadius: "50%", background: "#E9AC80", border: "2px solid rgba(255,255,255,0.3)", boxSizing: "border-box" }} />
            <div style={{ fontWeight: 700, color: "#E9AC80", fontSize: "1.15rem", marginBottom: "0.5rem" }}>2 марта (онлайн)</div>
            <ul style={{ margin: 0, paddingLeft: "1.25rem", color: "rgba(255,255,255,0.88)", lineHeight: 1.7, listStylePosition: "outside" }}>
              <li>19:30 – 20:00: Консультация с менторами (онлайн)</li>
            </ul>
          </div>

          {/* 3 марта */}
          <div style={{ marginBottom: "2rem", position: "relative" }}>
            <div style={{ position: "absolute", left: "-2rem", top: 4, marginLeft: "-6px", width: 12, height: 12, borderRadius: "50%", background: "#E9AC80", border: "2px solid rgba(255,255,255,0.3)", boxSizing: "border-box" }} />
            <div style={{ fontWeight: 700, color: "#E9AC80", fontSize: "1.15rem", marginBottom: "0.5rem" }}>3 марта (онлайн)</div>
            <ul style={{ margin: 0, paddingLeft: "1.25rem", color: "rgba(255,255,255,0.88)", lineHeight: 1.7, listStylePosition: "outside" }}>
              <li>19:30 – 20:00: Консультация с менторами (онлайн)</li>
            </ul>
          </div>

          {/* 4 марта */}
          <div style={{ marginBottom: "2rem", position: "relative" }}>
            <div style={{ position: "absolute", left: "-2rem", top: 4, marginLeft: "-6px", width: 12, height: 12, borderRadius: "50%", background: "#E9AC80", border: "2px solid rgba(255,255,255,0.3)", boxSizing: "border-box" }} />
            <div style={{ fontWeight: 700, color: "#E9AC80", fontSize: "1.15rem", marginBottom: "0.5rem" }}>4 марта (онлайн)</div>
            <ul style={{ margin: 0, paddingLeft: "1.25rem", color: "rgba(255,255,255,0.88)", lineHeight: 1.7, listStylePosition: "outside" }}>
              <li>18:00 – 19:00: Мастер-класс по питчингу (онлайн)</li>
              <li>19:30 – 20:00: Консультация с менторами (онлайн)</li>
            </ul>
          </div>

          {/* 5 марта + ДД игр */}
          <div style={{ marginBottom: "2rem", position: "relative" }}>
            <div style={{ position: "absolute", left: "-2rem", top: 4, marginLeft: "-6px", width: 12, height: 12, borderRadius: "50%", background: "#E9AC80", border: "2px solid rgba(255,255,255,0.3)", boxSizing: "border-box" }} />
            <div style={{ fontWeight: 700, color: "#E9AC80", fontSize: "1.15rem", marginBottom: "0.5rem" }}>5 марта (онлайн)</div>
            <ul style={{ margin: 0, paddingLeft: "1.25rem", color: "rgba(255,255,255,0.88)", lineHeight: 1.7, listStylePosition: "outside" }}>
              <li>19:30 – 20:00: Консультация с менторами</li>
            </ul>
            <div style={{ marginTop: "1rem", padding: "1rem 1.25rem", background: "rgba(233, 172, 128, 0.2)", border: "2px solid #E9AC80", borderRadius: 12, fontSize: "1.25rem", fontWeight: 700, color: "#fff" }}>
              ⏰ 23:59 — ДД по загрузке игр
            </div>
          </div>

          {/* 6 марта + ДД презентаций */}
          <div style={{ marginBottom: "2rem", position: "relative" }}>
            <div style={{ position: "absolute", left: "-2rem", top: 4, marginLeft: "-6px", width: 12, height: 12, borderRadius: "50%", background: "#E9AC80", border: "2px solid rgba(255,255,255,0.3)", boxSizing: "border-box" }} />
            <div style={{ fontWeight: 700, color: "#E9AC80", fontSize: "1.15rem", marginBottom: "0.5rem" }}>6 марта — Пробный питчинг (онлайн)</div>
            <ul style={{ margin: 0, paddingLeft: "1.25rem", color: "rgba(255,255,255,0.88)", lineHeight: 1.7, listStylePosition: "outside" }}>
              <li>17:00 – 20:00: Пробный онлайн-питчинг</li>
            </ul>
            <div style={{ marginTop: "1rem", padding: "1rem 1.25rem", background: "rgba(233, 172, 128, 0.2)", border: "2px solid #E9AC80", borderRadius: 12, fontSize: "1.25rem", fontWeight: 700, color: "#fff" }}>
              ⏰ 23:59 — ДД по загрузке презентаций
            </div>
          </div>

          {/* 7 марта */}
          <div style={{ marginBottom: 0, position: "relative" }}>
            <div style={{ position: "absolute", left: "-2rem", top: 4, marginLeft: "-6px", width: 12, height: 12, borderRadius: "50%", background: "#E9AC80", border: "2px solid rgba(255,255,255,0.3)", boxSizing: "border-box" }} />
            <div style={{ fontWeight: 700, color: "#E9AC80", fontSize: "1.15rem", marginBottom: "0.5rem" }}>7 марта — Закрытие: 11:30 – 20:00</div>
            <ul style={{ margin: 0, paddingLeft: "1.25rem", color: "rgba(255,255,255,0.88)", lineHeight: 1.7, listStylePosition: "outside" }}>
              <li>11:30 – 12:00: Сбор участников</li>
              <li>12:00 – 14:15: Шоукейс и голосование за лучшую игру</li>
              <li>14:15 – 17:00: Питчинги</li>
              <li>18:30 – 19:00: Закрытие джема</li>
            </ul>
            <p style={{ margin: "0.5rem 0 0", fontSize: "0.95rem", color: "rgba(255,255,255,0.6)" }}>Локация: Лицей НИУ ВШЭ (Солянка 14Ас1), Актовый зал, 5 этаж</p>
          </div>
        </div>
      </div>
      <div className="info-section" id="format">
        <h1>Формат проведения</h1>
          <p>
          Как очно, так и онлайн! Любой желающий может принять участие в Coffee Jam 2, даже не находясь в Москве! Достаточно лишь пройти регистрацию и следить за событиями в нашем телеграмм канале 
          </p>
      </div>
      <div className="info-section" id="rules">
        <h1>Правила участия</h1>
        <ol style={{ margin: 0, paddingLeft: "1.5rem", color: "rgba(255,255,255,0.88)", lineHeight: 1.8, fontSize: "1.1rem" }}>
          <li>Участвовать можно индивидуально или в команде.</li>
          <li>Игра должна быть создана в рамках геймджема.</li>
          <li>Использование ассетов, опубликованных из источников команды LycGameDev, допускается.</li>
          <li>Разрешено использовать любые движки и инструменты, если иное не указано отдельно.</li>
          <li>Работы должны быть сданы до установленного дедлайна.</li>
          <li>От одного участника или команды принимается одна работа.</li>
          <li>
            Участники соглашаются с тем, что их игра может быть показана и опубликована в рамках геймджема.
            <br />
            <a href="https://lyc-game-dev.tilda.ws/rules" target="_blank" rel="noopener noreferrer" style={{ color: "#E9AC80", textDecoration: "underline" }}>Пользовательское соглашение</a>
            {" · "}
            <a href="https://lyc-game-dev.tilda.ws/policy" target="_blank" rel="noopener noreferrer" style={{ color: "#E9AC80", textDecoration: "underline" }}>Политика обработки персональных данных</a>
          </li>
        </ol>
      </div>
      <div className="info-section" id="nominations">
        <h1>Темы и номинации</h1>
        <p style={{ margin: 0, fontSize: "1.75rem" }}>
          <ShinyText text="скоро" color="#E9AC80" shineColor="#fff" speed={2} />
        </p>
      </div>
      <div className="info-section" id="faq">
        <h1>FAQ</h1>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = faqOpenIndex === index;
            return (
              <div
                key={index}
                style={{
                  borderBottom: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <button
                  type="button"
                  onClick={() => setFaqOpenIndex(isOpen ? null : index)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "0.75rem",
                    padding: "1rem 0",
                    background: "none",
                    border: "none",
                    color: "#E9AC80",
                    fontSize: "1.15rem",
                    fontWeight: 600,
                    textAlign: "left",
                    cursor: "pointer",
                    fontFamily: "inherit",
                }}
                >
                  <span>{item.q}</span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                    style={{ flexShrink: 0 }}
                  >
                    <ChevronDown size={22} strokeWidth={2.5} />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      style={{ overflow: "hidden" }}
                    >
                      <p style={{ margin: 0, paddingBottom: "1rem", color: "rgba(255,255,255,0.88)", lineHeight: 1.7, fontSize: "1.05rem" }}>
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
      <div className="info-section" id="contacts">
        <h1>Контакты организаторов</h1>
        <ul style={{ margin: 0, paddingLeft: "1.25rem", color: "rgba(255,255,255,0.88)", lineHeight: 1.9, fontSize: "1.05rem" }}>
          <li>
            Глава проекта:{" "}
            <a href="https://t.me/anastasiamitsura" target="_blank" rel="noopener noreferrer" style={{ color: "#E9AC80", textDecoration: "underline" }}>@anastasiamitsura</a>
          </li>
          <li>
            Координатор организации мероприятий:{" "}
            <a href="https://t.me/Vieynene" target="_blank" rel="noopener noreferrer" style={{ color: "#E9AC80", textDecoration: "underline" }}>@Vieynene</a>
          </li>
          <li>
            Координатор IT:{" "}
            <a href="https://t.me/ThatIsDreamer" target="_blank" rel="noopener noreferrer" style={{ color: "#E9AC80", textDecoration: "underline" }}>@ThatIsDreamer</a>
          </li>
          <li>
            Координатор дизайна:{" "}
            <a href="https://t.me/Svarochny_apparat" target="_blank" rel="noopener noreferrer" style={{ color: "#E9AC80", textDecoration: "underline" }}>@Svarochny_apparat</a>
            {" и "}
            <a href="https://t.me/Zlata_cs" target="_blank" rel="noopener noreferrer" style={{ color: "#E9AC80", textDecoration: "underline" }}>@Zlata_cs</a>
          </li>
          <li>
            Координатор СММ:{" "}
            <a href="https://t.me/Ustaliy_kameshek" target="_blank" rel="noopener noreferrer" style={{ color: "#E9AC80", textDecoration: "underline" }}>@Ustaliy_kameshek</a>
          </li>
          <li>
            Администратор:{" "}
            <a href="https://t.me/MagicTraveller" target="_blank" rel="noopener noreferrer" style={{ color: "#E9AC80", textDecoration: "underline" }}>@MagicTraveller</a>
          </li>
          <li>
            Исполнители организаторы:{" "}
            <a href="https://t.me/onixal" target="_blank" rel="noopener noreferrer" style={{ color: "#E9AC80", textDecoration: "underline" }}>@onixal</a>
            {" и "}
            <a href="https://t.me/Kosovrr" target="_blank" rel="noopener noreferrer" style={{ color: "#E9AC80", textDecoration: "underline" }}>@Kosovrr</a>
          </li>
        </ul>
      </div>
      <div className="info-section" id="links">
        <h1>Полезные чаты</h1>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <a
            href="http://@LycGameDev"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.75rem",
              color: "#E9AC80",
              textDecoration: "none",
              fontSize: "1.1rem",
              fontWeight: 500,
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.85"; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
          >
            <MessageCircle size={24} strokeWidth={2} />
            <span>Наш телеграмм канал тут</span>
            <ArrowUpRight size={18} strokeWidth={2} />
          </a>
          <a
            href="https://www.twitch.tv/lycgamedev"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.75rem",
              color: "#E9AC80",
              textDecoration: "none",
              fontSize: "1.1rem",
              fontWeight: 500,
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.85"; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
          >
            <Twitch size={24} strokeWidth={2} />
            <span>Наш твич тут</span>
            <ArrowUpRight size={18} strokeWidth={2} />
          </a>
        </div>
      </div>
    </div>

    </>
  );
}