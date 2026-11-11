const root = document.documentElement;
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
const desktop = matchMedia("(min-width: 900px)");
const stickyDeck = matchMedia("(min-width: 900px) and (min-height: 680px)");

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

const tickers = new Set();
function loop(now) {
  for (const fn of tickers) fn(now);
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

/* ---------- Reveal on scroll ---------- */
const revealTargets = $$("[data-reveal]");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("in");
        io.unobserve(entry.target);
      }
    },
    { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
  );
  revealTargets.forEach((el) => io.observe(el));
} else {
  revealTargets.forEach((el) => el.classList.add("in"));
}

/* ---------- Intro ---------- */
const fontsReady = document.fonts?.ready ?? Promise.resolve();
let introAt = 0;
Promise.race([fontsReady, new Promise((r) => setTimeout(r, 1200))]).then(() =>
  requestAnimationFrame(() => {
    root.classList.add("is-ready");
    introAt = performance.now() + 350;
  }),
);

/* ---------- Name: letters swell towards the pointer ---------- */
const chars = [];
$$("[data-chars]").forEach((el) => {
  const text = el.textContent;
  el.textContent = "";
  for (const ch of text) {
    const span = document.createElement("span");
    span.className = ch === " " ? "ch ch--sp" : "ch";
    span.textContent = ch === " " ? " " : ch;
    el.append(span);
    if (ch !== " ") chars.push({ el: span, t: 0 });
  }
});
const nameTile = $(".tile--name");
const pointer = { x: -9999, y: -9999, active: false };
if (chars.length && !reduced) {
  if (finePointer) {
    addEventListener("pointermove", (e) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;
    }, { passive: true });
    document.addEventListener("mouseleave", () => (pointer.active = false));
  }
  tickers.add((now) => {
    const box = nameTile.getBoundingClientRect();
    if (box.bottom < 0 || box.top > innerHeight) return;
    const intro = introAt ? (now - introAt) / 1500 : -1;
    const introOn = intro >= 0 && intro <= 1;
    const near = pointer.active && pointer.x > box.left - 200 && pointer.x < box.right + 200 && pointer.y > box.top - 200 && pointer.y < box.bottom + 200;
    const radius = box.width * 0.24;
    chars.forEach((c, i) => {
      let target = 0;
      if (introOn) {
        const head = intro * (chars.length + 5) - 2.5;
        target = Math.exp(-((i - head) ** 2) / 2.4);
      } else if (near) {
        const r = c.el.getBoundingClientRect();
        const d = Math.hypot(pointer.x - (r.left + r.width / 2), pointer.y - (r.top + r.height / 2));
        target = clamp(1 - d / radius) ** 1.4;
      }
      if (Math.abs(target - c.t) < 0.004) return;
      c.t = lerp(c.t, target, 0.16);
      c.el.style.setProperty("--wg", (560 + c.t * 240).toFixed(0));
      c.el.style.setProperty("--wd", (88 + c.t * 12).toFixed(1));
    });
  });
}

/* ---------- Role rotator ---------- */
const roleEls = $$(".roles > span");
if (roleEls.length > 1 && !reduced) {
  let current = 0;
  setInterval(() => {
    if (document.hidden) return;
    const prev = roleEls[current];
    current = (current + 1) % roleEls.length;
    const next = roleEls[current];
    prev.classList.remove("is-on");
    prev.classList.add("is-off");
    setTimeout(() => prev.classList.remove("is-off"), 750);
    next.classList.remove("is-off");
    requestAnimationFrame(() => next.classList.add("is-on"));
  }, 2400);
}

/* ---------- Dunedin clock ---------- */
const clockText = $(".js-clock");
const hands = { h: $(".clock__h"), m: $(".clock__m"), s: $(".clock__s") };
if (clockText) {
  const fmt = new Intl.DateTimeFormat("en-NZ", { timeZone: "Pacific/Auckland", hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23" });
  const tick = () => {
    const parts = Object.fromEntries(fmt.formatToParts(new Date()).map((p) => [p.type, p.value]));
    const h = Number(parts.hour) % 24;
    const m = Number(parts.minute);
    const s = Number(parts.second);
    clockText.textContent = `${String(h).padStart(2, "0")}:${parts.minute}`;
    const total = h * 3600 + m * 60 + s;
    hands.h.style.transform = `rotate(${(total / 43200) * 360}deg)`;
    hands.m.style.transform = `rotate(${(total / 3600) * 360}deg)`;
    hands.s.style.transform = `rotate(${(total / 60) * 360}deg)`;
  };
  tick();
  setInterval(tick, 1000);
}

/* ---------- Tile tilt ---------- */
if (finePointer && !reduced) {
  $$("[data-tilt]").forEach((el) => {
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--ry", `${((e.clientX - r.left) / r.width - 0.5) * 8}deg`);
      el.style.setProperty("--rx", `${((e.clientY - r.top) / r.height - 0.5) * -8}deg`);
    });
    el.addEventListener("pointerleave", () => {
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
    });
  });
}

/* ---------- Dock ---------- */
const dock = $(".dock");
const dockPill = $(".dock__pill");
const dockLinks = $$("a", dock);
let activeLink = null;
function setActive(link) {
  if (!link) return;
  activeLink = link;
  dockLinks.forEach((a) => a.classList.toggle("is-active", a === link));
  const target = link.offsetParent === null ? dockLinks.find((a) => a.offsetParent !== null) : link;
  dockPill.style.setProperty("--x", `${target.offsetLeft}px`);
  dockPill.style.setProperty("--w", `${target.offsetWidth}px`);
  dockPill.style.setProperty("--o", link.offsetParent === null ? "0" : "1");
  dock.scrollTo({ left: target.offsetLeft - dock.clientWidth / 2 + target.offsetWidth / 2, behavior: reduced ? "auto" : "smooth" });
}
if ("IntersectionObserver" in window) {
  const spy = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) setActive(dockLinks.find((a) => a.getAttribute("href") === `#${entry.target.id}`));
      }
    },
    { rootMargin: "-40% 0px -55% 0px" },
  );
  dockLinks.forEach((a) => {
    const section = $(a.getAttribute("href"));
    if (section) spy.observe(section);
  });
}
setActive(dockLinks[0]);
fontsReady.then(() => setActive(activeLink));
addEventListener("resize", () => setActive(activeLink));

/* ---------- Skills: draggable bubbles ---------- */
const play = $(".play");
const box = $(".play__box");
if (play && box && !reduced) {
  play.classList.add("is-live");
  const items = $$(".bubble", box).map((el) => ({ el, size: Number(el.dataset.size) || 1, r: 60, x: 0, y: 0, vx: 0, vy: 0, drag: null }));
  let W = 0;
  let H = 0;
  let placed = false;
  let running = false;

  function measure() {
    const nw = box.clientWidth;
    const nh = box.clientHeight;
    if (!nw || !nh) return;
    const base = clamp(Math.min(nw / 6.2, nh / 2.5), 50, 104);
    items.forEach((it, i) => {
      it.r = base * it.size;
      it.el.style.setProperty("--dia", `${(it.r * 2).toFixed(1)}px`);
      if (!placed) {
        it.x = ((i + 0.5) / items.length) * nw;
        it.y = nh * (i % 2 ? 0.68 : 0.32);
        const a = Math.random() * Math.PI * 2;
        it.vx = Math.cos(a) * 1.1;
        it.vy = Math.sin(a) * 1.1;
      } else {
        it.x *= nw / W;
        it.y *= nh / H;
      }
    });
    W = nw;
    H = nh;
    placed = true;
  }

  function step() {
    if (!running || !placed) return;
    for (const it of items) {
      if (it.drag) continue;
      it.vx *= 0.992;
      it.vy *= 0.992;
      const speed = Math.hypot(it.vx, it.vy);
      if (speed < 0.35) {
        const a = Math.random() * Math.PI * 2;
        it.vx += Math.cos(a) * 0.05;
        it.vy += Math.sin(a) * 0.05;
      } else if (speed > 26) {
        it.vx *= 26 / speed;
        it.vy *= 26 / speed;
      }
      it.x += it.vx;
      it.y += it.vy;
    }
    for (let i = 0; i < items.length; i++) {
      for (let j = i + 1; j < items.length; j++) {
        const a = items[i];
        const b = items[j];
        let dx = b.x - a.x;
        let dy = b.y - a.y;
        let dist = Math.hypot(dx, dy);
        const min = a.r + b.r;
        if (dist >= min) continue;
        if (dist < 0.01) {
          dx = 1;
          dy = 0;
          dist = 1;
        }
        const nx = dx / dist;
        const ny = dy / dist;
        const overlap = min - dist;
        const wa = a.drag ? 0 : b.drag ? 1 : 0.5;
        const wb = 1 - wa;
        a.x -= nx * overlap * wa;
        a.y -= ny * overlap * wa;
        b.x += nx * overlap * wb;
        b.y += ny * overlap * wb;
        const rel = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
        if (rel < 0) {
          const impulse = rel * 0.92;
          if (!a.drag) {
            a.vx += nx * impulse * (b.drag ? 2 : 1);
            a.vy += ny * impulse * (b.drag ? 2 : 1);
          }
          if (!b.drag) {
            b.vx -= nx * impulse * (a.drag ? 2 : 1);
            b.vy -= ny * impulse * (a.drag ? 2 : 1);
          }
        }
      }
    }
    for (const it of items) {
      if (it.x < it.r) { it.x = it.r; it.vx = Math.abs(it.vx) * 0.85; }
      if (it.x > W - it.r) { it.x = W - it.r; it.vx = -Math.abs(it.vx) * 0.85; }
      if (it.y < it.r) { it.y = it.r; it.vy = Math.abs(it.vy) * 0.85; }
      if (it.y > H - it.r) { it.y = H - it.r; it.vy = -Math.abs(it.vy) * 0.85; }
      it.el.style.transform = `translate3d(${(it.x - it.r).toFixed(1)}px,${(it.y - it.r).toFixed(1)}px,0)`;
    }
  }

  items.forEach((it) => {
    it.el.addEventListener("pointerdown", (e) => {
      const rect = box.getBoundingClientRect();
      it.drag = { ox: e.clientX - rect.left - it.x, oy: e.clientY - rect.top - it.y, px: it.x, py: it.y };
      it.vx = it.vy = 0;
      it.el.classList.add("is-drag");
      it.el.setPointerCapture(e.pointerId);
      e.preventDefault();
    });
    it.el.addEventListener("pointermove", (e) => {
      if (!it.drag) return;
      const rect = box.getBoundingClientRect();
      const nx = clamp(e.clientX - rect.left - it.drag.ox, it.r, W - it.r);
      const ny = clamp(e.clientY - rect.top - it.drag.oy, it.r, H - it.r);
      it.vx = lerp(it.vx, nx - it.x, 0.6);
      it.vy = lerp(it.vy, ny - it.y, 0.6);
      it.x = nx;
      it.y = ny;
    });
    const release = () => {
      if (!it.drag) return;
      it.drag = null;
      it.el.classList.remove("is-drag");
    };
    it.el.addEventListener("pointerup", release);
    it.el.addEventListener("pointercancel", release);
  });

  measure();
  addEventListener("resize", measure);
  fontsReady.then(measure);
  if ("IntersectionObserver" in window) {
    new IntersectionObserver((entries) => {
      running = entries[0].isIntersecting;
      if (running) measure();
    }).observe(box);
  } else {
    running = true;
  }
  tickers.add(step);
}

/* ---------- Experience timeline ---------- */
const gantt = $(".gantt");
if (gantt) {
  const axis = $(".gantt__axis", gantt);
  const rows = $(".gantt__rows", gantt);
  const bars = $$(".bar", gantt);
  const month = (s) => {
    const [y, m] = s.split("-").map(Number);
    return new Date(y, m - 1, 1);
  };
  const now = new Date();
  const starts = bars.map((b) => month(b.dataset.start));
  const axisStart = new Date(Math.min(...starts.map((d) => d.getFullYear())), 0, 1);
  const axisEnd = new Date(now.getFullYear(), now.getMonth() + 2, 1);
  const pos = (d) => clamp((d - axisStart) / (axisEnd - axisStart)) * 100;

  for (let y = axisStart.getFullYear(); y <= now.getFullYear(); y++) {
    const x = pos(new Date(y, 0, 1));
    if (x > 96) break;
    const label = document.createElement("span");
    label.style.setProperty("--x", `${x}%`);
    label.textContent = y;
    axis.append(label);
    const line = document.createElement("i");
    line.className = "gantt__line";
    line.style.setProperty("--x", `${x}%`);
    rows.prepend(line);
  }
  const nowLine = document.createElement("i");
  nowLine.className = "gantt__line gantt__line--now";
  nowLine.style.setProperty("--x", `${pos(now)}%`);
  rows.prepend(nowLine);

  const select = (bar) => {
    bars.forEach((b) => {
      const on = b === bar;
      b.classList.toggle("is-on", on);
      b.setAttribute("aria-pressed", String(on));
      $(`#${b.getAttribute("aria-controls")}`)?.classList.toggle("is-on", on);
    });
  };
  bars.forEach((bar, i) => {
    const start = starts[i];
    let end = now;
    if (bar.dataset.end) {
      end = month(bar.dataset.end);
      end.setMonth(end.getMonth() + 1);
    } else {
      bar.classList.add("bar--now");
    }
    const l = pos(start);
    bar.style.setProperty("--l", `${l.toFixed(2)}%`);
    bar.style.setProperty("--w", `${(pos(end) - l).toFixed(2)}%`);
    bar.style.setProperty("--i", i);
    bar.addEventListener("click", () => select(bar));
    if (finePointer) bar.addEventListener("pointerenter", () => select(bar));
  });
}

/* ---------- Project deck: cards settle back as the next one covers them ---------- */
const pcards = $$(".pcard");
if (pcards.length && !reduced) {
  let lastKey = "";
  tickers.add(() => {
    if (!stickyDeck.matches) {
      if (lastKey !== "off") {
        pcards.forEach((c) => {
          c.style.removeProperty("--s");
          c.style.removeProperty("--b");
        });
        lastKey = "off";
      }
      return;
    }
    const key = `${scrollY}|${innerWidth}|${innerHeight}`;
    if (key === lastKey) return;
    lastKey = key;
    const rects = pcards.map((c) => c.getBoundingClientRect());
    pcards.forEach((card, i) => {
      const next = rects[i + 1];
      const p = next ? clamp((rects[i].top + rects[i].height - next.top) / rects[i].height) : 0;
      card.style.setProperty("--s", (1 - p * 0.05).toFixed(4));
      card.style.setProperty("--b", (1 - p * 0.32).toFixed(3));
    });
  });
}

/* ---------- Services ---------- */
const svcs = $$(".svc");
const openSvc = (item, open = true) => {
  svcs.forEach((other) => {
    const on = other === item ? open : false;
    other.classList.toggle("is-on", on);
    $(".svc__tab", other).setAttribute("aria-expanded", String(on));
  });
};
svcs.forEach((item) => {
  $(".svc__tab", item).addEventListener("click", () => openSvc(item, desktop.matches ? true : !item.classList.contains("is-on")));
  if (finePointer) item.addEventListener("pointerenter", () => desktop.matches && openSvc(item));
});

/* ---------- Contact form (Formspree) ---------- */
const form = $("#contact-form");
const submit = $("#contact-submit");
const status = $("#contact-status");
if (form && submit && status) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    submit.disabled = true;
    status.className = "form__status";
    status.textContent = "Sending…";
    try {
      const res = await fetch(form.action, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error("Form submission failed");
      form.reset();
      status.classList.add("is-ok");
      status.textContent = "Thanks! Your message has been sent.";
    } catch {
      status.classList.add("is-error");
      status.textContent = "Something went wrong. Please email hello@weihong.dev instead.";
    } finally {
      submit.disabled = false;
    }
  });
}
