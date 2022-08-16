import isUrl from "is-url-superb";
import { Editor, Element, Range, Transforms } from "slate";

import { EditorUtils } from "../utils/editor-utils";

export const withLinks = (editor: Editor) => {
  const { insertData, isInline, normalizeNode } = editor;

  editor.isInline = (element) => {
    return element.type === "link" ? true : isInline(element);
  };

  editor.normalizeNode = (entry) => {
    const [node, path] = entry;

    //-------------------------------------------
    // Empty Links are removed
    //-------------------------------------------
    if (Element.isElement(node) && node.type === "link") {
      if (Editor.isEmpty(editor, node)) {
        Transforms.removeNodes(editor, { at: path });
        return;
      }
    }

    normalizeNode(entry);
  };

  editor.insertData = (data) => {
    const text = data.getData("text/plain");

    //-------------------------------------------
    // Copy links secretly
    //-------------------------------------------
    if (text && isUrl(text)) {
      if (editor.selection) {
        if (Range.isCollapsed(editor.selection)) {
          EditorUtils.insertLink(editor, text);
        } else {
          EditorUtils.turnIntoLink(editor, text, "end");
        }
        return;
      }
    }

    insertData(data);
  };

  return editor;
};

/*
      Two adjacent links get separated by a space

      try {
        const [previousNode, previousPath] = Editor.node(
          editor,
          Path.previous(path)
        );

        if (Text.isText(previousNode) && previousNode.text === "") {
          const [previousPreviousNode, previousPreviousPath] = Editor.node(
            editor,
            Path.previous(previousPath)
          );

          if (
            Element.isElement(previousPreviousNode) &&
            previousPreviousNode.type === "link"
          ) {
            console.log("previous is link");
            Transforms.setNodes(
              editor,
              {
                text: " ",
              },
              { at: previousPath }
            );
            return;
          }
        }
      } catch (e) {}

      try {
        const [nextNode, nextPath] = Editor.node(editor, Path.next(path));

        if (Text.isText(nextNode) && nextNode.text === "") {
          const [nextNextNode, nextNextPath] = Editor.node(
            editor,
            Path.next(nextPath)
          );

          if (Element.isElement(nextNextNode) && nextNextNode.type === "link") {
            console.log("next is link");
            Transforms.setNodes(
              editor,
              {
                text: " ",
              },
              { at: nextPath }
            );
            return;
          }
        }
      } catch (e) {}
 */
