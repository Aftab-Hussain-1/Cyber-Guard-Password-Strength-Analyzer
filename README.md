
# Vault Gauge — Password Strength Checker

**Project 1 // Defensive Logic** — built for **DecodeLabs**

A fully client-side password strength checker. Password kabhi bhi browser se bahar nahi jata — sab kuch locally JavaScript mein evaluate hota hai.

---

## 🔍 Overview

Vault Gauge user ko live typing ke doran password ka strength gauge dikhata hai — length, character variety, aur known-breach exposure ke basis par — aur estimate karta hai ke brute-force attempt mein kitna time lagega.

Iske sath ek **Passphrase Fabricator** bhi hai jo crypto-secure random strong passwords generate karta hai.

---

## 🌐 Live Demo
Visit the live website here: https://vault-gauge-password-strength-checker.netlify.app/

---
## 📁 Project Structure

```
├── index.html    → Page structure & layout (4 panels)
├── style.css     → Dark "blueprint/grid" themed styling
└── script.js     → Evaluation logic, gauge rendering, generator
```

---

## ✨ Features

### 1. Live Password Evaluator

- Real-time strength gauge (color-coded: red → amber → blue → green)
- Verdict label: `Weak`, `Medium`, `Strong`, `Very Strong`, ya `Compromised`
- Estimated crack time (assuming 10 billion guesses/sec offline attack)
- 6 live checklist items:
  - 8+ characters
  - Uppercase letter
  - Lowercase letter
  - Number
  - Symbol
  - Not in known-breach list

### 2. Entropy Readout

- Bits of entropy calculated as `length × log₂(character-pool size)`
- Visual "keyspace" bar chart representing entropy strength (scaled 0–128 bits)

### 3. Breach List Check

- Chota illustrative sample set of commonly leaked passwords (`123456`, `password`, `qwerty`, etc.)
- Agar match ho jaye to turant "Compromised" verdict aur red banner

### 4. Passphrase Fabricator

- Adjustable length slider (6–32 characters)
- Toggle options: Uppercase / lowercase / digits / symbols
- Crypto-secure random generation (`crypto.getRandomValues`, Fisher-Yates shuffle)
- Guarantees at least 1 character from har selected pool
- Copy-to-clipboard button
- Generated password directly feed hoti hai upar wale evaluator mein

### 5. Field Reference Panel

- Educational cards explaining:
  - Entropy calculation
  - Offline vs throttled attacker models
  - Why length alone kaafi nahi hai (breach lists / common patterns)

---

## 🛠️ Tech Stack

- **HTML5** — semantic structure
- **CSS3** — custom properties (CSS variables) for theming, responsive grid layout, `prefers-reduced-motion` support
- **Vanilla JavaScript (IIFE)** — no frameworks, no external dependencies except Google Fonts
- Fonts: `Space Mono` (data/mono elements) + `Archivo` (headings/body)

---

## 🔒 Privacy & Security Notes

- Koi bhi password network par send nahi hota — sab kuch client-side (`localhost`/browser) evaluate hota hai
- Random passphrase generation `crypto.getRandomValues` use karta hai (secure), Math.random() nahi
- Breach list sirf ek **chota illustrative demo sample** hai — real-world use ke liye Have I Been Pwned jaisi full service recommend ki gayi hai

---

## ▶️ How to Run

1. Teeno files (`index.html`, `style.css`, `script.js`) same folder mein rakhein
2. `index.html` ko kisi bhi modern browser mein open karein
3. Koi build step ya server zaroori nahi — pure static site hai

---

## 📌 Possible Future Improvements

- Full Have I Been Pwned API integration (k-anonymity model)
- Dictionary/pattern-based attack simulation (e.g. zxcvbn-style scoring)
- Dark/light theme toggle
- Export generated passphrase history (session-only, no persistence)

---

*Built as an educational defensive-security demo — no data collection, no external submission of any typed password.*

# Vault Gauge — Password Strength Checker

**Project 1 // Defensive Logic** — built for **DecodeLabs**

A fully client-side password strength checker. Password kabhi bhi browser se bahar nahi jata — sab kuch locally JavaScript mein evaluate hota hai.

---

## 🔍 Overview

Vault Gauge user ko live typing ke doran password ka strength gauge dikhata hai — length, character variety, aur known-breach exposure ke basis par — aur estimate karta hai ke brute-force attempt mein kitna time lagega.

Iske sath ek **Passphrase Fabricator** bhi hai jo crypto-secure random strong passwords generate karta hai.

---

## 📁 Project Structure

```
├── index.html    → Page structure & layout (4 panels)
├── style.css     → Dark "blueprint/grid" themed styling
└── script.js     → Evaluation logic, gauge rendering, generator
```

---

## ✨ Features

### 1. Live Password Evaluator

- Real-time strength gauge (color-coded: red → amber → blue → green)
- Verdict label: `Weak`, `Medium`, `Strong`, `Very Strong`, ya `Compromised`
- Estimated crack time (assuming 10 billion guesses/sec offline attack)
- 6 live checklist items:
  - 8+ characters
  - Uppercase letter
  - Lowercase letter
  - Number
  - Symbol
  - Not in known-breach list

### 2. Entropy Readout

- Bits of entropy calculated as `length × log₂(character-pool size)`
- Visual "keyspace" bar chart representing entropy strength (scaled 0–128 bits)

### 3. Breach List Check

- Chota illustrative sample set of commonly leaked passwords (`123456`, `password`, `qwerty`, etc.)
- Agar match ho jaye to turant "Compromised" verdict aur red banner

### 4. Passphrase Fabricator

- Adjustable length slider (6–32 characters)
- Toggle options: Uppercase / lowercase / digits / symbols
- Crypto-secure random generation (`crypto.getRandomValues`, Fisher-Yates shuffle)
- Guarantees at least 1 character from har selected pool
- Copy-to-clipboard button
- Generated password directly feed hoti hai upar wale evaluator mein

### 5. Field Reference Panel

- Educational cards explaining:
  - Entropy calculation
  - Offline vs throttled attacker models
  - Why length alone kaafi nahi hai (breach lists / common patterns)

---

## 🛠️ Tech Stack

- **HTML5** — semantic structure
- **CSS3** — custom properties (CSS variables) for theming, responsive grid layout, `prefers-reduced-motion` support
- **Vanilla JavaScript (IIFE)** — no frameworks, no external dependencies except Google Fonts
- Fonts: `Space Mono` (data/mono elements) + `Archivo` (headings/body)

---

## 🔒 Privacy & Security Notes

- Koi bhi password network par send nahi hota — sab kuch client-side (`localhost`/browser) evaluate hota hai
- Random passphrase generation `crypto.getRandomValues` use karta hai (secure), Math.random() nahi
- Breach list sirf ek **chota illustrative demo sample** hai — real-world use ke liye Have I Been Pwned jaisi full service recommend ki gayi hai

---

## ▶️ How to Run

1. Teeno files (`index.html`, `style.css`, `script.js`) same folder mein rakhein
2. `index.html` ko kisi bhi modern browser mein open karein
3. Koi build step ya server zaroori nahi — pure static site hai

---

## 📌 Possible Future Improvements

- Full Have I Been Pwned API integration (k-anonymity model)
- Dictionary/pattern-based attack simulation (e.g. zxcvbn-style scoring)
- Dark/light theme toggle
- Export generated passphrase history (session-only, no persistence)

---

*Built as an educational defensive-security demo — no data collection, no external submission of any typed password.*
