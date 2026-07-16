# 🛡️ Cyber Guard — Password Strength Analyzer

**DecodeLabs Cyber Security Internship — Project 1 (Enhanced Edition)**

A stylish, hacker-themed **desktop application** (built with Python + CustomTkinter) that analyzes password strength in real time. Not a website — a native GUI app that runs on your machine.

![Status](https://img.shields.io/badge/status-active-success)
![Python](https://img.shields.io/badge/python-3.9%2B-blue)
![License](https://img.shields.io/badge/license-MIT-lightgrey)

---

## ✨ Features

- **Live analysis** — strength updates instantly as you type, no button click needed
- **Dark hacker-terminal UI** — neon green/cyan palette, monospace font, animated scanline
- **Requirement scan checklist** — length, uppercase, lowercase, digit, special character (✔ / ✘)
- **Entropy calculator** — measures password randomness in bits
- **Crack-time estimator** — approximate time to brute-force at 10 billion guesses/sec
- **Leaked password detection** — flags common/breached passwords instantly
- **Show/Hide toggle** (👁) — reveal or mask your password
- **One-click secure password generator** — instantly generates a strong random password
- **Unicode entropy bonus** — rewards passwords using non-ASCII characters

---

## 📸 What It Looks Like

A dark terminal-style window with:
- `CYBER GUARD` header with a glowing scanline animation
- A password input field with live feedback
- A color-coded strength meter: 🔴 Weak → 🟡 Moderate → 🟢 Strong / Fortress
- An entropy + crack-time stat panel
- A live requirement checklist

---

## 🚀 Getting Started

### Prerequisites
- Python 3.9 or higher

### Installation

```bash
pip install customtkinter
```

> **Note:** On some Linux systems you may also need Tkinter:
> ```bash
> sudo apt-get install python3-tk
> ```

### Run the App

```bash
python cyber_password_checker.py
```

---

## 🧠 How It Works

| Component | Description |
|---|---|
| **Scoring** | Points awarded for length (≥8, ≥12), digits, uppercase, lowercase, and special characters |
| **Entropy** | Calculated as `length × log2(character pool size)` |
| **Crack Time** | Estimated using `2^entropy ÷ guesses_per_second (10 billion)` |
| **Leaked Check** | Password compared against a set of commonly breached passwords |
| **Verdict Tiers** | `COMPROMISED` → `WEAK` → `MODERATE` → `STRONG` → `FORTRESS` |

---

## 🗂️ Project Structure

```
├── cyber_password_checker.py   # Main application (GUI + analysis logic)
└── README.md                   # This file
```

---

## ⚠️ Disclaimer

This tool is for **educational purposes** as part of a cyber security internship project. It does not transmit, store, or log any password you enter — all analysis happens locally in memory and is discarded when the app closes.

---

## 📄 License

MIT License — free to use, modify, and share for learning purposes.

---

*Built with 🐍 Python and 🖤 CustomTkinter as part of the DecodeLabs Cyber Security Internship.*
