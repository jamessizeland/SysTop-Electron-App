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
  document.getElementById("mem-total").innerText = info.totalMemMb;
  console.log(info);
});
