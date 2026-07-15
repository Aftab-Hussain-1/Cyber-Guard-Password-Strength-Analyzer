(function(){
  const pwInput = document.getElementById('pw');
  const toggleBtn = document.getElementById('toggleBtn');
  const gaugeFill = document.getElementById('gaugeFill');
  const verdict = document.getElementById('verdict');
  const crackTime = document.getElementById('crackTime');
  const entropyNum = document.getElementById('entropyNum');
  const leakBanner = document.getElementById('leakBanner');
  const leakText = document.getElementById('leakText');
  const keyspaceViz = document.getElementById('keyspaceViz');
  const checksEl = document.getElementById('checks');

  // small illustrative sample of extremely common breached passwords (not exhaustive)
  const COMMON_LEAKED = new Set([
    "123456","password","123456789","12345678","12345","qwerty","abc123",
    "111111","123123","password1","admin","letmein","welcome","monkey",
    "dragon","iloveyou","1q2w3e4r","football","baseball","trustno1"
  ]);

  // build keyspace viz bars once
  const BAR_COUNT = 28;
  for(let i=0;i<BAR_COUNT;i++){
    const b = document.createElement('div');
    b.className = 'bar';
    b.style.height = '4px';
    keyspaceViz.appendChild(b);
  }
  const bars = keyspaceViz.querySelectorAll('.bar');

  function colorFor(score){
    if(score < 30) return getComputedStyle(document.documentElement).getPropertyValue('--red');
    if(score < 55) return getComputedStyle(document.documentElement).getPropertyValue('--amber');
    if(score < 80) return getComputedStyle(document.documentElement).getPropertyValue('--blue');
    return getComputedStyle(document.documentElement).getPropertyValue('--green');
  }

  function formatCrackTime(seconds){
    if(!isFinite(seconds) || seconds <= 0) return 'instant';
    const units = [
      ['centuries', 100*365*24*3600],
      ['years', 365*24*3600],
      ['days', 24*3600],
      ['hours', 3600],
      ['minutes', 60],
      ['seconds', 1]
    ];
    for(const [name, size] of units){
      if(seconds >= size){
        const val = seconds/size;
        return (val > 999 ? '999+' : val.toFixed(val<10?1:0)) + ' ' + name;
      }
    }
    return 'under a second';
  }

  function evaluate(pw){
    const len = pw.length;
    const hasUpper = /[A-Z]/.test(pw);
    const hasLower = /[a-z]/.test(pw);
    const hasDigit = /[0-9]/.test(pw);
    const hasSymbol = /[^A-Za-z0-9]/.test(pw);
    const isLeaked = pw.length>0 && COMMON_LEAKED.has(pw.toLowerCase());

    // character pool size for entropy estimate
    let pool = 0;
    if(hasLower) pool += 26;
    if(hasUpper) pool += 26;
    if(hasDigit) pool += 10;
    if(hasSymbol) pool += 32;
    if(pool === 0) pool = 1;

    const entropy = len > 0 ? len * Math.log2(pool) : 0;

    // guesses per second assumption: 10 billion/sec (fast offline attack, e.g. GPU + weak hash)
    const guessesPerSecond = 1e10;
    const totalCombos = Math.pow(pool, len);
    const secondsToCrack = isLeaked ? 0 : totalCombos / guessesPerSecond / 2; // avg case

    // score out of 100
    let score = Math.min(100, Math.round(entropy / 100 * 100 * 1.4));
    if(len === 0) score = 0;
    if(isLeaked) score = Math.min(score, 8);

    let label, labelColor;
    if(len === 0){ label = 'Awaiting input'; labelColor = 'var(--ink-dim)'; }
    else if(isLeaked){ label = 'Compromised'; labelColor = 'var(--red)'; }
    else if(len < 8){ label = 'Weak'; labelColor = 'var(--red)'; }
    else if(score < 55){ label = 'Medium'; labelColor = 'var(--amber)'; }
    else if(score < 80){ label = 'Strong'; labelColor = 'var(--blue)'; }
    else { label = 'Very Strong'; labelColor = 'var(--green)'; }

    return {len, hasUpper, hasLower, hasDigit, hasSymbol, isLeaked, entropy, score, label, labelColor, secondsToCrack};
  }

  function render(){
    const pw = pwInput.value;
    const r = evaluate(pw);

    gaugeFill.style.width = r.len === 0 ? '0%' : Math.max(6, r.score) + '%';
    gaugeFill.style.background = colorFor(r.score);

    verdict.textContent = r.label;
    verdict.style.color = r.labelColor;

    crackTime.innerHTML = r.len === 0 ? '' : 'Crack time (est.) <b>' + formatCrackTime(r.secondsToCrack) + '</b>';

    entropyNum.innerHTML = Math.round(r.entropy) + '<span style="font-size:16px;color:var(--ink-dim)"> bits</span>';

    // keyspace bars — animate a rough "fill" representing entropy scaled 0-128 bits
    const filled = Math.min(BAR_COUNT, Math.round((r.entropy/128) * BAR_COUNT));
    bars.forEach((b, i) => {
      if(i < filled){
        b.style.height = (10 + (i/BAR_COUNT)*28) + 'px';
        b.style.background = colorFor(r.score);
      } else {
        b.style.height = '4px';
        b.style.background = 'var(--grid)';
      }
    });

    // checks
    const map = {len:r.len>=8, upper:r.hasUpper, lower:r.hasLower, digit:r.hasDigit, symbol:r.hasSymbol, leak: r.len>0 && !r.isLeaked};
    Object.keys(map).forEach(key=>{
      const row = checksEl.querySelector('[data-key="'+key+'"]');
      const icon = row.querySelector('.check-icon');
      if(r.len === 0){
        row.classList.remove('pass');
        icon.textContent = '';
        return;
      }
      if(map[key]){
        row.classList.add('pass');
        icon.textContent = '✓';
      } else {
        row.classList.remove('pass');
        icon.textContent = '';
      }
    });

    // leak banner
    if(r.len === 0){
      leakBanner.className = 'leak-banner safe';
      leakText.textContent = 'No breach list checked yet — start typing to test against common leaked passwords.';
    } else if(r.isLeaked){
      leakBanner.className = 'leak-banner danger';
      leakText.textContent = 'This exact password appears on public breach lists. It would be tried in the first second of any real attack — regardless of length or symbols.';
    } else {
      leakBanner.className = 'leak-banner safe';
      leakText.textContent = 'Not found in this sample breach list. (Demo uses a small illustrative set — always check real passwords against a full service like Have I Been Pwned.)';
    }
  }

  pwInput.addEventListener('input', render);

  toggleBtn.addEventListener('click', ()=>{
    const isPw = pwInput.type === 'password';
    pwInput.type = isPw ? 'text' : 'password';
    toggleBtn.textContent = isPw ? 'Hide' : 'Show';
  });

  render();

  // ---- Passphrase Fabricator ----
  const lenSlider = document.getElementById('lenSlider');
  const lenVal = document.getElementById('lenVal');
  const optUpper = document.getElementById('optUpper');
  const optLower = document.getElementById('optLower');
  const optDigit = document.getElementById('optDigit');
  const optSymbol = document.getElementById('optSymbol');
  const genOutput = document.getElementById('genOutput');
  const genBtn = document.getElementById('genBtn');
  const genCopyBtn = document.getElementById('genCopyBtn');

  const CHARS = {
    upper: 'ABCDEFGHJKLMNPQRSTUVWXYZ',
    lower: 'abcdefghijkmnpqrstuvwxyz',
    digit: '23456789',
    symbol: '!@#$%^&*()-_=+[]{}?'
  };

  lenSlider.addEventListener('input', ()=>{ lenVal.textContent = lenSlider.value; });

  function secureRandomInt(max){
    const arr = new Uint32Array(1);
    crypto.getRandomValues(arr);
    return arr[0] % max;
  }

  function generatePassphrase(){
    const pools = [];
    if(optUpper.checked) pools.push(CHARS.upper);
    if(optLower.checked) pools.push(CHARS.lower);
    if(optDigit.checked) pools.push(CHARS.digit);
    if(optSymbol.checked) pools.push(CHARS.symbol);

    if(pools.length === 0){
      genOutput.textContent = 'Select at least one character type';
      return;
    }

    const length = parseInt(lenSlider.value, 10);
    const allChars = pools.join('');
    let result = [];

    // guarantee at least one char from each selected pool, then fill the rest
    pools.forEach(pool => result.push(pool[secureRandomInt(pool.length)]));
    while(result.length < length){
      result.push(allChars[secureRandomInt(allChars.length)]);
    }
    // shuffle (Fisher-Yates, crypto-backed)
    for(let i = result.length - 1; i > 0; i--){
      const j = secureRandomInt(i + 1);
      [result[i], result[j]] = [result[j], result[i]];
    }
    result = result.slice(0, length);

    genOutput.textContent = result.join('');
    genCopyBtn.textContent = 'Copy';
    genCopyBtn.classList.remove('copied');

    // feed straight into the evaluator above so the gauge reflects what was just made
    pwInput.value = result.join('');
    pwInput.type = 'text';
    toggleBtn.textContent = 'Hide';
    render();
  }

  genBtn.addEventListener('click', generatePassphrase);

  genCopyBtn.addEventListener('click', async ()=>{
    const text = genOutput.textContent;
    if(!text || text.startsWith('—') || text.startsWith('Select')) return;
    try{
      await navigator.clipboard.writeText(text);
      genCopyBtn.textContent = 'Copied';
      genCopyBtn.classList.add('copied');
      setTimeout(()=>{ genCopyBtn.textContent = 'Copy'; genCopyBtn.classList.remove('copied'); }, 1600);
    }catch(e){
      genCopyBtn.textContent = 'Select & Ctrl+C';
    }
  });
})();