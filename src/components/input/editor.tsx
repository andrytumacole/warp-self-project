import {
  MutableRefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Quill, { QuillOptions, Delta, Op } from "quill";
import "quill/dist/quill.snow.css";

import { Button } from "../ui/button";
import { PiTextAa } from "react-icons/pi";
import { ImageIcon, Smile } from "lucide-react";
import { MdSend } from "react-icons/md";
import Hint from "../global/tooltip";
import { cn } from "@/lib/utils";

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
    placeholder = "Write something here...",
    defaultValue = [],
    disabled = false,
    innerRef,
  } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const [text, setText] = useState("");

  //use own refs for this so that no need rerender
  //the main reason for using refs is these values are being used
  //inside the use effect and we don't want to trigger rerenders
  const submitRef = useRef(onSubmit);
  const placeholderRef = useRef(placeholder);
  const quillRef = useRef<Quill | null>(null);
  const defaultValueRef = useRef(defaultValue);
  const disabledRef = useRef(disabled);

  //set the values before browser paints
  useLayoutEffect(() => {
    submitRef.current = onSubmit;
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
              handler: () => {
                console.log("enter pressed");
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

  //updated when text changes, and text changes when the quill ref TEXT_CHANGE event fires off
  const isEmpty = text.replace(/<(.|\n)*?>/g, "").trim().length === 0;

  return (
    <div className="flex flex-col">
      <div className="flex flex-col border border-slate-200 rounded-md overflow-hidden focus-within:border-slate-300 focus-within:shadow-sm transition bg-white">
        <div ref={containerRef} className="h-full" />
        <div className="flex px-2 pb-2 z-[5] items-center">
          <Hint label="Hide formatting">
            <Button
              disabled={false}
              size={"iconSm"}
              variant={"ghost"}
              onClick={() => {}}
            >
              <PiTextAa />
            </Button>
          </Hint>

          <Hint label="Emoji">
            <Button
              disabled={false}
              size={"iconSm"}
              variant={"ghost"}
              onClick={() => {}}
            >
              <Smile />
            </Button>
          </Hint>

          {variant === "create" && (
            <>
              <Hint label="Image">
                <Button
                  disabled={false}
                  size={"iconSm"}
                  variant={"ghost"}
                  onClick={() => {}}
                >
                  <ImageIcon />
                </Button>
              </Hint>
              <Button
                disabled={disabled || isEmpty}
                onClick={() => {}}
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
                disabled={false}
                onClick={() => {}}
              >
                Cancel
              </Button>
              <Button
                className=" bg-slate-800 hover:bg-slate-800/80 text-white hover:text-white"
                variant={"outline"}
                size={"sm"}
                disabled={false}
                onClick={() => {}}
              >
                Save
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className="p-2 text-[10px] text-muted-foreground flex justify-end">
        <p>
          <strong>Shift + Return</strong> to add a new line
        </p>
      </div>
    </div>
  );
}

export default Editor;
