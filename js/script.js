/*
 * script.js
 * DecodeLabs — Password Strength Schematic
 * Pure client-side. Nothing here ever sends the candidate string anywhere.
 */
(() => {
  "use strict";

  // ---------- element refs ----------
  const pwInput      = document.getElementById("pwInput");
  const toggleVis    = document.getElementById("toggleVis");
  const eyeIcon      = document.getElementById("eyeIcon");
  const clearBtn     = document.getElementById("clearBtn");

  const verdictText  = document.getElementById("verdictText");
  const meterFill    = document.getElementById("meterFill");
  const checklist    = document.getElementById("checklist");

  const entropyVal      = document.getElementById("entropyVal");
  const crackOfflineEl  = document.getElementById("crackOffline");
  const crackThrottled  = document.getElementById("crackThrottled");

  const statusDot   = document.getElementById("statusDot");
  const statusText  = document.getElementById("statusText");

  const lockSvg   = document.getElementById("lockSvg");
  const lockScore = document.getElementById("lockScore");
  const pins      = Array.from(document.querySelectorAll(".pin"));

  const lenSlider  = document.getElementById("lenSlider");
  const lenReadout = document.getElementById("lenReadout");
  const optUpper   = document.getElementById("optUpper");
  const optLower   = document.getElementById("optLower");
  const optNumber  = document.getElementById("optNumber");
  const optSymbol  = document.getElementById("optSymbol");
  const genBtn     = document.getElementById("genBtn");
  const copyBtn    = document.getElementById("copyBtn");
  const genOutput  = document.getElementById("genOutput");
  const copyNote   = document.getElementById("copyNote");

  const SYMBOLS = "!@#$%^&*()_+-=[]{}|;:,.<>?";
  const KEYBOARD_RUNS = ["qwerty", "asdfgh", "zxcvbn", "qazwsx", "1qaz2wsx", "wasd"];

  // ==========================================================
  // 1. ANALYSIS
  // ==========================================================

  function hasSequential(str) {
    const s = str.toLowerCase();
    for (let i = 0; i < s.length - 2; i++) {
      const a = s.charCodeAt(i);
      const b = s.charCodeAt(i + 1);
      const c = s.charCodeAt(i + 2);
      if ((b - a === 1 && c - b === 1) || (a - b === 1 && b - c === 1)) {
        return true;
      }
    }
    return false;
  }

  function hasRepeatedRun(str) {
    return /(.)\1\1/.test(str); // same char 3+ in a row
  }

  function hasKeyboardRun(str) {
    const s = str.toLowerCase();
    return KEYBOARD_RUNS.some((run) => s.includes(run));
  }

  function isLeaked(str) {
    if (!str) return false;
    const s = str.toLowerCase();
    if (LEAKED_PASSWORDS.includes(s)) return true;
    // catch variants like "iloveyou1998" or "password!"
    return LEAKED_PASSWORDS.some((entry) => entry.length >= 6 && s.includes(entry));
  }

  function calcEntropy(str) {
    if (!str) return 0;
    let poolSize = 0;
    if (/[a-z]/.test(str)) poolSize += 26;
    if (/[A-Z]/.test(str)) poolSize += 26;
    if (/[0-9]/.test(str)) poolSize += 10;
    if (/[^a-zA-Z0-9]/.test(str)) poolSize += 32;
    if (poolSize === 0) return 0;
    return str.length * Math.log2(poolSize);
  }

  function formatDuration(seconds) {
    if (!isFinite(seconds) || seconds < 1) return "instantly";
    const units = [
      ["century", 100 * 365.25 * 24 * 3600],
      ["year", 365.25 * 24 * 3600],
      ["day", 24 * 3600],
      ["hour", 3600],
      ["minute", 60],
      ["second", 1],
    ];
    for (const [name, size] of units) {
      if (seconds >= size) {
        const n = seconds / size;
        const rounded = n >= 100 ? Math.round(n).toLocaleString() : n.toFixed(1);
        return `~${rounded} ${name}${n >= 1.5 ? "s" : ""}${n > 99999 ? "+" : ""}`;
      }
    }
    return "instantly";
  }

  function crackTime(entropyBits, guessesPerSecond) {
    const totalGuesses = Math.pow(2, entropyBits);
    const avgGuesses = totalGuesses / 2;
    return avgGuesses / guessesPerSecond;
  }

  function analyze(pw) {
    const checks = {
      length: pw.length >= 8,
      upper: /[A-Z]/.test(pw),
      lower: /[a-z]/.test(pw),
      number: /[0-9]/.test(pw),
      symbol: /[^a-zA-Z0-9]/.test(pw),
      pattern: pw.length > 0 && !hasSequential(pw) && !hasRepeatedRun(pw) && !hasKeyboardRun(pw),
      leaked: pw.length > 0 && !isLeaked(pw),
    };

    const passedCount = Object.values(checks).filter(Boolean).length;
    const totalChecks = Object.keys(checks).length;

    const entropy = calcEntropy(pw);

    // base score from checklist, blended lightly with entropy headroom
    let score = pw.length === 0 ? 0 : Math.round((passedCount / totalChecks) * 100);

    // extra credit for real length beyond the 8-char minimum
    if (pw.length >= 12) score = Math.min(100, score + 5);
    if (pw.length >= 16) score = Math.min(100, score + 5);

    // leaked or obviously patterned strings are capped hard regardless of length
    if (!checks.leaked) score = Math.min(score, 15);
    else if (!checks.pattern) score = Math.min(score, 45);
    if (!checks.length) score = Math.min(score, 25);

    score = Math.max(0, Math.min(100, score));

    let verdict = "WEAK";
    if (score >= 75) verdict = "STRONG";
    else if (score >= 45) verdict = "MEDIUM";

    return { checks, passedCount, totalChecks, entropy, score, verdict };
  }

  function paintChecklist(checks) {
    checklist.querySelectorAll("li").forEach((li) => {
      const key = li.dataset.check;
      const pass = checks[key];
      li.classList.toggle("pass", !!pass);
      li.classList.toggle("fail", !pass);
    });
  }

  function paintLock(score, checks) {
    const passedKeys = Object.values(checks).filter(Boolean).length;
    pins.forEach((pin, i) => {
      pin.classList.toggle("lit", i < Math.round((passedKeys / 7) * 5));
    });
    lockScore.textContent = String(score);
    lockSvg.classList.toggle("unlocked", score >= 75);
  }

  function paintStatus(pw, verdict) {
    statusDot.classList.remove("weak", "medium", "strong");
    if (pw.length === 0) {
      statusText.textContent = "STANDBY — AWAITING INPUT";
      return;
    }
    const cls = verdict.toLowerCase();
    statusDot.classList.add(cls);
    statusText.textContent = `LIVE ANALYSIS — CLASSIFIED ${verdict}`;
  }

  function render() {
    const pw = pwInput.value;
    const result = analyze(pw);

    verdictText.textContent = pw.length === 0 ? "— IDLE —" : `— ${result.verdict} —`;
    verdictText.classList.remove("weak", "medium", "strong");
    if (pw.length > 0) verdictText.classList.add(result.verdict.toLowerCase());

    meterFill.style.width = `${result.score}%`;
    meterFill.style.background =
      result.verdict === "STRONG" ? "var(--safe)" :
      result.verdict === "MEDIUM" ? "var(--amber)" : "var(--alert)";

    entropyVal.textContent = `${result.entropy.toFixed(1)} bits`;
    crackOfflineEl.textContent = formatDuration(crackTime(result.entropy, 1e10));
    crackThrottled.textContent = formatDuration(crackTime(result.entropy, 100));

    paintChecklist(result.checks);
    paintLock(result.score, result.checks);
    paintStatus(pw, result.verdict);
  }

  pwInput.addEventListener("input", render);

  toggleVis.addEventListener("click", () => {
    const showing = pwInput.type === "text";
    pwInput.type = showing ? "password" : "text";
    eyeIcon.style.opacity = showing ? "1" : "0.5";
  });

  clearBtn.addEventListener("click", () => {
    pwInput.value = "";
    pwInput.focus();
    render();
  });

  // ==========================================================
  // 2. GENERATOR
  // ==========================================================

  function buildPool() {
    let pool = "";
    if (optUpper.checked) pool += "ABCDEFGHJKLMNPQRSTUVWXYZ"; // no I/O ambiguity
    if (optLower.checked) pool += "abcdefghijkmnopqrstuvwxyz"; // no l ambiguity
    if (optNumber.checked) pool += "23456789"; // no 0/1 ambiguity
    if (optSymbol.checked) pool += SYMBOLS;
    return pool;
  }

  function securePick(pool) {
    const arr = new Uint32Array(1);
    crypto.getRandomValues(arr);
    return pool[arr[0] % pool.length];
  }

  function generatePassphrase() {
    const pool = buildPool();
    if (!pool) {
      genOutput.textContent = "select at least one character set";
      return;
    }
    const len = Number(lenSlider.value);

    // guarantee at least one of each selected category, then fill + shuffle
    const musts = [];
    if (optUpper.checked) musts.push(securePick("ABCDEFGHJKLMNPQRSTUVWXYZ"));
    if (optLower.checked) musts.push(securePick("abcdefghijkmnopqrstuvwxyz"));
    if (optNumber.checked) musts.push(securePick("23456789"));
    if (optSymbol.checked) musts.push(securePick(SYMBOLS));

    const rest = [];
    for (let i = musts.length; i < len; i++) rest.push(securePick(pool));

    const combined = musts.concat(rest);
    // Fisher-Yates shuffle using crypto randomness
    for (let i = combined.length - 1; i > 0; i--) {
      const arr = new Uint32Array(1);
      crypto.getRandomValues(arr);
      const j = arr[0] % (i + 1);
      [combined[i], combined[j]] = [combined[j], combined[i]];
    }

    genOutput.textContent = combined.join("");
    copyNote.textContent = "";
  }

  lenSlider.addEventListener("input", () => {
    lenReadout.textContent = lenSlider.value;
  });

  genBtn.addEventListener("click", generatePassphrase);

  copyBtn.addEventListener("click", async () => {
    const text = genOutput.textContent;
    if (!text || text === "press GENERATE" || text.startsWith("select at least")) return;
    try {
      await navigator.clipboard.writeText(text);
      copyNote.textContent = "copied to clipboard";
    } catch {
      copyNote.textContent = "copy failed — select the text manually";
    }
    setTimeout(() => (copyNote.textContent = ""), 2500);
  });

  // initial paint
  generatePassphrase();
  render();
})();
