import { Editor, Element, Path, Transforms } from "slate";

export const withTrailingBlock = (editor: Editor) => {
  const { normalizeNode } = editor;

  editor.normalizeNode = (entry) => {
    if (entry[1].length === 0) {
      const { children } = editor;
      const lastNode = children[children.length - 1];

      if (
        children.length === 0 ||
        (Element.isElement(lastNode) && lastNode.type !== "paragraph")
      ) {
        // Insert paragraph trailing block
        const lastNodePath = Editor.last(editor, [])[1];
        Transforms.insertNodes(
          editor,
          {
            type: "paragraph",
            children: [{ text: "" }],
          },
          {
            at:
              children.length === 0 ? [0] : Path.next(lastNodePath.slice(0, 1)),
          }
        );

        return;
      }
    }

    normalizeNode(entry);
  };

  return editor;
};
