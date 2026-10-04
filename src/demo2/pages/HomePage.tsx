import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { site } from "../../demo/content/site";
import { AyannaPlanNav } from "../components/AyannaPlanNav";
import { AyannaSections } from "../components/AyannaSections";
import type { AyannaRoomId } from "../three/rooms";

const AyannaSceneCanvas = lazy(() =>
  import("../components/AyannaSceneCanvas").then((module) => ({
    default: module.AyannaSceneCanvas,
  })),
);

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [query]);
  return matches;
}

function webglAvailable() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

export function HomePage() {
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const isMobile = useMediaQuery("(max-width: 767px)");
  const [hasWebGL, setHasWebGL] = useState(true);
  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [activeRoom, setActiveRoom] = useState<AyannaRoomId>("foyer");
  const flyToRef = useRef<((id: AyannaRoomId) => void) | null>(null);

  useEffect(() => setHasWebGL(webglAvailable()), []);

  const use3d = !reducedMotion && !isMobile && hasWebGL && !loadError;
  const onReady = useCallback((value: boolean) => setReady(value), []);
  const onActiveRoom = useCallback((id: AyannaRoomId) => setActiveRoom(id), []);
  const onError = useCallback((message: string) => setLoadError(message), []);

  const onSelect = (id: AyannaRoomId) => {
    if (use3d && flyToRef.current) {
      flyToRef.current(id);
      return;
    }
    setActiveRoom(id);
    document.getElementById(`room-${id}`)?.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  const header = (
    <header className="topbar">
      <a className="brand" href="#room-foyer">{site.name}</a>
      <span className="model-badge">Ayanna · Type E2</span>
      <Link className="top-link" to="/services">Services</Link>
    </header>
  );

  if (!use3d) {
    return (
      <div className="demo2-shell">
        {header}
        <main className="fallback-page">
          <p className="eyebrow">Ayanna · Bukit Jalil</p>
          <h1>A furnished portfolio tour</h1>
          <p className="lede">
            Explore the rooms below. The 3D view is paused on small screens and
            when reduced motion is preferred.
          </p>
          {loadError ? (
            <p className="model-error" role="alert">
              The 3D model could not load. The full portfolio remains available.
            </p>
          ) : null}
          <div className="plan-inline">
            <AyannaPlanNav activeRoom={activeRoom} onSelect={onSelect} compact />
          </div>
          <AyannaSections />
        </main>
      </div>
    );
  }

  return (
    <div className="demo2-shell">
      {header}
      <Suspense
        fallback={
          <div className="scene-stage">
            <img className="scene-poster" src="/demo2/floorplan-poster.svg" alt="" />
          </div>
        }
      >
        <AyannaSceneCanvas
          enabled={use3d}
          reducedMotion={reducedMotion}
          onReady={onReady}
          onActiveRoom={onActiveRoom}
          onError={onError}
          flyToRef={flyToRef}
        />
      </Suspense>
      <div className="content-rail">
        <AyannaPlanNav activeRoom={activeRoom} onSelect={onSelect} />
        <AyannaSections />
      </div>
      <p className="sr-only" aria-live="polite">
        {ready ? "Furnished 3D apartment loaded." : "Loading furnished 3D apartment."}
      </p>
    </div>
  );
}
