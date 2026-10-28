# White Canvas for Fontra

A small Fontra plugin that switches the glyph editor canvas between its normal
theme and a white canvas with black glyphs. The rest of the Fontra interface
keeps its current theme.

![White canvas with a black glyph](screenshot.png)

## Features

- Toggle with `Ctrl+Shift+U` (Windows/Linux) or `Cmd+Shift+U` (macOS).
- Toggle from **View > White Canvas** as well.
- Remembers the setting per browser and restores it after a reload.
- Keeps working when the OS or Fontra theme changes.
- Self-contained: no dependencies and no changes to Fontra's files.

## Install

### From GitHub

1. Put `plugin.json` and `start.js` in the root of a public GitHub repository.
2. In Fontra, open **Fontra > Plugin Manager**, click **Add**, and enter the
   repository as `user/repo`.
3. Reload the editor.

Fontra fetches GitHub plugins through jsDelivr, so a fresh commit may take a
short while to appear.

### From a local folder

Fontra loads plugins from a URL, so the server must allow cross-origin requests.
This repository includes a small development server that sends the needed CORS
headers:

```sh
python serve.py
```

Then open **Fontra > Plugin Manager**, add `http://localhost:8001`, and reload
the editor. Use a different port with `python serve.py --port 8002` if needed.

To work on the plugin, edit `start.js`, then reload the editor. The development
server disables caching.

## Usage

Open the glyph editor and press `Ctrl+Shift+U` / `Cmd+Shift+U`. The same toggle
is available in **View > White Canvas**.

The setting is stored in `localStorage` under `fontra.white-canvas-mode`.
Remove the plugin from the Plugin Manager to uninstall it.

## Notes

- This affects the glyph editor canvas only. Font overviews and the Fontra
  panels keep their current appearance.
- In a light Fontra theme the canvas is already white, so the toggle has little
  visible effect.
- While enabled, all canvas visualization layers use their light-theme colors.
  Selection overlays and outlines therefore remain visible.
- Tested with Fontra 2026.10.0.
