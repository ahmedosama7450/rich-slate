import Tippy from "@tippyjs/react";
import { useState } from "react";
import { Editor, Element, Range } from "slate";
import { ReactEditor } from "slate-react";

import { HoveringContainer } from "./HoveringContainer";
import { EditorUtils } from "../utils/editor-utils";
import { ToolbarButton } from "./ToolbarButton";

export const LinkToolbar = ({
  showLinkInput,
  i18n,
}: {
  showLinkInput: () => void;
  i18n: { editLink: string; unlink: string };
}) => {
  const [url, setUrl] = useState<string>(""); // TODO Calling setUrl inside useEffect is dangerous, though

  return (
    <HoveringContainer
      whereToShow={(editor) => {
        const selection = editor.selection;

        if (
          !selection ||
          !ReactEditor.isFocused(editor) ||
          Range.isExpanded(selection)
        ) {
          setUrl("");
          return null;
        } else {
          const nodeEntry = Editor.above<Element>(editor, {
            match: (n) => Element.isElement(n),
          });

          if (nodeEntry && nodeEntry[0].type === "link") {
            setUrl(nodeEntry[0].url);
            return selection;
          } else {
            setUrl("");
            return null;
          }
        }
      }}
      placement="bottom"
    >
      <div className="flex items-center gap-0.5 px-3 py-3 bg-white border rounded-sm shadow-sm">
        <Tippy content={url} placement="bottom">
          <a
            href={url}
            className="block text-sm mr-0.5 truncate text-link max-w-[200px] hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            {url}
          </a>
        </Tippy>

        <ToolbarButton
          tooltip={i18n["editLink"]}
          listener={() => {
            showLinkInput();
          }}
          tooltipPlacement="bottom"
          icon="ri:link"
        />

        <ToolbarButton
          tooltip={i18n["unlink"]}
          listener={(editor) => {
            if (EditorUtils.isLinkActive(editor)) {
              EditorUtils.unlink(editor);
            }
          }}
          tooltipPlacement="bottom"
          icon="ri:link-unlink"
        />
      </div>
    </HoveringContainer>
  );
};
