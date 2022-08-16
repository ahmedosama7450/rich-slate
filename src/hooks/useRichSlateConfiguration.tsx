import { useContext } from "react";
import { RichSlateContext } from "../RichSlateProvider";

export const useRichSlateConfiguration = () => {
  return useContext(RichSlateContext);
};
