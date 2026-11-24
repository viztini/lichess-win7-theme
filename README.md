# Retro Lichess

A Firefox extension that skins [Lichess](https://lichess.org) as an early-2000s desktop.

<!-- Add a screenshot at screenshots/win7.png and uncomment:
![Windows 7 theme](screenshots/win7.png)
-->

## Themes

| Theme | Description |
| --- | --- |
| **Windows 7 Aero** (default) | Frosted glass panels, forest wallpaper, glossy Aero buttons, Segoe UI, and a working taskbar with a start orb, pinned links and a clock. |
| **Windows 98** | Flat gray bevels, teal desktop, navy title bars, a scrolling marquee and a visitor counter. |
| **Geocities** | Starfield, Comic Sans, rainbow headers, ridge borders, "under construction" footer. |

Click the toolbar icon to switch themes or toggle the taskbar, marquee and footer. Changes apply instantly to open Lichess tabs.

Your own Lichess board and piece theme is left alone, so pick one you like in Lichess preferences.

## Install

Firefox only (Manifest V3, Firefox 115 or newer).

### Try it (temporary)

1. Download or clone this repository.
2. Open `about:debugging#/runtime/this-firefox`.
3. Click **Load Temporary Add-on** and select `extension/manifest.json`.

Temporary add-ons are removed when Firefox restarts.

### Permanent

Firefox only keeps unsigned add-ons in Developer Edition or Nightly (set `xpinstall.signatures.required` to `false` in `about:config`), or after signing. To sign, run `npm run build` and submit the zip from `dist/` to [addons.mozilla.org](https://addons.mozilla.org/developers/) as an unlisted add-on.

## Development

```bash
npm install
npm start      # launches Firefox with the extension and reloads on change
npm run lint   # web-ext lint
npm run build  # zip into dist/
```

### Layout

```
extension/
  manifest.json
  content.js     applies theme attributes, builds taskbar / marquee / footer
  retro.css      Windows 98 + Geocities themes
  win7.css       Windows 7 Aero theme
  popup.html/js  toolbar settings popup
  assets/        wallpaper
```

### How it works

Lichess rewrites the `class` attribute on `<html>` once its own theme code runs, which would remove any class the extension added. State therefore lives in `data-retro*` attributes on `<html>`, and a `MutationObserver` puts them back if something strips them. Every selector in the stylesheets is scoped to those attributes, so turning the theme off in the popup removes all styling.

### Customising

- **Glass tint**: edit `--w7-tint` at the top of `extension/win7.css`.
- **Wallpaper**: replace `extension/assets/wallpaper.jpg` (any size; it is drawn with `background-size: cover`).
- **Start menu / pinned links**: edit the `LINKS` and `PINNED` arrays in `extension/content.js`.

Lichess changes its markup now and then. If a part of the site looks unstyled, inspect the element and add its selector to the relevant list in the CSS.

## Credits and disclaimers

- Not affiliated with, endorsed by, or sponsored by Lichess or Microsoft. "Windows" and "Aero" are trademarks of Microsoft; this project only imitates a visual style.
- Lichess is free and open source software: <https://github.com/lichess-org/lila>.
- `extension/assets/wallpaper.jpg` is a third-party photograph and is not covered by the MIT license. Replace it with an image you have the right to redistribute before publishing.

## License

MIT, see [LICENSE](LICENSE).
