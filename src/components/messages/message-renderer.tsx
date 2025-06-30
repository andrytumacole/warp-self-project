import Quill from "quill";
import { useEffect, useRef, useState } from "react";

interface MessageRendererProps {
  rawMessage: string;
}

function MessageRenderer(props: Readonly<MessageRendererProps>) {
  const { rawMessage } = props;
  const [isEmpty, setIsEmpty] = useState(false);
  const rendererRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rendererRef.current) return;

    const container = rendererRef.current;
    const quill = new Quill(document.createElement("div"));

    quill.enable(false); //readonly quill used for rendering messages

    const contents = JSON.parse(rawMessage);
    quill.setContents(contents);

    const isEmpty =
      quill
        .getText()
        .replace(/<(.|\n)*?>/g, "")
        .trim().length === 0;
    setIsEmpty(isEmpty);

    container.innerHTML = quill.root.innerHTML;

    return () => {
      if (container) {
        container.innerHTML = "";
      }
    };
  }, [rawMessage]);

  return isEmpty ? null : (
    <div ref={rendererRef} className="ql-editor ql-renderer" />
  );
}

export default MessageRenderer;
