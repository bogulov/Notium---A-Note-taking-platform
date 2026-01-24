# Product Requirements Document (PRD)

## AI-Powered Note Taking Web Application

---

## 1. PRODUCT OVERVIEW

### 1.1 Product Vision

Apple Notes ka ek web-based clone jo sabhi modern browsers mein seamlessly run karega aur AI-powered features ke saath users ko enhanced note-taking experience provide karega.

### 1.2 Product Goals

- Apple Notes jaisa intuitive aur clean user interface
- Cross-browser compatibility (Chrome, Firefox, Safari, Edge)
- Fully responsive design (Mobile, Tablet, Desktop)
- AI-powered content generation aur query answering
- Local storage-based note management
- Markdown export functionality
- Smooth animations aur transitions

### 1.3 Target Users

- Students jo notes organize karna chahte hain
- Professionals jo quick note-taking aur AI assistance chahte hain
- General users jo simple, intuitive note-taking app prefer karte hain

---

## 2. FUNCTIONAL REQUIREMENTS

### 2.1 Core Note-Taking Features (Apple Notes Parity)

#### 2.1.1 Note Management

- **Create New Note**
  - Quick create button (top-right corner)
  - Keyboard shortcut: Cmd/Ctrl + N
  - Auto-save functionality (save as user types)
- **Delete Note**
  - Delete button with confirmation dialog
  - Move to "Recently Deleted" folder (30-day retention)
  - Permanent delete option
- **Edit Note**
  - Real-time editing without save button
  - Auto-save every 2-3 seconds
  - Last edited timestamp display

- **Search Notes**
  - Global search bar (top of sidebar)
  - Search by title aur content
  - Real-time search results
  - Search highlighting

#### 2.1.2 Text Formatting

- **Basic Formatting**
  - Bold (Cmd/Ctrl + B)
  - Italic (Cmd/Ctrl + I)
  - Underline (Cmd/Ctrl + U)
  - Strikethrough
- **Paragraph Formatting**
  - Headings (H1, H2, H3)
  - Bullet lists
  - Numbered lists
  - Checklist/Todo items
  - Block quotes
- **Text Styling**
  - Font size options
  - Text alignment (Left, Center, Right)
  - Text color
  - Highlight color

#### 2.1.3 Organization Features

- **Folders**
  - Create custom folders
  - Rename folders
  - Delete folders
  - Drag-and-drop notes between folders
  - Default folder: "Notes"
- **Sorting Options**
  - Date Created (Newest/Oldest)
  - Date Modified (Recent first)
  - Title (A-Z)

#### 2.1.4 Additional Apple Notes Features

- **Attachments**
  - Image upload aur preview
  - File attachments (optional, if needed)
- **Tables**
  - Insert simple tables
  - Add/remove rows and columns
- **Links**
  - Auto-detect URLs
  - Clickable links
  - Insert custom links

---

### 2.2 AI-Powered Features (OpenAI Integration)

#### 2.2.1 AI Command Panel

- **Activation Methods**
  - Keyboard shortcut: Cmd/Ctrl + K
  - Dedicated AI button in toolbar
  - Slash command: Type "/" to open AI menu

#### 2.2.2 AI Capabilities

**A. Document Generation**

- User commands examples:
  - "Write a 500-word essay on climate change"
  - "Create a meeting agenda for project kickoff"
  - "Generate a professional email template"
  - "Write bullet points summarizing quantum physics"
- AI response handling:
  - Stream text directly into editor
  - Option to accept or reject AI-generated content
  - Edit AI content before insertion

**B. Question Answering**

- User selects existing text
- Opens AI panel
- Asks questions like:
  - "Summarize this in 3 points"
  - "Explain this in simple terms"
  - "What are the key takeaways?"
  - "Translate this to Hindi"
- AI response display:
  - Show in side panel (non-intrusive)
  - Option to insert answer into note
  - Copy answer to clipboard

**C. Text Enhancement**

- Commands:
  - "Improve this paragraph"
  - "Make this more professional"
  - "Fix grammar and spelling"
  - "Expand this section"
  - "Make this shorter"

#### 2.2.3 AI Settings

- **OpenAI API Configuration**
  - API key input field (Settings page)
  - Secure storage (localStorage with encryption)
  - Model selection: GPT-4o, GPT-4o-mini, etc.
  - Temperature control (creativity slider)
  - Max token limit setting

- **AI Behavior Settings**
  - Response length preference
  - Tone selection (Professional, Casual, Creative)
  - Language preference

---

### 2.3 Export & Import Features

#### 2.3.1 Export Functionality

- **Markdown Export (.md)**
  - Single note export
  - Bulk export (selected notes)
  - Export entire folder
  - File naming: `{note-title}-{date}.md`
  - Preserve formatting in Markdown syntax
- **Export Options**
  - Include metadata (creation date, last modified)
  - Export with/without AI-generated content markers

#### 2.3.2 Import Functionality (Optional Enhancement)

- Import .md files
- Import .txt files
- Preserve formatting during import

---

### 2.4 Storage Architecture

#### 2.4.1 Local Storage Strategy

- **Data Structure**

```json
{
  "notes": [
    {
      "id": "unique-uuid",
      "title": "Note Title",
      "content": "HTML/Markdown content",
      "folder": "folder-id",
      "createdAt": "timestamp",
      "updatedAt": "timestamp",
      "tags": [],
      "isPinned": false
    }
  ],
  "folders": [
    {
      "id": "folder-uuid",
      "name": "Folder Name",
      "createdAt": "timestamp"
    }
  ],
  "settings": {
    "openAIKey": "encrypted-key",
    "theme": "light/dark",
    "aiSettings": {}
  }
}
```

- **Storage Limits**
  - Monitor localStorage usage (max ~5-10MB)
  - Warning when approaching limit
  - Suggestion to export old notes

---

## 3. UI/UX REQUIREMENTS

### 3.1 Layout Structure (Apple Notes Clone)

```
┌─────────────────────────────────────────────────────┐
│  [☰] Search Notes...            [+ New Note] [⚙️]   │
├──────────┬────────────┬──────────────────────────────┤
│          │            │                              │
│ Folders  │ Note List  │     Editor Area              │
│          │            │                              │
│ 📁 Notes │ Note 1     │  Title: Untitled Note        │
│ 📁 Work  │ Note 2     │  ─────────────────────       │
│ 📁 Ideas │ Note 3 ✓   │                              │
│          │            │  [B] [I] [U] [AI] [...]      │
│ + New    │            │                              │
│          │            │  Type your note here...      │
│          │            │                              │
│          │            │                              │
└──────────┴────────────┴──────────────────────────────┘
```

### 3.2 Responsive Breakpoints

#### Desktop (≥1024px)

- 3-column layout (Folders | List | Editor)
- Full toolbar visible
- Sidebar width: 200px (folders), 280px (list)

#### Tablet (768px - 1023px)

- 2-column layout (List | Editor)
- Folders accessible via hamburger menu
- Collapsible sidebar

#### Mobile (<768px)

- Single column view
- Bottom navigation bar
- Swipe gestures (delete, pin)
- Full-screen editor

### 3.3 Color Scheme (Apple Notes Style)

**Light Mode:**

- Background: #FFFFFF
- Sidebar: #F5F5F7
- Text: #1D1D1F
- Accent: #007AFF
- Borders: #D1D1D6

**Dark Mode:**

- Background: #1C1C1E
- Sidebar: #2C2C2E
- Text: #FFFFFF
- Accent: #0A84FF
- Borders: #38383A

### 3.4 Typography

- Primary Font: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif
- Title: 22px, Semi-bold
- Body: 16px, Regular
- UI Elements: 14px, Medium

---

## 4. ANIMATION REQUIREMENTS

### 4.1 Micro-Interactions

#### Page Transitions

- **Note Selection**: Fade in editor content (200ms ease-out)
- **Folder Switch**: Slide animation for note list (250ms cubic-bezier)
- **Modal Open/Close**: Scale + fade (300ms)

#### Button Interactions

- **Hover State**: Scale 1.05 + color transition (150ms)
- **Click Feedback**: Scale 0.95 bounce (100ms)
- **Loading States**: Skeleton screens with shimmer effect

#### AI Interactions

- **AI Panel Open**: Slide up from bottom (300ms ease-out)
- **AI Typing**: Typewriter effect for generated content
- **AI Thinking**: Pulsing dots animation

### 4.2 Smooth Scrolling

- Smooth scroll behavior for all scrollable areas
- Custom scrollbar styling (thin, rounded)
- Scroll-to-top button with fade-in at 300px scroll

### 4.3 Animation Library Recommendations

- Framer Motion (React)
- GSAP (Vanilla JS)
- CSS Transitions for simple interactions

---

## 5. TECHNICAL SPECIFICATIONS

### 5.1 Frontend Technology Stack

**Recommended Stack:**

- **Framework**: React.js 18+ with TypeScript
- **Styling**: Tailwind CSS + CSS Modules
- **Rich Text Editor**:
  - TipTap (recommended) - Highly customizable
  - Quill.js (alternative) - Simpler implementation
- **State Management**:
  - Zustand (lightweight) or
  - Redux Toolkit (complex state)
- **Routing**: React Router v6
- **Animations**: Framer Motion
- **Icons**: Lucide React / Heroicons

**Alternative Stack (Vanilla):**

- HTML5, CSS3, JavaScript (ES6+)
- Quill.js for editor
- GSAP for animations

### 5.2 OpenAI Integration

```javascript
// API Call Structure
const generateContent = async (prompt, userText) => {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini", // Cost-effective option
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant for note-taking.",
        },
        {
          role: "user",
          content: prompt + (userText ? `\n\nContext: ${userText}` : ""),
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    }),
  });

  return await response.json();
};
```

### 5.3 Export Implementation

```javascript
// Markdown Export Function
const exportToMarkdown = (note) => {
  // Convert HTML to Markdown
  const markdown = turndownService.turndown(note.content);

  const blob = new Blob([markdown], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${sanitizeFileName(note.title)}-${Date.now()}.md`;
  a.click();
  URL.revokeObjectURL(url);
};
```

### 5.4 Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile Safari (iOS 14+)
- Chrome Android (Latest)

---

## 6. PERFORMANCE REQUIREMENTS

### 6.1 Load Times

- Initial page load: <2 seconds
- Note switch: <100ms
- AI response start: <1 second
- Export generation: <500ms

### 6.2 Optimization Strategies

- Lazy load note content (virtualization for large lists)
- Debounce auto-save (500ms delay)
- Memoization for expensive renders
- Code splitting for AI features
- Image compression for attachments

---

## 7. SECURITY & PRIVACY

### 7.1 Data Security

- Encrypt OpenAI API key in localStorage
- No server-side storage (fully client-side)
- Clear sensitive data on logout/close
- HTTPS only in production

### 7.2 Privacy Considerations

- No analytics tracking
- No data sent to external servers (except OpenAI API)
- User owns all data
- Clear data deletion options

---

## 8. USER FLOWS

### 8.1 First-Time User Flow

1. Landing page with welcome message
2. Create first note automatically
3. Quick tutorial tooltip (optional)
4. Prompt to set up AI (optional)

### 8.2 Note Creation Flow

1. Click "+ New Note"
2. Editor opens with focus on title
3. Start typing (auto-save begins)
4. Use toolbar for formatting
5. Note appears in sidebar list

### 8.3 AI Assistance Flow

1. User types/selects text
2. Press Cmd+K or click AI button
3. AI panel opens
4. Enter command/question
5. AI processes (loading indicator)
6. Response streams into view
7. Accept/Edit/Reject options

### 8.4 Export Flow

1. Right-click note or use menu
2. Select "Export as Markdown"
3. File downloads to device
4. Success notification

---

## 9. FEATURE PRIORITIZATION (MVP vs Future)

### 9.1 MVP (Minimum Viable Product)

**Phase 1 - Core Features:**

- ✅ Basic note CRUD operations
- ✅ Rich text formatting (bold, italic, lists)
- ✅ Folder organization
- ✅ Search functionality
- ✅ Local storage persistence
- ✅ Markdown export
- ✅ Responsive design (3 breakpoints)
- ✅ Basic animations

**Phase 2 - AI Features:**

- ✅ OpenAI API integration
- ✅ AI content generation
- ✅ AI question answering
- ✅ API key management

### 9.2 Future Enhancements

- 🔮 Cloud sync (optional backend)
- 🔮 Collaborative editing
- 🔮 Voice notes
- 🔮 Advanced AI features (summarization, translation)
- 🔮 Templates library
- 🔮 PDF export
- 🔮 Dark mode toggle
- 🔮 Keyboard shortcuts customization
- 🔮 Note linking (wiki-style)
- 🔮 Version history

---

## 10. SUCCESS METRICS

### 10.1 Technical Metrics

- Page load time <2s
- Lighthouse score >90
- Zero critical accessibility issues
- <1% error rate
- Works on 95%+ target browsers

### 10.2 User Experience Metrics

- Average session duration
- Notes created per user
- AI feature usage rate
- Export frequency
- User retention (return visits)

---

## 11. DEVELOPMENT TIMELINE

### Estimated Timeline (Single Developer)

**Week 1-2: Setup & Core UI**

- Project setup (React + TypeScript)
- Basic layout implementation
- Sidebar navigation
- Note list component

**Week 3-4: Editor & Formatting**

- Rich text editor integration
- Toolbar implementation
- Formatting features
- Auto-save functionality

**Week 5-6: Data Management**

- LocalStorage architecture
- CRUD operations
- Search functionality
- Folder management

**Week 7-8: AI Integration**

- OpenAI API setup
- AI command panel
- Content generation
- Question answering

**Week 9-10: Export & Polish**

- Markdown export
- Animations refinement
- Responsive testing
- Bug fixes

**Week 11-12: Testing & Launch**

- Cross-browser testing
- Performance optimization
- Documentation
- Deployment

---

## 12. TECHNICAL CHALLENGES & SOLUTIONS

### 12.1 Rich Text Editing

**Challenge:** Complex formatting preservation
**Solution:** Use TipTap with custom extensions for Apple Notes-like features

### 12.2 AI Rate Limiting

**Challenge:** OpenAI API costs & rate limits
**Solution:**

- Implement request queuing
- Token usage monitoring
- User-configurable limits
- Caching common responses

### 12.3 LocalStorage Limits

**Challenge:** 5-10MB storage limit
**Solution:**

- Implement storage quota monitoring
- Automatic cleanup of deleted notes
- Export old notes prompt
- Consider IndexedDB for large datasets

### 12.4 Real-time Auto-save

**Challenge:** Performance with large documents
**Solution:**

- Debounced saves (500ms)
- Differential updates (save only changes)
- Background save with visual indicator

---

## 13. ACCESSIBILITY REQUIREMENTS

### 13.1 WCAG 2.1 AA Compliance

- ✅ Keyboard navigation (Tab, Arrow keys)
- ✅ Screen reader compatibility (ARIA labels)
- ✅ Focus indicators
- ✅ Color contrast ratio 4.5:1
- ✅ Text resizing up to 200%
- ✅ Alt text for icons

### 13.2 Keyboard Shortcuts

- Cmd/Ctrl + N: New note
- Cmd/Ctrl + K: AI panel
- Cmd/Ctrl + F: Search
- Cmd/Ctrl + S: Manual save (visual feedback only)
- Cmd/Ctrl + B/I/U: Text formatting
- Cmd/Ctrl + E: Export current note

---

## 14. DEPLOYMENT & HOSTING

### 14.1 Hosting Options

**Recommended:**

- Vercel (React/Next.js apps)
- Netlify (Static sites)
- GitHub Pages (Simple deployment)

### 14.2 Domain & SSL

- Custom domain setup
- Free SSL certificate
- CDN for static assets

### 14.3 CI/CD Pipeline

- GitHub Actions for automated deployment
- Automated testing before deployment
- Version tagging

---

## 15. DOCUMENTATION REQUIREMENTS

### 15.1 User Documentation

- Getting started guide
- AI features tutorial
- Keyboard shortcuts reference
- Export/import guide
- FAQ section

### 15.2 Developer Documentation

- Setup instructions
- Code architecture
- API integration guide
- Contribution guidelines

---

## 16. APPENDIX

### 16.1 Glossary

- **Note**: Single document/entry
- **Folder**: Collection of notes
- **AI Command**: User instruction to AI
- **Markdown**: Lightweight markup language

### 16.2 References

- Apple Notes (inspiration)
- OpenAI API Documentation
- TipTap Editor Documentation
- React Best Practices

---

## FINAL NOTES

Yeh PRD aapke project ko production-level tak le jane ke liye complete roadmap provide karta hai. Development shuru karne se pehle:

1. **Tech stack finalize karein** (React recommended)
2. **OpenAI API key obtain karein** (free tier se start kar sakte hain)
3. **Design mockups banayen** (Figma/Sketch recommended)
4. **Git repository setup karein**
5. **MVP features ko prioritize karein**
