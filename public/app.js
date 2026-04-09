async function uploadResume(){

  const file = document.getElementById("resumeFile").files[0];

  if(!file){
    alert("Upload file first");
    return;
  }

  const formData = new FormData();
  formData.append("resume", file);

  const res = await fetch("/api/resume/upload",{
    method:"POST",
    body:formData
  });

  const data = await res.json();

  if(data.success){
    alert("Resume Score: " + data.score);
  } else {
    alert("Error: " + data.error);
  }
}