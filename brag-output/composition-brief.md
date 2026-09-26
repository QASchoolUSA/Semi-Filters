# Hyperframes Composition Brief: Semi Filters

## Objective
Create a short launch-style brag video for Semi Filters.

## Output
- Composition directory: `brag-output/composition/`
- Rendered video: `brag-output/brag.mp4`
- Format: landscape — 1920x1080
- Duration: 20 seconds

## Source Material
- Project root: `/workspace`
- Primary files read: `README.md`, `src/app/globals.css`, `src/components/HeroBanner.tsx`, `src/components/HomeClient.tsx`, `src/components/TruckMakerFilters.tsx`, `public/favicon.svg`
- Product name: Semi Filters
- Tagline / strongest claim: Premium Filters for Semi Trucks
- Key UI or visual moment to recreate: Shop by Truck cards + Add to Cart + Order Confirmed
- Copy that must appear verbatim:
  - Premium Filters for Semi Trucks
  - Find Filters For Your Rig
  - Add to Cart
  - Order Confirmed!
  - FIRST15
  - SEMI FILTERS

## Creative Direction
- Tone preset: polished
- Creative direction: quiet premium fleet-parts product film
- Interpretation: Fewer scenes, longer holds, soft materials, restrained SFX; confidence through restraint
- Angle: Treat filtration as a premium product film — dark Apple-like materials, brand orange, real path truck → fitment → cart
- Hook: Logo + "Premium Filters for Semi Trucks"
- Outro / punchline: SEMI FILTERS · Keep your fleet running · semifilters.com
- Avoid:
  - Generic SaaS language
  - Abstract filler visuals
  - Unrelated visual redesign
  - Neon purple glow aesthetics

## Visual Identity
- Background: `#000000`
- Text: `#f5f5f7`
- Accent: `#FF6B00`
- Card: `#1c1c1e`
- Success: `#30d158`
- Display font: -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, Arial, sans-serif
- Body font: same
- Visual references from the project: concentric orange filter mark; truck maker cards; FIRST15 chip; dark materials with soft radius

## Storyboard
Use the storyboard in `brag-output/brag-plan.md` as the creative contract.

Scene summary:
1. Brand hook — 3.5s — logo + Premium Filters for Semi Trucks
2. Shop by truck — 5s — Find Filters For Your Rig + Volvo/Kenworth/Freightliner sequential cards
3. Fitment → cart — 5.5s — product card + Add to Cart + FIRST15
4. Confirmed + outro — 6s — Order Confirmed! → SEMI FILTERS wordmark

## Audio
- Audio role: warm corporate bed with sparse professional accents
- Audio arc: establish bed → light card ticks → click confirm → soft stamp → music fade under logo
- Music: happy-beats-business-moves-vol-10-by-ende-dot-app.mp3
- Music treatment: volume ~0.30, soft 1.5s fade under final logo
- Music cue guidance: bundled preset `.agents/skills/brag/assets/music/cues/happy-beats-business-moves-vol-10-by-ende-dot-app.music-cues.json`; strong cues ~15.82 / 18.01 / 18.55 for confirmed/outro; beat grid ~0.55s for truck cards (every other beat for text)
- Audio-reactive treatment: subtle; orange logo glow / accent bar presence with RMS — no waveform visuals
- Audio-coupled moments:
  - Scene 2 — card sequence
  - Scene 3 — simulated Add to Cart click
  - Scene 4 — Order Confirmed stamp / final logo
- SFX selection guidance: sparse UI clicks/switches; prefer low HF-risk sounds for polished tone
- SFX analysis guidance: `.agents/skills/brag/assets/sfx/sfx-analysis.json`
- Exact SFX choice: Hyperframes should choose filenames, timestamps, density, and volume based on the implemented animation.
- Audio files: copy the chosen music and any Hyperframes-selected SFX into `brag-output/composition/assets/`

## Hyperframes Instructions
Load Hyperframes domain skills (`hyperframes-core`, `hyperframes-animation`, `hyperframes-creative`, `hyperframes-keyframes`, `hyperframes-cli`). /brag owns this workflow — skip the hyperframes intent interview and product-launch-video interview.

Requirements:
- Show at least one real UI, copy, or visual element from the source project.
- Keep all text readable in the final render.
- Keep the video within 15-25 seconds.
- Include the planned music/SFX layer.
- Treat music cue metadata as optional timing hints.
- Major reveals may lock to strong cues within ±0.15s; mark `// beat-locked`.
- Sequential truck cards snap to beat grid (±0.10s); mark `// beat-grid`.
- Use local assets for audio.
- Run `npx hyperframes check` before render.
