import { useEffect, useRef, useState } from "react";
import type { ApartmentScene } from "./buildApartment";
import {
  interpolatePath,
  keyframeForSection,
  scrollProgressFromSections,
  SECTION_ORDER,
} from "./cameraPath";
import type { StoryRoomId } from "./apartmentGeometry";

type Options = {
  enabled: boolean;
  reducedMotion: boolean;
  sectionIds?: StoryRoomId[];
};

export function useScrollScene(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  options: Options,
) {
  const sceneRef = useRef<ApartmentScene | null>(null);
  const [ready, setReady] = useState(false);
  const [activeRoom, setActiveRoom] = useState<StoryRoomId>("hallway");
  const flyToRef = useRef<StoryRoomId | null>(null);

  useEffect(() => {
    if (!options.enabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    let cancelled = false;
    let raf = 0;
    let visible = true;
    let tabVisible = !document.hidden;
    let detachListeners: (() => void) | null = null;

    (async () => {
      const { createApartmentScene } = await import("./buildApartment");
      if (cancelled || !canvasRef.current) return;
      const apartment = createApartmentScene(canvasRef.current);
      sceneRef.current = apartment;

      const parent = canvas.parentElement;
      const resize = () => {
        const w = parent?.clientWidth ?? window.innerWidth;
        const h = parent?.clientHeight ?? window.innerHeight;
        apartment.resize(w, h);
      };
      resize();
      window.addEventListener("resize", resize);

      const io = new IntersectionObserver(
        ([entry]) => {
          visible = entry.isIntersecting;
        },
        { threshold: 0.05 },
      );
      io.observe(canvas);

      const onVisibility = () => {
        tabVisible = !document.hidden;
      };
      document.addEventListener("visibilitychange", onVisibility);

      detachListeners = () => {
        window.removeEventListener("resize", resize);
        document.removeEventListener("visibilitychange", onVisibility);
        io.disconnect();
      };

      const sectionIds = options.sectionIds ?? SECTION_ORDER;

      const tick = () => {
        if (cancelled) return;
        const scene = sceneRef.current;
        if (!scene) return;
        if (visible && tabVisible) {
          const sections = sectionIds.flatMap((id) => {
            const element = document.getElementById(`room-${id}`);
            return element ? [{ id, element }] : [];
          });

          if (options.reducedMotion) {
            scene.setWallHeight(2.5);
          } else if (flyToRef.current) {
            const kf = keyframeForSection(flyToRef.current);
            scene.setWallHeight(kf.wallHeight);
            scene.setCamera(kf.position, kf.target, kf.fov, false);
          } else {
            const progress = scrollProgressFromSections(
              sections,
              window.scrollY,
              window.innerHeight,
            );
            const frame = interpolatePath(progress);
            scene.setWallHeight(frame.wallHeight);
            scene.setCamera(frame.position, frame.target, frame.fov, false);

            let best: StoryRoomId = "hallway";
            let bestDist = Infinity;
            const focus = window.scrollY + window.innerHeight * 0.35;
            for (const { id, element } of sections) {
              const mid = element.offsetTop + element.offsetHeight * 0.35;
              const d = Math.abs(mid - focus);
              if (d < bestDist) {
                bestDist = d;
                best = id;
              }
            }
            setActiveRoom(best);
          }
          scene.render();
        }
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      setReady(true);
    })();

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      detachListeners?.();
      sceneRef.current?.dispose();
      sceneRef.current = null;
      setReady(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.enabled, options.reducedMotion]);

  const flyToRoom = (id: StoryRoomId) => {
    flyToRef.current = id;
    setActiveRoom(id);
    const el = document.getElementById(`room-${id}`);
    if (el) {
      el.scrollIntoView({
        behavior: options.reducedMotion ? "auto" : "smooth",
        block: "start",
      });
    }
    window.setTimeout(() => {
      flyToRef.current = null;
    }, 1200);
  };

  return { ready, activeRoom, flyToRoom };
}
