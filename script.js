const input = document.getElementById("pwdInput");
const strengthLabel = document.getElementById("strengthLabel");
const strengthBadge = document.getElementById("strengthBadge");
const tipBox = document.getElementById("tipBox");
const segments = document.querySelectorAll(".meter-seg");
const eyeBtn = document.getElementById("eyeBtn");

// Check items
const cLen = document.getElementById("c-len");
const cUpper = document.getElementById("c-upper");
const cLower = document.getElementById("c-lower");
const cNum = document.getElementById("c-num");
const cSym = document.getElementById("c-sym");
const cLong = document.getElementById("c-long");
const cNoCommon = document.getElementById("c-nocommon");
const cNoRep = document.getElementById("c-norep");

// Server analysis elements
const analyzeBtn = document.getElementById("analyzeBtn");
const btnText = document.getElementById("btnText");
const apiResult = document.getElementById("apiResult");
const entropyVal = document.getElementById("entropyVal");
const crackVal = document.getElementById("crackVal");

// Toggle password visibility
eyeBtn.addEventListener("click", () => {
  if(input.type === "password") {
    input.type = "text";
  } else {
    input.type = "password";
  }
});

// Helper to update check items
function updateCheck(el, condition) {
  const icon = el.querySelector(".check-icon");
  if (condition) {
    el.classList.add("pass");
    el.classList.remove("fail");
    icon.innerHTML = "&#10003;"; // Checkmark
  } else {
    el.classList.add("fail");
    el.classList.remove("pass");
    icon.innerHTML = "&#10005;"; // Cross
  }
}

// Client-side password checker
input.addEventListener("input", () => {
  const password = input.value;
  let score = 0;

  // Checks
  const hasLen = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNum = /[0-9]/.test(password);
  const hasSym = /[^a-zA-Z0-9]/.test(password);
  const hasLong = password.length >= 12;
  const hasNoRep = !/(.)\1{2,}/.test(password) && password.length > 0;

  // Update UI checks
  updateCheck(cLen, hasLen);
  updateCheck(cUpper, hasUpper);
  updateCheck(cLower, hasLower);
  updateCheck(cNum, hasNum);
  updateCheck(cSym, hasSym);
  updateCheck(cLong, hasLong);
  updateCheck(cNoRep, hasNoRep);
  
  // Reset nocommon since it requires server
  cNoCommon.classList.remove("pass", "fail");
  cNoCommon.querySelector(".check-icon").innerHTML = "&#9675;"; // Circle

  if(hasLen) score++;
  if(hasUpper) score++;
  if(hasLower) score++;
  if(hasNum) score++;
  if(hasSym) score++;
  if(hasLong) score++;

  // Max score on client side before server check is 6. Scale to 5 segments.
  let meterScore = Math.min(5, Math.ceil(score * (5/6)));
  if (password.length === 0) meterScore = 0;

  segments.forEach((seg, index) => {
    if(index < meterScore) {
      if(meterScore <= 2) seg.style.background = "#ff2244";
      else if(meterScore <= 3) seg.style.background = "#ffaa00";
      else seg.style.background = "#00ff88";
    } else {
      seg.style.background = "#111";
    }
  });

  if(password.length === 0) {
    strengthLabel.innerHTML = "STANDBY <span class=\"cursor\"></span>";
    strengthBadge.textContent = "--";
    tipBox.innerHTML = "// awaiting input — type a password above <span class=\"cursor\"></span>";
  } else if(meterScore <= 2) {
    strengthLabel.textContent = "WEAK";
    strengthBadge.textContent = "LOW";
    tipBox.textContent = "Add uppercase letters, numbers and symbols.";
  } else if(meterScore <= 3) {
    strengthLabel.textContent = "MEDIUM";
    strengthBadge.textContent = "GOOD";
    tipBox.textContent = "Try making password longer (12+ chars).";
  } else {
    strengthLabel.textContent = "STRONG";
    strengthBadge.textContent = "SECURE";
    tipBox.textContent = "Excellent password.";
  }
});

// Server-side analysis
analyzeBtn.addEventListener("click", async () => {
  const password = input.value;
  if (!password) {
    apiResult.innerHTML = "<div class='api-line'><span class='api-val danger'>Error: Please enter a password first.</span></div>";
    apiResult.classList.add("show");
    return;
  }

  analyzeBtn.classList.add("loading");
  btnText.textContent = "ANALYZING...";
  
  try {
    const res = await fetch("http://localhost:3000/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ password })
    });
    
    if (!res.ok) throw new Error("Server error");
    
    const data = await res.json();
    
    // Update server-only checks and stats
    updateCheck(cNoCommon, !data.isCommon);
    entropyVal.textContent = data.entropy + " bits";
    crackVal.textContent = data.crackTimeHuman;
    
    // Build result view
    apiResult.innerHTML = `
      <div class="api-line"><span class="api-key">STATUS:</span> <span class="api-val ok">200 OK</span></div>
      <div class="api-line"><span class="api-key">ENTROPY:</span> <span class="api-val">${data.entropy} bits</span></div>
      <div class="api-line"><span class="api-key">CRACK TIME:</span> <span class="api-val">${data.crackTimeHuman}</span></div>
      <div class="api-line"><span class="api-key">COMMON PWD:</span> <span class="api-val ${data.isCommon ? 'danger' : 'ok'}">${data.isCommon ? 'YES' : 'NO'}</span></div>
      <div class="api-line"><span class="api-key">SUGGESTION:</span> <span class="api-val">${data.suggestion}</span></div>
    `;
    apiResult.classList.add("show");

  } catch (err) {
    apiResult.innerHTML = `<div class="api-line"><span class="api-val danger">Connection Error: Ensure backend server is running on port 3000.</span></div>`;
    apiResult.classList.add("show");
  } finally {
    analyzeBtn.classList.remove("loading");
    btnText.textContent = "▶ RUN SERVER-SIDE ANALYSIS";
  }
});