const { app, BrowserWindow, Menu, ipcMain, Tray } = require("electron");
const log = require("electron-log");
const Store = require("./Store");
const MainWindow = require("./MainWindow");
const path = require("path");

// Set env
process.env.NODE_ENV = "production";

const isDev = process.env.NODE_ENV !== "production";
const isMac = process.platform === "darwin";

let mainWindow;
let tray;

// init store and defaults
const store = new Store({
  configName: "user-settings",
  defaults: {
    settings: {
      cpuOverload: 80,
      alertFrequency: 5,
    },
  },
});

function createMainWindow() {
  mainWindow = new MainWindow("./app/index.html", isDev);
}

app.on("ready", () => {
  createMainWindow();

  mainWindow.webContents.on("dom-ready", () => {
    //retrieve settings a soon as the dom is ready
    mainWindow.webContents.send("settings:get", store.get("settings"));
  });

  const mainMenu = Menu.buildFromTemplate(menu);
  Menu.setApplicationMenu(mainMenu);
  mainWindow.on("close", (e) => {
    // prevent standard x behaviour to just hide rather than full quit
    if (!app.isQuitting) {
      e.preventDefault();
      mainWindow.hide();
    }
    return true;
  });

  // create tray icon
  const icon = path.join(__dirname, "assets", "icons", "tray_icon.png");
  tray = new Tray(icon);
  tray.on("click", () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide();
      console.log("hide window");
    } else {
      mainWindow.show();
      console.log("show window");
    }
  });

  mainWindow.on("ready", () => (mainWindow = null));

  tray.on("right-click", () => {
    const contextMenu = Menu.buildFromTemplate([
      {
        label: "Quit",
        click: () => {
          app.isQuitting = true;
          app.quit();
        },
      },
    ]);
    tray.popUpContextMenu(contextMenu);
  });
});

const menu = [
  ...(isMac ? [{ role: "appMenu" }] : []),
  {
    role: "fileMenu",
  },
  {
    label: "View",
    submenu: [
      {
        label: "Toggle Navigation",
        click: () => mainWindow.webContents.send("nav:toggle"),
      },
    ],
  },
  ...(isDev
    ? [
        {
          label: "Developer",
          submenu: [
            { role: "reload" },
            { role: "forcereload" },
            { type: "separator" },
            { role: "toggledevtools" },
          ],
        },
      ]
    : []),
];

// set settings
ipcMain.on("settings:set", (e, value) => {
  store.set("settings", value);
  mainWindow.webContents.send("settings:get", store.get("settings"));
});

app.on("window-all-closed", () => {
  if (!isMac) {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});

app.allowRendererProcessReuse = true;
