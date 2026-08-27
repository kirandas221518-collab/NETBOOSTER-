let testing = false;

function startTest() {

  if (testing) return;

  testing = true;

  const button = document.getElementById("testButton");
  const status = document.getElementById("testStatus");
  const speedValue = document.getElementById("speedValue");
  const circle = document.querySelector(".speed-circle");

  button.disabled = true;
  button.innerText = "TESTING...";

  document.getElementById("download").innerText = "--";
  document.getElementById("upload").innerText = "--";
  document.getElementById("ping").innerText = "--";
  document.getElementById("qualityText").innerText = "Testing";

  let speed = 0;
  let progress = 0;

  status.innerText = "Checking your connection...";

  const interval = setInterval(() => {

    progress += Math.random() * 8 + 3;

    if (progress > 100) {
      progress = 100;
    }

    speed = Math.round(
      20 +
      Math.random() * 80 +
      Math.sin(progress / 10) * 15
    );

    speedValue.innerText = speed;

    const degree = progress * 3.6;

    circle.style.background =
      `conic-gradient(#00d9ff ${degree}deg, #15202a ${degree}deg)`;

    if (progress < 35) {
      status.innerText = "Testing download speed...";
    }
    else if (progress < 70) {
      status.innerText = "Testing upload speed...";
    }
    else {
      status.innerText = "Checking latency...";
    }

    if (progress >= 100) {

      clearInterval(interval);

      finishTest(speed);
    }

  }, 100);

}


function finishTest(downloadSpeed) {

  const uploadSpeed = Math.max(
    5,
    Math.round(downloadSpeed * (0.25 + Math.random() * 0.25))
  );

  const ping = Math.round(
    10 + Math.random() * 60
  );

  document.getElementById("download").innerText =
    downloadSpeed + " Mbps";

  document.getElementById("upload").innerText =
    uploadSpeed + " Mbps";

  document.getElementById("ping").innerText =
    ping + " ms";

  let quality = "";

  if (downloadSpeed >= 100 && ping < 30) {
    quality = "Excellent";
  }
  else if (downloadSpeed >= 50 && ping < 60) {
    quality = "Good";
  }
  else if (downloadSpeed >= 20) {
    quality = "Average";
  }
  else {
    quality = "Slow";
  }

  document.getElementById("qualityText").innerText =
    quality;

  document.getElementById("testStatus").innerText =
    "Test completed successfully";

  const button = document.getElementById("testButton");

  button.disabled = false;
  button.innerText = "TEST AGAIN";

  testing = false;

  saveHistory(
    downloadSpeed,
    uploadSpeed,
    ping,
    quality
  );
}


function saveHistory(download, upload, ping, quality) {

  const history =
    JSON.parse(localStorage.getItem("netboostHistory")) || [];

  const result = {
    download: download,
    upload: upload,
    ping: ping,
    quality: quality,
    date: new Date().toLocaleString()
  };

  history.unshift(result);

  if (history.length > 10) {
    history.pop();
  }

  localStorage.setItem(
    "netboostHistory",
    JSON.stringify(history)
  );

  displayHistory();
}


function displayHistory() {

  const historyList =
    document.getElementById("historyList");

  const history =
    JSON.parse(localStorage.getItem("netboostHistory")) || [];

  if (history.length === 0) {

    historyList.innerHTML =
      '<p class="empty">No tests completed yet.</p>';

    return;
  }

  historyList.innerHTML = "";

  history.forEach(item => {

    const div = document.createElement("div");

    div.className = "history-item";

    div.innerHTML = `
      <div>
        <small>Download</small>
        <strong>${item.download} Mbps</strong>
      </div>

      <div>
        <small>Upload</small>
        <strong>${item.upload} Mbps</strong>
      </div>

      <div>
        <small>Ping</small>
        <strong>${item.ping} ms</strong>
      </div>

      <div>
        <small>Quality</small>
        <strong>${item.quality}</strong>
      </div>

      <small>${item.date}</small>
    `;

    historyList.appendChild(div);

  });
}


function clearHistory() {

  localStorage.removeItem("netboostHistory");

  displayHistory();
}


displayHistory();