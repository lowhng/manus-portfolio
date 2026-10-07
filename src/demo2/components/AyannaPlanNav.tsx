import { AYANNA_ROOMS, type AyannaRoomId } from "../three/rooms";

type Props = {
  activeRoom: AyannaRoomId;
  onSelect: (id: AyannaRoomId) => void;
  compact?: boolean;
};

export function AyannaPlanNav({ activeRoom, onSelect, compact }: Props) {
  return (
    <nav className="plan-nav" aria-label="Ayanna apartment floor plan">
      <h2>{compact ? "Plan" : "Ayanna floor plan"}</h2>
      <svg
        className="plan-svg"
        viewBox="-0.35 -0.35 12.2 12.15"
        role="group"
        aria-label="Rooms in the Ayanna Type E2 apartment"
      >
        <rect className="plan-shell" x="0" y="0" width="11.5" height="11.43" rx="0.1" />
        <g aria-hidden="true">
          {AYANNA_ROOMS.filter((room) => !room.isExit).map((room) => {
            const [x0, y0, x1, y1] = room.box;
            return (
              <g key={`base-${room.id}`}>
                <rect
                  className={`plan-room room-${room.id}`}
                  x={x0}
                  y={y0}
                  width={x1 - x0}
                  height={y1 - y0}
                />
                <text className="plan-label" x={room.center[0]} y={room.center[1]}>
                  {room.shortLabel}
                </text>
              </g>
            );
          })}
          <rect className="plan-entry" x="2.25" y="-0.05" width="0.7" height="0.16" />
        </g>
        {AYANNA_ROOMS.map((room) => {
          const [x0, y0, x1, y1] = room.box;
          return (
            <rect
              key={room.id}
              className={`plan-hotspot${activeRoom === room.id ? " is-active" : ""}`}
              x={x0}
              y={y0}
              width={x1 - x0}
              height={y1 - y0}
              tabIndex={0}
              role="button"
              aria-label={room.label}
              aria-current={activeRoom === room.id ? "true" : undefined}
              onClick={() => onSelect(room.id)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onSelect(room.id);
                }
              }}
            />
          );
        })}
      </svg>
    </nav>
  );
}
