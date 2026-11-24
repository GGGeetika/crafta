# Crafta — The Story Studio (V2)

**A classic children’s book that you make together.** Little books. Big memories.

A child and a grown-up sit side by side with one device and make a six-page picture book about Maya and her neighborhood, taking turns. The illustrated world is the interface: you tap the bakery and Maya walks there; pick “a big gust of wind” and the trees bend and the kite flies off. After every round a new page drops into the growing book. At the end the cover is revealed, then the app gets out of the way so you can read your book together.

No accounts, no server-side storage, no AI image generation. Works offline once loaded.

## Run it

Node 22.6+ (or 24) and npm.

```sh
npm install
npm run dev          # http://localhost:3000
npm test             # story engine: all 19,683 paths + branching, custom text, restore, sharing
npm run typecheck
npm run build && npm start
```

`/model-sheet` is an internal studio page: Maya’s poses and expressions, the cast, objects and the four backdrops on one sheet. Use it to review the art or brief an illustrator.

## The experience

| | |
|---|---|
| **Home / bookshelf** | Maple Street, the tagline, *Make a book together* (or *Continue our book*), and finished books shown as covers on a shelf. |
| **Authors** | A title page: “written by ___ and ___”. First names or nicknames only. |
| **Six rounds** | Each round is a turn for the little author (crayon), the grown-up (pen), or both together, shown with an icon, a coloured band and the author’s name, so colour is never the only cue. |
| **Growing book** | After each round the new page flies into the “Our book” strip, and the page text appears in book type for the grown-up to read aloud. Tap any finished page to revisit it. |
| **Cover reveal** | A cloth-bound cover with the title, both names, and an illustration built from the story’s own characters and object. Primary action: *Let’s read together.* |
| **Reader** | Full screen, no app chrome. Spreads in landscape, single pages in portrait. Swipe, tap or use the arrow keys. Three text sizes. Ends with *The End*, an authorship page, and *Make another adventure*. |
| **Save & share** | Behind a press-and-hold grown-up gate: a private reading link, the whole book as one self-contained HTML file, and the cover as a PNG. Uses the native share sheet where the device supports it. |

### The six rounds

1. **Where shall we go?** Child taps Little Crumb, the park or the station in the picture.
2. **A little discovery.** Child taps one of three objects at that place. Grown-up decides what makes it special: a note / very old / does something surprising / *write your own*.
3. **Something unexpected.** Grown-up picks the twist: wind / a cheeky animal / rain. Child picks Maya’s reaction, which sets her trait (quick / cheerful / clever). The last page comes back to that trait.
4. **A new friend.** Child taps Grandpa Otis, Juniper or Biscuit the dog. Grown-up says what they need: lost / lonely / *the object is theirs* / *write your own*.
5. **What shall we do?** Together. There are three solutions for each need, and they depend on the object and the place.
6. **Until next time.** Together. Pick an ending and a title (three suggestions built from the story, or your own).

Every choice changes the text and the picture. The test suite checks that no two options at any step lead to the same book.

## Architecture

```
lib/story/content.ts   Story bible: places, objects, twists, cast, needs, plans, endings, all prose fragments
lib/story/engine.ts    Story state, step order + whose turn, options, validation, prose assembly, titles,
                       restore() (replays saved choices through the rules), share-link encode/decode
lib/story/compose.ts   Pure scene composition: story state → positioned, layered actors on a 1000×700 stage.
                       Feeds the live canvas, every book page and the cover, so they always match.
lib/persist.ts         localStorage: autosaved draft + bookshelf (always validated through restore())
lib/analytics.ts       Anonymous event names only → /api/events (server log). No names, choices or text.

components/art/        The illustration system (hand-authored SVG)
  defs.tsx               shared pen-wobble + paper-tooth filters; Shape/Limb/Ink primitives
  palette.ts             the one limited palette
  Maya.tsx               Maya’s model sheet in code: 14 poses × 8 expressions
  cast.tsx               Otis, Juniper, Biscuit, Mrs. Penny, cat, squirrel, pigeon
  objects.tsx            9 discovery objects (+ note/old/curious looks), thought bubbles, rain, wind, props
  scenery.tsx            trees, lamp, bench, houses, Little Crumb, train, pond…
  backdrops.tsx          Maple Street, bakery, park, station (day/dusk, clear/wind/rain)
  Stage.tsx              layered renderer: static backdrop + one SVG layer per actor + forgiving hit areas
components/studio/     Home, Authors, Make (canvas + turn panel + book strip), Cover, Reader, ShareSheet, exporter
```

**Art approach.** Every asset is hand-authored SVG in the same world units. One shared filter turns the geometry into a steady pen line with a little paper tooth. Washes sit slightly off-register, the way they do in printed books. A larger, looser filter blooms the edges of skies and hills. Characters are reusable components with poses and expressions, so Maya looks the same on every page. Scenes are layered (backdrop → actors → weather), and actors move by animating their layer, so the heavy backdrop never repaints.

**Reliability.** Stories are deterministic templates filled with the authors’ choices, so there is no network dependency and no waiting. A typed custom answer is cleaned (markup stripped, length capped) and woven into sentence frames that work with any wording. Progress autosaves after every choice. Reload and you’ll see *Continue our book*.

**Privacy.** Everything stays in this browser’s local storage. A private link carries the whole book inside the URL *fragment* (`#book=…`), which browsers never send to a server, so there is nothing stored on our side. Analytics record event names with a random anonymous device id. No children’s names, story content, photos or birthdates are ever collected.

## Deploy

Same as V1: any Node host that runs Next.js (for example Vercel), build with `npm run build`, serve with `npm start`. No environment variables. The build uses `next build --webpack` because this cloud sandbox restricts Turbopack worker ports. Deploy this branch as a preview so the live V1 on `main` is untouched.

## Known limitations

- The art is hand-coded vector illustration in a classic picture-book idiom. It is consistent and original, but it is not a professional illustrator’s brushwork. The component boundaries (characters, poses, objects, backdrops) are designed so an illustrator’s artwork can replace them one piece at a time.
- One world (Maple Street), one protagonist and three friends. Seated poses exist for Maya only.
- Custom answers change the text but not the pictures; the picture falls back to the closest built-in choice.
- No voice input. Typed custom answers only.
- The shared link holds the whole book (around 300–400 characters), so it is long but works without a server.
