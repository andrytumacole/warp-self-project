import {
  MutableRefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Quill, { QuillOptions, Delta, Op } from "quill";
import "quill/dist/quill.snow.css";

import Image from "next/image";
import { Button } from "../ui/button";
import { PiTextAa } from "react-icons/pi";
import { ImageIcon, Smile, XIcon } from "lucide-react";
import { MdSend } from "react-icons/md";
import Hint from "../global/tooltip";
import { cn } from "@/lib/utils";
import EmojiPopover from "./emoji-popover";

type EditorValue = {
  image: File | null;
  body: string;
};

interface EditorProps {
  variant?: "create" | "update";
  onSubmit: ({ image, body }: EditorValue) => void;
  onCancel?: () => void;
  placeholder?: string;
  defaultValue?: Delta | Op[];
  disabled?: boolean;
  innerRef?: MutableRefObject<Quill | null>;
}

function Editor(props: Readonly<EditorProps>) {
  const {
    variant,
    onSubmit,
    onCancel,
    placeholder = "Write something here...",
    defaultValue = [],
    disabled = false,
    innerRef,
  } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const [text, setText] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [isToolbarVisible, setIsToolbarVisible] = useState(true);

  //use own refs for this so that no need rerender
  //the main reason for using refs is these values are being used
  //inside the useEffect and we don't want to trigger rerenders
  const submitRef = useRef(onSubmit);
  const placeholderRef = useRef(placeholder);
  const quillRef = useRef<Quill | null>(null);
  const defaultValueRef = useRef(defaultValue);
  const disabledRef = useRef(disabled);
  const cancelRef = useRef(onCancel);

  //extract the image from here inside the useEffect
  //ref because we don't want to rerender when adding image
  const imageElementRef = useRef<HTMLInputElement>(null);

  //set the values before browser paints
  useLayoutEffect(() => {
    submitRef.current = onSubmit;
    cancelRef.current = onCancel;
    placeholderRef.current = placeholder;
    defaultValueRef.current = defaultValue;
    disabledRef.current = disabled;
  });

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const editorContainer = container.appendChild(
      container.ownerDocument.createElement("div")
    );
    const options: QuillOptions = {
      theme: "snow",
      placeholder: placeholderRef.current,
      modules: {
        //specify what is shown in the toolbar
        //each array item means group or section
        toolbar: [
          ["bold", "italic", "strike"],
          ["link"],
          [{ list: "ordered" }, { list: "bullet" }],
        ],
        //bind "Enter" keyboard press to the handler
        keyboard: {
          bindings: {
            enter: {
              key: "Enter",
              handler: async () => {
                const text = quill.getText();
                const addedImage = imageElementRef.current?.files?.[0] ?? null;
                const isEmpty =
                  !addedImage &&
                  text.replace(/<(.|\n)*?>/g, "").trim().length === 0;
                if (isEmpty) return;

                const body = JSON.stringify(quill.getContents());
                await submitRef.current?.({ body: body, image: addedImage });
                cancelRef.current?.();
              },
            },
          },
        },
      },
    };

    const quill = new Quill(editorContainer, options);

    //now the quill object can be used outside the useEffect through the reference
    quillRef.current = quill;
    quillRef.current.focus();

    if (innerRef) {
      //since this innerRef ref comes from the parent component
      //the parent component also has control over the quill functions
      innerRef.current = quill;
    }

    quill.setContents(defaultValueRef.current);
    setText(quill.getText());

    //listener for text change on the quill component
    quill.on(Quill.events.TEXT_CHANGE, () => {
      setText(quill.getText());
    });

    return () => {
      quill.off(Quill.events.TEXT_CHANGE);
      if (container) {
        container.innerHTML = "";
      }
      if (quillRef.current) {
        quillRef.current = null;
      }

      if (innerRef) {
        innerRef.current = null;
      }
    };
  }, [innerRef]);

  function handleToggleToolbar() {
    setIsToolbarVisible((i) => !i);
    const toolbarElement = containerRef.current?.querySelector(".ql-toolbar");

    if (toolbarElement) {
      toolbarElement.classList.toggle("hidden");
    }
  }

  function onEmojiSelect(emoji: { native: string }) {
    const quill = quillRef.current;

    //add the emoji on the last line of the quill
    quill?.insertText(quill?.getSelection()?.index ?? 0, emoji.native);
  }

  //updated when text changes, and text changes when the quill ref TEXT_CHANGE event fires off
  const isEmpty = !image && text.replace(/<(.|\n)*?>/g, "").trim().length === 0;

  return (
    <div className="flex flex-col">
      <input
        type="file"
        accept="image/*"
        ref={imageElementRef}
        onChange={(event) => {
          setImage(event.target.files![0]);
        }}
        className="hidden"
      />
      <div
        className={cn(
          "flex flex-col border border-slate-200 rounded-md overflow-hidden focus-within:border-slate-300 focus-within:shadow-sm transition bg-white",
          disabled && "opacity-50"
        )}
      >
        <div ref={containerRef} className="h-full" />
        {!!image && (
          <div className="p-2">
            <div className="relative size-[62px] flex items-center justify-center group">
              <Hint label="Remove image">
                <button
                  onClick={() => {
                    setImage(null);
                    imageElementRef.current!.value = "";
                  }}
                  className="hidden group-hover:flex rounded-full bg-black/70 hover:bg-black absolute -top-2.5 -right-2.5 text-white size-6 z-[4] border-2 border-white items-center justify-center"
                >
                  <XIcon className="size-3.5" />
                </button>
              </Hint>
              <Image
                src={URL.createObjectURL(image)}
                alt="Uploaded"
                fill
                className="rounded-xl overflow-hidden border object-cover"
              />
            </div>
          </div>
        )}
        <div className="flex px-2 pb-2 z-[5] items-center">
          <Hint
            label={isToolbarVisible ? "Hide formatting" : "Show formatting"}
          >
            <Button
              disabled={disabled}
              size={"iconSm"}
              variant={"ghost"}
              onClick={handleToggleToolbar}
            >
              <PiTextAa />
            </Button>
          </Hint>

          <Hint label="Emoji">
            <EmojiPopover onEmojiSelect={onEmojiSelect}>
              <Button disabled={disabled} size={"iconSm"} variant={"ghost"}>
                <Smile />
              </Button>
            </EmojiPopover>
          </Hint>

          {variant === "create" && (
            <>
              <Hint label="Image">
                <Button
                  disabled={disabled}
                  size={"iconSm"}
                  variant={"ghost"}
                  onClick={() => imageElementRef.current?.click()}
                >
                  <ImageIcon />
                </Button>
              </Hint>
              <Button
                disabled={disabled || isEmpty}
                onClick={() =>
                  onSubmit({
                    body: JSON.stringify(quillRef.current?.getContents()),
                    image,
                  })
                }
                className={cn(
                  "ml-auto p-3",
                  isEmpty
                    ? "bg-slate-300 text-muted-foreground"
                    : "bg-slate-800 hover:bg-slate-800/80 text-white"
                )}
              >
                Send
                <MdSend />
              </Button>
            </>
          )}

          {variant === "update" && (
            <div className="ml-auto flex items-center gap-x-2">
              <Button
                className=" bg-white hover:bg-white text-black"
                variant={"outline"}
                size={"sm"}
                disabled={disabled}
                onClick={onCancel}
              >
                Cancel
              </Button>
              <Button
                className=" bg-slate-800 hover:bg-slate-800/80 text-white hover:text-white"
                variant={"outline"}
                size={"sm"}
                disabled={disabled || isEmpty}
                onClick={() =>
                  onSubmit({
                    body: JSON.stringify(quillRef.current?.getContents()),
                    image,
                  })
                }
              >
                Save
              </Button>
            </div>
          )}
        </div>
      </div>
      {variant === "create" && (
        <div
          className={cn(
            "p-2 text-[10px] text-muted-foreground flex justify-end opacity-0 transition",
            !isEmpty && "opacity-100"
          )}
        >
          <p>
            <strong>Shift + Return</strong> to add a new line
          </p>
        </div>
      )}
    </div>
  );
}

export default Editor;
