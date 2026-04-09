let warnings = 0;

// 🚫 TAB SWITCH DETECTION
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    warnings++;
    sendViolation("Tab Switch");

    alert("⚠️ Tab switch detected! (" + warnings + ")");

    if (warnings >= 3) {
      failTest("Too many tab switches");
    }
  }
});

// 🚫 COPY-PASTE BLOCK
document.addEventListener("copy", (e) => {
  e.preventDefault();
  sendViolation("Copy attempt");
  alert("❌ Copy not allowed");
});

document.addEventListener("paste", (e) => {
  e.preventDefault();
  sendViolation("Paste attempt");
  alert("❌ Paste not allowed");
});

// 🚫 RIGHT CLICK BLOCK
document.addEventListener("contextmenu", (e) => {
  e.preventDefault();
  sendViolation("Right click");
});

// 🚫 DEV TOOLS DETECTION
setInterval(() => {
  const widthThreshold = window.outerWidth - window.innerWidth > 160;
  const heightThreshold = window.outerHeight - window.innerHeight > 160;

  if (widthThreshold || heightThreshold) {
    sendViolation("Dev tools opened");
  }
}, 2000);

// 🚀 SEND VIOLATION TO SERVER
function sendViolation(type) {
  fetch("http://localhost:5000/api/monitor/violation", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      type,
      time: new Date()
    })
  });
}

// ❌ AUTO FAIL
function failTest(reason) {
  alert("❌ Test terminated: " + reason);

  fetch("http://localhost:5000/api/monitor/fail", {
    method: "POST"
  });

  window.location.href = "/fail.html";
}