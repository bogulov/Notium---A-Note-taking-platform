# DESIGN.md

## AI-Powered Note Taking Application - Complete Design Specification

---

## TABLE OF CONTENTS

1. [Design Philosophy](#1-design-philosophy)
2. [Color System](#2-color-system)
3. [Typography](#3-typography)
4. [Layout Architecture](#4-layout-architecture)
5. [Component Specifications](#5-component-specifications)
6. [Responsive Breakpoints](#6-responsive-breakpoints)
7. [Animation Specifications](#7-animation-specifications)
8. [Icon System](#8-icon-system)
9. [Spacing System](#9-spacing-system)
10. [Interactive States](#10-interactive-states)
11. [Component Code Templates](#11-component-code-templates)

---

## 1. DESIGN PHILOSOPHY

### 1.1 Core Principles

- **Minimalism**: Clean interface, maximum content focus
- **Clarity**: Clear visual hierarchy, obvious interactions
- **Consistency**: Uniform spacing, predictable behaviors
- **Performance**: Smooth 60fps animations, instant feedback
- **Accessibility**: WCAG 2.1 AA compliant, keyboard-first

### 1.2 Apple Notes Visual Language

- Subtle shadows for depth
- Rounded corners (8px standard)
- Soft color palette
- Generous white space
- System font stack

---

## 2. COLOR SYSTEM

### 2.1 Light Mode Palette

```css
/* Primary Colors */
--color-primary: #007aff; /* Apple Blue - CTAs, Links */
--color-primary-hover: #0051d5; /* Hover state */
--color-primary-light: #e5f2ff; /* Backgrounds, highlights */

/* Neutral Colors */
--color-background: #ffffff; /* Main background */
--color-surface: #f5f5f7; /* Sidebar, cards */
--color-surface-hover: #ebebed; /* Hover states */
--color-border: #d1d1d6; /* Dividers, borders */
--color-border-light: #e5e5ea; /* Subtle borders */

/* Text Colors */
--color-text-primary: #1d1d1f; /* Main text */
--color-text-secondary: #86868b; /* Meta info, timestamps */
--color-text-tertiary: #c7c7cc; /* Placeholder text */

/* Semantic Colors */
--color-success: #34c759; /* Success states */
--color-warning: #ff9500; /* Warning states */
--color-error: #ff3b30; /* Error, delete */
--color-info: #5ac8fa; /* Info badges */

/* AI Feature Colors */
--color-ai-primary: #af52de; /* AI button, accents */
--color-ai-background: #f5ebff; /* AI panel background */
--color-ai-border: #d7b8f3; /* AI panel border */
```

### 2.2 Dark Mode Palette

```css
/* Primary Colors */
--color-primary: #0a84ff; /* Apple Blue - Dark mode */
--color-primary-hover: #409cff; /* Hover state */
--color-primary-light: #1f3a5f; /* Backgrounds */

/* Neutral Colors */
--color-background: #000000; /* Main background */
--color-surface: #1c1c1e; /* Sidebar, cards */
--color-surface-hover: #2c2c2e; /* Hover states */
--color-border: #38383a; /* Dividers, borders */
--color-border-light: #48484a; /* Subtle borders */

/* Text Colors */
--color-text-primary: #ffffff; /* Main text */
--color-text-secondary: #98989d; /* Meta info */
--color-text-tertiary: #48484a; /* Placeholder text */

/* Semantic Colors */
--color-success: #32d74b; /* Success states */
--color-warning: #ff9f0a; /* Warning states */
--color-error: #ff453a; /* Error, delete */
--color-info: #64d2ff; /* Info badges */

/* AI Feature Colors */
--color-ai-primary: #bf5af2; /* AI button, accents */
--color-ai-background: #2d1b3d; /* AI panel background */
--color-ai-border: #5e3a7c; /* AI panel border */
```

### 2.3 CSS Implementation

```css
:root {
  /* Light mode (default) */
  color-scheme: light;

  /* Apply light mode colors here */
  --color-primary: #007aff;
  /* ... all light mode colors */
}

[data-theme="dark"] {
  color-scheme: dark;

  /* Apply dark mode colors here */
  --color-primary: #0a84ff;
  /* ... all dark mode colors */
}

/* Auto dark mode support */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    /* Apply dark mode colors */
  }
}
```

---

## 3. TYPOGRAPHY

### 3.1 Font Stack

```css
--font-family-base:
  -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu",
  "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;

--font-family-mono:
  "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New",
  monospace;
```

### 3.2 Font Sizes & Line Heights

```css
/* Font Sizes */
--font-size-xs: 12px; /* Small labels, metadata */
--font-size-sm: 14px; /* UI elements, buttons */
--font-size-base: 16px; /* Body text, editor */
--font-size-lg: 18px; /* Subtitles */
--font-size-xl: 22px; /* Note titles */
--font-size-2xl: 28px; /* Page headers */
--font-size-3xl: 34px; /* Large headings */

/* Line Heights */
--line-height-tight: 1.2; /* Headings */
--line-height-normal: 1.5; /* Body text */
--line-height-relaxed: 1.7; /* Reading text */

/* Font Weights */
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
```

### 3.3 Typography Classes

```css
.text-xs {
  font-size: var(--font-size-xs);
}
.text-sm {
  font-size: var(--font-size-sm);
}
.text-base {
  font-size: var(--font-size-base);
}
.text-lg {
  font-size: var(--font-size-lg);
}
.text-xl {
  font-size: var(--font-size-xl);
}
.text-2xl {
  font-size: var(--font-size-2xl);
}
.text-3xl {
  font-size: var(--font-size-3xl);
}

.font-normal {
  font-weight: var(--font-weight-normal);
}
.font-medium {
  font-weight: var(--font-weight-medium);
}
.font-semibold {
  font-weight: var(--font-weight-semibold);
}
.font-bold {
  font-weight: var(--font-weight-bold);
}

.leading-tight {
  line-height: var(--line-height-tight);
}
.leading-normal {
  line-height: var(--line-height-normal);
}
.leading-relaxed {
  line-height: var(--line-height-relaxed);
}
```

---

## 4. LAYOUT ARCHITECTURE

### 4.1 Main Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│  HEADER (60px height)                                       │
│  [☰] Search...              [+ New Note] [AI] [⚙️]         │
├──────────┬────────────────┬─────────────────────────────────┤
│          │                │                                 │
│ SIDEBAR  │  NOTE LIST     │     EDITOR                      │
│ (200px)  │  (280px)       │     (flex-1)                    │
│          │                │                                 │
│ Folders  │ ┌────────────┐ │  ┌──────────────────────────┐  │
│ ├─ Notes │ │ Note Title │ │  │ Title Input              │  │
│ ├─ Work  │ │ Preview... │ │  │                          │  │
│ ├─ Ideas │ │ 2 hours ago│ │  ├──────────────────────────┤  │
│ └─ Trash │ └────────────┘ │  │ [B][I][U] [List] [AI]    │  │
│          │                │  ├──────────────────────────┤  │
│ + New    │ ┌────────────┐ │  │                          │  │
│ Folder   │ │ Another... │ │  │  Editor Content Area     │  │
│          │ │ Yesterday  │ │  │                          │  │
│          │ └────────────┘ │  │                          │  │
│          │                │  └──────────────────────────┘  │
│          │                │                                 │
└──────────┴────────────────┴─────────────────────────────────┘
```

### 4.2 Grid System

```css
.app-container {
  display: grid;
  grid-template-columns: 200px 280px 1fr;
  grid-template-rows: 60px 1fr;
  grid-template-areas:
    "header header header"
    "sidebar notelist editor";
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

.header {
  grid-area: header;
}
.sidebar {
  grid-area: sidebar;
}
.note-list {
  grid-area: notelist;
}
.editor {
  grid-area: editor;
}
```

### 4.3 Component Dimensions

```css
/* Header */
--header-height: 60px;
--header-padding: 16px 24px;

/* Sidebar */
--sidebar-width: 200px;
--sidebar-width-collapsed: 0px;
--sidebar-padding: 16px;

/* Note List */
--notelist-width: 280px;
--notelist-width-mobile: 100%;
--note-item-height: 80px;
--note-item-padding: 12px 16px;

/* Editor */
--editor-max-width: 800px;
--editor-padding: 24px;
--toolbar-height: 48px;
```

---

## 5. COMPONENT SPECIFICATIONS

### 5.1 Header Component

**Dimensions:**

- Height: 60px
- Padding: 16px 24px
- Border bottom: 1px solid var(--color-border)

**Layout:**

```
[Menu Icon] [Search Input..................] [New Note] [AI] [Settings]
```

**Elements:**

1. **Menu Button (Mobile only)**
   - Size: 40px × 40px
   - Icon: Hamburger (3 lines)
   - Tap target: 44px × 44px

2. **Search Input**
   - Width: 300px (desktop), flex-1 (mobile)
   - Height: 36px
   - Border radius: 8px
   - Background: var(--color-surface)
   - Placeholder: "Search notes..."
   - Icon: Magnifying glass (left, 16px)

3. **New Note Button**
   - Width: auto
   - Height: 36px
   - Padding: 0 16px
   - Border radius: 8px
   - Background: var(--color-primary)
   - Text: "+ New Note" (desktop), "+" (mobile)
   - Color: white

4. **AI Button**
   - Size: 36px × 36px
   - Border radius: 8px
   - Background: var(--color-ai-primary)
   - Icon: Sparkles/Stars
   - Tooltip: "AI Assistant (⌘K)"

5. **Settings Button**
   - Size: 36px × 36px
   - Border radius: 8px
   - Background: transparent
   - Icon: Gear
   - Hover: var(--color-surface-hover)

**CSS Template:**

```css
.header {
  height: var(--header-height);
  padding: var(--header-padding);
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-background);
}

.search-input {
  width: 300px;
  height: 36px;
  padding: 0 12px 0 36px;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  font-size: var(--font-size-sm);
  position: relative;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: var(--color-text-secondary);
}

.btn-new-note {
  height: 36px;
  padding: 0 16px;
  border-radius: 8px;
  background: var(--color-primary);
  color: white;
  border: none;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.15s ease;
}

.btn-new-note:hover {
  background: var(--color-primary-hover);
  transform: scale(1.02);
}
```

---

### 5.2 Sidebar Component (Folders)

**Dimensions:**

- Width: 200px (desktop), 0px (collapsed)
- Padding: 16px
- Border right: 1px solid var(--color-border)

**Elements:**

1. **Folder List**
   - Each folder item: 36px height
   - Icon + Text layout
   - Active state highlight

2. **Folder Item**
   - Padding: 8px 12px
   - Border radius: 6px
   - Icon size: 18px
   - Font size: 14px

3. **New Folder Button**
   - Full width
   - Height: 36px
   - Dashed border: 1px dashed var(--color-border)
   - Text: "+ New Folder"

**CSS Template:**

```css
.sidebar {
  width: var(--sidebar-width);
  padding: var(--sidebar-padding);
  background: var(--color-surface);
  border-right: 1px solid var(--color-border);
  overflow-y: auto;
  transition: width 0.3s ease;
}

.sidebar.collapsed {
  width: 0;
  padding: 0;
  overflow: hidden;
}

.folder-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.folder-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s ease;
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
}

.folder-item:hover {
  background: var(--color-surface-hover);
}

.folder-item.active {
  background: var(--color-primary-light);
  color: var(--color-primary);
  font-weight: var(--font-weight-medium);
}

.folder-icon {
  width: 18px;
  height: 18px;
  color: var(--color-primary);
}

.btn-new-folder {
  width: 100%;
  height: 36px;
  margin-top: 12px;
  padding: 8px 12px;
  border: 1px dashed var(--color-border);
  border-radius: 6px;
  background: transparent;
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-new-folder:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: var(--color-primary-light);
}
```

---

### 5.3 Note List Component

**Dimensions:**

- Width: 280px (desktop), 100% (mobile)
- Border right: 1px solid var(--color-border)

**Elements:**

1. **List Header**
   - Height: 48px
   - Padding: 12px 16px
   - Title + Count + Sort dropdown

2. **Note Item**
   - Height: 80px (auto if preview long)
   - Padding: 12px 16px
   - Border bottom: 1px solid var(--color-border-light)

3. **Note Item Structure:**
   ```
   ┌─────────────────────────────┐
   │ Note Title         [Pin]    │  <- 18px font, semibold
   │ Preview text that shows...  │  <- 14px font, 2 lines max
   │ 2 hours ago · 125 words    │  <- 12px font, gray
   └─────────────────────────────┘
   ```

**CSS Template:**

```css
.note-list {
  width: var(--notelist-width);
  background: var(--color-background);
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.note-list-header {
  height: 48px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.note-list-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.note-count {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-left: 8px;
}

.note-list-items {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}

.note-item {
  min-height: 80px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--color-border-light);
  cursor: pointer;
  transition: background 0.15s ease;
  position: relative;
}

.note-item:hover {
  background: var(--color-surface);
}

.note-item.active {
  background: var(--color-primary-light);
  border-left: 3px solid var(--color-primary);
}

.note-item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

.note-item-title {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}

.note-item-pin {
  width: 20px;
  height: 20px;
  color: var(--color-primary);
  flex-shrink: 0;
}

.note-item-preview {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 6px;
}

.note-item-meta {
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
  display: flex;
  align-items: center;
  gap: 8px;
}
```

---

### 5.4 Editor Component

**Dimensions:**

- Max width: 800px (centered)
- Padding: 24px (desktop), 16px (mobile)
- Min height: 100%

**Elements:**

1. **Title Input**
   - Height: auto (min 44px)
   - Font size: 22px
   - Font weight: 600
   - Placeholder: "Untitled Note"
   - Border: none
   - Focus: outline none

2. **Toolbar**
   - Height: 48px
   - Padding: 8px 0
   - Border bottom: 1px solid var(--color-border-light)
   - Sticky position: top

3. **Content Area**
   - Min height: calc(100vh - 200px)
   - Font size: 16px
   - Line height: 1.6
   - Padding top: 16px

**Toolbar Buttons:**

```
[B] [I] [U] [S] | [H1] [H2] [H3] | [•] [1.] [☑] | [Link] [Image] | [AI ✨]
```

**CSS Template:**

```css
.editor {
  flex: 1;
  background: var(--color-background);
  overflow-y: auto;
  display: flex;
  justify-content: center;
}

.editor-container {
  width: 100%;
  max-width: var(--editor-max-width);
  padding: var(--editor-padding);
}

.editor-title {
  width: 100%;
  border: none;
  outline: none;
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  background: transparent;
  padding: 12px 0;
  margin-bottom: 8px;
  resize: none;
  overflow: hidden;
  min-height: 44px;
  line-height: var(--line-height-tight);
}

.editor-title::placeholder {
  color: var(--color-text-tertiary);
}

.editor-toolbar {
  height: var(--toolbar-height);
  padding: 8px 0;
  border-bottom: 1px solid var(--color-border-light);
  display: flex;
  align-items: center;
  gap: 4px;
  position: sticky;
  top: 0;
  background: var(--color-background);
  z-index: 10;
  margin-bottom: 16px;
}

.toolbar-group {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 0 8px;
  border-right: 1px solid var(--color-border-light);
}

.toolbar-group:last-child {
  border-right: none;
}

.toolbar-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: var(--color-text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
}

.toolbar-btn:hover {
  background: var(--color-surface);
  color: var(--color-text-primary);
}

.toolbar-btn.active {
  background: var(--color-primary-light);
  color: var(--color-primary);
}

.toolbar-btn-ai {
  padding: 0 12px;
  width: auto;
  gap: 6px;
  background: var(--color-ai-primary);
  color: white;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.toolbar-btn-ai:hover {
  background: var(--color-ai-primary);
  opacity: 0.9;
  transform: scale(1.05);
}

.editor-content {
  min-height: calc(100vh - 200px);
  font-size: var(--font-size-base);
  line-height: var(--line-height-relaxed);
  color: var(--color-text-primary);
  outline: none;
  padding-top: 16px;
}

.editor-content:empty:before {
  content: attr(data-placeholder);
  color: var(--color-text-tertiary);
  pointer-events: none;
}
```

---

### 5.5 AI Panel Component

**Dimensions:**

- Width: 400px (desktop), 100% (mobile)
- Position: Fixed bottom-right or slide-up modal
- Max height: 500px
- Border radius: 12px (top corners)

**Elements:**

1. **Panel Header**
   - Height: 48px
   - Title: "AI Assistant"
   - Close button

2. **Input Area**
   - Min height: 80px
   - Auto-resize textarea
   - Placeholder: "Ask AI or type a command..."

3. **Response Area**
   - Max height: 300px
   - Scrollable
   - Formatted markdown support

4. **Action Buttons**
   - "Insert", "Copy", "Regenerate"

**CSS Template:**

```css
.ai-panel {
  position: fixed;
  bottom: 0;
  right: 24px;
  width: 400px;
  max-height: 500px;
  background: var(--color-background);
  border: 1px solid var(--color-ai-border);
  border-radius: 12px 12px 0 0;
  box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  z-index: 100;
  transform: translateY(100%);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.ai-panel.open {
  transform: translateY(0);
}

.ai-panel-header {
  height: 48px;
  padding: 0 16px;
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--color-ai-background);
}

.ai-panel-title {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-ai-primary);
  display: flex;
  align-items: center;
  gap: 8px;
}

.ai-panel-close {
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 6px;
  background: transparent;
  cursor: pointer;
  color: var(--color-text-secondary);
}

.ai-panel-close:hover {
  background: var(--color-surface-hover);
}

.ai-panel-input {
  padding: 16px;
  border-bottom: 1px solid var(--color-border);
}

.ai-textarea {
  width: 100%;
  min-height: 80px;
  max-height: 120px;
  padding: 12px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-size: var(--font-size-sm);
  font-family: var(--font-family-base);
  resize: vertical;
  outline: none;
}

.ai-textarea:focus {
  border-color: var(--color-ai-primary);
  box-shadow: 0 0 0 3px var(--color-ai-background);
}

.ai-panel-response {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  max-height: 300px;
}

.ai-response-content {
  font-size: var(--font-size-sm);
  line-height: var(--line-height-normal);
  color: var(--color-text-primary);
}

.ai-panel-actions {
  padding: 12px 16px;
  border-top: 1px solid var(--color-border);
  display: flex;
  gap: 8px;
}

.ai-action-btn {
  flex: 1;
  height: 36px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: transparent;
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all 0.15s ease;
}

.ai-action-btn:hover {
  background: var(--color-surface);
  border-color: var(--color-ai-primary);
  color: var(--color-ai-primary);
}

.ai-action-btn.primary {
  background: var(--color-ai-primary);
  color: white;
  border-color: var(--color-ai-primary);
}

.ai-action-btn.primary:hover {
  opacity: 0.9;
}
```

---

## 6. RESPONSIVE BREAKPOINTS

### 6.1 Breakpoint System

```css
/* Breakpoints */
--breakpoint-mobile: 320px;
--breakpoint-mobile-lg: 480px;
--breakpoint-tablet: 768px;
--breakpoint-desktop: 1024px;
--breakpoint-desktop-lg: 1440px;

/* Media Queries */
@media (max-width: 767px) {
  /* Mobile */
}
@media (min-width: 768px) and (max-width: 1023px) {
  /* Tablet */
}
@media (min-width: 1024px) {
  /* Desktop */
}
```

### 6.2 Mobile Layout (< 768px)

**Grid System:**

```css
.app-container {
  grid-template-columns: 1fr;
  grid-template-rows: 60px 1fr;
  grid-template-areas:
    "header"
    "content";
}

/* Sidebar becomes overlay */
.sidebar {
  position: fixed;
  left: 0;
  top: 60px;
  height: calc(100vh - 60px);
  width: 280px;
  transform: translateX(-100%);
  z-index: 50;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
}

.sidebar.open {
  transform: translateX(0);
}

/* Note list takes full width */
.note-list {
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  transform: translateX(0);
  transition: transform 0.3s ease;
}

.note-list.hidden {
  transform: translateX(-100%);
}

/* Editor slides in */
.editor {
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  width: 100%;
  transform: translateX(100%);
  transition: transform 0.3s ease;
}

.editor.active {
  transform: translateX(0);
}
```

**Mobile Navigation:**

- Bottom bar with tabs: Notes | Editor | AI
- Swipe gestures for navigation
- Full-screen mode for editor

### 6.3 Tablet Layout (768px - 1023px)

**Grid System:**

```css
.app-container {
  grid-template-columns: 280px 1fr;
  grid-template-rows: 60px 1fr;
  grid-template-areas:
    "header header"
    "notelist editor";
}

/* Sidebar becomes collapsible overlay */
.sidebar {
  position: fixed;
  left: 0;
  top: 60px;
  height: calc(100vh - 60px);
  width: 240px;
  transform: translateX(-100%);
  z-index: 40;
}

.sidebar.open {
  transform: translateX(0);
}
```

### 6.4 Desktop Layout (>= 1024px)

**Standard 3-column layout as defined in section 4.1**

---

## 7. ANIMATION SPECIFICATIONS

### 7.1 Timing Functions

```css
/* Easing Functions */
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);

/* Durations */
--duration-fast: 150ms;
--duration-normal: 250ms;
--duration-slow: 400ms;
```

### 7.2 Component Animations

**1. Note Selection Animation**

```css
.note-item {
  transition:
    background 150ms ease-out,
    border-left 150ms ease-out,
    transform 150ms ease-out;
}

.note-item:hover {
  transform: translateX(2px);
}

.note-item.active {
  animation: slideInBorder 200ms ease-out;
}

@keyframes slideInBorder {
  from {
    border-left-width: 0;
  }
  to {
    border-left-width: 3px;
  }
}
```

**2. Editor Fade In**

```css
.editor-content {
  animation: fadeIn 200ms ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

**3. AI Panel Slide Up**

```css
.ai-panel {
  transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

.ai-panel.open {
  animation: slideUp 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
```

**4. Button Hover & Click**

```css
.btn {
  transition:
    transform 150ms ease-out,
    background 150ms ease-out,
    box-shadow 150ms ease-out;
}

.btn:hover {
  transform: scale(1.05);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.btn:active {
  transform: scale(0.95);
}
```

**5. Modal/Dialog**

```css
.modal-overlay {
  animation: fadeIn 200ms ease-out;
}

.modal-content {
  animation: scaleIn 250ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
```

**6. Loading Spinner**

```css
.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
```

**7. AI Typing Effect**

```css
.ai-typing {
  animation: pulse 1.4s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.ai-dot {
  animation: dotPulse 1.4s ease-in-out infinite;
}

.ai-dot:nth-child(2) {
  animation-delay: 0.2s;
}
.ai-dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes dotPulse {
  0%,
  60%,
  100% {
    transform: scale(1);
    opacity: 1;
  }
  30% {
    transform: scale(1.3);
    opacity: 0.7;
  }
}
```

**8. Skeleton Loading**

```css
.skeleton {
  background: linear-gradient(
    90deg,
    var(--color-surface) 0%,
    var(--color-surface-hover) 50%,
    var(--color-surface) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
```

---

## 8. ICON SYSTEM

### 8.1 Icon Library

**Recommended: Lucide React** (https://lucide.dev/)

### 8.2 Icon Sizes

```css
--icon-xs: 14px;
--icon-sm: 16px;
--icon-base: 20px;
--icon-lg: 24px;
--icon-xl: 32px;
```

### 8.3 Icon Mapping

| Component     | Icon Name   | Size |
| ------------- | ----------- | ---- |
| Menu          | Menu        | 20px |
| Search        | Search      | 16px |
| New Note      | Plus        | 16px |
| AI Button     | Sparkles    | 16px |
| Settings      | Settings    | 20px |
| Folder        | Folder      | 18px |
| Note          | FileText    | 18px |
| Pin           | Pin         | 16px |
| Delete        | Trash2      | 16px |
| Bold          | Bold        | 16px |
| Italic        | Italic      | 16px |
| Underline     | Underline   | 16px |
| List Bullet   | List        | 16px |
| List Numbered | ListOrdered | 16px |
| Checklist     | CheckSquare | 16px |
| Link          | Link        | 16px |
| Image         | Image       | 16px |
| Export        | Download    | 16px |
| Close         | X           | 16px |

### 8.4 Icon Implementation

```jsx
import { Search, Plus, Sparkles, Folder, FileText } from 'lucide-react';

// Usage
<Search size={16} className="icon-search" />
<Plus size={16} className="icon-plus" />
```

---

## 9. SPACING SYSTEM

### 9.1 Spacing Scale

```css
--spacing-0: 0;
--spacing-1: 4px;
--spacing-2: 8px;
--spacing-3: 12px;
--spacing-4: 16px;
--spacing-5: 20px;
--spacing-6: 24px;
--spacing-8: 32px;
--spacing-10: 40px;
--spacing-12: 48px;
--spacing-16: 64px;
--spacing-20: 80px;
```

### 9.2 Component Spacing

**Padding:**

- Buttons: 0 16px (horizontal)
- Input fields: 12px
- Cards: 16px
- Sections: 24px
- Page margins: 24px (desktop), 16px (mobile)

**Gaps:**

- Button groups: 8px
- Form fields: 16px
- List items: 2px
- Icon + Text: 8px

---

## 10. INTERACTIVE STATES

### 10.1 Button States

```css
/* Default */
.btn {
  background: var(--color-primary);
  color: white;
  opacity: 1;
  cursor: pointer;
}

/* Hover */
.btn:hover {
  background: var(--color-primary-hover);
  transform: scale(1.02);
}

/* Active/Click */
.btn:active {
  transform: scale(0.98);
}

/* Focus */
.btn:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* Disabled */
.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* Loading */
.btn.loading {
  opacity: 0.7;
  cursor: wait;
  pointer-events: none;
}
```

### 10.2 Input States

```css
/* Default */
.input {
  border: 1px solid var(--color-border);
  background: var(--color-background);
}

/* Focus */
.input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-light);
  outline: none;
}

/* Error */
.input.error {
  border-color: var(--color-error);
}

.input.error:focus {
  box-shadow: 0 0 0 3px rgba(255, 59, 48, 0.1);
}

/* Success */
.input.success {
  border-color: var(--color-success);
}

/* Disabled */
.input:disabled {
  background: var(--color-surface);
  color: var(--color-text-tertiary);
  cursor: not-allowed;
}
```

### 10.3 Link States

```css
.link {
  color: var(--color-primary);
  text-decoration: none;
  position: relative;
}

.link:hover {
  text-decoration: underline;
}

.link:active {
  color: var(--color-primary-hover);
}

.link:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
  border-radius: 2px;
}
```

---

## 11. COMPONENT CODE TEMPLATES

### 11.1 React Component Structure

**App.jsx**

```jsx
import React, { useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import NoteList from "./components/NoteList";
import Editor from "./components/Editor";
import AIPanel from "./components/AIPanel";
import "./App.css";

function App() {
  const [notes, setNotes] = useState([]);
  const [folders, setFolders] = useState([]);
  const [activeNote, setActiveNote] = useState(null);
  const [activeFolder, setActiveFolder] = useState("all");
  const [isAIPanelOpen, setIsAIPanelOpen] = useState(false);

  return (
    <div className="app-container">
      <Header
        onNewNote={() => {
          /* Create new note */
        }}
        onOpenAI={() => setIsAIPanelOpen(true)}
      />

      <Sidebar
        folders={folders}
        activeFolder={activeFolder}
        onFolderSelect={setActiveFolder}
      />

      <NoteList
        notes={notes}
        activeNote={activeNote}
        onNoteSelect={setActiveNote}
      />

      <Editor
        note={activeNote}
        onUpdate={(content) => {
          /* Update note */
        }}
      />

      <AIPanel isOpen={isAIPanelOpen} onClose={() => setIsAIPanelOpen(false)} />
    </div>
  );
}

export default App;
```

**Header.jsx**

```jsx
import React from "react";
import { Menu, Search, Plus, Sparkles, Settings } from "lucide-react";
import "./Header.css";

function Header({ onNewNote, onOpenAI }) {
  return (
    <header className="header">
      <button className="btn-menu" aria-label="Menu">
        <Menu size={20} />
      </button>

      <div className="search-container">
        <Search className="search-icon" size={16} />
        <input
          type="text"
          className="search-input"
          placeholder="Search notes..."
        />
      </div>

      <button className="btn-new-note" onClick={onNewNote}>
        <Plus size={16} />
        <span>New Note</span>
      </button>

      <button className="btn-ai" onClick={onOpenAI}>
        <Sparkles size={16} />
      </button>

      <button className="btn-settings" aria-label="Settings">
        <Settings size={20} />
      </button>
    </header>
  );
}

export default Header;
```

**NoteItem.jsx**

```jsx
import React from "react";
import { Pin } from "lucide-react";
import "./NoteItem.css";

function NoteItem({ note, isActive, onClick }) {
  const formatTimestamp = (date) => {
    // Format: "2 hours ago", "Yesterday", etc.
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className={`note-item ${isActive ? "active" : ""}`} onClick={onClick}>
      <div className="note-item-header">
        <h3 className="note-item-title">{note.title || "Untitled"}</h3>
        {note.isPinned && <Pin className="note-item-pin" size={16} />}
      </div>

      <p className="note-item-preview">{note.preview || "No content"}</p>

      <div className="note-item-meta">
        <span>{formatTimestamp(note.updatedAt)}</span>
        <span>·</span>
        <span>{note.wordCount || 0} words</span>
      </div>
    </div>
  );
}

export default NoteItem;
```

### 11.2 CSS Module Example

**NoteItem.module.css**

```css
.noteItem {
  min-height: 80px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--color-border-light);
  cursor: pointer;
  transition:
    background 0.15s ease,
    transform 0.15s ease;
}

.noteItem:hover {
  background: var(--color-surface);
  transform: translateX(2px);
}

.noteItem.active {
  background: var(--color-primary-light);
  border-left: 3px solid var(--color-primary);
  animation: slideInBorder 200ms ease-out;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

.title {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

.preview {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 6px;
}

.meta {
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
  display: flex;
  align-items: center;
  gap: 8px;
}

@keyframes slideInBorder {
  from {
    border-left-width: 0;
  }
  to {
    border-left-width: 3px;
  }
}
```

---

## 12. ACCESSIBILITY CHECKLIST

### 12.1 Keyboard Navigation

```jsx
// Example: Keyboard shortcuts handler
useEffect(() => {
  const handleKeyboard = (e) => {
    // Cmd/Ctrl + N: New Note
    if ((e.metaKey || e.ctrlKey) && e.key === "n") {
      e.preventDefault();
      createNewNote();
    }

    // Cmd/Ctrl + K: AI Panel
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      toggleAIPanel();
    }

    // Cmd/Ctrl + F: Focus Search
    if ((e.metaKey || e.ctrlKey) && e.key === "f") {
      e.preventDefault();
      searchInputRef.current?.focus();
    }
  };

  window.addEventListener("keydown", handleKeyboard);
  return () => window.removeEventListener("keydown", handleKeyboard);
}, []);
```

### 12.2 ARIA Labels

```jsx
// Buttons
<button aria-label="Create new note" onClick={onNewNote}>
  <Plus size={16} />
</button>

// Inputs
<input
  type="text"
  aria-label="Search notes"
  placeholder="Search notes..."
/>

// Icons
<Sparkles aria-hidden="true" size={16} />

// Loading states
<div role="status" aria-live="polite">
  {isLoading ? 'Loading...' : 'Content loaded'}
</div>
```

### 12.3 Focus Management

```css
/* Focus visible for keyboard users */
*:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
  border-radius: 4px;
}

/* Remove outline for mouse users */
*:focus:not(:focus-visible) {
  outline: none;
}

/* Skip to content link */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--color-primary);
  color: white;
  padding: 8px 16px;
  text-decoration: none;
  z-index: 1000;
}

.skip-link:focus {
  top: 0;
}
```

---

## 13. PERFORMANCE OPTIMIZATION

### 13.1 Lazy Loading

```jsx
import React, { lazy, Suspense } from "react";

const AIPanel = lazy(() => import("./components/AIPanel"));
const SettingsModal = lazy(() => import("./components/SettingsModal"));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      {isAIPanelOpen && <AIPanel />}
    </Suspense>
  );
}
```

### 13.2 Virtual Scrolling (for large note lists)

```jsx
import { FixedSizeList } from "react-window";

function NoteList({ notes }) {
  const Row = ({ index, style }) => (
    <div style={style}>
      <NoteItem note={notes[index]} />
    </div>
  );

  return (
    <FixedSizeList
      height={600}
      itemCount={notes.length}
      itemSize={80}
      width="100%"
    >
      {Row}
    </FixedSizeList>
  );
}
```

### 13.3 Debounced Auto-save

```jsx
import { useCallback } from "react";
import debounce from "lodash/debounce";

function Editor({ note, onSave }) {
  const debouncedSave = useCallback(
    debounce((content) => {
      onSave(content);
    }, 500),
    [],
  );

  const handleChange = (e) => {
    const content = e.target.value;
    debouncedSave(content);
  };

  return <textarea onChange={handleChange} />;
}
```

---

## 14. EXPORT FUNCTIONALITY

### 14.1 Markdown Export Implementation

```jsx
import TurndownService from "turndown";

function exportToMarkdown(note) {
  const turndownService = new TurndownService({
    headingStyle: "atx",
    codeBlockStyle: "fenced",
  });

  const markdown = turndownService.turndown(note.content);

  // Add frontmatter
  const frontmatter = `---
title: ${note.title}
created: ${note.createdAt}
updated: ${note.updatedAt}
---

`;

  const fullContent = frontmatter + markdown;

  // Create and download file
  const blob = new Blob([fullContent], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${sanitizeFileName(note.title)}-${Date.now()}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function sanitizeFileName(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
```

### 14.2 Export Menu UI

```jsx
function ExportMenu({ note }) {
  return (
    <div className="export-menu">
      <button onClick={() => exportToMarkdown(note)}>
        <Download size={16} />
        Export as Markdown
      </button>
      <button onClick={() => exportToTxt(note)}>
        <FileText size={16} />
        Export as Text
      </button>
    </div>
  );
}
```

---

## 15. IDE COMMAND PROMPTS

### 15.1 Initial Setup Command

```
Create a React app with the following structure:
- src/
  - components/
    - Header.jsx
    - Sidebar.jsx
    - NoteList.jsx
    - NoteItem.jsx
    - Editor.jsx
    - Toolbar.jsx
    - AIPanel.jsx
  - hooks/
    - useNotes.js
    - useLocalStorage.js
  - utils/
    - markdown.js
    - storage.js
  - styles/
    - variables.css
    - App.css
  - App.jsx
  - main.jsx

Install dependencies:
- lucide-react (icons)
- turndown (HTML to Markdown)
- @tiptap/react @tiptap/starter-kit (rich text editor)

Set up CSS variables for the Apple Notes color scheme in variables.css
```

### 15.2 Component Generation Commands

**For Header:**

```
Create a Header component with:
- Mobile menu button (hamburger icon)
- Search input with icon
- New Note button (+ icon + text)
- AI button (sparkles icon)
- Settings button (gear icon)

Use Lucide React icons
Apply styles from the design spec
Add proper ARIA labels
Make responsive (hide text on mobile)
```

**For NoteList:**

```
Create a NoteList component that:
- Displays a list of notes from props
- Each note shows: title, preview (2 lines), timestamp, word count
- Highlights active note with primary color
- Adds left border (3px) on active note
- Implements smooth hover animation
- Uses virtual scrolling for performance
- Handles click to select note
```

**For Editor:**

```
Create an Editor component using TipTap with:
- Title input (auto-resize textarea)
- Toolbar with buttons: Bold, Italic, Underline, Headings, Lists, Link, Image
- AI button in toolbar (purple color)
- Content area (TipTap editor)
- Auto-save on content change (500ms debounce)
- Placeholder text
- Focus on mount
```

**For AIPanel:**

```
Create an AIPanel component that:
- Slides up from bottom-right
- Has header with title and close button
- Input textarea for AI commands
- Response area with markdown formatting
- Action buttons: Insert, Copy, Regenerate
- Shows typing indicator when AI is processing
- Integrates with OpenAI API
- Handles errors gracefully
```

### 15.3 Styling Commands

```
Apply these styles to the app:
- Use CSS variables from variables.css
- Implement the 3-column grid layout
- Add smooth transitions (150ms-300ms)
- Use the specified color palette
- Apply border-radius: 8px to buttons and inputs
- Use the spacing system (4px increments)
- Add hover states to all interactive elements
- Implement focus-visible outlines for accessibility
```

### 15.4 Responsive Commands

```
Make the app responsive:
- Mobile (< 768px): Single column, overlay sidebar, full-screen editor
- Tablet (768px - 1023px): 2 columns, collapsible sidebar
- Desktop (>= 1024px): 3 columns, always visible sidebar

Add transitions for layout changes
Implement swipe gestures for mobile navigation
Add bottom navigation bar for mobile
```

---

## 16. TESTING CHECKLIST

### 16.1 Visual Testing

- [ ] All colors match the design spec
- [ ] Typography is consistent
- [ ] Spacing follows the 4px system
- [ ] Icons are the correct size
- [ ] Hover states work on all buttons
- [ ] Active states are visible
- [ ] Focus indicators are clear
- [ ] Dark mode works correctly

### 16.2 Responsive Testing

- [ ] Works on iPhone SE (375px)
- [ ] Works on iPad (768px)
- [ ] Works on desktop (1024px+)
- [ ] Sidebar collapses properly
- [ ] Editor is readable on mobile
- [ ] Touch targets are 44px minimum
- [ ] No horizontal scrolling

### 16.3 Interaction Testing

- [ ] Note creation works
- [ ] Note selection works
- [ ] Auto-save functions
- [ ] Search filters notes
- [ ] Folder switching works
- [ ] AI panel opens/closes
- [ ] Export downloads file
- [ ] Keyboard shortcuts work

### 16.4 Performance Testing

- [ ] Initial load < 2s
- [ ] Note switching < 100ms
- [ ] Animations run at 60fps
- [ ] No layout shifts
- [ ] Smooth scrolling
- [ ] No memory leaks

---

## 17. FINAL IMPLEMENTATION NOTES

### 17.1 Priority Order

1. **Phase 1**: Layout + Basic UI (Week 1-2)
   - Grid system
   - Header, Sidebar, NoteList, Editor
   - Color scheme and typography
2. **Phase 2**: Note Management (Week 3-4)
   - CRUD operations
   - Local storage
   - Auto-save
   - Search
3. **Phase 3**: Rich Text (Week 5-6)
   - TipTap integration
   - Toolbar
   - Formatting
4. **Phase 4**: AI Features (Week 7-8)
   - OpenAI integration
   - AI panel
   - Commands
5. **Phase 5**: Export + Polish (Week 9-10)
   - Markdown export
   - Animations
   - Responsive refinement
   - Bug fixes

### 17.2 Key Dependencies

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "lucide-react": "^0.263.1",
    "@tiptap/react": "^2.1.0",
    "@tiptap/starter-kit": "^2.1.0",
    "turndown": "^7.1.2",
    "openai": "^4.20.0"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "@vitejs/plugin-react": "^4.2.0"
  }
}
```

### 17.3 Environment Variables

```env
VITE_OPENAI_API_KEY=your_api_key_here
```

---

## SUMMARY

Is design document mein complete specifications diye gaye hain:

✅ **Complete Color System** - Light/Dark mode
✅ **Typography Scale** - Fonts, sizes, weights
✅ **Layout Architecture** - 3-column grid
✅ **All Components** - Header, Sidebar, NoteList, Editor, AI Panel
✅ **Responsive Design** - Mobile, Tablet, Desktop
✅ **Animation Specs** - Timings, easing, keyframes
✅ **Accessibility** - ARIA, keyboard nav, focus management
✅ **Code Templates** - React components ready to use
✅ **IDE Commands** - Direct prompts for AI coding assistants
