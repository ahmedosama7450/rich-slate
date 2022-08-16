import classNames from "classnames";
import { RenderElementProps, useFocused, useSelected } from "slate-react";

export const SeparatorRenderer = ({
  attributes,
  children,
}: RenderElementProps) => {
  const selected = useSelected();
  const focused = useFocused();

  return (
    <div
      {...attributes}
      style={{
        paddingTop: "1.5rem",
        paddingBottom: "1.5rem",
      }}
      className={classNames(
        "cursor-default ring-offset-4 ring-offset-white",
        selected && focused
          ? "ring-primary ring-2"
          : "hover:ring-2 hover:ring-yellow-300"
      )}
    >
      {children}
      <div contentEditable={false}>
        <hr
          style={{
            marginTop: 0,
            marginBottom: 0,
            paddingTop: 0,
            paddingBottom: 0,
          }}
        />
      </div>
    </div>
  );
};
