import classNames from "classnames";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { BaseSelection, Editor } from "slate";
import { ReactEditor, useSlate } from "slate-react";
import { PropsWithRequiredChildren } from "overwind-ui";

export const HoveringContainer = ({
  children,
  containerProps,

  placement,
  whereToShow,
}: {
  children: React.ReactNode | ((editor: Editor) => React.ReactNode);
  containerProps?: React.ComponentPropsWithoutRef<"div">;

  placement: "top" | "bottom";
  /**
   *  Called whenever the editor value changes
   *  @return null if you want to hide the container
   */
  whereToShow: (editor: Editor) => BaseSelection;
}) => {
  const editor = useSlate();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const placementSelection = whereToShow(editor);

    if (placementSelection) {
      const domRange = ReactEditor.toDOMRange(editor, placementSelection);
      const rect = domRange.getBoundingClientRect();

      container.style.opacity = "1";

      container.style.left = `${
        rect.left +
        window.pageXOffset -
        container.offsetWidth / 2 +
        rect.width / 2
      }px`;

      container.style.top =
        placement === "top"
          ? `${rect.top + window.pageYOffset - container.offsetHeight - 8}px`
          : `${rect.top + window.scrollY + rect.height + 6}px`;
    } else {
      if (container.hasAttribute("style")) container.removeAttribute("style");
    }
  });

  return (
    <ClientOnlyPortal>
      <div
        {...containerProps}
        ref={containerRef}
        onMouseDown={(e) => {
          // Preventing editor from losing focus
          e.preventDefault();
        }}
        className={classNames(
          containerProps?.className,
          "absolute top-[-10000px] left-[-10000px] z-50 opacity-0 transition duration-75"
        )}
      >
        {typeof children === "function" ? children(editor) : children}
      </div>
    </ClientOnlyPortal>
  );
};

export default function ClientOnlyPortal({
  children,
}: PropsWithRequiredChildren<{}>) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(typeof document === "object");
  }, []);

  return mounted ? createPortal(children, document.body) : null;
}
