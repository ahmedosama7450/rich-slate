import { Editor, Element, Range, Text, Transforms } from "slate";

import { EditorUtils } from "../utils/editor-utils";

export const withBlocks = (editor: Editor) => {
  const { normalizeNode, deleteBackward } = editor;

  editor.normalizeNode = (entry) => {
    const [node, path] = entry;

    //-------------------------------------------
    // Remove formatting from code blocks
    //-------------------------------------------
    if (Element.isElement(node) && node.type === "code-block") {
      // Has text with marks
      const [match] = Editor.nodes(editor, {
        at: path,
        match: (n) => Text.isText(n) && EditorUtils.hasMarks(n),
        mode: "lowest",
      });

      if (match) {
        // Remove marks from text
        Transforms.setNodes(
          editor,
          { bold: undefined, italic: undefined, code: undefined },
          { at: path, match: (n) => Text.isText(n), mode: "lowest" }
        );
        return;
      }
    }

    normalizeNode(entry);
  };

  editor.deleteBackward = (unit) => {
    //-------------------------------------------
    // Pressing backspace on an empty block (heading, code block, quote) block should turn it into a paragraph block
    //-------------------------------------------
    if (editor.selection && Range.isCollapsed(editor.selection)) {
      const entry = EditorUtils.getBlockAbove(editor);

      if (entry) {
        const [node, path] = entry;

        if (
          (node.type === "code-block" ||
            node.type === "heading1" ||
            node.type === "heading2" ||
            node.type === "quote") &&
          Editor.isEmpty(editor, node)
        ) {
          // Turn into paragraph
          Transforms.setNodes(
            editor,
            {
              type: "paragraph",
            },
            {
              at: path,
            }
          );

          return;
        }
      }
    }

    deleteBackward(unit);
  };

  return editor;
};
