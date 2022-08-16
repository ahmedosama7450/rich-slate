import { Editor, Range, Transforms } from "slate";

import { ToggleableBlockType } from "../editor-types";
import { EditorUtils } from "../utils/editor-utils";

const MARKDOWN_SHORTCUTS: Record<string, ToggleableBlockType> = {
  "#": "heading1",
  "##": "heading2",
  ">": "quote",
  "<": "quote",
  "```": "code-block",
  "*": "bulleted-list",
  "-": "bulleted-list",
  "1.": "numbered-list",
  "1-": "numbered-list",
  "1)": "numbered-list",
};

export const withMarkdownShortcuts = (editor: Editor) => {
  const { insertText } = editor;

  editor.insertText = (text) => {
    /*
     Markdown shortcut is triggered by inserting a space proceeded by
     the shortcut in an empty paragraph element 
    */
    const { selection } = editor;

    if (text === " " && selection && Range.isCollapsed(selection)) {
      const entry = EditorUtils.getBlockAbove(editor);

      if (entry) {
        const [node, path] = entry;

        if (node.type === "paragraph") {
          const shortcutsRange: Range = {
            anchor: Editor.start(editor, path),
            focus: selection.focus,
          };

          const type =
            MARKDOWN_SHORTCUTS[Editor.string(editor, shortcutsRange)];

          if (type) {
            Transforms.select(editor, shortcutsRange);
            Transforms.delete(editor);

            EditorUtils.toggleBlock(editor, type);
            return;
          }
        }
      }
    }

    insertText(text);
  };

  return editor;
};
