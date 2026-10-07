import { site } from "../content/site";
import { RoomSection } from "./RoomSection";

export function RoomSections() {
  const room = (id: string) => site.rooms.find((r) => r.id === id)!;
  const lidarProject = site.projects.find((project) => project.id === "lidar")!;

  return (
    <>
      <RoomSection
        id="hallway"
        eyebrow={room("hallway").eyebrow}
        title={site.name}
        lede={room("hallway").body}
      >
        <p style={{ marginTop: "0.75rem", color: "var(--muted)" }}>
          Welcome to {site.apartmentLabel}. Scroll to walk through.
        </p>
      </RoomSection>

      <RoomSection
        id="bathroom"
        eyebrow={room("bathroom").eyebrow}
        title={room("bathroom").title}
        lede={room("bathroom").body}
      >
        <div className="stack">
          <article className="item">
            <h3>{lidarProject.title}</h3>
            <p>{lidarProject.description}</p>
          </article>
        </div>
      </RoomSection>

      <RoomSection
        id="bedroom1"
        eyebrow={room("bedroom1").eyebrow}
        title={room("bedroom1").title}
        lede={room("bedroom1").body}
        wide
      >
        <div className="stack">
          {site.experience.map((ex) => (
            <article className="item" key={ex.role + ex.org}>
              <h3>
                {ex.role}, {ex.org}
              </h3>
              <p className="meta">{ex.period}</p>
              <p>{ex.summary}</p>
            </article>
          ))}
        </div>
      </RoomSection>

      <RoomSection
        id="bedroom2"
        eyebrow={room("bedroom2").eyebrow}
        title={room("bedroom2").title}
        lede={room("bedroom2").body}
      >
        <div className="stack">
          <article className="item">
            <h3>PhD</h3>
            <p>{site.research.phd}</p>
          </article>
          <article className="item">
            <h3>Related work</h3>
            <p>{site.research.other}</p>
          </article>
        </div>
      </RoomSection>

      <RoomSection
        id="study"
        eyebrow={room("study").eyebrow}
        title={room("study").title}
        lede={room("study").body}
        wide
      >
        <div className="stack">
          {site.caseStudies.map((cs) => (
            <article key={cs.id} className="item">
              <h3>{cs.title}</h3>
              <p className="meta">For {cs.client}</p>
              <ul style={{ paddingLeft: "1.1rem", marginTop: "0.5rem" }}>
                <li>
                  <strong>Problem:</strong> {cs.problem}
                </li>
                <li>
                  <strong>My role:</strong> {cs.role}
                </li>
                <li>
                  <strong>Approach:</strong> {cs.approach}
                </li>
                <li>
                  <strong>Outcome:</strong> {cs.outcome}
                </li>
              </ul>
            </article>
          ))}
        </div>
      </RoomSection>

      <RoomSection
        id="living"
        eyebrow={room("living").eyebrow}
        title={room("living").title}
        lede={room("living").body}
        wide
      >
        <div className="stack">
          {site.projects.filter((project) => project.id !== "lidar").map((p) => (
            <article key={p.id} className="item">
              <h3>
                {p.href ? (
                  <a href={p.href} target="_blank" rel="noreferrer">
                    {p.title}
                  </a>
                ) : (
                  p.title
                )}
              </h3>
              <p>{p.description}</p>
              {p.status ? <p className="meta">{p.status}</p> : null}
            </article>
          ))}
        </div>
      </RoomSection>

      <RoomSection
        id="kitchen"
        eyebrow={room("kitchen").eyebrow}
        title={room("kitchen").title}
        lede={room("kitchen").body}
      >
        <ul className="contact-list">
          {site.personal.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </RoomSection>

      <RoomSection
        id="storage"
        eyebrow={room("storage").eyebrow}
        title={room("storage").title}
        lede={room("storage").body}
      >
        <div className="stack">
          {site.archive.map((p) => (
            <article key={p.id} className="item">
              <h3>
                {p.href ? (
                  <a href={p.href} target="_blank" rel="noreferrer">
                    {p.title}
                  </a>
                ) : (
                  p.title
                )}
              </h3>
              <p>{p.description}</p>
            </article>
          ))}
        </div>
      </RoomSection>

      <RoomSection
        id="contact"
        eyebrow={room("contact").eyebrow}
        title={room("contact").title}
        lede={room("contact").body}
      >
        <p className="meta" style={{ marginTop: "0.75rem" }}>
          {site.location}
        </p>
        <ul className="contact-list">
          <li>
            <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
          </li>
          <li>
            <a href={site.contact.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          </li>
          <li>
            <a href={site.contact.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
          </li>
        </ul>
      </RoomSection>
    </>
  );
}
