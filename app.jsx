/* Karta - Investor Deck · app shell: assembles sections, scroll-spy */
const { useState: aS, useEffect: aE, useRef: aRf } = React;

/* ONE shared mesh shader behind the whole deck (fixed, pointer-through). */
/* scroll progress bar - DOM-driven (no React re-render per scroll frame) */
function Progress() {
  const ref = aRf(null);
  aE(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const h = document.documentElement.scrollHeight - window.innerHeight;
        if (ref.current) ref.current.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + "%";
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);
  return <div ref={ref} style={{ position: "fixed", top: 0, left: 0, height: 2, width: "0%", background: "var(--pp-acid)", zIndex: 80, transition: "width .1s linear" }} />;
}

function App() {
  const [active, setActive] = aS("mission");

  /* scroll-spy (rAF-throttled) */
  aE(() => {
    const ids = SECTIONS.map((s) => s.id);
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const mid = window.scrollY + window.innerHeight * 0.35;
        let cur = ids[0];
        for (const id of ids) {
          const el = document.getElementById(id);
          if (el && el.getBoundingClientRect().top + window.scrollY <= mid) cur = id;
        }
        setActive(cur);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);

  return (
    <React.Fragment>
      <Progress />
      <Header active={active} />
      <div className="chapter" style={{ position: "relative" }}><Hero variant="split" /></div>
      <div className="chapter" style={{ position: "relative" }}><WhoWeServe /></div>
      <div className="chapter" style={{ position: "relative" }}><Problem /></div>
      <div className="chapter" style={{ position: "relative" }}><SolutionHandV2 /></div>
      <div className="chapter" style={{ position: "relative" }}><HowItWorks /></div>
      <div className="chapter" style={{ position: "relative" }}><Traction /></div>
      <div className="chapter" style={{ position: "relative" }}><UAECore /></div>
      <div className="chapter" style={{ position: "relative" }}><MarketRedesign /></div>
      <div className="chapter" style={{ position: "relative" }}><WhereWeOperate /></div>
      <div className="chapter" style={{ position: "relative" }}><PlatformVision /></div>
      <div className="chapter" style={{ position: "relative" }}><Roadmap /></div>
      <div className="chapter" style={{ position: "relative" }}><Close /></div>
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
