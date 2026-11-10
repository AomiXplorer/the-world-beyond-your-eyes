# The World Beyond Your Eyes

Anime visual novel, 8 chapters, 4 endings. Indonesian dialogue.

**Play:** https://aomixplorer.github.io/the-world-beyond-your-eyes/

## What's inside
- `index.html` + `css/` + `js/` - engine (dialogue, choices, auto/skip, log, save slots, gallery, chapter select)
- `js/story/ch01-ch08.js`, `js/story/endings.js` - the whole script
- `assets/bg` - 16 AI-generated 16:9 backgrounds
- `assets/char` - 15 character expression sprites (Shiori 9, Mio 6)
- `assets/audio` - 9 BGM tracks + 16 SFX, generated from scratch

Rain ambience is audio only indoors; the falling-rain overlay is painted only over
open-air backgrounds (`VN.RAIN_BG` in `js/config.js`).

Static site, no build step. Serve the folder with any static server.
