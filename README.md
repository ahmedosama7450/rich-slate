# Rich Slate

Opinionated rich text editor based on [slate](https://docs.slatejs.org/api/transforms) framework

**Slate** is a completely customizable framework for building rich text editors. **Rich Slate** builds on top of it to abstract away all of the complexity. We don't provide much customization now but we will in the future.

> **Rich Slate is still under development and not ready for production yet due to lack of tests and customizations. See [roadmap](#Roadmap)**

## Playground

Experiment with the editor in the [playground](https://rich-slate.vercel.app/) which includes all currently supported features

## Installation

**Rich Slate** requires [overwind-ui](https://github.com/ahmedosama7450/overwind-ui) as a peer dependency. So, you need to install and configure it first. (_We intend to remove this dependence in the future_)

Assuming that `overwind-ui` is installed

1. Install dependencies

```bash
npm install rich-slate slate slate-react slate-history
```

2. Add `rich-slate` types. This is kind of strange but It's needed to make everything type-safe

In your `tsconfig.json`, add the following

```json
{
  "compilerOptions": {
    "typeRoots": ["./node_modules/@types", "./node_modules/rich-slate/dist"]
  }
}
```

3. Add `rich-slate` tailwind preset and tell tailwind to compile the classes used in the library.

> Note that we don't compile tailwind classes ourselves because we assume that you are using tailwind in your project and so, this prevents generating duplicate classes.

```js
// tailwind.config.js
module.exports = {
  presets: [require("rich-slate/tailwind"), require("overwind-ui/tailwind")],

  content: [
    "./node_modules/overwind-ui/**/*.{js,ts,jsx,tsx}",
    "./node_modules/rich-slate/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
};
```

You should have `@tailwindcss/typography` installed because It's present in the plugins list of the tailwind preset.

## Usage

There are three main components exported

`RichSlateProvider`

This is where you set editor initial value and provide customizations

`RichSlateToolbar`

This renders toolbar components. You can customize it using `className` prop

`RichSlate`

This renders the editor itself

**Complete example**

```typescript
import { RichSlate, RichSlateProvider, RichSlateToolbar } from "rich-slate";
import { initialValue } from "../utils/initial-value";

export const EditorExample = () => {
  return (
    <RichSlateProvider
      initialValue={initialValue}
      configuration={{
        multipleHeadings: true,
        separator: true,
        images: true,
      }}
    >
      <div className="mx-4 sm:mx-8">
        <div className="mx-auto max-w-4xl rounded-sm bg-white shadow">
          <div className="sticky top-0 z-40">
            <RichSlateToolbar
              className="flex-wrap rounded-t-sm border border-gray-200 bg-gray-50 px-1 py-2"
              i18n={{
                bulletedList: "Bulleted List",
                numberedList: "Numbered List",
                codeBlock: "Code Block",
                image: "Image",
                heading: "Heading",
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
      </div>
    </RichSlateProvider>
  );
};
```

## Roadmap

- [ ] Add tests
- [ ] Remove dependence on [overwind-ui](https://github.com/ahmedosama7450/overwind-ui)
- [ ] More customizations over editor features
- [ ] Other rich text features
  - [ ] Mentions
  - [ ] Math expressions using [KaText](https://katex.org/)
  - [ ] Image caption/toolbar/resize/align
  - [ ] Code block highlight
  - [ ] Paste from word/html
  - [ ] Markdown mode
  - [ ] More markdown shortcuts for inline formatting: code, bold, italic
  - [ ] More inline formatting options: underline, strike-through, superscript, subscript, highlight, remove format(mod + d)
  - [ ] Advanced spell checking (suggest changes)
  - [ ] Word/line count
  - [ ] Private comments
  - [ ] Drag and drop blocks
  - [ ] Auto saving
  - [ ] Emojis
  - [ ] Alignment
  - [ ] Indenting
  - [ ] Embeds
  - [ ] Videos
  - [ ] tables
  - [ ] TOC
  - [ ] Draw electrical circuits, special shapes

## License

MIT
