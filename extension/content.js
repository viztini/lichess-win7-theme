(() => {
  const api = typeof browser !== "undefined" ? browser : chrome;
  const DEFAULTS = { enabled: true, marquee: true, footer: true, taskbar: true, theme: "win7", visits: 0 };
  const root = document.documentElement;

  let settings = { ...DEFAULTS };
  let built = false;

  // Lichess rewrites <html class="..."> when its theme loads, so we use
  // data-attributes and re-apply them if anything strips them.
  function applyAttrs() {
    const set = (name, val) => {
      if (val === null) {
        if (root.hasAttribute(name)) root.removeAttribute(name);
      } else if (root.getAttribute(name) !== val) {
        root.setAttribute(name, val);
      }
    };
    set("data-retro", settings.enabled ? "1" : null);
    set("data-retro-theme", settings.theme || "win7");
    set("data-retro-marquee", settings.marquee ? null : "off");
    set("data-retro-footer", settings.footer ? null : "off");
    set("data-retro-taskbar", settings.taskbar ? null : "off");
  }

  applyAttrs();
  new MutationObserver(applyAttrs).observe(root, { attributes: true });

  const pad = (n, len) => String(n).padStart(len, "0");

  const LINKS = [
    ["Play", "/"], ["Puzzles", "/training"], ["Learn", "/learn"], ["Watch", "/tv"],
    ["Tournaments", "/tournament"], ["Analysis board", "/analysis"],
    ["Board editor", "/editor"], ["Forum", "/forum"], ["Players", "/player"],
  ];
  const PINNED = ["Play", "Puzzles", "Learn", "Watch"];

  function buildTaskbar() {
    // Start menu
    const start = document.createElement("div");
    start.id = "retro-start";
    start.innerHTML = '<div class="retro-start-title">Lichess</div><div class="retro-start-list"></div>';
    const list = start.querySelector(".retro-start-list");
    for (const [label, href] of LINKS) {
      const a = document.createElement("a");
      a.href = href;
      a.textContent = label;
      list.appendChild(a);
    }

    // Taskbar
    const bar = document.createElement("div");
    bar.id = "retro-taskbar";

    const orb = document.createElement("button");
    orb.id = "retro-orb";
    orb.type = "button";
    orb.title = "Start";
    orb.innerHTML = '<span class="retro-flag"><i></i><i></i><i></i><i></i></span>';
    orb.addEventListener("click", (e) => {
      e.stopPropagation();
      start.classList.toggle("open");
    });
    document.addEventListener("click", (e) => {
      if (!start.contains(e.target)) start.classList.remove("open");
    });
    bar.appendChild(orb);

    const path = location.pathname;
    for (const [label, href] of LINKS) {
      if (!PINNED.includes(label)) continue;
      const a = document.createElement("a");
      a.className = "retro-pin";
      a.href = href;
      a.textContent = label;
      if (href === "/" ? path === "/" : path.startsWith(href)) a.classList.add("current");
      bar.appendChild(a);
    }

    const tray = document.createElement("div");
    tray.className = "retro-tray";
    const clock = document.createElement("div");
    clock.className = "retro-clock";
    const showdesk = document.createElement("div");
    showdesk.className = "retro-showdesk";
    tray.append(clock, showdesk);
    bar.appendChild(tray);

    const tick = () => {
      const d = new Date();
      clock.innerHTML =
        d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) +
        "<br>" + d.toLocaleDateString();
    };
    tick();
    setInterval(tick, 15000);

    document.body.append(start, bar);
  }

  function build() {
    if (built || !document.body) return;
    built = true;

    // Marquee + footer (Win98 / Geocities themes)
    const mq = document.createElement("div");
    mq.id = "retro-marquee";
    const m = document.createElement("marquee");
    m.setAttribute("scrollamount", "6");
    m.textContent =
      "*** WELCOME TO LICHESS.ORG *** The FREE online chess server *** No ads, no kidding *** " +
      "Please sign my guestbook *** Best viewed at 800x600 *** Play a bullet game! *** ";
    mq.appendChild(m);

    const foot = document.createElement("div");
    foot.id = "retro-footer";
    foot.innerHTML =
      '<div class="retro-rainbow"></div>' +
      '<div class="retro-construction">UNDER CONSTRUCTION</div>' +
      "<p>You are visitor number</p>" +
      '<div class="retro-counter" id="retro-counter">000000</div>' +
      '<div class="retro-badges">' +
      '<span class="retro-badge">Best viewed with<br>Netscape 4.0</span>' +
      '<span class="retro-badge">Made with<br>Notepad</span>' +
      '<span class="retro-badge">Valid<br>HTML 4.01!</span>' +
      '<span class="retro-badge">Powered by<br>56k modem</span>' +
      "</div>" +
      '<p class="retro-ring">[ &lt;&lt; Prev ] [ Random ] [ Next &gt;&gt; ] &nbsp; Chess WebRing</p>' +
      '<div class="retro-rainbow"></div>';

    const main = document.getElementById("main-wrap");
    if (main && main.parentNode) main.parentNode.insertBefore(mq, main);
    else document.body.insertBefore(mq, document.body.firstChild);
    document.body.appendChild(foot);

    buildTaskbar();

    const visits = (settings.visits || 0) + 1;
    api.storage.local.set({ visits });
    const c = document.getElementById("retro-counter");
    if (c) c.textContent = pad(1337 + visits, 6);
  }

  function init(stored) {
    settings = { ...DEFAULTS, ...stored };
    applyAttrs();
    if (document.body) build();
    else document.addEventListener("DOMContentLoaded", build, { once: true });
  }

  api.storage.local.get(DEFAULTS).then(init, () => init({}));

  api.storage.onChanged.addListener((changes) => {
    for (const k of ["enabled", "marquee", "footer", "taskbar", "theme"]) {
      if (changes[k]) settings[k] = changes[k].newValue;
    }
    applyAttrs();
  });
})();
