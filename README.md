# 🔐 Cyber Security Project 1: Password Strength Checker

> **DecodeLabs Junior Analyst Kit | Sheet 01-A**
>
> Powered by DecodeLabs

---

## 📋 Project Overview

A fully responsive, **technical blueprint / engineering-drawing** themed web application that performs live risk classification for a single credential — checking length, character variety, entropy, estimated crack time, and known-leaked-password matches, entirely in the browser. Built as part of the DecodeLabs Cyber Security training program.

### Goal
Implement a real-time password strength analyzer using:
- Rule-based checklist scoring (length, case, numbers, symbols, patterns, leaks)
- Shannon entropy estimation (`length × log₂(pool size)`)
- Brute-force crack-time modeling for two attacker profiles
- A secure, client-side passphrase generator

> Nothing typed into this tool is ever sent anywhere — all analysis happens 100% client-side.

---

## 🚀 Features

| Feature | Description |
|---------|-------------|
| **Live Classification** | Real-time WEAK / MEDIUM / STRONG verdict as you type |
| **Strength Meter** | Animated progress bar color-coded to the verdict |
| **7-Point Checklist** | Length, uppercase, lowercase, number, symbol, pattern, leaked-list checks |
| **Lock Schematic** | Animated SVG padlock with 5 tumbler pins that light up per hardened criterion |
| **Entropy Readout** | Live bits-of-entropy calculation |
| **Crack Time Estimates** | Estimated time to crack on an offline rig (10B guesses/sec) vs. a throttled login (100 guesses/sec) |
| **Leaked Password Check** | Screens against a known-leaked wordlist, including common variants |
| **Pattern Detection** | Flags sequential runs, repeated characters, and keyboard-walk patterns (e.g. `qwerty`) |
| **Show / Hide Toggle** | Eye icon to reveal or mask the typed password |
| **Passphrase Generator** | Cryptographically secure generator (`crypto.getRandomValues`) with adjustable length (8–40) and toggleable character sets |
| **Copy to Clipboard** | One-click copy of the generated passphrase |
| **Field Reference Panel** | Plain-language explainers on entropy, attacker models, and why length alone isn't enough |
| **Responsive** | Works on mobile, tablet, and desktop |

---

## 🎨 Design Theme

This project deliberately avoids a dark neon dashboard look, going for a **technical blueprint / engineering drawing** aesthetic instead — paper, ink, grid lines, and crosshair crop marks.

| Element | Color |
|---------|-------|
| Paper (background) | `#f6f4ee` |
| Paper Panel | `#fbfaf6` |
| Grid Lines | `rgba(27, 42, 74, 0.08)` |
| Ink (primary text) | `#1b2a4a` |
| Ink Soft (secondary text) | `#57678c` |
| Blue Line (accent) | `#2f4d8c` |
| Alert / Weak | `#d8542b` |
| Safe / Strong | `#2f7a52` |
| Amber / Medium | `#c9971f` |

---

## 🛠️ Tech Stack

- **HTML5** — Semantic structure
- **CSS3** — Grid, Custom Properties, SVG styling, blueprint-style crop marks
- **Vanilla JavaScript** — Pure client-side, no dependencies, uses the Web Crypto API for secure randomness
- **Google Fonts** — JetBrains Mono + Inter

---

## 📁 File Structure

```
Project 1 Password-Checker/
├── index.html          # Main HTML structure
├── css/
│   └── style.css       # Blueprint theme + Responsive design
└── js/
    ├── script.js        # Analysis, scoring, and generator logic
    └── wordlist.js       # Known-leaked password list used for the leak check
```

---

## 🎮 How to Run

### Option 1: Direct Open
1. Download or clone this repository
2. Open `index.html` in any modern browser (Chrome, Firefox, Edge, Safari)

### Option 2: Live Server (Recommended)
```bash
# Using VS Code Live Server extension
# OR using Python
python -m http.server 8000

# OR using Node.js
npx serve .
```
Then open `http://localhost:8000`

---

## 🔐 Scoring & Analysis Details

### Checklist Criteria
1. At least 8 characters (12+ recommended)
2. Contains an uppercase letter
3. Contains a lowercase letter
4. Contains a number
5. Contains a symbol
6. No obvious repeats or keyboard runs (e.g. `aaa`, `qwerty`)
7. Not on the known-leaked password list

### Scoring Logic
- Base score = `(passed checks / total checks) × 100`
- Bonus: +5 for length ≥ 12, +5 for length ≥ 16
- Hard caps: leaked passwords capped at 15, patterned passwords capped at 45, sub-8-character passwords capped at 25
- Verdict: `STRONG` ≥ 75, `MEDIUM` ≥ 45, otherwise `WEAK`

### Entropy Formula
```
Entropy (bits) = length × log₂(character pool size)
```

### Crack Time Models
- **Offline rig**: 10,000,000,000 (10B) guesses/second — a stolen password hash on dedicated hardware
- **Throttled login**: 100 guesses/second — a rate-limited login form

---

## ⚠️ Why Length Alone Isn't Enough

| Vulnerability | Impact |
|---------------|--------|
| **Leaked Passwords** | Common breached passwords are tried first, regardless of length |
| **Keyboard Runs & Repeats** | Patterns like `qwerty` or `aaa111` are guessed almost instantly |
| **Weak Character Variety** | A long password using only lowercase letters still has a small effective pool size |

> This is a **learning tool** for understanding password strength concepts, not a substitute for a password manager.

---

## 📱 Responsive Breakpoints

| Screen | Layout |
|--------|--------|
| **Desktop** | Two-column analysis panel (input + checklist alongside the lock schematic) |
| **Tablet / Mobile** | Stacked layout, full-width input and controls |

---

## 🎯 Project Deliverables Checklist

- [x] Real-time password analysis as the user types
- [x] Implement entropy calculation (`length × log₂(pool size)`)
- [x] Model two distinct attacker crack-time scenarios
- [x] Detect leaked passwords and common patterns
- [x] Provide a secure passphrase generator
- [x] Blueprint / technical-drawing themed UI
- [x] Fully responsive design

---

## 🏆 Skills Demonstrated

- Password security concepts
- Entropy & information theory basics
- Regex-based pattern detection
- Secure random number generation (Web Crypto API)
- DOM manipulation & live UI updates
- SVG animation
- Responsive web design
- UI/UX design principles

---

## 📜 License

This project is created for **educational purposes** as part of the DecodeLabs Industrial Training Kit.

---

<p align="center">
  <b>🔒 DecodeLabs — Your journey to becoming a professional security expert begins here.</b>
</p>
