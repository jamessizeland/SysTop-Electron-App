// import dependencies
const { ipcRenderer } = require("electron");
const settingsForm = document.getElementById("settings-form");

// get settings from GUI
ipcRenderer.on("settings:get", (e, settings) => {
  document.getElementById("cpu-overload").value = settings.cpuOverload;
  document.getElementById("alert-frequency").value = settings.alertFrequency;
});

// submit settings
settingsForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const cpuOverload = document.getElementById("cpu-overload").value;
  const alertFrequency = document.getElementById("alert-frequency").value;

  // send new settings to main process
  ipcRenderer.send("settings:set", {
    cpuOverload,
    alertFrequency,
  });
  console.log("settings saved");
});
