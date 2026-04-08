# Contributing

Thanks for helping improve ChaosToggle.js. This page is a short orientation; the canonical checklist and workflow live in the repository.

## Where to look

- **[CONTRIBUTING.md](https://github.com/Caripson/ChaosToggle.js/blob/main/CONTRIBUTING.md)** — branching, issues, PR expectations (add this file at the repo root if it is not there yet).  
- **[GitHub Issues](https://github.com/Caripson/ChaosToggle.js/issues)** — bugs, ideas, and effect/theme proposals.  
- **Source layout** — `src/effects/` for individual effects, `src/themes/builtin.ts` for bundled themes, `src/core/engine.ts` for orchestration.

## Local development

```bash
git clone https://github.com/Caripson/ChaosToggle.js.git
cd ChaosToggle.js
npm install
npm run build
npm test
```

Documentation site:

```bash
npm run docs:dev
```

## What makes a good contribution

- **Focused PRs** — one feature or fix per branch when possible.  
- **Tests** — add or update Vitest coverage when behavior changes.  
- **Docs** — update VitePress pages under `docs/` when you change public API or user-visible behavior.  
- **Accessibility & consent** — prank effects should stay clearly optional and documented with warnings.

## Templates

- [New effect](/community/effect-template)  
- [New theme](/community/theme-template)  
