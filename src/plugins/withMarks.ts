import { Editor, Text, Transforms, Element } from "slate";

import { EditorUtils } from "../utils/editor-utils";

export const withMarks = (editor: Editor) => {
  const { normalizeNode } = editor;

  editor.normalizeNode = (entry) => {
    const [node, path] = entry;

    if (Text.isText(node)) {
      //-------------------------------------------
      // Remove formatting from empty text nodes (That helps terminate inline formatting when break is inserted)
      //-------------------------------------------
      /*
       E.g. When pressing enter on the end of a bold text, the node is split
       The next paragraph will have a an empty text node with bold mark and when you start typing,
       the text is bold. By removing formatting from empty text nodes, we guarantee that this won't happen
       */
      if (node.text === "" && EditorUtils.hasMarks(node)) {
        Transforms.setNodes(
          editor,
          { bold: undefined, italic: undefined, code: undefined },
          { at: path }
        );
        return;
      }

      //-------------------------------------------
      // Text nodes with code can't be bold or italic
      //-------------------------------------------
      if (node.code && (node.bold || node.italic)) {
        Transforms.setNodes(
          editor,
          { bold: undefined, italic: undefined },
          { at: path }
        );
        return;
      }
    } else if (Element.isElement(node) && node.type === "link") {
      //-------------------------------------------
      // Links can't have bold or italic marks
      //-------------------------------------------
      const [match] = Editor.nodes(editor, {
        at: path,
        match: (n) => Text.isText(n) && !!(n.bold || n.italic),
        mode: "lowest",
      });

      if (match) {
        Transforms.setNodes(
          editor,
          { bold: undefined, italic: undefined },
          {
            at: path,
            match: (n) => Text.isText(n) && !!(n.bold || n.italic),
            mode: "lowest",
          }
        );
        return;
      }
    }

    normalizeNode(entry);
  };

  return editor;
};
