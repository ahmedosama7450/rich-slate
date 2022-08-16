import classNames from "classnames";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ReactEditor,
  RenderElementProps,
  useFocused,
  useSelected,
  useSlateStatic,
} from "slate-react";
import { Transforms, Path } from "slate";
import Image from "next/image";
import {
  Button,
  IconButton,
  ImageCropperDialog,
  ImageCropperDialogProps,
  Tooltip,
} from "overwind-ui";

import { ImageElement } from "../editor-types";

export type ImageRendererProps = RenderElementProps & {
  i18n: {
    imageCropperTitles: ImageCropperDialogProps["titles"];
    insertParagraphText: string;
    editText: string;
  };
};

export const ImageRenderer = ({
  attributes,
  children,
  element,
  i18n: { insertParagraphText, editText, imageCropperTitles },
}: ImageRendererProps) => {
  const editor = useSlateStatic();
  const selected = useSelected();
  const focused = useFocused();

  const [naturalWidth, setNaturalWidth] = useState<number>(0);
  const [naturalHeight, setNaturalHeight] = useState<number>(0);

  const container = useRef<HTMLDivElement>(null);
  const scaledImageContainer = useRef<HTMLDivElement>(null);

  let finalCropData = (element as ImageElement).cropData;
  if (!finalCropData) {
    finalCropData = {
      x: 0,
      y: 0,
      width: naturalWidth,
      height: naturalHeight,
      scaleX: 1,
      scaleY: 1,
    };
  }

  const scaleImageContainer = useCallback(() => {
    if (!finalCropData || !container.current || !scaledImageContainer.current)
      return;

    const scaleX = container.current.offsetWidth / finalCropData.width;
    const scaleY = container.current.offsetHeight / finalCropData.height;

    scaledImageContainer.current.style.transform = `scale(${scaleX}, ${scaleY})`;

    /*
     translate(calc(${imageContainerScaleX - 1} * 50%), calc(${
      imageContainerScaleY - 1
    } * 50%)
     */
  }, [finalCropData]);

  useEffect(() => {
    const onResize = () => {
      scaleImageContainer();
    };

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [scaleImageContainer]);

  useEffect(() => {
    scaleImageContainer();
  });

  return (
    <div className="mx-5" {...attributes}>
      {/*
        - max-width: min(3 * n-width, 100%)
        - max-height: min(3 * n-height, 96tw)
        - ratio = n-width / n-height
        - If n-width is longer side
          -> width = max-width
          -> height = width / ratio
        - If n-height is longer side
          -> height = max-height
          -> width = height * ratio
        */}
      <div
        ref={container}
        className={classNames(
          "group relative my-5 mx-auto cursor-default bg-gray-200 ring-offset-white",
          selected && focused
            ? "ring-primary ring"
            : "hover:ring hover:ring-yellow-300"
        )}
        style={
          finalCropData
            ? {
                ...(finalCropData.width >= finalCropData.height
                  ? {
                      width: `min(${3 * finalCropData.width}px, 100%)`,
                    }
                  : {
                      height: `min(${3 * finalCropData.height}px, 24rem)`,
                    }),
                aspectRatio: `${finalCropData.width}/${finalCropData.height}`,
              }
            : undefined
        }
        contentEditable={false}
      >
        <div
          ref={scaledImageContainer}
          style={
            finalCropData
              ? { width: finalCropData.width, height: finalCropData.height }
              : undefined
          }
          className="relative h-full w-full origin-top-left"
        >
          <Image
            layout="fill"
            objectFit="none"
            objectPosition={
              finalCropData
                ? `${
                    finalCropData.scaleX === -1
                      ? -(naturalWidth - finalCropData.x - finalCropData.width)
                      : -finalCropData.x
                  }px ${
                    finalCropData.scaleY === -1
                      ? -(
                          naturalHeight -
                          finalCropData.y -
                          finalCropData.height
                        )
                      : -finalCropData.y
                  }px`
                : undefined
            }
            onLoadingComplete={({ naturalWidth, naturalHeight }) => {
              setNaturalWidth(naturalWidth);
              setNaturalHeight(naturalHeight);
            }}
            src={(element as ImageElement).src}
            className={classNames({
              "-scale-x-100": finalCropData && finalCropData.scaleX === -1,
              "-scale-y-100": finalCropData && finalCropData.scaleY === -1,
            })}
            alt="Image in editor"
          />
        </div>

        <IconButton
          className={classNames(
            "absolute top-0 right-0 m-1 opacity-100 transition-opacity",
            {
              "hidden opacity-0": !selected || !focused,
            }
          )}
          type="button"
          iconProps={{ icon: "ri:delete-bin-line", size: "sm" }}
          bgColor="overlay"
          color="white"
          innerProps={{
            onMouseDown: (e: React.MouseEvent<HTMLButtonElement>) => {
              e.preventDefault();
            },
          }}
          onClick={(e) => {
            e.preventDefault();
            Transforms.removeNodes(editor, {
              at: ReactEditor.findPath(editor, element),
            });
          }}
        />

        <ImageCropperDialog
          titles={imageCropperTitles}
          onCropped={async ({ src, cropData }) => {
            Transforms.setNodes(
              editor,
              {
                src,
                cropData,
              },
              {
                at: ReactEditor.findPath(editor, element),
              }
            );
          }}
        >
          {(ds) => (
            <Button
              className={classNames(
                "absolute bottom-0 left-0 m-1 block opacity-100 transition-opacity",
                {
                  "hidden opacity-0": !selected || !focused,
                }
              )}
              type="button"
              flat
              size="xs"
              roundedFull
              color="overlay"
              innerProps={{
                onMouseDown: (e: React.MouseEvent<HTMLButtonElement>) => {
                  e.preventDefault();
                },
              }}
              onClick={(e) => {
                e.preventDefault();
                const { src, cropData } = element as ImageElement;

                ds.resultDataHandler?.setResultData({
                  src,
                  cropData,
                });
                ds.toggle();
              }}
            >
              {editText}
            </Button>
          )}
        </ImageCropperDialog>

        <Tooltip content={insertParagraphText}>
          <IconButton
            className={classNames(
              "absolute top-0 left-0 ml-14 -mt-3 transition-opacity",
              selected && focused
                ? "block opacity-100"
                : "hidden opacity-0 group-hover:block group-hover:bg-yellow-300 group-hover:opacity-100"
            )}
            type="button"
            iconProps={{ icon: "dashicons:editor-break", size: "xs" }}
            bgColor="primary"
            color="white"
            innerProps={{
              onMouseDown: (e: React.MouseEvent<HTMLButtonElement>) => {
                e.preventDefault();
              },
            }}
            onClick={(e) => {
              e.preventDefault();
              Transforms.insertNodes(
                editor,
                {
                  type: "paragraph",
                  children: [{ text: "" }],
                },
                {
                  at: ReactEditor.findPath(editor, element),
                  select: true,
                }
              );
            }}
          />
        </Tooltip>

        <Tooltip content={insertParagraphText} placement="bottom">
          <IconButton
            className={classNames(
              "absolute bottom-0 right-0 mr-14 -mb-3 transition-opacity",
              selected && focused
                ? "block opacity-100"
                : "hidden opacity-0 group-hover:block group-hover:bg-yellow-300 group-hover:opacity-100"
            )}
            type="button"
            iconProps={{ icon: "dashicons:editor-break", size: "xs" }}
            bgColor="primary"
            color="white"
            innerProps={{
              onMouseDown: (e: React.MouseEvent<HTMLButtonElement>) => {
                e.preventDefault();
              },
            }}
            onClick={(e) => {
              e.preventDefault();
              Transforms.insertNodes(
                editor,
                {
                  type: "paragraph",
                  children: [{ text: "" }],
                },
                {
                  at: Path.next(ReactEditor.findPath(editor, element)),
                  select: true, // TODO This doesn't do anything, I am not sure why
                }
              );
            }}
          />
        </Tooltip>
      </div>
      {children}
    </div>
  );
};
