export const VALENTINE_DATA = {
  captchaTiles: Array.from({ length: 9 }, (_, i) => `https://picsum.photos/seed/bf${i + 1}/200/200`),
  filmStripImages: Array.from({ length: 12 }, (_, i) => ({
    image: `https://picsum.photos/seed/memory${i + 1}/400/300`,
    caption: `Memory #${i + 1} — A beautiful moment we shared together 💕`,
  })),
  wordleLevels: [
    {
      word: "CALI",
      hints: [
        "Think of the most memorable thing I said to you.",
        "First word in that phrase.",
        "... place to be.",
      ],
    },
    {
      word: "BDSM",
      hints: [
        "The activity we did late at night where we bonded.",
        "The first thing that made us realize our freakiness.",
        "The test we took together.",
      ],
    },
  ],
  footer: {
    status: "IN LOVE",
    heartRate: "110BPM",
    target: "DHANASHRI_P",
    mode: "VALENTINE_2026",
  },
};
