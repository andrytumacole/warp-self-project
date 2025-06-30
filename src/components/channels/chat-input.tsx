import dynamic from "next/dynamic";
import Quill from "quill";
import { useRef } from "react";

const Editor = dynamic(() => import("../input/editor"), { ssr: false });

interface ChatInputProps {
  placeholder: string;
}

interface SubmitType {
  body: string;
  image: File | null;
}

function ChatInput(props: Readonly<ChatInputProps>) {
  const { placeholder } = props;
  const editorRef = useRef<Quill | null>(null);

  function handleSubmit(submitData: SubmitType) {
    console.log(submitData);
  }

  return (
    <div className="px-5 w-full">
      <Editor
        variant="create"
        onSubmit={handleSubmit}
        disabled={false}
        innerRef={editorRef}
        placeholder={placeholder}
      />
    </div>
  );
}

export default ChatInput;
