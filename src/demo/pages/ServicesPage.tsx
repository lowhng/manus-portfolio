import { Link } from "react-router-dom";
import { site } from "../content/site";

export function ServicesPage() {
  return (
    <main className="services-page">
      <p className="eyebrow">
        <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
          ← Back to the apartment
        </Link>
      </p>
      <h1>Services &amp; pricing</h1>
      <p className="sub">
        Plain pricing for website work. Photography offerings have been removed
        from this site.
      </p>
      {site.services.map((svc) => (
        <section
          key={svc.name}
          className={`service-block${svc.available ? "" : " unavailable"}`}
        >
          <h2>{svc.name}</h2>
          {!svc.available && svc.note ? (
            <p className="note">{svc.note}</p>
          ) : null}
          <p>{svc.description}</p>
          {svc.items.map((item) => (
            <div className="price-row" key={item.label}>
              <span>{item.label}</span>
              <span className="price">{item.price}</span>
            </div>
          ))}
        </section>
      ))}
      <p className="note">
        Questions?{" "}
        <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
      </p>
    </main>
  );
}
