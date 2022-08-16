import { RenderLeafProps } from "slate-react";
import classNames from "classnames";

export const renderLeaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  if (leaf.code) {
    children = <code>{children}</code>;
  } else {
    if (leaf.bold) {
      children = <strong>{children}</strong>;
    }

    if (leaf.italic) {
      children = <em>{children}</em>;
    }
  }

  return (
    <span
      className={classNames({
        // @ts-ignore
        "bg-[#ACCEF7]": leaf.selectionHighlight,
      })}
      {...attributes}
    >
      {children}
    </span>
  );
};
