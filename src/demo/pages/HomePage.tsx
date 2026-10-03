import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FloorPlanNav } from "../components/FloorPlanNav";
import { ReducedMotionPage } from "../components/ReducedMotionPage";
import { RoomSections } from "../components/RoomSections";
import { site } from "../content/site";
import type { StoryRoomId } from "../three/apartmentGeometry";

const SceneCanvas = lazy(() =>
  import("../components/SceneCanvas").then((m) => ({ default: m.SceneCanvas })),
);

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false,
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}

function webglAvailable() {
  try {
    const c = document.createElement("canvas");
    return !!(
      c.getContext("webgl") || c.getContext("experimental-webgl")
    );
  } catch {
    return false;
  }
}

export function HomePage() {
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const isMobile = useMediaQuery("(max-width: 767px)");
  const [hasWebGL, setHasWebGL] = useState(true);
  const [ready, setReady] = useState(false);
  const [activeRoom, setActiveRoom] = useState<StoryRoomId>("hallway");
  const flyToRef = useRef<((id: StoryRoomId) => void) | null>(null);

  useEffect(() => {
    setHasWebGL(webglAvailable());
  }, []);

  const use3d = !reducedMotion && !isMobile && hasWebGL;

  const onReady = useCallback((v: boolean) => setReady(v), []);
  const onActiveRoom = useCallback((id: StoryRoomId) => setActiveRoom(id), []);

  const onSelect = (id: StoryRoomId) => {
    if (flyToRef.current && use3d) {
      flyToRef.current(id);
    } else {
      setActiveRoom(id);
      document
        .getElementById(`room-${id}`)
        ?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
    }
  };

  if (reducedMotion || !hasWebGL) {
    return (
      <div className="demo-shell">
        <header className="topbar">
          <a className="brand" href="#room-hallway">
            {site.name}
          </a>
          <Link className="top-link" to="/services">
            Services
          </Link>
        </header>
        <ReducedMotionPage />
      </div>
    );
  }

  // Mobile: stacked sections + plan nav (no heavy 3D)
  if (isMobile) {
    return (
      <div className="demo-shell">
        <header className="topbar">
          <a className="brand" href="#room-hallway">
            {site.name}
          </a>
          <Link className="top-link" to="/services">
            Services
          </Link>
        </header>
        <FloorPlanNav activeRoom={activeRoom} onSelect={onSelect} compact />
        <div style={{ paddingBottom: "2rem" }}>
          <RoomSections />
        </div>
        <p className="sr-only" aria-live="polite">
          Showing floor plan and sections.
        </p>
      </div>
    );
  }

  return (
    <div className="demo-shell">
      <header className="topbar">
        <a className="brand" href="#room-hallway">
          {site.name}
        </a>
        <Link className="top-link" to="/services">
          Services
        </Link>
      </header>

      <Suspense
        fallback={
          <div className="scene-stage">
            <img
              className="scene-poster"
              src="/demo/floorplan-poster.svg"
              alt=""
              width={1200}
              height={700}
            />
          </div>
        }
      >
        <SceneCanvas
          enabled={use3d}
          reducedMotion={reducedMotion}
          onReady={onReady}
          onActiveRoom={onActiveRoom}
          flyToRef={flyToRef}
        />
      </Suspense>

      <div className="content-rail">
        <FloorPlanNav activeRoom={activeRoom} onSelect={onSelect} />
        <RoomSections />
      </div>

      <p className="sr-only" aria-live="polite">
        {ready
          ? "3D apartment model loaded."
          : "Loading 3D apartment model."}
      </p>
    </div>
  );
}
