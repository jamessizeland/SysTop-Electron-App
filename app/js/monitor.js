// import dependencies
const path = require("path");
const { cpu, mem, os } = require("node-os-utils");

let cpuOverload = 5; //%
let alertFrequency = 1; //minutes

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
    document.getElementById("cpu-usage").innerText =
      Math.round(info * 100) / 100 + "%";

    document.getElementById("cpu-progress").style.width = info + "%";

    //make progress bar red if overloaded
    if (info >= cpuOverload) {
      document.getElementById("cpu-progress").style.background = "red";
    } else {
      document.getElementById("cpu-progress").style.background = "#30c88b";
    }
    //check overload
    if (info >= cpuOverload && runNotify(alertFrequency)) {
      notifyUser({
        title: "CPU Overload",
        body: `CPU is over ${cpuOverload}%`,
        icon: path.join(__dirname, "img", "icon.png"),
      });
      localStorage.setItem("lastNotify", +new Date());
    }
  });
  cpu.free().then((info) => {
    document.getElementById("cpu-free").innerText =
      Math.round(info * 100) / 100 + "%";
  });
  document.getElementById("sys-uptime").innerText = formatTime(+os.uptime());
}, 2000);

/*************************************************************************/
// Functions
/*************************************************************************/
// Seconds to Time String
function formatTime(seconds) {
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${d}days, ${h}hours, ${m}minutes, ${s}seconds`;
}

// send notification
function notifyUser(options) {
  new Notification(options.title, options);
}

// time since notification
function runNotify(frequency) {
  if (localStorage.getItem("lastNotify") === null) {
    // Store timestamp
    localStorage.setItem("lastNotify", +new Date());
    return true;
  }
  const notifyTime = new Date(parseInt(localStorage.getItem("lastNotify")));
  const now = new Date();
  const diffTime = Math.abs(now - notifyTime);
  const minutesPassed = Math.ceil(diffTime / (1000 * 60));

  if (minutesPassed > frequency) return true;
  else return false;
}
