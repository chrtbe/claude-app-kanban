# Repository Instructions

## Setup

- Install dependencies with `npm install`.
- Start the development server with `npm dev`.
- use tailwind for styling
- Next.js
- Tailwind.css

## Verification

- Run `npm test` after modifying application logic.
- Run `npm lint` and `npm typecheck` before reporting completion.

## Conventions

- Use TypeScript for new application files.
- Reuse existing components before creating new ones.
- Do not edit generated files manually.
- Use libraries for fancy animations and features

## Github

- keep the commits short
- create pull requests for every feature
- PR and commit naming
  - feat: for features
  - fix: for bug fixes
  - refactor: for refactoring
  - rem: for removals
- keep the git history clean

## Access

- do not look at .env files and settings.local.json

## Documentation

- Save all docs in the "docs" folder
- Document every feature in "Features.md"
- Document all changes I agreed on
- Keep the documentations short, simple and easy to understand
- Document risks and problems in "Risks.md"

## Context

A minimalistic dynamic Kanban Board to manage tasks with a minimalistic and simple design.
The task can be categorized into groups and moved from one group to another per drag and drop. The drag and drop uses fancy animations for more fun.