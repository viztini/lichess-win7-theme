const api = typeof browser !== "undefined" ? browser : chrome;
const DEFAULTS = { enabled: true, marquee: true, footer: true, taskbar: true, theme: "win7" };

function syncRows(theme) {
  document.querySelectorAll("[data-for]").forEach((row) => {
    row.style.display = row.dataset.for.split(" ").includes(theme) ? "" : "none";
  });
}

api.storage.local.get(DEFAULTS).then((s) => {
  syncRows(s.theme);
  for (const key of Object.keys(DEFAULTS)) {
    const el = document.getElementById(key);
    if (el.type === "checkbox") {
      el.checked = !!s[key];
      el.addEventListener("change", () => api.storage.local.set({ [key]: el.checked }));
    } else {
      el.value = s[key];
      el.addEventListener("change", () => {
        api.storage.local.set({ [key]: el.value });
        syncRows(el.value);
      });
    }
  }
});
