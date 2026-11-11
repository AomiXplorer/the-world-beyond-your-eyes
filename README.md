# The World Beyond Your Eyes

Anime visual novel, 8 chapters, 4 endings. Indonesian dialogue.

**Play:** https://aomixplorer.github.io/the-world-beyond-your-eyes/

## What's inside

- `index.html` + `css/` + `js/` - engine (dialogue, choices, auto/skip, log, save
  slots, gallery, chapter select, PWA shell, fullscreen + orientation lock)
- `js/story/ch01-ch08.js`, `js/story/endings.js` - the whole script
- `assets/bg` - 14 backgrounds, 1920x1080 anime cel-shaded plates (11 locations,
  3 event CGs)
- `assets/characters` - half-body character sprites, waist-up composition,
  1200x1500 transparent WebP, bottom anchored:
  - Shiori Amane: 10 expressions
  - Mio Kanzaki: 11 expressions
  - Ren Takahashi: 1 expression (narrator, never stands on stage)
- `assets/audio` - 9 BGM tracks + 17 SFX, synthesised from scratch, royalty free

## Character sprites

Every sprite is generated as a waist-up illustration: the head sits on the top
edge of the canvas and the cut lands at the waist, so the face is the largest
thing on stage and the crop is part of the art, not a CSS trim of a full-body
render. All faces of a character share one canvas, one head size and one bottom
anchor, which is why swapping an expression never moves or resizes the sprite.

The stage sizes them from `--sprite-h` in `css/style.css` (82% of stage height on
wide screens, 92% on short landscape phones, 70% when two characters share the
stage). The waist line sits just behind the dialogue box.

## Expression cue

A face swap is a 200ms cross-fade, so it gets a 0.3s cloth rustle rather than a
click: band-passed noise with a fast attack, detuned a few percent on every play
and muted for 140ms after each one, so a burst of expression beats cannot turn it
into a machine gun. It plays only when the face really changes, never when the
character walks in and never while a save is being restored. Register or retune it
in `VN.SFX` (`expr_shift`) and drop the level in `js/scene.js` (`exprCue`).

## Editing the script

```js
VN.chapters.push({
  id: 'ch01', no: 1, kind: 'chapter',
  en: 'A Girl Who Listens to the Rain',
  id_title: 'Gadis yang Mendengarkan Hujan',
  bgm: 'rain', amb: 'rain_window', rain: true,
  beats: [
    { card: { no: 'Bab 01', en: '...', id: '...' } },
    { bg: 'cafe_rain', veil: true, rain: true },
    { t: 'First-person narration.' },
    { show: 'shiori', pos: 'center', e: 'smile' },
    { w: 'Shiori', t: 'Dialogue.' }
  ]
});
```

Expression words the script can use: `neutral`, `smile`, `tender`, `laugh`,
`shy`, `blush`, `sad`, `cry`, `surprised`, `angry`, plus `smirk` for Mio.
Anything else falls through `VN.EXPR_ALIAS` in `js/config.js` to the nearest
shipped face, so a script never breaks for a missing expression.

Rain ambience is audio only indoors; the falling-rain overlay is painted only over
open-air backgrounds (`VN.RAIN_BG` in `js/config.js`).

## Publishing

Static site, no build step. Serve the folder with any static server, or push to
`main`: GitHub Pages serves the repository root and `.nojekyll` keeps the paths
as they are. Bump `VN.VERSION` in `js/config.js` and `VERSION` in `sw.js` together
whenever art or code changes, or returning players keep the old cached build.
