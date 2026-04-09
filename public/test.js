window.onload = function () {
  console.log("JS Loaded ✅");

  const btn = document.getElementById("uploadBtn");

  btn.addEventListener("click", async function () {
    const file = document.getElementById("file").files[0];

    if (!file) {
      alert("Select file first");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    const res = await fetch("http://localhost:5000/api/resume/upload", {
      method: "POST",
      body: formData
    });

    const data = await res.json();

    document.getElementById("result").innerText =
      JSON.stringify(data, null, 2);
  });
};