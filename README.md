# Crafta — Story Studio

Make stories starring you. Your people. Your places. Your imagination.

A mobile-first, single-device storytelling prototype for families: **An Adventure in My Neighborhood**. Meet Maya, choose the bakery, park, or train station, make four consequential decisions, then turn through an eight-page storybook. Original layered SVG scenes respond to the adventure. No accounts, database, remote AI, or paid services.

## Develop

Use Node.js 24 and npm. The tests use Node’s built-in TypeScript stripping.

```sh
npm install
npm run dev
```

Open the development server on port 3000. The layout is designed for 375px phones and expands to a split scene and interaction view on desktop.

```sh
npm test
npm run typecheck
npm run build
npm start
```

`npm start` serves the production build. Build before typechecking a fresh checkout to include generated route types, if desired.

## Implementation

- Next.js App Router, React, strict TypeScript, Tailwind CSS 4, and Lucide icons.
- `lib/stories.ts`: structured character/location/event/decision/outcome state, branching options, deterministic eight-page story generation, and validated local restoration.
- `components/Scene.tsx`: original SVG neighborhood, Maya, location and event layers, helper, clues, resolution, and celebration details.
- `app/page.tsx`: welcome, character introduction, immediate scene selection, four decisions, custom ideas, and page reader.
- Progress is stored only in this browser’s local storage. Continue from the welcome screen after reloading. Starting another story clears the previous adventure. Storage failures are reported without blocking play.
- Custom ideas are included as plain text in the story. They do not generate custom illustrations; the scene still advances through the current chapter.
- Motion honors reduced-motion preferences. Choices are keyboard accessible with visible focus; changed headings receive focus and scene descriptions are available as text.

## Validation

The automated tests traverse every built-in branch in each location, verify coherent complete story generation, custom ideas, invalid saves, progress restoration, and branch-dependent options. Manually verify at 375px: welcome → Maya → each location → four choices (including a custom idea) → all eight pages → another story. Reload midway to check resuming. Check keyboard navigation and reduced-motion settings.

## Deploy

Deploy to any Node-compatible Next.js host (for example Vercel): install with `npm install`, build with `npm run build`, and serve with `npm start`. No environment variables are required. For a container or Node host, expose port 3000 and set `PORT` as needed. Keep HTTPS enabled in production. No progress is sent to the server.

## Scope

V0 implements one reusable neighborhood adventure. Photo upload, AI character generation, printing, accounts, social sharing, voice, complex editing, and a saved-story library are intentionally outside this prototype.
