import React, { useCallback, useMemo, useState } from "react";
import scrollIntoView from "scroll-into-view-if-needed";
import {
  BaseSelection,
  Editor,
  Element,
  NodeEntry,
  Range as SlateRange,
  Text,
} from "slate";
import { Editable, ReactEditor, useSlateStatic } from "slate-react";
import { PropsWithClassName } from "overwind-ui";

import { EditorUtils, handleBreakKeys, handleHotkeys } from "./utils";
import { BalloonToolbar, LinkInput, LinkToolbar } from "./components";
import { useRichSlateConfiguration } from "./hooks";
import { ImageRenderer, renderElement, renderLeaf } from "./renderers";

export type RichSlateProps = PropsWithClassName<{
  placeholder?: string;

  i18n: {
    balloonToolbarI18n: React.ComponentProps<typeof BalloonToolbar>["i18n"];
    linkToolbarI18n: React.ComponentProps<typeof LinkToolbar>["i18n"];
    linkInputI18n: React.ComponentProps<typeof LinkInput>["i18n"];
    imageRendererI18n: React.ComponentProps<typeof ImageRenderer>["i18n"];
  };
}>;

export const RichSlate = ({
  className,
  placeholder,

  i18n: {
    balloonToolbarI18n,
    linkToolbarI18n,
    linkInputI18n,
    imageRendererI18n,
  },
}: RichSlateProps) => {
  const editor = useSlateStatic();
  const configuration = useRichSlateConfiguration();

  const [linkInputSelection, setLinkInputSelection] =
    useState<BaseSelection>(null);

  const showLinkInput = useCallback(() => {
    setLinkInputSelection(editor.selection);
  }, [editor.selection]);

  const hideLinkInput = useCallback(() => {
    setLinkInputSelection(null);
  }, []);

  const renderElementMemoized = useMemo(() => {
    return renderElement(imageRendererI18n);
  }, [imageRendererI18n]);

  const decorate = useCallback(
    ([node, path]: NodeEntry) => {
      /*
        LinkInput takes focus so, editor selection is lost
        We use a decorator to mark the selection
      */
      if (
        linkInputSelection &&
        Text.isText(node) &&
        SlateRange.includes(linkInputSelection, path)
      ) {
        if (SlateRange.isCollapsed(linkInputSelection)) {
          // Try to find a link, and mark it as selection from start to end
          const linkElement = Editor.above(editor, {
            at: linkInputSelection,
            match: (n) => Element.isElement(n) && n.type === "link",
          });

          if (linkElement) {
            const [, path] = linkElement;
            return [
              {
                anchor: Editor.start(editor, path),
                focus: Editor.end(editor, path),
                selectionHighlight: true,
              },
            ];
          }
        } else {
          return [
            {
              ...linkInputSelection,
              selectionHighlight: true,
            },
          ];
        }
      }

      return [];
    },
    [editor, linkInputSelection]
  );

  return (
    <div className={className}>
      <BalloonToolbar showLinkInput={showLinkInput} i18n={balloonToolbarI18n} />
      <LinkToolbar showLinkInput={showLinkInput} i18n={linkToolbarI18n} />
      <LinkInput
        linkSelection={linkInputSelection}
        hide={hideLinkInput}
        i18n={linkInputI18n}
      />
      <Editable
        className="prose 2xl:prose-lg prose-primary max-w-none"
        style={{ wordBreak: "break-word" }}
        placeholder={placeholder}
        spellCheck={false}
        autoCorrect="false"
        autoCapitalize="false"
        decorate={decorate}
        renderElement={renderElementMemoized}
        renderLeaf={renderLeaf}
        onDOMBeforeInput={(event: InputEvent) => {
          // TODO Do we really need this ??
          switch (event.inputType) {
            case "formatBold":
              event.preventDefault();
              return EditorUtils.toggleMark(editor, "bold");
            case "formatItalic":
              event.preventDefault();
              return EditorUtils.toggleMark(editor, "italic");
          }
        }}
        onKeyDown={(event) => {
          if (handleHotkeys(editor, showLinkInput, event)) return;
          if (handleBreakKeys(editor, event)) return;
        }}
        scrollSelectionIntoView={(_editor, domRange) => {
          if (configuration.images) {
            // Don't scroll into images, back to default if not an image
            let isImage = false;
            if (editor.selection && SlateRange.isCollapsed(editor.selection)) {
              const [match] = Editor.nodes(editor, {
                match: (n) => Element.isElement(n) && n.type === "image",
                voids: true, // TODO removing this doesn't change result, I guess. Why ??
              });

              isImage = !!match;
            }

            if (!isImage) {
              defaultScrollSelectionIntoView(editor, domRange);
            }
          } else {
            defaultScrollSelectionIntoView(editor, domRange);
          }
        }}
      />
    </div>
  );
};

// TODO Taken from slate source code as It's not exported. Make a PR to export it
const defaultScrollSelectionIntoView = (
  editor: ReactEditor,
  domRange: Range
) => {
  // This was affecting the selection of multiple blocks and dragging behavior,
  // so enabled only if the selection has been collapsed.
  if (
    !editor.selection ||
    (editor.selection && SlateRange.isCollapsed(editor.selection))
  ) {
    const leafEl = domRange.startContainer.parentElement!;
    leafEl.getBoundingClientRect =
      domRange.getBoundingClientRect.bind(domRange);
    scrollIntoView(leafEl, {
      scrollMode: "if-needed",
    });
    //@ts-ignore
    delete leafEl.getBoundingClientRect;
  }
};
