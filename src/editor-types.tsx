import { BaseEditor, Text, Element } from "slate";
import { HistoryEditor } from "slate-history";
import { ReactEditor } from "slate-react";
import { CropData } from "overwind-ui";

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor;

    Element:
      | ParagraphElement
      | Heading1Element
      | Heading2Element
      | Heading3Element
      | QuoteElement
      | CodeBlockElement
      | BulletedListElement
      | NumberedListElement
      | ListItemElement
      | LinkElement
      | SeparatorElement
      | ImageElement;

    Text: {
      text: string;
    } & { [key in TextMark]?: boolean };
  }
}

export type TextMark = "bold" | "italic" | "code";

export type InlineNode = Text | LinkElement; // Need to be updated if more inline elements are added

export type ParagraphElement = {
  type: "paragraph";
  children: InlineNode[];
};

export type Heading1Element = {
  type: "heading1";
  children: InlineNode[];
};

export type Heading2Element = {
  type: "heading2";
  children: InlineNode[];
};

export type Heading3Element = {
  type: "heading3";
  children: InlineNode[];
};

export type QuoteElement = {
  type: "quote";
  children: InlineNode[];
};

export type CodeBlockElement = {
  type: "code-block";
  children: InlineNode[];
};

export type ListItemElement = {
  type: "list-item";
  children: InlineNode[];
};

export type BulletedListElement = {
  type: "bulleted-list";
  children: ListItemElement[];
};

export type NumberedListElement = {
  type: "numbered-list";
  children: ListItemElement[];
};

export type SeparatorElement = {
  type: "separator";
  children: Text[];
};

export type LinkElement = { type: "link"; url: string; children: Text[] };

export type ImageElement = {
  type: "image";
  src: string;
  cropData?: CropData;
  children: Text[];
};

/* export type MentionElement = {
  type: "mention";
  name: string;
  children: PlainText[];
};
 */

//-------------------------------------------
// Other types
//-------------------------------------------

export type ElementType = Element["type"];

export type ListType = Extract<ElementType, "bulleted-list" | "numbered-list">;

export type BlockType = Exclude<ElementType, "link">;

/**
 * Blocks that can be toggled to and from paragraph
 * list-item doesn't tell about the type we need to toggle into (bulleted/numbered)
 * separator is probably better to be removed manually
 */
export type ToggleableBlockType = Exclude<BlockType, "list-item" | "separator">;

/**
 * Blocks that have no wrappers
 */
export type DirectBlockType = Exclude<
  BlockType,
  "bulleted-list" | "numbered-list"
>;
