// import dependencies
const path = require("path");
const { cpu, mem, os } = require("node-os-utils");

// set model
document.getElementById("cpu-model").innerText = cpu.model();

// Computer name
document.getElementById("cpu-name").innerText = os.hostname();

// OS
document.getElementById("os").innerText = `${os.type()} ${os.arch()}`;

// Total memory
mem.info().then((info) => {
  document.getElementById("mem-total").innerText =
    Math.round(info.totalMemMb) / 1000 + " GB";
});

// Run every 2 seconds
setInterval(() => {
  // CPU usage
  cpu.usage().then((info) => {
    document.getElementById("cpu-usage").innerText = info + "%";
  });
  cpu.free().then((info) => {
    document.getElementById("cpu-free").innerText = info + "%";
  });
  document.getElementById("sys-uptime").innerText = formatTime(+os.uptime());
}, 2000);

// Seconds to Time String
function formatTime(seconds) {
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${d}days, ${h}hours, ${m}minutes, ${s}seconds`;
}
