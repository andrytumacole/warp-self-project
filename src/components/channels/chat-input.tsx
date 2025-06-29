import dynamic from "next/dynamic";

const Editor = dynamic(() => import("../input/editor"), { ssr: false });

function ChatInput() {
  return (
    <div className="px-5 w-full">
      <Editor />
    </div>
  );
}

export default ChatInput;
