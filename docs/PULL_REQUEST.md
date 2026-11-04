# Build Crafta’s interactive neighborhood story adventure

Crafta now offers a complete mobile-first storytelling flow in place of the empty repository. Families meet Maya, choose a bakery, park, or train station, make four branching decisions in a persistent original SVG scene, and reveal an eight-page illustrated storybook. Custom ideas enter deterministic story templates; progress resumes locally, and families can start another adventure without accounts or services.

Includes Next.js, TypeScript, Tailwind CSS, responsive styling, reduced-motion support, keyboard focus management, validated progress restoration, story-logic tests, a dependency lockfile, and setup/deployment documentation.

Six automated tests cover all 48 built-in paths, custom text, and restoration. The development server listens on port 3000 and serves the welcome screen with HTTP 200. Production builds use the supported Webpack option because the cloud sandbox restricts Turbopack worker ports. See the README for Vercel deployment instructions and phone smoke testing.
