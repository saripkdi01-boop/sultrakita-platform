/** Sanitasi HTML di browser (fallback ketika server tidak bisa mengambil psi.id). */
import DOMPurify from "dompurify";

const IFRAME_HOSTS = new Set(["www.youtube.com", "youtube.com", "www.youtube-nocookie.com"]);
let hooked = false;

function ensureHooks() {
  if (hooked) return;
  hooked = true;
  DOMPurify.addHook("uponSanitizeElement", (node, data) => {
    if (data.tagName === "iframe") {
      const el = node as Element;
      try {
        const u = new URL(el.getAttribute("src") || "");
        if (u.protocol !== "https:" || !IFRAME_HOSTS.has(u.hostname)) el.remove();
      } catch {
        el.remove();
      }
    }
  });
  DOMPurify.addHook("afterSanitizeAttributes", (node) => {
    const el = node as Element;
    if (el.tagName === "A") {
      const href = el.getAttribute("href") || "";
      if (/^https?:\/\//i.test(href)) {
        el.setAttribute("target", "_blank");
        el.setAttribute("rel", "noopener noreferrer nofollow");
      }
    }
    if (el.tagName === "IMG") {
      const src = el.getAttribute("src") || "";
      if (!/^https:\/\//i.test(src)) el.removeAttribute("src");
      el.setAttribute("loading", "lazy");
    }
  });
}

export function sanitizeInBrowser(html: string): string {
  ensureHooks();
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      "p", "br", "hr", "h2", "h3", "h4", "h5", "h6", "strong", "b", "em", "i", "u", "s",
      "sub", "sup", "small", "mark", "blockquote", "q", "cite", "ul", "ol", "li", "figure",
      "figcaption", "img", "a", "table", "thead", "tbody", "tfoot", "tr", "th", "td",
      "caption", "pre", "code", "span", "div", "iframe",
    ],
    ALLOWED_ATTR: [
      "href", "title", "target", "rel", "src", "alt", "width", "height", "loading",
      "srcset", "sizes", "allow", "allowfullscreen", "colspan", "rowspan", "scope",
    ],
    ALLOWED_URI_REGEXP: /^(?:https?:|mailto:|#)/i,
  });
}
