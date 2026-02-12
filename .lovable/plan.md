# 💝 The Dhanashri Project — Valentine's Day Experience

A single-page, scroll-driven romantic experience with interactive mini-games, cinematic visuals, and playful surprises.

---

## Section 1: Custom Cursor & Background

- Light pastel pink heart SVG cursor that follows the mouse with a springy, playful animation
- Full-page red textured background setting the mood

## Section 2: The reCAPTCHA Gate (Entry Point)

- Pixel-perfect replica of Google's "I'm not a robot" v2 CAPTCHA
- Blue header reading **"Select all images of your BF"**
- 3×3 image grid with selectable tiles (placeholder images)
- "Verify" button activates after selecting 3 tiles
- On verify: **confetti burst** + "Verification Successful" modal
- Page scroll is locked until verification is complete

## Section 3: The Cinematic Film Reel

- Massive **"HAPPY VALENTINES DAY"** heading in decorative Emilys Candy font
- Horizontal film strip (~1/3 screen height) styled like classic film tape
  - Black strip with transperent sprocket holes (through which the background png is visible) along top and bottom edges
  - 12 placeholder images placed side-by-side inside which will flip when clicked on to show text on what happened on that day (for now add placeholders in Life savers font)
- **Parallax scroll effect**: as user scrolls down, the reel slides horizontally right-to-left

## Section 4: The NYT-Style Wordle Game

- Faithful recreation of the New York Times Wordle interface
- **Level 1**: 4-letter word "CALI" — with 3 sequential hints
- **Level 2**: 4-letter word "BDSM" — with 3 sequential hints
- On-screen QWERTY keyboard with color-coded feedback (green/yellow/gray)
- "Hint?" button reveals clues one at a time in a glassmorphism card
- **Victory celebration**: A imessage sticker type GIF that i will upload which will be me doing a dance or something for now just add like a dancing GIF

## Section 5: Footer Status Bar

- Fixed bottom bar with monospace-style engineering readout:
  - `SYSTEM_STATUS: [IN LOVE] | HEART_RATE: [110BPM] | TARGET: [DHANASHRI_P] | MODE: [VALENTINE_2026]`

## Typography

- **Emilys Candy** — Main title only
- **Life Savers** — Section headings
- **Outfit** — All UI/body text, Wordle letters, hints, footer

## Technical Notes

- Framer Motion for cursor, scroll-based parallax, and animations
- Canvas-confetti or similar for the confetti burst
- All data driven by a single `VALENTINE_DATA` config object
- No backend needed — fully client-side experience