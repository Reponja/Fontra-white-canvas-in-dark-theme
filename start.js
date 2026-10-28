// Fontra "White Canvas" plugin
//
// Toggles the glyph editor between:
//   - Fontra's normal appearance (dark canvas, white glyphs in dark mode)
//   - a white canvas with black glyphs, while the Fontra UI stays as-is
//
// The state is remembered per browser in localStorage.

const STYLE_ELEMENT_ID = "fontra-white-canvas-style";
const ROOT_CLASS = "fontra-white-canvas";
const STORAGE_KEY = "fontra.white-canvas-mode";

const isMac = /Mac|iPhone|iPad|iPod/.test(
  navigator.platform || navigator.userAgent || ""
);
const SHORTCUT_LABEL = isMac ? "\u2318\u21e7U" : "Ctrl+Shift+U";
const MENU_TITLE = `White Canvas (${SHORTCUT_LABEL})`;

function ensureStyles() {
  if (document.getElementById(STYLE_ELEMENT_ID)) {
    return;
  }

  const style = document.createElement("style");
  style.id = STYLE_ELEMENT_ID;
  style.textContent = `
    html.${ROOT_CLASS} body,
    html.${ROOT_CLASS} .main-container,
    html.${ROOT_CLASS} #edit-canvas {
      background-color: #fff;
    }
  `;
  document.head.appendChild(style);
}

function readStoredState() {
  try {
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch (error) {
    return false;
  }
}

function writeStoredState(enabled) {
  try {
    localStorage.setItem(STORAGE_KEY, enabled ? "1" : "0");
  } catch (error) {
    // localStorage can be unavailable in private browsing or sandboxed contexts.
  }
}

function isWhiteCanvas() {
  return document.documentElement.classList.contains(ROOT_CLASS);
}

function applyLayerTheme(editor) {
  const whiteCanvas = isWhiteCanvas();
  const darkTheme = whiteCanvas ? false : editor.isThemeDark;

  if (editor.visualizationLayers) {
    editor.visualizationLayers.darkTheme = darkTheme;
  }
  if (editor.cleanGlyphsLayers) {
    editor.cleanGlyphsLayers.darkTheme = darkTheme;
  }
  editor.canvasController?.requestUpdate?.();
}

function setWhiteCanvas(editor, enabled, { persist = true } = {}) {
  document.documentElement.classList.toggle(ROOT_CLASS, enabled);
  if (persist) {
    writeStoredState(enabled);
  }
  applyLayerTheme(editor);
}

function toggleWhiteCanvas(editor) {
  setWhiteCanvas(editor, !isWhiteCanvas());
}

function installThemeHook(editor) {
  const originalThemeChanged = editor.themeChanged?.bind(editor);
  if (!originalThemeChanged) {
    return;
  }

  // Fontra calls themeChanged() when the OS theme or the Fontra theme setting
  // changes. Re-apply our override afterwards, so white-canvas mode survives it.
  editor.themeChanged = () => {
    originalThemeChanged();
    applyLayerTheme(editor);
  };
}

function installMenu(editor) {
  const getViewMenuItems = editor.getViewMenuItems?.bind(editor);
  if (!getViewMenuItems) {
    return;
  }

  editor.getViewMenuItems = () => {
    return [
      ...getViewMenuItems(),
      { title: "-" },
      {
        title: () => MENU_TITLE,
        checked: isWhiteCanvas(),
        enabled: () => true,
        callback: () => toggleWhiteCanvas(editor),
      },
    ];
  };
}

function makeShortcutHandler(editor) {
  return (event) => {
    if (event.repeat || event.isComposing) {
      return;
    }

    const commandKeyDown = isMac ? event.metaKey : event.ctrlKey;
    if (!commandKeyDown || !event.shiftKey || event.altKey) {
      return;
    }

    const isUKey = event.code === "KeyU" || event.key?.toLowerCase() === "u";
    if (!isUKey) {
      return;
    }

    event.preventDefault();
    toggleWhiteCanvas(editor);
  };
}

export function start(editor, pluginPath) {
  if (window.__fontraWhiteCanvasPlugin) {
    return;
  }
  window.__fontraWhiteCanvasPlugin = true;

  ensureStyles();
  setWhiteCanvas(editor, readStoredState(), { persist: false });
  installThemeHook(editor);
  installMenu(editor);

  window.addEventListener("keydown", makeShortcutHandler(editor));
}
