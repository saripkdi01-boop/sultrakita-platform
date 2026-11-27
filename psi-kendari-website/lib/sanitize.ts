import "server-only";
import sanitizeHtml from "sanitize-html";

/** Tag & atribut yang diizinkan untuk isi artikel dari psi.id. */
export const ALLOWED_TAGS = [
  "p", "br", "hr", "h2", "h3", "h4", "h5", "h6", "strong", "b", "em", "i", "u", "s",
  "sub", "sup", "small", "mark", "blockquote", "q", "cite", "ul", "ol", "li", "figure",
  "figcaption", "img", "a", "table", "thead", "tbody", "tfoot", "tr", "th", "td",
  "caption", "pre", "code", "span", "div", "iframe",
];

const IFRAME_HOSTS = ["www.youtube.com", "youtube.com", "www.youtube-nocookie.com"];

/** Sanitasi HTML dari API (cegah XSS): buang skrip, style, event handler, iframe asing. */
export function sanitizeArticleHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: {
      a: ["href", "title", "target", "rel"],
      img: ["src", "alt", "width", "height", "loading", "decoding", "srcset", "sizes"],
      iframe: ["src", "width", "height", "title", "allow", "allowfullscreen", "loading", "referrerpolicy"],
      th: ["colspan", "rowspan", "scope"],
      td: ["colspan", "rowspan"],
    },
    allowedSchemes: ["https", "http", "mailto"],
    allowedSchemesByTag: { img: ["https"], iframe: ["https"] },
    allowedIframeHostnames: IFRAME_HOSTS,
    allowProtocolRelative: false,
    disallowedTagsMode: "discard",
    transformTags: {
      h1: "h2",
      a: (tagName, attribs) => {
        const href = attribs.href || "";
        const external = /^https?:\/\//i.test(href);
        return {
          tagName: "a",
          attribs: {
            href,
            ...(attribs.title ? { title: attribs.title } : {}),
            ...(external ? { target: "_blank", rel: "noopener noreferrer nofollow" } : {}),
          },
        };
      },
      img: (tagName, attribs) => ({
        tagName,
        attribs: { ...attribs, loading: "lazy", decoding: "async" },
      }),
      iframe: (tagName, attribs) => ({
        tagName,
        attribs: {
          ...attribs,
          loading: "lazy",
          referrerpolicy: "strict-origin-when-cross-origin",
          title: attribs.title || "Video tersemat",
        },
      }),
    },
    exclusiveFilter: (frame) =>
      frame.tag === "p" && !frame.text.trim() && !(frame.mediaChildren && frame.mediaChildren.length),
  });
}
