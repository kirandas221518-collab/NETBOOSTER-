let testing = false;

// ===============================
// NETBOOST SPEED TEST
// ===============================

async function startTest() {

  if (testing) return;

  testing = true;

  const button = document.getElementById("testButton");
  const status = document.getElementById("testStatus");
  const speedValue = document.getElementById("speedValue");

  const downloadEl = document.getElementById("download");
  const uploadEl = document.getElementById("upload");
  const pingEl = document.getElementById("ping");
  const qualityEl = document.getElementById("qualityText");

  button.disabled = true;
  button.innerText = "TESTING...";
  status.innerText = "Checking your connection...";
  
  speedValue.innerText = "0";
  downloadEl.innerText = "--";
  uploadEl.innerText = "--";
  pingEl.innerText = "--";
  qualityEl.innerText = "Testing...";

  try {

    // -------------------------------
    // PING TEST
    // -------------------------------

    status.innerText = "Testing latency...";

    const pingStart = performance.now();

    await fetch(
      "https://speed.cloudflare.com/__down?bytes=1",
      {
        cache: "no-store",
        mode: "cors"
      }
    );

    const pingEnd = performance.now();

    const ping = Math.round(pingEnd - pingStart);

    pingEl.innerText = ping + " ms";


    // -------------------------------
    // DOWNLOAD TEST
    // -------------------------------

    status.innerText = "Testing download speed...";

    const testSize = 5000000; // 5 MB

    const startTime = performance.now();

    const response = await fetch(
      "https://speed.cloudflare.com/__down?bytes=" + testSize,
      {
        cache: "no-store",
        mode: "cors"
      }
    );

    const data = await response.arrayBuffer();

    const endTime = performance.now();

    const seconds = (endTime - startTime) / 1000;

    const bytes = data.byteLength;

    const bits = bytes * 8;

    const mbps = bits / seconds / 1000000;

    const downloadSpeed = Math.max(
      0.1,
      Math.round(mbps * 10) / 10
    );

    downloadEl.innerText = downloadSpeed + " Mbps";

    speedValue.innerText = downloadSpeed;


    // -------------------------------
    // UPLOAD
    // -------------------------------

    status.innerText = "Testing upload speed...";

    const uploadSize = 1000000; // 1 MB

    const uploadData = new Uint8Array(uploadSize);

    const uploadStart = performance.now();

    await fetch(
      "https://speed.cloudflare.com/__up",
      {
        method: "POST",
        body: uploadData,
        cache: "no-store",
        mode: "cors"
      }
    );

    const uploadEnd = performance.now();

    const uploadSeconds =
      (uploadEnd - uploadStart) / 1000;

    const uploadMbps =
      (uploadSize * 8) /
      uploadSeconds /
      1000000;

    const uploadSpeed = Math.max(
      0.1,
      Math.round(uploadMbps
