import { marked } from "marked";
import DOMPurify from "dompurify";

marked.setOptions({ breaks: true });

// LLM output is untrusted content rendered as raw HTML — always sanitize
// before it reaches {@html}.
export function renderMarkdown(text: string): string {
  return DOMPurify.sanitize(marked.parse(text, { async: false }));
}
