import { Editor, Element, Path, Transforms } from "slate";

export const withSeparator = (editor: Editor) => {
  const { isVoid, normalizeNode } = editor;

  editor.isVoid = (element) => {
    return element.type === "separator" ? true : isVoid(element);
  };

  editor.normalizeNode = (entry) => {
    const [node, path] = entry;

    //-------------------------------------------
    // No two separators next to one another, remove the second one
    //-------------------------------------------
    if (Element.isElement(node) && node.type === "separator") {
      try {
        const [previousNode] = Editor.node(editor, Path.previous(path));

        if (
          Element.isElement(previousNode) &&
          previousNode.type === "separator"
        ) {
          Transforms.removeNodes(editor, { at: path });
          return;
        }
      } catch (e) {}

      try {
        const [nextNode, nextPath] = Editor.node(editor, Path.next(path));

        if (Element.isElement(nextNode) && nextNode.type === "separator") {
          Transforms.removeNodes(editor, { at: nextPath });
          return;
        }
      } catch (e) {}
    }

    normalizeNode(entry);
  };

  return editor;
};
