import { RoomSection } from "../../demo/components/RoomSection";
import { site } from "../../demo/content/site";

const roomCopy = {
  foyer: {
    eyebrow: "Foyer",
    title: site.name,
    lede: site.tagline,
  },
  bathroom: {
    eyebrow: "Master bathroom",
    title: "The model",
    lede: "A detailed interior concept, translated from Blender into an interactive Three.js walkthrough.",
  },
  master: {
    eyebrow: "Master bedroom",
    title: "Experience",
    lede: "Roles across utilities transformation, business analysis, UX, and AR research.",
  },
  bedroom1: {
    eyebrow: "Bedroom 1",
    title: "Research",
    lede: "PhD research in AR for on-site sports spectating, and AR headset widget placement.",
  },
  bedroom2: {
    eyebrow: "Bedroom 2",
    title: "Consulting",
    lede: "Utilities-sector digital work for a New Zealand electricity distributor — anonymised case studies.",
  },
  living: {
    eyebrow: "Living and dining",
    title: "Side projects",
    lede: "Things I ship on the side: products, internal tools, and AR experiments.",
  },
  kitchen: {
    eyebrow: "Kitchen",
    title: "Personal",
    lede: "Photography, cake decorating, and noodles — the warm corners of the week.",
  },
  yard: {
    eyebrow: "Balcony and yard",
    title: "Archive",
    lede: "Older projects and experiments kept close, even when they are no longer centre stage.",
  },
  contact: {
    eyebrow: "Front door",
    title: "Say hello",
    lede: "Leave a note on the way out, or get in touch about something worth building.",
  },
} as const;

export function AyannaSections() {
  const lidarProject = site.projects.find((project) => project.id === "lidar")!;

  return (
    <>
      <RoomSection id="foyer" {...roomCopy.foyer}>
        <p className="section-note">Welcome to the Ayanna concept home. Scroll to look around.</p>
      </RoomSection>

      <RoomSection id="bathroom" {...roomCopy.bathroom}>
        <div className="stack">
          <article className="item">
            <h3>{lidarProject.title}</h3>
            <p>{lidarProject.description}</p>
          </article>
        </div>
      </RoomSection>

      <RoomSection id="master" {...roomCopy.master} wide>
        <div className="stack">
          {site.experience.map((experience) => (
            <article className="item" key={`${experience.role}-${experience.org}`}>
              <h3>{experience.role}, {experience.org}</h3>
              <p className="meta">{experience.period}</p>
              <p>{experience.summary}</p>
            </article>
          ))}
        </div>
      </RoomSection>

      <RoomSection id="bedroom1" {...roomCopy.bedroom1}>
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

      <RoomSection id="bedroom2" {...roomCopy.bedroom2} wide>
        <div className="stack">
          {site.caseStudies.map((study) => (
            <article className="item" key={study.id}>
              <h3>{study.title}</h3>
              <p className="meta">For {study.client}</p>
              <ul>
                <li><strong>Problem:</strong> {study.problem}</li>
                <li><strong>My role:</strong> {study.role}</li>
                <li><strong>Approach:</strong> {study.approach}</li>
                <li><strong>Outcome:</strong> {study.outcome}</li>
              </ul>
            </article>
          ))}
        </div>
      </RoomSection>

      <RoomSection id="living" {...roomCopy.living} wide>
        <div className="stack">
          {site.projects.filter((project) => project.id !== "lidar").map((project) => (
            <article className="item" key={project.id}>
              <h3>
                {project.href ? (
                  <a href={project.href} target="_blank" rel="noreferrer">{project.title}</a>
                ) : project.title}
              </h3>
              <p>{project.description}</p>
              {project.status ? <p className="meta">{project.status}</p> : null}
            </article>
          ))}
        </div>
      </RoomSection>

      <RoomSection id="kitchen" {...roomCopy.kitchen}>
        <ul className="contact-list">
          {site.personal.map((interest) => <li key={interest}>{interest}</li>)}
        </ul>
      </RoomSection>

      <RoomSection id="yard" {...roomCopy.yard}>
        <div className="stack">
          {site.archive.map((project) => (
            <article className="item" key={project.id}>
              <h3>
                {project.href ? (
                  <a href={project.href} target="_blank" rel="noreferrer">{project.title}</a>
                ) : project.title}
              </h3>
              <p>{project.description}</p>
            </article>
          ))}
        </div>
      </RoomSection>

      <RoomSection id="contact" {...roomCopy.contact}>
        <p className="meta section-note">{site.location}</p>
        <ul className="contact-list">
          <li><a href={`mailto:${site.contact.email}`}>{site.contact.email}</a></li>
          <li><a href={site.contact.linkedin} target="_blank" rel="noreferrer">LinkedIn</a></li>
          <li><a href={site.contact.github} target="_blank" rel="noreferrer">GitHub</a></li>
        </ul>
      </RoomSection>
    </>
  );
}
