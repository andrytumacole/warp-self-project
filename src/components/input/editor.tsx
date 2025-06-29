import { useEffect, useRef } from "react";
import Quill, { QuillOptions } from "quill";
import "quill/dist/quill.snow.css";

import { Button } from "../ui/button";
import { PiTextAa } from "react-icons/pi";
import { ImageIcon, Smile } from "lucide-react";
import { MdSend } from "react-icons/md";
import Hint from "../global/tooltip";

function Editor() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const editorContainer = container.appendChild(
      container.ownerDocument.createElement("div")
    );
    const options: QuillOptions = {
      theme: "snow",
    };

    const quill = new Quill(editorContainer, options);

    return () => {
      if (container) {
        container.innerHTML = "";
      }
    };
  }, []);

  return (
    <div className="flex flex-col">
      <div className="flex flex-col border border-slate-200 rounded-md overflow-hidden focus-within:border-slate-300 focus-within:shadow-sm transition bg-white">
        <div ref={containerRef} className="h-full" />
        <div className="flex px-2 pb-2 z-[5]">
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
            disabled={false}
            onClick={() => {}}
            className="ml-auto bg-slate-800 hover:bg-slate-800/80 text-white"
            size={"iconSm"}
          >
            <MdSend />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Editor;
