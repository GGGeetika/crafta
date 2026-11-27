# Crafta V2 — The Story Studio

Replaces V1’s scrolling questionnaire with an illustrated story canvas that a child and a grown-up share. Over six rounds of turns they make a six-page picture book about Maya, watch it grow page by page, reveal a personalized cover, and read it in a distraction-free reader. Finished books sit on a local bookshelf and can be shared privately: as a link, a self-contained HTML book, or a cover image.

- New original illustration system: hand-authored SVG with a shared pen-and-wash filter; Maya’s model sheet in code (14 poses × 8 expressions); a cast of 7; 9 objects; 4 backdrops with weather and time of day. The art can be reviewed at `/model-sheet`.
- Story engine with structured state and real branching: 19,683 built-in paths plus custom answers. Tests verify every path and check that no option repeats another.
- Turn-taking between little author, grown-up and together, shown with icon, colour and name. Taps go directly on the illustrated world, with large forgiving hit areas.
- Local autosave and resume, a bookshelf, a grown-up gate before sharing, and anonymous analytics.
- Responsive for iPhone and iPad (landscape and portrait) and desktop; supports reduced motion.

Validation: `npm test` (7 tests, every path), `npm run typecheck`, `npm run build`, and scripted Playwright playthroughs on desktop, iPhone 13 (landscape), iPhone SE (portrait) and iPad (landscape), including resume, custom answers, export and opening a shared link.
