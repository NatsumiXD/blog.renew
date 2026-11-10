# RhineLabUI opening integration

Adapted from [LBEILC/RhineLabUI](https://github.com/LBEILC/RhineLabUI), copyright 2026 LBEILC, MIT. See `LICENSE` and the distributed `public/licenses/RhineLabUI-LICENSE.txt`. The original checkout is not required or included; the opening is self-contained.

The original DOM/SVG renderer, frame tracks, shared mark and fixed phrase artwork are retained. The blog plays from app time 1.76 (source video 6.76 seconds) to app time 21.92 (source video 26.92 seconds), then reveals its homepage. No archive scene, Three.js, audio, PWA or hosting logic is imported.

The renderer uses the original light palette and authored phrase graphics; the original optional, separately licensed Novecento webfont loader is omitted. Original timing and geometry are preserved. All extracted CSS is scoped to `rhine-welcome` so the blog keeps its styles.

The identity is personalized to `RAKURIN NATSUMI` and the brand to `BAKA BLOG` in `config.ts`. These phrases use MiSans character cells instead of the original fixed identity/company artwork, retaining the original reveal frames and allowing the new wording to render. The remaining authored phrases retain the source drawings.

Only unchanged Latin shard `0.woff2` from MiSans `misans-webfont@4.3.1` regular, demibold and bold is bundled in `src/assets/rhine-lab/`. That directory includes the original copyright notice, upstream README, package provenance and SHA-256 hashes in `source.json`. The font license is distributed at `public/licenses/MiSans-license.pdf`.

The integration shell is `../WelcomeScreen.astro`, its lifecycle is `./welcome.ts`, and its styles are `../../styles/rhine-welcome.css`. Session completion uses the new key `rhine-welcome-entered`, so visitors who saw the previous opening can see this one once. Reduced motion shows the final welcome briefly without the flashing/scanning sequence. Escape and the visible skip link always enter the homepage.
