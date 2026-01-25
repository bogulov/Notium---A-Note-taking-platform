// @ts-expect-error no types for turndown
import TurndownService from 'turndown';
import type { Note } from '../types';

const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
});

export function exportNoteAsMarkdown(note: Note) {
  const markdown = turndownService.turndown(note.content);

  const frontmatter = `---
title: ${note.title}
created: ${new Date(note.createdAt).toISOString()}
updated: ${new Date(note.updatedAt).toISOString()}
tags: ${note.tags?.join(', ') || 'none'}
---

`;

  const fullContent = frontmatter + markdown;

  downloadFile(
    fullContent,
    `${sanitizeFileName(note.title)}.md`,
    'text/markdown'
  );
}

export function exportNoteAsText(note: Note) {
  const text = stripHTML(note.content);
  downloadFile(text, `${sanitizeFileName(note.title)}.txt`, 'text/plain');
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function sanitizeFileName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 50);
}

function stripHTML(html: string): string {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
}
