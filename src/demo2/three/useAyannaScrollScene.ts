import { useEffect, useRef, useState } from "react";
import type { AyannaScene } from "./ayannaScene";
import {
  interpolatePath,
  keyframeForSection,
  scrollProgressFromSections,
} from "./cameraPath";
import { SECTION_ORDER, type AyannaRoomId } from "./rooms";

type Options = {
  enabled: boolean;
  reducedMotion: boolean;
  onError?: (message: string) => void;
};

export function useAyannaScrollScene(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  options: Options,
) {
  const sceneRef = useRef<AyannaScene | null>(null);
  const flyToRef = useRef<AyannaRoomId | null>(null);
  const [ready, setReady] = useState(false);
  const [activeRoom, setActiveRoom] = useState<AyannaRoomId>("foyer");

  useEffect(() => {
    if (!options.enabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    let cancelled = false;
    let animationFrame = 0;
    let visible = true;
    let tabVisible = !document.hidden;
    let cleanupListeners: (() => void) | undefined;

    void (async () => {
      try {
        const { createAyannaScene } = await import("./ayannaScene");
        const ayanna = await createAyannaScene(canvas);
        if (cancelled) {
          ayanna.dispose();
          return;
        }
        sceneRef.current = ayanna;

        const resize = () => {
          const parent = canvas.parentElement;
          ayanna.resize(
            parent?.clientWidth ?? window.innerWidth,
            parent?.clientHeight ?? window.innerHeight,
          );
        };
        resize();
        window.addEventListener("resize", resize);

        const observer = new IntersectionObserver(
          ([entry]) => {
            visible = entry.isIntersecting;
          },
          { threshold: 0.05 },
        );
        observer.observe(canvas);
        const onVisibility = () => {
          tabVisible = !document.hidden;
        };
        document.addEventListener("visibilitychange", onVisibility);
        cleanupListeners = () => {
          window.removeEventListener("resize", resize);
          document.removeEventListener("visibilitychange", onVisibility);
          observer.disconnect();
        };

        const tick = () => {
          if (cancelled) return;
          if (visible && tabVisible) {
            const sections = SECTION_ORDER.flatMap((id) => {
              const element = document.getElementById(`room-${id}`);
              return element ? [{ id, element }] : [];
            });
            if (flyToRef.current) {
              const frame = keyframeForSection(flyToRef.current);
              ayanna.setCamera(frame.position, frame.target, frame.fov);
            } else {
              const progress = scrollProgressFromSections(
                sections,
                window.scrollY,
                window.innerHeight,
              );
              const frame = interpolatePath(progress);
              ayanna.setCamera(frame.position, frame.target, frame.fov);

              const focus = window.scrollY + window.innerHeight * 0.35;
              let closest: AyannaRoomId = "foyer";
              let distance = Number.POSITIVE_INFINITY;
              for (const section of sections) {
                const midpoint =
                  section.element.offsetTop + section.element.offsetHeight * 0.35;
                const nextDistance = Math.abs(midpoint - focus);
                if (nextDistance < distance) {
                  closest = section.id;
                  distance = nextDistance;
                }
              }
              setActiveRoom(closest);
            }
            ayanna.render();
          }
          animationFrame = requestAnimationFrame(tick);
        };
        setReady(true);
        animationFrame = requestAnimationFrame(tick);
      } catch (error) {
        if (!cancelled) {
          options.onError?.(
            error instanceof Error ? error.message : "The 3D model could not load.",
          );
        }
      }
    })();

    return () => {
      cancelled = true;
      cancelAnimationFrame(animationFrame);
      cleanupListeners?.();
      sceneRef.current?.dispose();
      sceneRef.current = null;
      setReady(false);
    };
    // Callback identity should not recreate the WebGL renderer.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.enabled, options.reducedMotion]);

  const flyToRoom = (id: AyannaRoomId) => {
    flyToRef.current = id;
    setActiveRoom(id);
    document.getElementById(`room-${id}`)?.scrollIntoView({
      behavior: options.reducedMotion ? "auto" : "smooth",
      block: "start",
    });
    window.setTimeout(() => {
      flyToRef.current = null;
    }, 1200);
  };

  return { ready, activeRoom, flyToRoom };
}
