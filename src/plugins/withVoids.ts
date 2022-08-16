import { Editor, Path, Transforms } from "slate";

import { EditorUtils } from "../utils/editor-utils";

export const withVoids = (editor: Editor) => {
  const { deleteBackward } = editor;

  editor.deleteBackward = (unit) => {
    //-------------------------------------------
    // Instead of deleting the void element, select it. Second time deletes it
    //-------------------------------------------
    const entry = EditorUtils.getBlockAbove(editor);

    if (entry) {
      const [node, path] = entry;

      if (Editor.isEmpty(editor, node)) {
        try {
          const [previousNode, previousPath] = Editor.node(
            editor,
            Path.previous(path)
          );

          if (Editor.isVoid(editor, previousNode)) {
            Transforms.select(editor, previousPath);
            return;
          }
        } catch (e) {}
      }
    }

    deleteBackward(unit);
  };

  return editor;
};
