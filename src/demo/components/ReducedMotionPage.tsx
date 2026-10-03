import { FloorPlanNav } from "./FloorPlanNav";
import { RoomSections } from "./RoomSections";
import type { StoryRoomId } from "../three/apartmentGeometry";
import { useState } from "react";

export function ReducedMotionPage() {
  const [activeRoom, setActiveRoom] = useState<StoryRoomId>("hallway");

  const onSelect = (id: StoryRoomId) => {
    setActiveRoom(id);
    document.getElementById(`room-${id}`)?.scrollIntoView({ behavior: "auto" });
  };

  return (
    <div className="fallback-page">
      <p className="eyebrow">My Dunedin apartment</p>
      <h1>Wei Hong Lo</h1>
      <p className="lede" style={{ marginTop: "0.75rem" }}>
        I design and build tools for messy real-world problems.
      </p>
      <div className="plan-inline">
        <FloorPlanNav activeRoom={activeRoom} onSelect={onSelect} compact />
      </div>
      <RoomSections />
    </div>
  );
}
