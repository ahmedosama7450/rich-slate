import { htmlEscape } from "escape-goat";
import { Descendant, Text } from "slate";

// TODO This has not been tested yet!
export function serializeToHtml(nodes: Descendant[]) {
  return nodes.map((n) => serializeToHtmlHelper(n)).join("");
}

function serializeToHtmlHelper(node: Descendant): string {
  if (Text.isText(node)) {
    let textHtml = htmlEscape(node.text);

    if (node.code) {
      textHtml = `<code>${textHtml}</code>`;
    } else {
      if (node.bold) {
        textHtml = `<strong>${textHtml}</strong>`;
      }

      if (node.italic) {
        textHtml = `<em>${textHtml}</em>`;
      }
    }

    return textHtml;
  }

  const children = node.children.map((n) => serializeToHtmlHelper(n)).join("");

  switch (node.type) {
    case "paragraph": // Default can handle this, just saving a couple of checks because most elements are paragraphs
      return `<p>${children}</p>`;
    case "heading1":
      return `<h1>${children}</h1`;
    case "heading2":
      return `<h2>${children}</h2>`;
    case "quote":
      return `<blockquote>${children}</blockquote>`;
    case "code-block":
      return `<pre><code>${children}</code></pre>`;
    case "bulleted-list":
      return `<ul>${children}</ul>`;
    case "numbered-list":
      return `<ol>${children}</ol>`;
    case "list-item":
      return `<li>${children}</li>`;
    case "link":
      return `<a href="${htmlEscape(node.url)}">${children}</a>`;
    case "separator":
      return `<hr/>`;
    case "image":
      return `<img src="${node.src}"/>`; // TODO Use next.js image component. What about cropData ?
    default:
      return `<p>${children}</p>`;
  }
}
