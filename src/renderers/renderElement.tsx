/* eslint-disable react/display-name */
import { RenderElementProps } from "slate-react";

import { ImageRenderer, ImageRendererProps } from "./ImageRenderer";
import { LinkRenderer } from "./LinkRenderer";
import { SeparatorRenderer } from "./SeparatorRenderer";

export const renderElement =
  (i18n: ImageRendererProps["i18n"]) => (props: RenderElementProps) => {
    const { element, attributes, children } = props;

    switch (element.type) {
      case "heading1":
        return <h2 {...attributes}>{children}</h2>;
      case "heading2":
        return <h3 {...attributes}>{children}</h3>;
      case "quote":
        return <blockquote {...attributes}>{children}</blockquote>;
      case "code-block":
        return (
          <pre {...attributes}>
            <code>{children}</code>
          </pre>
        );
      case "bulleted-list":
        return <ul {...attributes}>{children}</ul>;
      case "numbered-list":
        return <ol {...attributes}>{children}</ol>;
      case "list-item":
        return <li {...attributes}>{children}</li>;
      case "link":
        return <LinkRenderer {...props} />;
      case "separator":
        return <SeparatorRenderer {...props} />;
      case "image":
        return <ImageRenderer {...props} i18n={i18n} />;
      default:
        return <p {...attributes}>{children}</p>;
    }
  };
