import { Editor, Element, Node, Path, Point, Range, Transforms } from "slate";

import { EditorUtils } from "../utils/editor-utils";

export const withLists = (editor: Editor) => {
  const { insertBreak, deleteBackward, normalizeNode } = editor;

  editor.normalizeNode = (entry) => {
    const [node, path] = entry;

    if (Element.isElement(node)) {
      if (node.type === "list-item") {
        //-------------------------------------------
        // No list item without parent list container
        //-------------------------------------------
        const parent = Node.parent(editor, path);
        if (
          !Element.isElement(parent) ||
          !EditorUtils.isListType(parent.type)
        ) {
          Transforms.removeNodes(editor, { at: path });
          return;
        }
      }

      if (node.type === "bulleted-list" || node.type === "numbered-list") {
        //-------------------------------------------
        // lists without list items are removed
        //-------------------------------------------
        if (Editor.isEmpty(editor, node)) {
          Transforms.removeNodes(editor, { at: path });
          return;
        }

        //-------------------------------------------
        // Lists must only have list items => split lists at other elements
        //-------------------------------------------
        for (const [child, childPath] of Node.children(editor, path)) {
          if (Element.isElement(child) && child.type !== "list-item") {
            Transforms.liftNodes(editor, { at: childPath });
            return;
          }
        }

        //-------------------------------------------
        // Two adjacent lists of same type (bulleted/numbered) get merged
        //-------------------------------------------
        try {
          const [previousNode] = Editor.node(editor, Path.previous(path));

          if (
            Element.isElement(previousNode) &&
            previousNode.type === node.type
          ) {
            Transforms.mergeNodes(editor, { at: path });
            return;
          }
        } catch (e) {}

        try {
          const [nextNode, nextPath] = Editor.node(editor, Path.next(path));

          if (Element.isElement(nextNode) && nextNode.type === node.type) {
            Transforms.mergeNodes(editor, { at: nextPath });
            return;
          }
        } catch (e) {}
      }
    }

    normalizeNode(entry);
  };

  editor.insertBreak = () => {
    //-------------------------------------------
    // Inserting break on an empty list item turns it into a paragraph
    //-------------------------------------------
    if (editor.selection && Range.isCollapsed(editor.selection)) {
      const entry = EditorUtils.getBlockAbove(editor);

      if (entry) {
        const [node, path] = entry;

        if (node.type === "list-item" && Editor.isEmpty(editor, node)) {
          Transforms.setNodes(
            editor,
            {
              type: "paragraph",
            },
            {
              at: path,
            }
          );
          return true;
        }
      }
    }
    insertBreak();
  };

  editor.deleteBackward = (unit) => {
    //-------------------------------------------
    // Pressing backspace at the beginning of a list item turns it into a paragraph
    //-------------------------------------------
    if (editor.selection && Range.isCollapsed(editor.selection)) {
      const entry = EditorUtils.getBlockAbove(editor);

      if (entry) {
        const [node, path] = entry;

        if (
          node.type === "list-item" &&
          Point.equals(editor.selection.anchor, Editor.start(editor, path))
        ) {
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
