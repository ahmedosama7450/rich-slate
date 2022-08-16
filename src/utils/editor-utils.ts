import {
  BasePoint,
  Editor,
  Element,
  Location,
  Range,
  Text,
  Transforms,
} from "slate";

import { CropData } from "overwind-ui";

import { ElementType, TextMark, ToggleableBlockType } from "../editor-types";

export const EditorUtils = {
  //-------------------------------------------
  // Blocks & Marks
  //-------------------------------------------

  isBlockActive(editor: Editor, type: ToggleableBlockType) {
    const [match] = Editor.nodes(editor, {
      match: (n) => Editor.isBlock(editor, n) && n.type === type,
    });
    return !!match;
  },

  toggleBlock(editor: Editor, type: ToggleableBlockType) {
    const isActive = this.isBlockActive(editor, type);
    const isList = this.isListType(type);

    Editor.withoutNormalizing(editor, () => {
      Transforms.setNodes(
        editor,
        {
          type: isActive ? "paragraph" : isList ? "list-item" : type,
        },
        { match: (n) => Editor.isBlock(editor, n) }
      );

      if (isList && !isActive) {
        Transforms.wrapNodes(editor, { type, children: [] });
      }
    });
  },

  isMarkActive(editor: Editor, mark: TextMark) {
    const [match] = Editor.nodes(editor, {
      match: (n) => Text.isText(n) && n[mark] === true,
      universal: true,
    });
    return !!match;
  },

  toggleMark(editor: Editor, mark: TextMark) {
    if (!editor.selection || Range.isCollapsed(editor.selection)) return;

    const isActive = this.isMarkActive(editor, mark);

    Transforms.setNodes(
      editor,
      {
        [mark]: isActive ? undefined : true,
      },
      {
        match: (n) => Text.isText(n),
        split: true,
      }
    );
  },

  //-------------------------------------------
  // Links
  //-------------------------------------------

  isLinkActive(editor: Editor) {
    const [match] = Editor.nodes(editor, {
      match: (n) => Element.isElement(n) && n.type === "link",
    });
    return !!match;
  },

  /**
   * You need to check that the selection is collapsed, first
   */
  insertLink(editor: Editor, url: string) {
    Transforms.insertNodes(editor, {
      type: "link",
      url,
      children: [{ text: url }],
    });
  },

  /**
   * You need to check that the selection is expanded, first
   * Nothing happens if there is already a link within the selection
   */
  turnIntoLink(editor: Editor, url: string, whereCursor: "middle" | "end") {
    if (!this.isLinkActive(editor)) {
      Transforms.wrapNodes(
        editor,
        {
          type: "link",
          url,
          children: [],
        },
        { split: true }
      );

      // Place cursor
      const selection = editor.selection;
      if (selection) {
        let point = Range.end(selection);

        if (whereCursor === "middle") {
          point = {
            path: point.path,
            offset: point.offset - Math.round(point.offset / 2),
          };
        }

        Transforms.select(editor, point);
      }
    }
  },

  /**
   * You need to check that the selection is collapsed, first. So, only one link is changed
   * Nothing happens if there is no link in the selection
   */
  changeLinkUrl(editor: Editor, url: string) {
    Transforms.setNodes(
      editor,
      { url },
      {
        match: (n) => Element.isElement(n) && n.type === "link",
      }
    );
  },

  /**
   * You must check isLinkActive before calling unlink
   */
  unlink(editor: Editor) {
    Transforms.unwrapNodes(editor, {
      match: (n) => Element.isElement(n) && n.type === "link",
      split: true,
    });

    // TODO Improvement: when range is expanded, we only want to unlink the selected part of the link, not the whole link element
    /* const selection = editor.selection!;
    if (Range.isCollapsed(selection)) {
      Transforms.unwrapNodes(editor, {
        match: (n) => Element.isElement(n) && n.type === "link",
      });
    } else {
      Editor.withoutNormalizing(editor, () => {
        Transforms.splitNodes(editor, {
          match: (n) => Element.isElement(n) && n.type === "link",
          at: selection.anchor,
          always: true,
        });
        Transforms.splitNodes(editor, {
          match: (n) => Element.isElement(n) && n.type === "link",
          at: selection.focus,
          always: true,
        });
        Transforms.unwrapNodes(editor, {
          match: (n) => Element.isElement(n) && n.type === "link",
          split: true,
          at: {
            anchor: { path: selection.anchor.path, offset: 0 },
            focus: { path: selection.focus.path, offset: 0 },
          },
        });
      });
    } */
  },

  toggleLink(editor: Editor, showLinkInput: () => void) {
    if (EditorUtils.isLinkActive(editor)) {
      EditorUtils.unlink(editor);
    } else {
      if (editor.selection && Range.isExpanded(editor.selection)) {
        showLinkInput();
      }
    }
  },

  //-------------------------------------------
  // Separator
  //-------------------------------------------

  insertSeparator(editor: Editor) {
    Editor.withoutNormalizing(editor, () => {
      // Remove empty paragraph
      const entry = this.getBlockAbove(editor);
      if (entry) {
        const [node, path] = entry;

        if (node.type === "paragraph" && Editor.isEmpty(editor, node)) {
          Transforms.removeNodes(editor, { at: path });
        }
      }

      Transforms.insertNodes(
        editor,
        [
          {
            type: "separator",
            children: [{ text: "" }],
          },
          { type: "paragraph", children: [{ text: "" }] },
        ],
        {
          match: (_, path) => path.length === 1,
        }
      );
    });
  },

  //-------------------------------------------
  // Images
  //-------------------------------------------
  insertImage(editor: Editor, src: string, cropData?: CropData) {
    Transforms.insertNodes(editor, {
      type: "image",
      src: src,
      cropData,
      children: [{ text: "" }],
    });
  },

  //-------------------------------------------
  // Others
  //-------------------------------------------

  getBlockAbove(editor: Editor) {
    return Editor.above<Element>(editor, {
      match: (n) => Editor.isBlock(editor, n),
    });
  },

  /**
   * @returns where point is relative to at
   */
  getEdge(
    editor: Editor,
    point: BasePoint,
    at: Location
  ): "start" | "end" | "unknown" {
    return Editor.isStart(editor, point, at)
      ? "start"
      : Editor.isEnd(editor, point, at)
      ? "end"
      : "unknown";
  },

  /**
   * unknown can mean that there is no selection at all, there is no block at all, or the selection is within the block or outside of it
   */
  getBlockSelectionEdge(editor: Editor): "unknown" | "start" | "end" {
    const selection = editor.selection;
    if (!selection) return "unknown"; // No selection

    const path = this.getBlockAbove(editor)?.[1];
    if (!path) return "unknown"; // No block above

    const focusEdge = EditorUtils.getEdge(editor, selection.focus, path);
    if (focusEdge === "unknown") {
      return Range.isCollapsed(selection)
        ? focusEdge
        : EditorUtils.getEdge(editor, selection.anchor, path);
    } else {
      return focusEdge;
    }
  },

  isListType(type: ElementType): type is "bulleted-list" | "numbered-list" {
    return type === "bulleted-list" || type === "numbered-list";
  },

  hasMarks(node: Text): boolean {
    return !!(node.bold || node.italic || node.code);
  },
};

/* markNodeMatch(editor: Editor, mark: TextMark): NodeMatch<Node> {
    return (node: Node, path: Path) => {
      if (Text.isText(node)) {
        const parent = Editor.parent(editor, path)[0];
        const isLink = Element.isElement(parent) && parent.type === "link";

        if (mark === "bold" || mark === "italic") {
          // Skip code and links (When applying bold and italic marks)
          return !isLink && !node.code;
        } else if (mark === "code") {
          // Skip links (when applying code mark)
          return !isLink;
        }
      }

      return false;
    };
  }, */

/* mark === "code" && !isActive // Applying code removes all other formatting
        ? {
            code: true,
            bold: undefined,
            italic: undefined,
          }
        : */

/*

  isImageUrl(url: string) {
    if (!isUrl(url)) return false;
    const ext = new URL(url).pathname.split(".").pop();
    return ext && imageExtensions.includes(ext);
  },

*/
