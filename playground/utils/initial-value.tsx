import { Descendant } from "slate";

export const initialValue: Descendant[] = [
  {
    type: "heading1",
    children: [
      {
        text: "Rich Slate",
      },
    ],
  },
  {
    type: "paragraph",
    children: [
      {
        text: "Rich Slate is an opinionated ",
      },
      {
        text: "rich text editor",
        bold: true,
      },
      {
        text: " on top of ",
      },
      {
        type: "link",
        url: "https://docs.slatejs.org/",
        children: [
          {
            text: "slate",
          },
        ],
      },
      {
        text: " framework. Slate is a ",
      },
      {
        text: "completely customizable",
        italic: true,
      },
      {
        text: " framework for building rich text editors. ",
      },
      {
        text: "Rich Slate",
        bold: true,
      },
      {
        text: " builds on top of it to abstact away all of the complexity. We don't provide much customization now but we will in the future.",
      },
    ],
  },
  {
    type: "heading2",
    children: [
      {
        text: "Currently supported features",
      },
    ],
  },
  {
    type: "paragraph",
    children: [
      {
        text: "We support the most common rich text editing features but there is a lot more coming. Let's look at a frew of them here",
      },
    ],
  },
  {
    type: "heading3",
    children: [
      {
        text: "Rich blocks",
      },
    ],
  },
  {
    type: "paragraph",
    children: [
      {
        text: "These include headings, code blocks, quotes, bulleted lists and numbered lists",
      },
    ],
  },
  {
    type: "quote",
    children: [
      {
        text: "If you don't like where you are, move you're not a tree.\nQuotes can be muti-line. To break out, press ",
      },
      {
        text: "ctrl+enter",
        code: true,
      },
    ],
  },
  {
    type: "paragraph",
    children: [
      {
        text: "Here is a code block",
      },
    ],
  },
  {
    type: "code-block",
    children: [
      {
        text: "boolean works = true;\nif(works) {\n   soundsGood();\n}",
      },
    ],
  },
  {
    type: "paragraph",
    children: [
      {
        text: "Lists are essential blocks",
      },
    ],
  },
  {
    type: "bulleted-list",
    children: [
      {
        type: "list-item",
        children: [
          {
            text: "That's true",
          },
        ],
      },
      {
        type: "list-item",
        children: [
          {
            text: "I use them all the time",
          },
        ],
      },
      {
        type: "list-item",
        children: [
          {
            text: "especially bulleted lists",
          },
        ],
      },
    ],
  },
  {
    type: "paragraph",
    children: [
      {
        text: "Numbered lists are also usefull",
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
            text: "Am I right ?",
          },
        ],
      },
      {
        type: "list-item",
        children: [
          {
            text: "You can use them, too",
          },
        ],
      },
    ],
  },
  {
    type: "heading3",
    children: [
      {
        text: "Advanced blocks",
      },
    ],
  },
  {
    type: "paragraph",
    children: [
      {
        text: "These include separators and images",
      },
    ],
  },
  {
    type: "paragraph",
    children: [
      {
        text: "Here is an image. You can crop the image before and after you add it.",
      },
    ],
  },
  {
    type: "image",
    src: "/example.jpg",
    children: [
      {
        text: "",
      },
    ],
  },
  {
    type: "paragraph",
    children: [
      {
        text: "Let's end with a ",
      },
      {
        text: "separator",
        bold: true,
      },
    ],
  },
  {
    type: "separator",
    children: [
      {
        text: "",
      },
    ],
  },
  {
    type: "heading3",
    children: [
      {
        text: "Inline marks",
      },
    ],
  },
  {
    type: "paragraph",
    children: [
      {
        text: "There include ",
      },
      {
        text: "bold",
        bold: true,
      },
      {
        text: ", ",
      },
      {
        text: "italic",
        italic: true,
      },
      {
        text: ", ",
      },
      {
        text: "code",
        code: true,
      },
      {
        text: " and ",
      },
      {
        type: "link",
        url: "www.google.com",
        children: [
          {
            text: "links",
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
        text: "You can't make code text as bold or italic but It can be a ",
      },
      {
        type: "link",
        url: "www.google.com",
        children: [
          {
            text: "link",
            code: true,
          },
        ],
      },
      {
        text: ". That makes sense, right ?",
      },
    ],
  },
  {
    type: "heading3",
    children: [
      {
        text: "Markdown shortcuts",
      },
    ],
  },
  {
    type: "paragraph",
    children: [
      {
        text: "For example: To add a heading, type # then a space. Same goes for quotes, code blocks, lists which have their common shortcuts.",
      },
    ],
  },
  {
    type: "paragraph",
    children: [
      {
        text: "We have more coming!",
      },
    ],
  },
];
