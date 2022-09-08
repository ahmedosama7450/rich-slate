import { RichSlate, RichSlateProvider, RichSlateToolbar } from "rich-slate";
import { initialValue } from "../utils/initial-value";

export const Editor = () => {
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
        <div className="mx-auto max-w-4xl rounded bg-white shadow">
          <div className="sticky top-0 z-40">
            <RichSlateToolbar
              className="flex-wrap rounded-t border border-gray-200 bg-gray-50 px-1 py-2"
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

          <div className="rounded-b border-b border-r border-l border-gray-200 py-3 px-3">
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
