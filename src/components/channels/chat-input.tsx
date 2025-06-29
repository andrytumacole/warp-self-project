import dynamic from "next/dynamic";
import Quill from "quill";
import { useRef } from "react";

const Editor = dynamic(() => import("../input/editor"), { ssr: false });

interface ChatInputProps {
  placeholder: string;
}

function ChatInput(props: Readonly<ChatInputProps>) {
  const { placeholder } = props;
  const editorRef = useRef<Quill | null>(null);
  return (
    <div className="px-5 w-full">
      <Editor
        variant="create"
        onSubmit={() => {}}
        disabled={false}
        innerRef={editorRef}
        placeholder={placeholder}
      />
    </div>
  );
}

export default ChatInput;
