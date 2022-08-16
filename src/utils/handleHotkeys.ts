import isHotkey from "is-hotkey";
import { KeyboardEvent } from "react";
import { Editor } from "slate";
import { HistoryEditor } from "slate-history";
import { OverloadedReturnType } from "overwind-ui";

import { EditorUtils } from "./editor-utils";

export const handleHotkeys = (
  editor: Editor,
  showLinkInput: () => void,
  event: KeyboardEvent
): boolean => {
  for (const hotkey of HOTKEYS) {
    if (hotkey.checkHotkey(event)) {
      event.preventDefault();
      hotkey.action(editor, showLinkInput);
      return true;
    }
  }

  return false;
};

const HOTKEYS: {
  checkHotkey: Extract<OverloadedReturnType<typeof isHotkey>, Function>;
  action: (editor: Editor, showLinkInput: () => void) => void;
}[] = [
  {
    checkHotkey: isHotkey("mod+k"),
    action: (editor, showLinkInput) => {
      EditorUtils.toggleLink(editor, showLinkInput);
    },
  },

  {
    checkHotkey: isHotkey("mod+b"),
    action: (editor) => {
      EditorUtils.toggleMark(editor, "bold");
    },
  },

  {
    checkHotkey: isHotkey("mod+i"),
    action: (editor) => {
      EditorUtils.toggleMark(editor, "italic");
    },
  },

  {
    checkHotkey: isHotkey("mod+`"),
    action: (editor) => {
      EditorUtils.toggleMark(editor, "code");
    },
  },

  {
    checkHotkey: isHotkey("mod+z"),
    action: (editor) => {
      HistoryEditor.undo(editor);
    },
  },

  {
    checkHotkey: isHotkey(["mod+y", "mod+shift+z"]),
    action: (editor) => {
      HistoryEditor.redo(editor);
    },
  },
];
