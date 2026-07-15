# Password Strength Schematic — DecodeLabs Project 1

A client-side Password Strength Checker built for the DecodeLabs Cyber
Security Industrial Training Kit, Project 1 (Batch 2026).

Everything runs **entirely in the browser**. The password you type is never
sent to a server, logged, or stored anywhere.

---

## Live demo files

Open `index.html` directly in any modern browser — no build step, no
server, no dependencies to install (one Google Font is loaded over the
network for type; the app still works offline, it'll just fall back to
system fonts).

```
password-checker/
├── index.html          → page structure
├── css/
│   └── style.css       → all styling (blueprint / technical-drawing theme)
├── js/
│   ├── wordlist.js     → small sample leaked-password list
│   └── script.js       → all analysis + generator logic
└── README.md           → this file
```

Each concern lives in its own file on purpose: markup, styling, data, and
logic are separated so any one piece can be read, replaced, or graded
independently.

---

## What it does

### 1. Live analysis panel
Type a password and get an immediate, real-time read-out:

- **Classification** — WEAK / MEDIUM / STRONG, with a 0–100 score
- **Checklist** against the brief's required criteria:
  - length ≥ 8 characters
  - contains an uppercase letter
  - contains a lowercase letter
  - contains a number
  - contains a symbol
  - **bonus:** no obvious repeated runs, sequences, or keyboard patterns
    (e.g. `aaa`, `abc`, `qwerty`)
  - **bonus:** not present on a sample list of known leaked passwords
- **Entropy** in bits, calculated as `length × log2(character-pool size)`
- **Estimated crack time** under two attacker models (as outlined in the
  training deck):
  - *offline / stolen hash* — 10 billion guesses/second
  - *throttled login form* — 100 guesses/second
- A schematic padlock that visually "unlocks" (five tumbler pins light up
  one per satisfied criterion group) as the password gets stronger —
  this is the page's signature visual element, built as an animated
  inline SVG rather than a generic circular gauge.

### 2. Passphrase fabricator (generator)
- Adjustable length (8–40 characters)
- Toggle uppercase / lowercase / numbers / symbols
- Uses `crypto.getRandomValues` (not `Math.random`) for actual
  cryptographic randomness, guarantees at least one character from each
  selected set, and excludes visually ambiguous characters (`0/O`, `1/l/I`)
- One-click copy to clipboard

### 3. Field reference panel
Three short explainers (entropy, the two attacker models, and why leaked
strings can fail instantly regardless of length) so the page also works
as a teaching artifact, not just a tool.

---

## Design notes

The visual language is a deliberate departure from a typical dark
neon security-dashboard look: it's a light "engineering blueprint"
theme — graph-paper backdrop, ink-navy line work, crop marks, and a
JetBrains Mono display face — pulled directly from the training deck's
own blueprint diagrams ("The Logic Skeleton", "Defining the Policy") so
the tool visually matches the brief it was built from, rather than
mimicking any existing reference UI.

---

## Requirements coverage (Project 1 brief)

| Requirement                                   | Where it's handled                     |
|------------------------------------------------|-----------------------------------------|
| Check password length                          | `analyze()` in `script.js`, `checks.length` |
| Check numbers, symbols, uppercase letters       | `checks.number`, `checks.symbol`, `checks.upper`, `checks.lower` |
| Display weak / medium / strong result           | `verdictText`, `.status-strip`, lock schematic |
| String handling / condition checks              | Regex-based checks, no external libraries |
| Extension: leaked-password check                | `js/wordlist.js` + `isLeaked()` |
| Extension: character-variety / pattern checks    | `hasSequential()`, `hasRepeatedRun()`, `hasKeyboardRun()` |

---

## Known limitations

- The leaked-password list is a small, illustrative sample (~50 entries),
  not a production breach corpus — swapping in a larger list (or an API
  lookup such as Have I Been Pwned's k-anonymity endpoint) would be the
  natural next step for a Project 2-style hardening pass.
- Entropy is a standard character-pool estimate; it doesn't model
  dictionary-aware crackers, which will do better than brute force on
  human-chosen passwords even when this checker reports "strong."
