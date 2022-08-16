import { Editor } from "slate";

export const withImages = (editor: Editor) => {
  const { isVoid } = editor;

  editor.isVoid = (element) => {
    return element.type === "image" ? true : isVoid(element);
  };

  return editor;
};

/*
editor.insertData = (data) => {
    const text = data.getData("text/plain");
    const { files } = data;

    if (files && files.length > 0) {
      for (const file of files) {
        const reader = new FileReader();
        const [mime] = file.type.split("/");

        if (mime === "image") {
          reader.addEventListener("load", () => {
            const url = reader.result;
            EditorUtils.insertImage(editor, url);
          });

          reader.readAsDataURL(file);
        }
      }
    } else if (EditorUtils.isImageUrl(text)) {
      EditorUtils.insertImage(editor, text);
    } else {
      insertData(data);
    }
  };
*/
