import { useMemo } from "react";
import { Editor, Element, Range, Text } from "slate";
import { ReactEditor } from "slate-react";

import { ToolbarButton, BaseToolbarButtonProps } from "./ToolbarButton";
import { HoveringContainer } from "./HoveringContainer";
import { TextMark } from "../editor-types";
import { EditorUtils } from "../utils/editor-utils";

export const BalloonToolbar = ({
  showLinkInput,
  i18n,
}: {
  showLinkInput: () => void;
  i18n: {
    boldTooltip: string;
    italicTooltip: string;
    codeTooltip: string;
    linkTooltip: string;
  };
}) => {
  const markButtons: (BaseToolbarButtonProps & { mark: TextMark })[] =
    useMemo(() => {
      return [
        // Bold
        {
          mark: "bold",
          tooltip: i18n["boldTooltip"],
          icon: "ri:bold",
        },

        // Italic
        {
          mark: "italic",
          tooltip: i18n["italicTooltip"],
          icon: "ri:italic",
        },

        // Code
        {
          mark: "code",
          tooltip: i18n["codeTooltip"],
          icon: "ri:code-s-line",
        },
      ];
    }, [i18n]);

  return (
    <HoveringContainer
      whereToShow={(editor) => {
        const selection = editor.selection;
        if (
          selection &&
          ReactEditor.isFocused(editor) &&
          Range.isExpanded(selection) &&
          Editor.string(editor, selection) !== ""
        ) {
          return selection;
        } else {
          return null;
        }
      }}
      placement="top"
    >
      <div className="flex items-center gap-1 px-1 py-1 border rounded-sm shadow-sm bg-gray-50">
        {markButtons.map(({ mark, ...rest }, index) => (
          <ToolbarButton
            key={index}
            disabled={(editor) => {
              // TODO Optimize using useMemo, somehow

              const [enabledMatch] = Editor.nodes(editor, {
                match: (node, path) => {
                  if (Text.isText(node)) {
                    /* 
                    The button is enabled if part of selection includes a text node that:
                      => In case of italic/bold marks: 
                          - doesn't have code mark
                          - its ancestor: - is not link
                                        - is not code block
                      => In case of code marks
                          - its ancestor : is not code block
                    */
                    if (mark === "bold" || mark === "italic") {
                      if (!node.code) {
                        return !Editor.above(editor, {
                          at: path,
                          match: (n) =>
                            Element.isElement(n) &&
                            (n.type === "link" || n.type === "code-block"),
                        });
                      }
                    } else {
                      return !Editor.above(editor, {
                        at: path,
                        match: (n) =>
                          Element.isElement(n) && n.type === "code-block",
                      });
                    }
                  }
                  return false;
                },
              });

              return !enabledMatch;
            }}
            listener={(editor) => {
              EditorUtils.toggleMark(editor, mark);
            }}
            selected={(editor) => EditorUtils.isMarkActive(editor, mark)}
            {...rest}
          />
        ))}

        <div className="w-px h-6 bg-gray-200"></div>

        <ToolbarButton
          listener={(editor) => {
            EditorUtils.toggleLink(editor, showLinkInput);
          }}
          selected={(editor) => EditorUtils.isLinkActive(editor)}
          tooltip={i18n["linkTooltip"]}
          icon="ri:link"
        />
      </div>
    </HoveringContainer>
  );
};
