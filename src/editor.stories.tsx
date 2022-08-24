import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Descendant } from "slate";
import { RichSlate, RichSlateProvider, RichSlateToolbar } from "./main";

export default {
  title: "Example Editor",
  component: RichSlate,
} as ComponentMeta<typeof RichSlate>;

export const Example: ComponentStory<typeof RichSlate> = (args) => {
  return (
    <RichSlateProvider
      initialValue={initialValue}
      configuration={{ images: true, multipleHeadings: true, separator: true }}
    >
      <div className="mx-auto max-w-4xl rounded-sm bg-white shadow">
        <div className="sticky top-0 z-40">
          <RichSlateToolbar
            className="rounded-t-sm border border-gray-200 bg-gray-50 px-1 py-1"
            i18n={{
              bulletedList: "Bulleted List",
              numberedList: "Numbered List",
              codeBlock: "Code Block",
              heading: "Heading",
              image: "Image",
              heading1: "Heading1",
              heading2: "Heading2",
              heading3: "Heading3",
              quote: "Quote",
              redo: "Redo",
              undo: "Undo",
              separator: "Separator",
              imagePickerTitles: {
                apply: "Apply",
                cancel: "Cancel",
                noneAspectRatio: "None",
                squareAspectRatio: "Square",
                title: "Pick Image",
                wideAspectRatio: "Wide",
              },
            }}
          />
        </div>

        <div className="rounded-b-sm border-b border-r border-l border-gray-200 py-3 px-3">
          <RichSlate
            className="min-h-[calc(100vh-32px-var(--navbar-height)-var(--navbar-margin-bottom))]"
            i18n={{
              balloonToolbarI18n: {
                boldTooltip: "Bold",
                codeTooltip: "Code",
                italicTooltip: "Italic",
                linkTooltip: "Link",
              },
              linkToolbarI18n: { editLink: "Edit Link", unlink: "Unlink" },
              linkInputI18n: {
                linkInputApply: "Apply",
                linkInputCancel: "Cancel",
                linkInputPlaceholder: "Enter a link",
              },
              imageRendererI18n: {
                editText: "Edit",
                insertParagraphText: "Insert paragraph",
                imageCropperTitles: {
                  apply: "Apply",
                  cancel: "Cancel",
                  noneAspectRatio: "None",
                  squareAspectRatio: "Square",
                  title: "Pick Image",
                  wideAspectRatio: "Wide",
                },
              },
            }}
          />
        </div>
      </div>
    </RichSlateProvider>
  );
};

const initialValue: Descendant[] = [
  {
    type: "heading2",
    children: [
      {
        text: "What to expect",
      },
    ],
  },
  /*   {
    type: "image",
    src: "https://www.industrialempathy.com/img/remote/ZiClJf-1920w.jpg",
    children: [{ text: "" }],
  }, */
  {
    type: "bulleted-list",
    children: [
      {
        type: "list-item",
        children: [
          {
            text: "ahmed",
          },
        ],
      },
      {
        type: "list-item",
        children: [
          {
            text: "osama",
          },
        ],
      },
      {
        type: "list-item",
        children: [
          {
            text: "mohamed",
          },
        ],
      },
    ],
  },
  {
    type: "paragraph",
    children: [
      {
        text: "Well, there is more to think ",
      },
      {
        type: "link",
        url: "https://docs.slatejs.org/api/nodes/editor#check-methods",
        children: [
          {
            text: "about",
          },
        ],
      },
      {
        text: "",
      },
    ],
  },
  {
    type: "paragraph",
    children: [
      {
        text: "Let me tell you more about this, when I was investigating this problem with one my colleagues, he found something interesting:",
      },
    ],
  },
  {
    type: "quote",
    children: [
      {
        text: "How would you ever stop this ?",
      },
    ],
  },
  {
    type: "paragraph",
    children: [
      {
        text: "That was pretty interesting to me and I thought about it unstoppably and interestingly enough, I reached a somewhat good answer and this answer goes like this:",
      },
    ],
  },
  {
    type: "numbered-list",
    children: [
      {
        type: "list-item",
        children: [
          {
            text: "Don't think much",
          },
        ],
      },
      {
        type: "list-item",
        children: [
          {
            text: "Just do It",
          },
        ],
      },
      {
        type: "list-item",
        children: [
          {
            text: "repeat from 1 to 2",
          },
        ],
      },
    ],
  },
  {
    type: "paragraph",
    children: [
      {
        text: "And this is how the problem has bee eliminated for me",
      },
    ],
  },
];

/* "px-1.5": structure === "main", */
/* "borer-b rounded-b border-r border-l border-gray-100 px-3":
                            structure === "secondary", */
