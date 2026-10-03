import { STORY_ROOMS, getRoomByGeometryName } from "../three/apartmentGeometry";
import type { StoryRoomId } from "../three/apartmentGeometry";

type Props = {
  activeRoom: StoryRoomId;
  onSelect: (id: StoryRoomId) => void;
  compact?: boolean;
};

function polyToPath(poly: [number, number][]): string {
  return (
    poly
      .map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(2)},${p[1].toFixed(2)}`)
      .join(" ") + " Z"
  );
}

export function FloorPlanNav({ activeRoom, onSelect, compact }: Props) {
  const navRooms = STORY_ROOMS.map((r) => {
    const geo = getRoomByGeometryName(r.geometryName);
    return {
      id: r.id,
      name: r.label,
      poly: geo?.poly ?? null,
    };
  });

  return (
    <nav className="plan-nav" aria-label="Apartment floor plan">
      <h2>{compact ? "Plan" : "Floor plan"}</h2>
      <svg
        className="plan-svg"
        viewBox="-0.5 -0.5 16.5 8.5"
        role="group"
        aria-label="Rooms in my Dunedin apartment"
      >
        <rect x="0" y="0" width="15.3" height="7.5" fill="#e5e0d6" rx="0.1" />
        {navRooms.map((room) => {
          if (room.id === "contact") {
            return (
              <rect
                key={room.id}
                className={`plan-hotspot${activeRoom === room.id ? " is-active" : ""}`}
                x="5.9"
                y="0.15"
                width="0.55"
                height="1.1"
                tabIndex={0}
                role="button"
                aria-label="Front door — Contact"
                aria-current={activeRoom === room.id ? "true" : undefined}
                onClick={() => onSelect(room.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelect(room.id);
                  }
                }}
              />
            );
          }
          if (!room.poly) return null;
          return (
            <path
              key={room.id}
              className={`plan-hotspot${activeRoom === room.id ? " is-active" : ""}`}
              d={polyToPath(room.poly)}
              tabIndex={0}
              role="button"
              aria-label={room.name}
              aria-current={activeRoom === room.id ? "true" : undefined}
              onClick={() => onSelect(room.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect(room.id);
                }
              }}
            />
          );
        })}
        <rect
          x="0"
          y="0"
          width="15.3"
          height="7.5"
          fill="none"
          stroke="#9aa2a8"
          strokeWidth="0.08"
        />
      </svg>
    </nav>
  );
}
