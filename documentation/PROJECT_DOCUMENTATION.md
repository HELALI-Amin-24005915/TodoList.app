# Technical Documentation - TodoList.app

## 1. Overview

TodoList.app is a React task management application organized around folders.

The project includes:

- task CRUD operations
- folder CRUD operations
- a many-to-many task-folder relationship
- combinable filtering and sorting
- a responsive interface optimized for mobile and desktop

## 2. Application architecture

### 2.1 Functional structure

- src/App.js
- src/contexts/TodoContext.jsx
- src/components/Header
- src/components/TodoList
- src/components/Task
- src/components/Filter
- src/components/Sort
- src/components/FolderManager
- src/components/CreateItemModal
- src/components/Footer
- src/utils/constants.js
- src/assets/backup.json

### 2.2 Single source of truth

Core business state is centralized in TodoContext:

- tasks: tasks
- folders: folders
- task-folder relations: relations
- active view: currentView (tasks/folders)
- folder filters:
  - folderFilterMode
  - selectedFolderIds
  - includeNoFolder

The provider also exposes business actions:

- tasks: addTask, updateTask, deleteTask
- folders: addFolder, updateFolder, deleteFolder
- associations: addTaskToFolder, removeTaskFromFolder
- utility queries: getTasksByFolder, getFoldersByTask
- navigation: goToTasksView, goToFoldersView, selectFolderAndGoToTasks
- reset: resetFromBackup

## 3. Data model

### 3.1 Task

Example properties in use:

- id
- title
- description
- date_creation
- date_echeance
- priorite
- etat
- equipiers

### 3.2 Folder

Example properties in use:

- id
- title
- description
- color
- icon
- type

### 3.3 Relation

Association entries:

- tache (task id)
- folder (folder id)

This structure allows one task to be linked to multiple folders.

## 4. Main flows

### 4.1 Global rendering

App.js wraps AppContent with TodoProvider.

AppContent:

- reads currentView from context
- renders FolderManager when currentView === folders
- renders TodoList otherwise
- orchestrates the create modal (task/folder)

### 4.2 Task management

Involved components:

- TodoList.jsx
- Task.jsx
- CreateItemModal.jsx

Behavior:

1. TodoList reads tasks + relations + filter state.
2. A filter/sort pipeline is computed with useMemo.
3. Each task is rendered by Task.
4. Task handles:
   - expand/collapse
   - inline editing
   - deletion
   - folder association/dissociation
   - folder badge click to activate filtering

### 4.3 Folder management

Main component: FolderManager.jsx

Behavior:

- folder cards display
- one-folder-at-a-time editing (atomic editingFolder state)
- edit/save/cancel/delete actions
- folder card click => switch to tasks view filtered by that folder

### 4.4 Filters and sorting

Components:

- Sort.jsx
- Filter.jsx (status filters + overdue switch)
- FolderFilter.jsx (folder selection + no-folder + only)

Filtering pipeline in TodoList:

1. folder filter (ALL, selected folders, no-folder)
2. status filter (multi-select)
3. overdue filter (> 7 days)
4. final sort by selected option

## 5. UX and responsive behavior

The project uses one CSS file per component.

Current principles:

- clear visual hierarchy for task and folder cards
- responsive action layouts (desktop/tablet/mobile)
- structured filter sections using fieldset/legend
- keyboard-accessible interactive buttons and badges

## 6. Data reset

At startup, Header shows a confirmation modal.

If confirmed:

- resetFromBackup reloads tasks, folders, and relations from src/assets/backup.json
- filters and current view are reset to default state

## 7. Development commands

- npm start: development server
- npm test: test runner
- npm run lint: ESLint linting
- npm run build: production build
- npm run docs: generate JSDoc output into docs/

## 8. CI/CD

### 8.1 Quality CI

Workflow: .github/workflows/ci.yml

Checks:

- dependency installation
- strict lint
- tests
- build

### 8.2 Documentation deployment

Workflow: .github/workflows/deploy-docs.yml

Pipeline:

1. npm ci --legacy-peer-deps
2. npm run docs
3. deploy docs/ to GitHub Pages

Expected final URL:

- https://helali-amin-24005915.github.io/TodoList.app/

## 9. Improvement ideas

- increase component test coverage (React Testing Library)
- replace remaining alert/confirm dialogs with React-Bootstrap modals
- add local persistence (localStorage or backend)
- add i18n and timezone handling for dates
