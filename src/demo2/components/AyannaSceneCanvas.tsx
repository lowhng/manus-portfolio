import { useEffect, useRef } from "react";
import { useAyannaScrollScene } from "../three/useAyannaScrollScene";
import type { AyannaRoomId } from "../three/rooms";

type Props = {
  enabled: boolean;
  reducedMotion: boolean;
  onReady: (ready: boolean) => void;
  onActiveRoom: (id: AyannaRoomId) => void;
  onError: (message: string) => void;
  flyToRef: React.MutableRefObject<((id: AyannaRoomId) => void) | null>;
};

export function AyannaSceneCanvas({
  enabled,
  reducedMotion,
  onReady,
  onActiveRoom,
  onError,
  flyToRef,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { ready, activeRoom, flyToRoom } = useAyannaScrollScene(canvasRef, {
    enabled,
    reducedMotion,
    onError,
  });

  useEffect(() => onReady(ready), [onReady, ready]);
  useEffect(() => onActiveRoom(activeRoom), [activeRoom, onActiveRoom]);
  useEffect(() => {
    flyToRef.current = flyToRoom;
  }, [flyToRef, flyToRoom]);

  return (
    <div className="scene-stage" aria-hidden={!ready}>
      <img
        className={`scene-poster${ready ? " is-hidden" : ""}`}
        src="/demo2/floorplan-poster.svg"
        alt=""
        width={1200}
        height={700}
        decoding="async"
      />
      <canvas
        ref={canvasRef}
        className={ready ? "is-ready" : undefined}
        aria-label="Interactive furnished 3D model of an Ayanna Type E2 apartment"
      />
    </div>
  );
}
