import isHotkey from "is-hotkey";
import { KeyboardEvent } from "react";
import { Editor, Range, Transforms, Path } from "slate";

import { DirectBlockType, ElementType } from "../editor-types";
import { EditorUtils } from "./editor-utils";

export const handleBreakKeys = (
  editor: Editor,
  event: KeyboardEvent
): boolean => {
  const selection = editor.selection;

  if (selection) {
    const entry = EditorUtils.getBlockAbove(editor);

    if (entry) {
      const node = entry[0];

      // Soft Break
      if (evaluateBreakCondition(softBreakRules, event, node.type)) {
        event.preventDefault();
        editor.insertText("\n");
        return true;
      }

      // Exit Break
      if (evaluateBreakCondition(exitBreakRules, event, node.type)) {
        const edge = EditorUtils.getBlockSelectionEdge(editor);

        if (edge !== "unknown") {
          event.preventDefault();

          if (Range.isExpanded(selection)) editor.deleteFragment();

          const isStart = edge === "start";
          let insertPath = Editor.path(editor, selection).slice(0, 1);
          if (!isStart) insertPath = Path.next(insertPath);

          Transforms.insertNodes(
            editor,
            {
              type: "paragraph",
              children: [{ text: "" }],
            },
            {
              at: insertPath,
              select: !isStart,
            }
          );

          return true;
        }
      }
    }
  }

  return false;
};

type BreakRules = Record<string, DirectBlockType[]>;

function evaluateBreakCondition(
  rules: BreakRules,
  event: React.KeyboardEvent,
  type: ElementType
) {
  return Object.keys(rules).some(
    (hotkey) =>
      //@ts-ignore
      isHotkey(hotkey, event) && rules[hotkey].includes(type)
  );
}

const softBreakRules: BreakRules = {
  enter: ["code-block", "quote"],
};

const exitBreakRules: BreakRules = {
  "mod+enter": ["quote", "code-block"],
  enter: ["heading1", "heading2", "heading3"],
};
