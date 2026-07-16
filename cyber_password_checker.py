"""
==================================================================
   CYBER GUARD :: Password Strength Analyzer
   DecodeLabs Cyber Security Internship - Project 1 (Enhanced)
==================================================================
   A stylish, hacker-themed DESKTOP APP (not a website) built with
   Python + CustomTkinter.

   Run with:  python cyber_password_checker.py

   Requires:  pip install customtkinter
==================================================================
"""

import string
import math
import random
import secrets
import customtkinter as ctk

# ------------------------------------------------------------------
# THEME / COLOR PALETTE  -  "Hacker Terminal" aesthetic
# ------------------------------------------------------------------
BG_MAIN      = "#0a0e0f"
BG_PANEL     = "#0f1720"
BG_CARD      = "#111c1f"
NEON_GREEN   = "#39ff14"
NEON_CYAN    = "#00e5ff"
NEON_RED     = "#ff2b4e"
NEON_AMBER   = "#ffb800"
TEXT_MUTED   = "#5f7a75"
TEXT_MAIN    = "#d8fff0"
FONT_MONO    = "Consolas"

ctk.set_appearance_mode("dark")
ctk.set_default_color_theme("green")

COMMON_PASSWORDS = {
    "password", "123456", "123456789", "qwerty", "admin", "letmein",
    "password123", "abc123", "welcome", "iloveyou", "monkey", "111111",
    "dragon", "master", "sunshine", "princess", "football", "shadow"
}

LEET_MAP = {"a": "@", "e": "3", "i": "1", "o": "0", "s": "$", "t": "7"}


# ------------------------------------------------------------------
# CORE ANALYSIS LOGIC
# ------------------------------------------------------------------
def analyze_password(pwd: str):
    result = {
        "score": 0,
        "max_score": 60,
        "checks": [],
        "verdict": "N/A",
        "verdict_color": TEXT_MUTED,
        "entropy": 0.0,
        "crack_time": "instantly",
        "leaked_warning": False,
    }

    if not pwd:
        return result

    if pwd.lower() in COMMON_PASSWORDS:
        result["leaked_warning"] = True
        result["score"] = 0
        result["checks"] = [("Commonly leaked password database", False, "CRITICAL")]
        result["verdict"] = "COMPROMISED"
        result["verdict_color"] = NEON_RED
        result["crack_time"] = "under 1 second"
        return result

    checks_def = [
        ("Length >= 8 characters",  len(pwd) >= 8, 10),
        ("Length >= 12 characters", len(pwd) >= 12, 10),
        ("Contains digit [0-9]",    any(c.isdigit() for c in pwd), 10),
        ("Contains uppercase [A-Z]", any(c.isupper() for c in pwd), 10),
        ("Contains lowercase [a-z]", any(c.islower() for c in pwd), 10),
        ("Contains special char",   any(c in string.punctuation for c in pwd), 10),
    ]

    score = 0
    for label, passed, points in checks_def:
        if passed:
            score += points
        result["checks"].append((label, passed, ""))

    # bonus for unicode
    unicode_bonus = 0
    if any(ord(c) > 127 for c in pwd):
        unicode_bonus = 5

    result["score"] = min(score, 60)

    # entropy estimate: pool size based on char classes used
    pool = 0
    if any(c.islower() for c in pwd):
        pool += 26
    if any(c.isupper() for c in pwd):
        pool += 26
    if any(c.isdigit() for c in pwd):
        pool += 10
    if any(c in string.punctuation for c in pwd):
        pool += len(string.punctuation)
    if any(ord(c) > 127 for c in pwd):
        pool += 256
    pool = max(pool, 1)

    entropy = len(pwd) * math.log2(pool)
    result["entropy"] = round(entropy, 1)

    # crack time estimate assuming 10 billion guesses/sec (offline GPU attack)
    guesses_per_sec = 1e10
    seconds = (2 ** entropy) / guesses_per_sec
    result["crack_time"] = human_time(seconds)

    total = result["score"] + unicode_bonus
    if result["leaked_warning"]:
        pass
    elif total >= 55:
        result["verdict"], result["verdict_color"] = "FORTRESS", NEON_GREEN
    elif total >= 40:
        result["verdict"], result["verdict_color"] = "STRONG", NEON_GREEN
    elif total >= 25:
        result["verdict"], result["verdict_color"] = "MODERATE", NEON_AMBER
    else:
        result["verdict"], result["verdict_color"] = "WEAK", NEON_RED

    result["score"] = total
    result["max_score"] = 65
    return result


def human_time(seconds: float) -> str:
    if seconds < 1:
        return "instantly"
    units = [
        ("centuries", 60 * 60 * 24 * 365 * 100),
        ("years", 60 * 60 * 24 * 365),
        ("days", 60 * 60 * 24),
        ("hours", 60 * 60),
        ("minutes", 60),
        ("seconds", 1),
    ]
    for name, size in units:
        if seconds >= size:
            value = seconds / size
            if value > 1e6:
                return f"{value:.2e} {name}"
            return f"{value:.1f} {name}"
    return "instantly"


def generate_strong_password(length: int = 16) -> str:
    alphabet = string.ascii_letters + string.digits + string.punctuation
    while True:
        pwd = "".join(secrets.choice(alphabet) for _ in range(length))
        if (any(c.isdigit() for c in pwd) and any(c.isupper() for c in pwd)
                and any(c.islower() for c in pwd)
                and any(c in string.punctuation for c in pwd)):
            return pwd


# ------------------------------------------------------------------
# GUI APPLICATION
# ------------------------------------------------------------------
class CyberGuardApp(ctk.CTk):
    def __init__(self):
        super().__init__()

        self.title("CYBER GUARD // Password Strength Analyzer")
        self.geometry("620x720")
        self.minsize(560, 680)
        self.configure(fg_color=BG_MAIN)

        self.show_password = False
        self._matrix_chars = "01"
        self._build_ui()
        self._animate_scanline()

    # ---------------------------------------------------------
    def _build_ui(self):
        # Header
        header = ctk.CTkFrame(self, fg_color=BG_PANEL, corner_radius=0, height=90)
        header.pack(fill="x", side="top")
        header.pack_propagate(False)

        title_lbl = ctk.CTkLabel(
            header, text="🛡  CYBER GUARD",
            font=(FONT_MONO, 26, "bold"), text_color=NEON_GREEN
        )
        title_lbl.pack(pady=(14, 0))

        subtitle_lbl = ctk.CTkLabel(
            header, text="[ PASSWORD STRENGTH ANALYSIS ENGINE ]",
            font=(FONT_MONO, 11), text_color=NEON_CYAN
        )
        subtitle_lbl.pack()

        self.scanline = ctk.CTkFrame(header, fg_color=NEON_GREEN, width=90, height=2)
        self.scanline.place(x=0, y=88)

        # Body scroll container
        body = ctk.CTkScrollableFrame(self, fg_color=BG_MAIN, scrollbar_button_color=BG_PANEL)
        body.pack(fill="both", expand=True, padx=18, pady=16)

        # Input card
        input_card = ctk.CTkFrame(body, fg_color=BG_CARD, corner_radius=12,
                                   border_width=1, border_color="#1c2b2b")
        input_card.pack(fill="x", pady=(0, 16))

        ctk.CTkLabel(input_card, text="> ENTER TARGET PASSWORD:",
                     font=(FONT_MONO, 13, "bold"), text_color=TEXT_MAIN
                     ).pack(anchor="w", padx=16, pady=(14, 6))

        entry_row = ctk.CTkFrame(input_card, fg_color="transparent")
        entry_row.pack(fill="x", padx=16, pady=(0, 14))

        self.pwd_var = ctk.StringVar()
        self.entry = ctk.CTkEntry(
            entry_row, textvariable=self.pwd_var, show="•",
            font=(FONT_MONO, 16), height=42, corner_radius=8,
            fg_color="#0b1313", border_color=NEON_GREEN, border_width=1,
            text_color=NEON_GREEN, placeholder_text="type here..."
        )
        self.entry.pack(side="left", fill="x", expand=True)
        self.pwd_var.trace_add("write", lambda *a: self._on_type())

        self.toggle_btn = ctk.CTkButton(
            entry_row, text="👁", width=42, height=42, corner_radius=8,
            fg_color="#132323", hover_color="#1b3232", text_color=NEON_CYAN,
            command=self._toggle_visibility
        )
        self.toggle_btn.pack(side="left", padx=(8, 0))

        gen_btn = ctk.CTkButton(
            input_card, text="⚡ GENERATE SECURE PASSWORD", height=36,
            corner_radius=8, fg_color="#132323", hover_color=NEON_GREEN,
            text_color=NEON_GREEN, font=(FONT_MONO, 12, "bold"),
            border_width=1, border_color=NEON_GREEN,
            command=self._on_generate
        )
        gen_btn.pack(padx=16, pady=(0, 16), fill="x")

        # Verdict card
        verdict_card = ctk.CTkFrame(body, fg_color=BG_CARD, corner_radius=12,
                                     border_width=1, border_color="#1c2b2b")
        verdict_card.pack(fill="x", pady=(0, 16))

        self.verdict_lbl = ctk.CTkLabel(
            verdict_card, text="AWAITING INPUT...", font=(FONT_MONO, 22, "bold"),
            text_color=TEXT_MUTED
        )
        self.verdict_lbl.pack(pady=(16, 4))

        self.score_bar = ctk.CTkProgressBar(
            verdict_card, height=14, corner_radius=7,
            progress_color=NEON_GREEN, fg_color="#0b1313"
        )
        self.score_bar.set(0)
        self.score_bar.pack(fill="x", padx=20, pady=(4, 8))

        self.score_lbl = ctk.CTkLabel(
            verdict_card, text="Score: 0 / 65", font=(FONT_MONO, 12), text_color=TEXT_MUTED
        )
        self.score_lbl.pack(pady=(0, 16))

        stats_row = ctk.CTkFrame(verdict_card, fg_color="transparent")
        stats_row.pack(fill="x", padx=16, pady=(0, 16))
        stats_row.columnconfigure((0, 1), weight=1)

        self.entropy_lbl = self._stat_box(stats_row, "ENTROPY", "0 bits", 0)
        self.crack_lbl = self._stat_box(stats_row, "CRACK TIME (est.)", "instantly", 1)

        # Checklist card
        self.checklist_card = ctk.CTkFrame(body, fg_color=BG_CARD, corner_radius=12,
                                            border_width=1, border_color="#1c2b2b")
        self.checklist_card.pack(fill="x", pady=(0, 16))

        ctk.CTkLabel(self.checklist_card, text="> SECURITY REQUIREMENT SCAN",
                     font=(FONT_MONO, 13, "bold"), text_color=TEXT_MAIN
                     ).pack(anchor="w", padx=16, pady=(14, 8))

        self.check_rows_frame = ctk.CTkFrame(self.checklist_card, fg_color="transparent")
        self.check_rows_frame.pack(fill="x", padx=16, pady=(0, 16))
        self.check_row_widgets = []

        # Footer
        footer = ctk.CTkLabel(
            body, text="DecodeLabs Cyber Security Internship — Project 1 (Enhanced Edition)",
            font=(FONT_MONO, 10), text_color=TEXT_MUTED
        )
        footer.pack(pady=(4, 10))

        self._render_checklist([])

    def _stat_box(self, parent, label, value, col):
        box = ctk.CTkFrame(parent, fg_color="#0b1313", corner_radius=10)
        box.grid(row=0, column=col, sticky="nsew", padx=6)
        ctk.CTkLabel(box, text=label, font=(FONT_MONO, 10), text_color=TEXT_MUTED).pack(pady=(10, 2))
        val_lbl = ctk.CTkLabel(box, text=value, font=(FONT_MONO, 15, "bold"), text_color=NEON_CYAN)
        val_lbl.pack(pady=(0, 10))
        return val_lbl

    # ---------------------------------------------------------
    def _toggle_visibility(self):
        self.show_password = not self.show_password
        self.entry.configure(show="" if self.show_password else "•")
        self.toggle_btn.configure(text="🙈" if self.show_password else "👁")

    def _on_generate(self):
        pwd = generate_strong_password()
        self.pwd_var.set(pwd)
        self.show_password = True
        self.entry.configure(show="")
        self.toggle_btn.configure(text="🙈")

    def _render_checklist(self, checks):
        for w in self.check_row_widgets:
            w.destroy()
        self.check_row_widgets = []

        if not checks:
            placeholder = ctk.CTkLabel(
                self.check_rows_frame, text="Awaiting password input...",
                font=(FONT_MONO, 12), text_color=TEXT_MUTED
            )
            placeholder.pack(anchor="w", pady=2)
            self.check_row_widgets.append(placeholder)
            return

        for label, passed, tag in checks:
            row = ctk.CTkFrame(self.check_rows_frame, fg_color="transparent")
            row.pack(fill="x", pady=3)
            icon = "✔" if passed else "✘"
            color = NEON_GREEN if passed else NEON_RED
            ctk.CTkLabel(row, text=icon, font=(FONT_MONO, 13, "bold"),
                         text_color=color, width=20).pack(side="left")
            ctk.CTkLabel(row, text=label, font=(FONT_MONO, 12),
                         text_color=TEXT_MAIN if passed else TEXT_MUTED).pack(side="left", padx=(6, 0))
            self.check_row_widgets.append(row)

    # ---------------------------------------------------------
    def _on_type(self):
        pwd = self.pwd_var.get()
        result = analyze_password(pwd)

        if not pwd:
            self.verdict_lbl.configure(text="AWAITING INPUT...", text_color=TEXT_MUTED)
            self.score_bar.set(0)
            self.score_lbl.configure(text="Score: 0 / 65")
            self.entropy_lbl.configure(text="0 bits")
            self.crack_lbl.configure(text="instantly")
            self._render_checklist([])
            return

        self.verdict_lbl.configure(text=result["verdict"], text_color=result["verdict_color"])
        self.score_bar.configure(progress_color=result["verdict_color"])
        self.score_bar.set(min(result["score"] / result["max_score"], 1.0))
        self.score_lbl.configure(text=f"Score: {result['score']} / {result['max_score']}")
        self.entropy_lbl.configure(text=f"{result['entropy']} bits")
        self.crack_lbl.configure(text=result["crack_time"])
        self._render_checklist(result["checks"])

    # ---------------------------------------------------------
    def _animate_scanline(self):
        # subtle moving neon scanline under the header for a "cyber" feel
        try:
            x = self.scanline.winfo_x()
            new_x = (x + 6) % max(self.winfo_width(), 100)
            self.scanline.place(x=new_x, y=88)
        except Exception:
            pass
        self.after(60, self._animate_scanline)


if __name__ == "__main__":
    app = CyberGuardApp()
    app.mainloop()
