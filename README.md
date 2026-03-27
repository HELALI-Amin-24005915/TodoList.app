# TodoList.app

A React task management app with folders, multi-criteria filtering, sorting, advanced editing, and a responsive UI (mobile + desktop).

## Documentation

- Technical project documentation: [documentation/PROJECT_DOCUMENTATION.md](documentation/PROJECT_DOCUMENTATION.md)
- Local API documentation (JSDoc) after generation: [docs/index.html](docs/index.html)
- Deployed documentation (GitHub Pages): https://helali-amin-24005915.github.io/TodoList.app/

The workflow already used to publish the documentation is: [.github/workflows/deploy-docs.yml](.github/workflows/deploy-docs.yml)

## Main features

- Task management: create, edit, delete, and mark as completed.
- Folder management: create, edit, delete, with color coding.
- Many-to-many task-folder relationship.
- Combined filters:
	- by status (multi-select)
	- by folder (multi-select)
	- tasks without folder
	- hide tasks overdue by more than 7 days
- Task sorting:
	- due date (asc/desc)
	- creation date
	- alphabetical order
- Contextual navigation:
	- Tasks mode / Folders mode
	- click a folder to switch to tasks filtered by that folder
	- clickable folder badges on tasks for quick filtering
- Reset to the initial backup data at startup.

## Technical stack

- React 18 (Create React App)
- Context API for global state
- React-Bootstrap + Bootstrap 5
- React Icons + MUI Icons
- Chart.js (summary chart in the header)
- JSDoc + better-docs

## Installation

Prerequisites:

- Node.js 18+ recommended
- npm

Install dependencies:

```bash
npm install
```

If you encounter a peer dependency conflict related to better-docs:

```bash
npm install --legacy-peer-deps
```

## Scripts

### Run in development

```bash
npm start
```

### Run tests

```bash
npm test
```

### Lint

```bash
npm run lint
```

### Production build

```bash
npm run build
```

### Generate JSDoc documentation

```bash
npm run docs
```

## Architecture (summary)

- `src/App.js`: app composition, context provider, conditional tasks/folders rendering, creation modal.
- `src/contexts/TodoContext.jsx`: single source of truth for tasks, folders, relations, current view, and folder filters.
- `src/components/TodoList`: tasks view, sorting + filtering + task card rendering.
- `src/components/FolderManager`: folders view, folder editing, folder->tasks navigation.
- `src/components/Task`: task display/editing and folder association management.
- `src/components/Header`: statistics, mobile menu, view switch, startup reset modal.
- `src/components/CreateItemModal`: task and folder creation.

For architecture and flow details, see [documentation/PROJECT_DOCUMENTATION.md](documentation/PROJECT_DOCUMENTATION.md).

## Documentation deployment

The repository contains a GitHub Actions workflow that:

1. installs dependencies,
2. generates JSDoc (`npm run docs`),
3. publishes the `docs/` content to GitHub Pages.

Workflow: [.github/workflows/deploy-docs.yml](.github/workflows/deploy-docs.yml)

After enabling GitHub Pages in the repository, the final URL follows this format:

- https://helali-amin-24005915.github.io/TodoList.app/

## Quality notes

- CI validation: strict lint + tests + build on Node 18 and 20.
- Workflow CI: [.github/workflows/ci.yml](.github/workflows/ci.yml)
