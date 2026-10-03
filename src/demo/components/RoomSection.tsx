import type { ReactNode } from "react";

type Props = {
  id: string;
  eyebrow: string;
  title: string;
  lede?: string;
  wide?: boolean;
  children?: ReactNode;
};

export function RoomSection({
  id,
  eyebrow,
  title,
  lede,
  wide,
  children,
}: Props) {
  return (
    <section className="room-section" id={`room-${id}`} aria-labelledby={`${id}-title`}>
      <article className={`room-card${wide ? " wide" : ""}`}>
        <p className="eyebrow">{eyebrow}</p>
        <h2 id={`${id}-title`}>{title}</h2>
        {lede ? <p className="lede">{lede}</p> : null}
        {children}
      </article>
    </section>
  );
}
