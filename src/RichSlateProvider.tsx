import { createContext } from "react";
import { createEditor, Descendant } from "slate";
import { withHistory } from "slate-history";
import { Slate, withReact } from "slate-react";
import { PropsWithRequiredChildren, PropsWithState } from "overwind-ui";

import {
  withBlocks,
  withLinks,
  withLists,
  withMarkdownShortcuts,
  withMarks,
  withSeparator,
  withTrailingBlock,
  withImages,
  withVoids,
} from "./plugins";
import { useConstant } from "./hooks";

export type RichSlateConfiguration = {
  multipleHeadings: boolean;
  separator: boolean;
  images: boolean;
};

export const RichSlateContext = createContext<RichSlateConfiguration>({
  multipleHeadings: false,
  separator: false,
  images: false,
});

export type RichSlateProviderProps = PropsWithState<
  Descendant[],
  PropsWithRequiredChildren<{
    configuration: RichSlateConfiguration;
  }>
>;

export const RichSlateProvider = ({
  children,

  value,
  onChange: setValue,

  configuration,
}: RichSlateProviderProps) => {
  const editor = useConstant(() => {
    let plugins = withBlocks(
      withMarks(
        withTrailingBlock(
          withMarkdownShortcuts(
            withLinks(withLists(withHistory(withReact(createEditor()))))
          )
        )
      )
    );

    if (configuration.separator) {
      plugins = withSeparator(plugins);
    }

    if (configuration.images) {
      plugins = withImages(plugins);
    }

    if (configuration.separator || configuration.images) {
      plugins = withVoids(plugins);
    }

    return plugins;
  });

  // TODO I am not sure which one to use, useMemo vs useConstant. needs more research
  /* const editor = useMemo(// Code here, [configuration.images, configuration.separator]); */

  return (
    <Slate
      editor={editor}
      value={value}
      onChange={(newValue) => {
        setValue(newValue);
      }}
    >
      <RichSlateContext.Provider value={configuration}>
        {children}
      </RichSlateContext.Provider>
    </Slate>
  );
};
