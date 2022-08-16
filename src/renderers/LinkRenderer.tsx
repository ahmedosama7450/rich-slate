import classNames from "classnames";
import { RenderElementProps, useFocused, useSelected } from "slate-react";

import { LinkElement } from "../editor-types";

export const LinkRenderer = ({
  attributes,
  children,
  element,
}: RenderElementProps) => {
  const selected = useSelected();
  const focused = useFocused();

  return (
    <a
      {...attributes}
      href={(element as LinkElement).url}
      className={classNames("hover:text-primary-700", {
        "bg-primary-50": selected && focused,
      })}
    >
      {children}
    </a>
  );
};
