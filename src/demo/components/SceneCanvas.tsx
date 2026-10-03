import { useEffect, useRef } from "react";
import { useScrollScene } from "../three/useScrollScene";
import type { StoryRoomId } from "../three/apartmentGeometry";

type Props = {
  enabled: boolean;
  reducedMotion: boolean;
  onReady: (ready: boolean) => void;
  onActiveRoom: (id: StoryRoomId) => void;
  flyToRef: React.MutableRefObject<((id: StoryRoomId) => void) | null>;
};

export function SceneCanvas({
  enabled,
  reducedMotion,
  onReady,
  onActiveRoom,
  flyToRef,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { ready, activeRoom, flyToRoom } = useScrollScene(canvasRef, {
    enabled,
    reducedMotion,
  });

  useEffect(() => {
    onReady(ready);
  }, [ready, onReady]);

  useEffect(() => {
    onActiveRoom(activeRoom);
  }, [activeRoom, onActiveRoom]);

  useEffect(() => {
    flyToRef.current = flyToRoom;
  }, [flyToRoom, flyToRef]);

  return (
    <div className="scene-stage" aria-hidden={!ready}>
      <img
        className={`scene-poster${ready ? " is-hidden" : ""}`}
        src="/demo/floorplan-poster.svg"
        alt=""
        width={1200}
        height={700}
        decoding="async"
      />
      <canvas
        ref={canvasRef}
        className={ready ? "is-ready" : undefined}
        aria-label="Interactive 3D model of my Dunedin apartment"
      />
    </div>
  );
}
